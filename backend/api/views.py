import boto3
import uuid
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .models import UserPhoto, State, District, Mandal, GramPanchayat, UserSignUp, Registration
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .serializers import UserSerializer, RegistrationSerializer
import json     
from django.utils import timezone
import datetime
import logging

logger = logging.getLogger(__name__)

# Configure S3 client
s3_client = boto3.client(
    's3',
    aws_access_key_id='AKIA4ZPZVNRHMFZJIGMZ',
    aws_secret_access_key='Q5S/l4VvmTT93AVYD1hVCdN/TMgR/2pH1nbkSFqT',
    region_name='ap-south-1'  # Change as per your AWS region
)

class UploadPhotoView(APIView):
    parser_classes = (MultiPartParser, FormParser)  # ✅ Add parser classes for file upload

    def post(self, request, *args, **kwargs):
        username = request.data.get("username")
        photo = request.FILES.get("photo")  # ✅ Ensure file is extracted correctly

        if not username or not photo:
            return Response({"error": "Username and photo are required"}, status=status.HTTP_400_BAD_REQUEST)

        # Generate unique filename
        file_extension = photo.name.split('.')[-1]
        file_name = f"volunteers/photos/{uuid.uuid4()}.{file_extension}"

        # Upload to S3
        s3_bucket_name = "yuvachetana-webapp"
        s3_client.upload_fileobj(photo, s3_bucket_name, file_name)

        # Generate S3 URL
        photo_url = f"https://{s3_bucket_name}.s3.amazonaws.com/{file_name}"

        # Save to database
        user_photo = UserPhoto(username=username, photo_url=photo_url)
        user_photo.save()

        return Response({"username": username, "photo_url": photo_url}, status=status.HTTP_201_CREATED)

class HelloworldView(APIView):
    def get(self, request, *args, **kwargs):
        return Response({"message": "Hello, World!"}, status=status.HTTP_200_OK)






def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip

