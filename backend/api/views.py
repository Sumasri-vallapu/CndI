import boto3
import uuid
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .models import UserPhoto
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .models import UserSignUp
from .serializers import UserSerializer
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
    # Log the raw request data
    logger.info(f"Raw request data: {request.data}")
    
    try:
        # Log after potential case conversion
        processed_data = {
            'mobile_number': request.data.get('mobile_number'),
            'surname': request.data.get('surname'),
            'given_name': request.data.get('given_name'),
            'password': request.data.get('password')
        }
        logger.info(f"Processed data: {processed_data}")
        
        # Your existing registration logic here
        # ...
        
    except Exception as e:
        logger.error(f"Registration error: {str(e)}")
        return Response({'detail': str(e)}, status=400)

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
