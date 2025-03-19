import boto3
import uuid
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .models import (
    UserPhoto, 
    State, 
    District, 
    Mandal, 
    GramPanchayat, 
    UserSignUp, 
    Registration, 
    Task_details
)
from rest_framework.response import Response
from rest_framework.decorators import api_view, parser_classes
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



class HelloworldView(APIView):
    def get(self, request, *args, **kwargs):
        return Response({"message": "Hello, World!"}, status=status.HTTP_200_OK)


def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    return x_forwarded_for.split(',')[0] if x_forwarded_for else request.META.get('REMOTE_ADDR')

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
    mobile_number = request.data.get("mobile_number")
    password = request.data.get("password")

    if not mobile_number or not password:
        return Response(
            {"error": "Mobile number and password are required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        user = UserSignUp.objects.get(mobile_number=mobile_number)

        # Check password
        if user.password != password:
            return Response(
                {"error": "Invalid credentials"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        # Determine User Status
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
            {"error": "User not found"},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {"error": "An error occurred during login"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


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

@api_view(['GET'])
def get_task_status(request, mobile_number):
    try:
        registration = Registration.objects.get(mobile_number=mobile_number)
        return Response({
            'video1_watched': registration.isvideo1seen,
            'video2_watched': registration.isvideo2seen,
            'task1_submitted': registration.istask1submitted,
            'task2_submitted': registration.istask2submitted,
            'task1_status': registration.task1_status,
            'task2_status': registration.task2_status
        })
    except Registration.DoesNotExist:
        return Response({"error": "User not found"}, status=404)

@api_view(['GET'])
def get_video_status(request, mobile_number):
    try:
        registration = Registration.objects.get(mobile_number=mobile_number)
        return Response({
            'video1_watched': registration.isvideo1seen,
            'video2_watched': registration.isvideo2seen
        })
    except Registration.DoesNotExist:
        return Response({"error": "User not found"}, status=404)

@api_view(['POST'])
def update_video_status(request):
    print("Received request:", request.method, request.data)  # Debug print
    """Update video watched status for a user"""
    try:
        data = request.data
        video_id = data.get('video_id')
        mobile_number = data.get('mobile_number')

        if not video_id or not mobile_number:
            return Response({
                "error": "Both video_id and mobile_number are required"
            }, status=400)

        registration = Registration.objects.get(mobile_number=mobile_number)
        
        if video_id == 'video1':
            registration.isvideo1seen = True
        elif video_id == 'video2':
            registration.isvideo2seen = True
        else:
            return Response({
                "error": "Invalid video_id. Must be 'video1' or 'video2'"
            }, status=400)
            
        registration.save()
        
        return Response({
            "status": "success",
            "message": f"{video_id} marked as watched"
        })

    except Registration.DoesNotExist:
        return Response({
            "error": "User registration not found"
        }, status=404)
    except Exception as e:
        return Response({
            "error": "Failed to update video status"
        }, status=500)

@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def submit_task1(request):
    try:
        mobile_number = request.POST.get('mobile_number')
        district_id = request.POST.get('district_id')
        mandal_id = request.POST.get('mandal_id')
        village_id = request.POST.get('village_id')

        # Validate required fields
        if not all([mobile_number, district_id, mandal_id, village_id]):
            return Response({
                "error": "mobile_number, district_id, mandal_id, and village_id are required"
            }, status=400)

        # Get user and registration
        user = UserSignUp.objects.get(mobile_number=mobile_number)
        registration = Registration.objects.get(mobile_number=mobile_number)
        
        # Create or update task details
        task_details, created = Task_details.objects.get_or_create(
            mobile_number=mobile_number,
            defaults={
                'user': user,
                'lc_state_id': 36,  # Telangana state ID
                'lc_district_id': district_id,
                'lc_mandal_id': mandal_id,
                'lc_grampanchayat_id': village_id
            }
        )

        if not created:
            # Update existing record
            task_details.lc_district_id = district_id
            task_details.lc_mandal_id = mandal_id
            task_details.lc_grampanchayat_id = village_id
        
        # Handle photo upload
        if 'lc_photo' in request.FILES:
            task_details.lc_photo_s3_url = upload_to_s3(
                request.FILES['lc_photo'], 
                f"lc_photos/{mobile_number}"
            )
            
        task_details.save()
        
        # Update registration status
        registration.istask1submitted = True
        registration.task1_status = 'UNDER_REVIEW'
        registration.save()
        
        return Response({
            "status": "success",
            "message": "Task 1 submitted successfully"
        })

    except (UserSignUp.DoesNotExist, Registration.DoesNotExist) as e:
        return Response({
            "error": f"User not found: {str(e)}"
        }, status=404)
    except Exception as e:
        logger.error(f"Task 1 submission error: {str(e)}")
        return Response({
            "error": f"Failed to submit task 1: {str(e)}"
        }, status=500)

@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def submit_task2(request):
    try:
        mobile_number = request.POST.get('mobile_number')
        if not mobile_number:
            return Response({"error": "mobile_number is required"}, status=400)
            
        registration = Registration.objects.get(mobile_number=mobile_number)
        
        if not registration.istask1submitted:
            return Response({"error": "Please complete Task 1 first"}, status=400)
            
        task_details = Task_details.objects.get(mobile_number=mobile_number)
        
        if 'training_photo' in request.FILES:
            task_details.students_marks_s3_url = upload_to_s3(
                request.FILES['training_photo'], 
                f"training_photos/{mobile_number}"
            )
            
        task_details.save()
        
        # Update registration status
        registration.istask2submitted = True
        registration.task2_status = 'UNDER_REVIEW'
        registration.save()
        
        return Response({"status": "success"})
    except Registration.DoesNotExist:
        return Response({"error": "User not found"}, status=404)
    except Exception as e:
        logger.error(f"Task 2 submission error: {str(e)}")
        return Response({"error": str(e)}, status=500)
import os

def upload_to_s3(file, path):
    try:
        # Extract file extension (.png, .jpg, etc.)
        file_extension = os.path.splitext(file.name)[1]  # e.g., ".png"
        full_path = f"{path}{file_extension}"  # Append extension

        s3_client.upload_fileobj(
            file,
            'yuvachetana-webapp',
            full_path,  # Save with correct extension
        )

        return f"https://yuvachetana-webapp.s3.amazonaws.com/{full_path}"
    except Exception as e:
        logger.error(f"S3 upload error: {str(e)}")
        raise e



# Location API

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




# tesing file upload

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