@api_view(['POST'])
def signup(request):
    
    data = request.data.copy()
    
    # Convert name fields to uppercase
    if 'surname' in data:
        data['surname'] = data['surname'].upper()
    if 'given_name' in data: 
        data['given_name'] = data['given_name'].upper()
    data['ip_address'] = get_client_ip(request)
    data['device_info'] = json.dumps(dict(request.headers))

    serializer = UserSerializer(data=data)
    if serializer.is_valid():
        user = serializer.save()
        logger.info(f"User signed up successfully with ID: {user.id}")
        return Response({
            "status": "success", 
            "message": "User signed up successfully", 
            "user_id": serializer.data['id']
        }, status=status.HTTP_201_CREATED) 
    
    logger.error(f"Signup validation failed: {serializer.errors}")
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST']) 
def forgot_password(request):
    mobile_number = request.data.get('mobile_number')
    try:
        user =  UserSignUp.objects.get(mobile_number=mobile_number)
        return Response({"status": "success", "password": user.password}, status=status.HTTP_200_OK)
    except UserSignUp.DoesNotExist:
        return Response({"status": "error", "message": "User not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def register(request):
    try:
        # Get the user first since mobile_number is required
        mobile_number = request.data.get('mobile_number')
        if not mobile_number:
            return Response({
                "status": "error",
                "message": "Mobile number is required"
            }, status=status.HTTP_400_BAD_REQUEST)

        user = UserSignUp.objects.get(mobile_number=mobile_number)
        
        # Create registration data with user
        data = request.data.copy()
        data['user'] = user.id  # Add user ID to the data
        
        serializer = RegistrationSerializer(data=data)
        if serializer.is_valid():
            # Save registration
            registration = serializer.save()
            
            # Update UserSignUp status
            user.is_registered = True
            user.save()
            
            return Response({
                "status": "success",
                "message": "Registration successful"
            }, status=status.HTTP_201_CREATED)
        
        return Response({
            "status": "error",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
        
    except UserSignUp.DoesNotExist:
        return Response({
            "status": "error",
            "message": "User not found. Please sign up first."
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error(f"Registration error: {str(e)}")
        return Response({
            "status": "error",
            "message": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# User Login
@api_view(['POST'])
def login(request):
    data = request.data
    mobile_number = data.get("mobile_number")
    password = data.get("password")

    # ✅ Input Validation
    if not mobile_number or not password:
        return Response(
            {"status": "error", "message": "Mobile number and password are required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        user = UserSignUp.objects.get(mobile_number=mobile_number)

        # ✅ Simple Password Check (No Hashing)
        if user.password != password:
            return Response(
                {"status": "error", "message": "Invalid credentials"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        # ✅ Determine User Status
        if not user.is_registered:
            user_status = "PENDING_REGISTRATION"
        elif not user.has_submitted_tasks:
            user_status = "PENDING_TASK_SUBMISSION"
        elif not user.is_selected:
            user_status = "AWAITING_SELECTION"
        elif not user.has_agreed_to_data_consent:
            user_status = "PENDING_DATA_CONSENT"
        elif not user.has_agreed_to_child_protection:
            user_status = "PENDING_CHILD_PROTECTION_CONSENT"
        else:
            user_status = "ACCESS_GRANTED"

        # ✅ Return Response
        return Response({
            "status": "success",
            "message": "Login successful",
            "user_status": user_status,
            "user": {
                "mobile_number": user.mobile_number,
                "full_name": user.full_name,
                "is_selected": user.is_selected,
                "unique_number": user.unique_number
            }
        }, status=status.HTTP_200_OK)

    except UserSignUp.DoesNotExist:
        return Response(
            {"status": "error", "message": "User not found"},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {"status": "error", "message": "An error occurred during login"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
def update_tasks(request):
    mobile_number = request.data.get('mobile_number')
    try:
        user = UserSignUp.objects.get(mobile_number=mobile_number)
        user.has_submitted_tasks = True
        user.save()
        return Response({
            "status": "success",
            "message": "Tasks submitted successfully"
        }, status=status.HTTP_200_OK)
    except UserSignUp.DoesNotExist:
        return Response({
            "status": "error",
            "message": "User not found"
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def update_data_consent(request):
    mobile_number = request.data.get('mobile_number')
    try:
        user = UserSignUp.objects.get(mobile_number=mobile_number)
        user.has_agreed_to_data_consent = True
        user.save()
        return Response({
            "status": "success",
            "message": "Data consent updated successfully"
        }, status=status.HTTP_200_OK)
    except UserSignUp.DoesNotExist:
        return Response({
            "status": "error",
            "message": "User not found"
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def update_child_protection_consent(request):
    mobile_number = request.data.get('mobile_number')
    try:
        user = UserSignUp.objects.get(mobile_number=mobile_number)
        user.has_agreed_to_child_protection = True
        user.save()
        return Response({
            "status": "success",
            "message": "Child protection consent updated successfully"
        }, status=status.HTTP_200_OK)
    except UserSignUp.DoesNotExist:
        return Response({
            "status": "error",
            "message": "User not found"
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def get_user_status(request, mobile_number):
    try:
        user = UserSignUp.objects.get(mobile_number=mobile_number)
        return Response({
            "status": "success",
            "user_status": {
                "is_registered": user.is_registered,
                "has_submitted_tasks": user.has_submitted_tasks,
                "is_selected": user.is_selected,
                "has_agreed_to_data_consent": user.has_agreed_to_data_consent,
                "has_agreed_to_child_protection": user.has_agreed_to_child_protection,
                "final_access_granted": user.final_access_granted
            }
        }, status=status.HTTP_200_OK)
    except UserSignUp.DoesNotExist:
        return Response({
            "status": "error",
            "message": "User not found"
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def get_castes(request):
    # Add your logic to fetch castes
    castes = [
        {"id": 1, "name": "OC"},
        {"id": 2, "name": "BC"},
        {"id": 3, "name": "SC"},
        {"id": 4, "name": "ST"}
    ]  # Replace with database query
    return Response(castes)

@api_view(['GET'])
def get_states(request):
    states = State.objects.all()
    data = [{"id": state.id, "name": state.name} for state in states]
    return Response(data)

@api_view(['GET'])
def get_districts(request):
    state_id = request.GET.get('state_id')
    if not state_id:
        return Response(
            {"message": "state_id is required"}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    districts = District.objects.filter(state_id=state_id)
    data = [{"id": dist.id, "name": dist.name} for dist in districts]
    return Response(data)

@api_view(['GET'])
def get_mandals(request):
    district_id = request.GET.get('district_id')
    if not district_id:
        return Response(
            {"message": "district_id is required"}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    mandals = Mandal.objects.filter(district_id=district_id)
    data = [{"id": mandal.id, "name": mandal.name} for mandal in mandals]
    return Response(data)

@api_view(['GET'])
def get_villages(request):
    mandal_id = request.GET.get('mandal_id')
    if not mandal_id:
        return Response(
            {"message": "mandal_id is required"}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    grampanchayats = GramPanchayat.objects.filter(mandal_id=mandal_id)
    data = [{"id": grampanchayat.id, "name": grampanchayat.name} for grampanchayat in grampanchayats]
    return Response(data)

@api_view(['GET'])
def get_user_details(request):
    mobile_number = request.GET.get('mobile_number')
    try:
        user = UserSignUp.objects.get(mobile_number=mobile_number)
        return Response({
            "full_name": user.full_name,
            "mobile_number": user.mobile_number
        }, status=status.HTTP_200_OK)
    except UserSignUp.DoesNotExist:
        return Response(
            {"message": "User not found"}, 
            status=status.HTTP_404_NOT_FOUND
        )
