import boto3
import uuid
import json
import logging
import os
from django.conf import settings
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
from .models import (
    FellowSignUp,
    FellowRegistration,
    FellowPhoto,
    FellowProfile,
    FellowTestimonial,
    TaskDetails,
    State,
    District,
    Mandal,
    GramPanchayat,
    University,
    College,
    Course,
)
from .serializers import (
    FellowSignUpSerializer,
    FellowRegistrationSerializer,
    FellowPhotoSerializer,
    FellowTestimonialSerializer,
    TaskDetailsSerializer,
    VideoStatusSerializer,
    FellowProfilePersonalSerializer,
    FellowProfileEducationSerializer,
    FellowProfileFamilySerializer,
    FellowProfileSkillsSerializer,
    UniversitySerializer,
    CollegeSerializer,
    CourseSerializer,
)

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
def fellow_signup(request):
    print("\n=== FELLOW SIGNUP ===")
    print("Signup data received:", request.data)
    
    data = request.data.copy()
    data['ip_address'] = get_client_ip(request)
    data['device_info'] = json.dumps(dict(request.headers))

    serializer = FellowSignUpSerializer(data=data)
    if serializer.is_valid():
        user = serializer.save()
        print(f"Created new fellow: ID={user.id}, Mobile={user.mobile_number}, Name={user.full_name}")
        
        # Verify the record exists
        verify = FellowSignUp.objects.get(id=user.id)
        print(f"Verified fellow exists: ID={verify.id}, Mobile={verify.mobile_number}")
        
        return Response({
            "status": "success",
            "message": "User signed up successfully",
            "user_id": user.id
        }, status=201)
    else:
        print("Signup validation errors:", serializer.errors)
        return Response({
            "status": "error",
            "errors": serializer.errors
        }, status=400)



@api_view(['POST'])
def fellow_register(request):
    mobile_number = request.data.get('mobile_number')

    fellow = FellowSignUp.objects.filter(mobile_number=mobile_number).first()
    if not fellow:
        return Response({'status': 'error', 'message': 'Fellow not found. Please sign up first.'}, status=404)

    data = request.data.copy()
    data['fellow'] = fellow.id  # Ensure fellow ID is passed

    serializer = FellowRegistrationSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        fellow.is_registered = True
        fellow.save()
        return Response({'status': 'success', 'message': 'Registration successful', 'data': serializer.data})
    else:
        return Response({'status': 'error', 'errors': serializer.errors}, status=400)
   



# @api_view(['GET'])
# def get_fellow_details(request):
#     mobile_number = request.GET.get('mobile_number')
#     if not mobile_number:
#         return Response({"error": "Mobile number is required"}, status=400)
    
#     try:
#         fellow = FellowSignUp.objects.get(mobile_number=mobile_number)
#         return Response({
#             "full_name": fellow.full_name,
#             "profile_photo_url": fellow.profile_photo_url
#         })
#     except FellowSignUp.DoesNotExist:
#         return Response({"error": "User not found"}, status=404)



@api_view(['POST']) 
def get_fellow_details(request):
    mobile_number = request.data.get('mobile_number')

    if not mobile_number:
        return Response({
            "status": "error",
            "message": "Mobile number is required."
        }, status=status.HTTP_400_BAD_REQUEST)

    try:
        fellow = FellowSignUp.objects.get(mobile_number=mobile_number)
        return Response({
            "status": "success",
            "password": fellow.password,     # plain text return — only for testing.
            "fellow_status": fellow.get_user_status(),
            "full_name": fellow.full_name,
        }, status=status.HTTP_200_OK)

    except FellowSignUp.DoesNotExist:
        return Response({
            "status": "error",
            "message": "User not found."
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def fellow_login(request):
    mobile_number = request.data.get("mobile_number")
    password = request.data.get("password")

    if not mobile_number or not password:
        return Response({"status": "error", "message": "Mobile number and password are required"},
                        status=status.HTTP_400_BAD_REQUEST)

    try:
        fellow = FellowSignUp.objects.get(mobile_number=mobile_number)

        if fellow.password != password:
            return Response({"status": "error", "message": "Invalid credentials"},
                            status=status.HTTP_401_UNAUTHORIZED)

        return Response({
            "status": "success",
            "message": "Login successful",
            "user_status": fellow.get_user_status(),  # ✅ Refactored
            "user": {
                "mobile_number": fellow.mobile_number,
                "full_name": fellow.full_name,
                "is_selected": fellow.is_selected,
                "unique_number": fellow.unique_number
            }
        }, status=status.HTTP_200_OK)

    except FellowSignUp.DoesNotExist:
        return Response({"status": "error", "message": "User not found"},
                        status=status.HTTP_404_NOT_FOUND)



@api_view(['POST']) 
def forgot_password(request):
    mobile_number = request.data.get('mobile_number')
    try:
        user =  FellowSignUp.objects.get(mobile_number=mobile_number)
        return Response({"status": "success", "password": user.password}, status=status.HTTP_200_OK)
    except FellowSignUp.DoesNotExist:
        return Response({"status": "error", "message": "User not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def get_user_status(request, mobile_number):  
    try:
        user = FellowSignUp.objects.get(mobile_number=mobile_number)
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
    except FellowSignUp.DoesNotExist:
        return Response({
            "status": "error",
            "message": "User not found"
        }, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
def update_tasks(request):
    mobile_number = request.data.get('mobile_number')
    try:
        user = FellowSignUp.objects.get(mobile_number=mobile_number)
        user.has_submitted_tasks = True
        user.save()
        return Response({
            "status": "success",
            "message": "Tasks submitted successfully"
        }, status=status.HTTP_200_OK)
    except FellowSignUp.DoesNotExist:
        return Response({
            "status": "error",
            "message": "User not found"
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def update_data_consent(request):
    mobile_number = request.data.get('mobile_number')
    try:
        user = FellowSignUp.objects.get(mobile_number=mobile_number)
        user.has_agreed_to_data_consent = True
        user.save()
        return Response({
            "status": "success",
            "message": "Data consent updated successfully"
        }, status=status.HTTP_200_OK)
    except FellowSignUp.DoesNotExist:
        return Response({
            "status": "error",
            "message": "User not found"
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def update_child_protection_consent(request):
    mobile_number = request.data.get('mobile_number')
    try:
        user = FellowSignUp.objects.get(mobile_number=mobile_number)
        user.has_agreed_to_child_protection = True
        user.save()
        return Response({
            "status": "success",
            "message": "Child protection consent updated successfully"
        }, status=status.HTTP_200_OK)
    except FellowSignUp.DoesNotExist:
        return Response({
            "status": "error",
            "message": "User not found"
        }, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def get_user_details(request):
    mobile_number = request.GET.get('mobile_number')
    if not mobile_number:
        return Response({"error": "Mobile number is required"}, status=400)
    
    try:
        fellow = FellowSignUp.objects.get(mobile_number=mobile_number)
        return Response({
            "full_name": fellow.full_name,
            "profile_photo_url": fellow.fellow_photo.photo_url if hasattr(fellow, 'fellow_photo') else None
        })
    except FellowSignUp.DoesNotExist:
        return Response({"error": "Fellow not found"}, status=404)

@api_view(['GET'])
def get_task_status(request, mobile_number):
    try:
        registration = FellowRegistration.objects.get(mobile_number=mobile_number)
        user = FellowSignUp.objects.get(mobile_number=mobile_number)
        return Response({
            'video1_watched': registration.isvideo1seen,
            'video2_watched': registration.isvideo2seen,
            'task1_submitted': registration.istask1submitted,
            'task2_submitted': registration.istask2submitted,
            'task1_status': registration.task1_status,
            'task2_status': registration.task2_status,
            'is_accepted_offer_letter': user.is_accepted_offer_letter,
            'accepted_offer_letter_date': user.accepted_offer_letter_date
        })
    except FellowRegistration.DoesNotExist: 
        return Response({"error": "User not found"}, status=404)

@api_view(['GET'])
def get_video_status(request, mobile_number):
    try:
        registration = FellowRegistration.objects.get(mobile_number=mobile_number)
        return Response({
            'video1_watched': registration.isvideo1seen,
            'video2_watched': registration.isvideo2seen
        })
    except FellowRegistration.DoesNotExist:
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

        registration = FellowRegistration.objects.get(mobile_number=mobile_number)
        
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

    except FellowRegistration.DoesNotExist:
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
        user = FellowSignUp.objects.get(mobile_number=mobile_number)
        registration = FellowRegistration.objects.get(mobile_number=mobile_number)
        
        # Create or update task details
        task_details, created = TaskDetails.objects.get_or_create(
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

    except (FellowSignUp.DoesNotExist, FellowRegistration.DoesNotExist) as e:
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
            
        registration = FellowRegistration.objects.get(mobile_number=mobile_number)
        
        if not registration.istask1submitted:
            return Response({"error": "Please complete Task 1 first"}, status=400)
            
        task_details = TaskDetails.objects.get(mobile_number=mobile_number)
        
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
 
        # Update has_submitted_tasks to True in api_usersignup
        user = FellowSignUp.objects.get(mobile_number=mobile_number)
        user.has_submitted_tasks = True
        user.save()
        
        return Response({"status": "success"})
    except FellowRegistration.DoesNotExist:
        return Response({"error": "User not found"}, status=404)
    except Exception as e:
        logger.error(f"Task 2 submission error: {str(e)}")
        return Response({"error": str(e)}, status=500)

def upload_to_s3(file, path):
    try:
        # Extract file extension
        file_extension = file.name.split('.')[-1]
        full_path = f"{path}{file_extension}"

        # Upload to S3
        s3_client.upload_fileobj(
            file,
            'yuvachetana-webapp',
            full_path
        )

        # Return the public URL
        return f"https://yuvachetana-webapp.s3.amazonaws.com/{full_path}"
    except Exception as e:
        logger.error(f"S3 upload error: {str(e)}")
        raise e



# Location API

@api_view(['GET'])
def get_states(request):
    states = State.objects.all()
    return Response([{"id": state.id, "name": state.state_name} for state in states])

@api_view(['GET'])
def get_districts(request):
    state_id = request.GET.get('state_id')
    districts = District.objects.filter(state_id=state_id)
    return Response([{"id": district.id, "name": district.district_name} for district in districts])

@api_view(['GET'])
def get_mandals(request):
    district_id = request.GET.get('district_id')
    mandals = Mandal.objects.filter(district_id=district_id)
    return Response([{"id": mandal.id, "name": mandal.mandal_name} for mandal in mandals])

@api_view(['GET'])
def get_grampanchayats(request):
    mandal_id = request.GET.get('mandal_id')
    grampanchayats = GramPanchayat.objects.filter(mandal_id=mandal_id)
    return Response([{"id": grampanchayat.id, "name": grampanchayat.gram_panchayat_name} for grampanchayat in grampanchayats])




# tesing file upload

@api_view(['POST'])
@parser_classes([MultiPartParser])
def upload_profile_photo(request):
    mobile_number = request.data.get('mobile_number')
    photo = request.FILES.get('photo')
    
    if not mobile_number or not photo:
        return Response({"error": "Both mobile number and photo are required"}, status=400)
    
    try:
        user = FellowSignUp.objects.get(mobile_number=mobile_number)
        
        # Generate unique filename
        ext = photo.name.split('.')[-1]
        filename = f"profile_photos/{user.unique_number}.{ext}"
        
        # Upload to S3
        s3_client.upload_fileobj(
            photo,
            AWS_STORAGE_BUCKET_NAME,
            filename,
            ExtraArgs={'ContentType': photo.content_type}
        )
        
        # Update user's photo URL
        photo_url = f"https://{AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com/{filename}"
        user.profile_photo_url = photo_url
        user.save()
        
        return Response({
            "status": "success",
            "photo_url": photo_url
        })
    except FellowSignUp.DoesNotExist:
        return Response({"error": "User not found"}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['GET'])
def get_fellow_profile(request, mobile_number):
    """Get fellow profile details"""
    try:
        profile = FellowProfile.objects.get(mobile_number=mobile_number)
        
        # Serialize different sections
        personal_data = FellowProfilePersonalSerializer(profile).data
        education_data = FellowProfileEducationSerializer(profile).data
        family_data = FellowProfileFamilySerializer(profile).data
        skills_data = FellowProfileSkillsSerializer(profile).data

        return Response({
            "status": "success",
            "data": {
                "personal_details": personal_data,
                "education_details": education_data,
                "family_details": family_data,
                "skills": skills_data
            }
        })
    except FellowProfile.DoesNotExist:
        return Response({
            "status": "error",
            "message": "Profile not found"
        }, status=404)

@api_view(['PATCH'])
def update_fellow_profile_section(request, mobile_number, section):
    """Update a specific section of fellow profile"""
    try:
        profile = FellowProfile.objects.get(mobile_number=mobile_number)
        
        # Map section names to serializers
        section_serializers = {
            'personal_details': FellowProfilePersonalSerializer,
            'education_details': FellowProfileEducationSerializer,
            'family_details': FellowProfileFamilySerializer,
            'skills': FellowProfileSkillsSerializer
        }
        
        # Get the appropriate serializer
        SerializerClass = section_serializers.get(section)
        if not SerializerClass:
            return Response({
                "error": f"Invalid section: {section}. Valid sections are: {', '.join(section_serializers.keys())}"
            }, status=400)
            
        serializer = SerializerClass(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "status": "success",
                "message": f"{section} updated successfully"
            })
        return Response({
            "status": "error",
            "errors": serializer.errors
        }, status=400)
        
    except FellowProfile.DoesNotExist:
        return Response({"error": "Profile not found"}, status=404)

@api_view(['POST'])
def update_fellow_acceptance(request, mobile_number):
    try:
        user = FellowSignUp.objects.get(mobile_number=mobile_number)
        user.is_accepted_offer_letter = True
        user.accepted_offer_letter_date = timezone.now()
        user.save()
        return Response({
            "status": "success",
            "message": "Fellowship acceptance updated successfully"
        })
    except FellowSignUp.DoesNotExist:
        return Response({"error": "Profile not found"}, status=404)

@api_view(['GET'])
def get_fellow_acceptance(request, mobile_number):
    try:
        user = FellowSignUp.objects.get(mobile_number=mobile_number)
        return Response({
            "is_accepted_offer_letter": user.is_accepted_offer_letter,
            "accepted_offer_letter_date": user.accepted_offer_letter_date
        })
    except FellowSignUp.DoesNotExist:
        return Response({"error": "Profile not found"}, status=404)

@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def save_fellow_testimonial(request):
    try:
        logger.info(f"Received files: {request.FILES}")
        logger.info(f"Received POST data: {request.POST}")
        
        audio_file = request.FILES.get('audio')
        if not audio_file:
            logger.error("No audio file received")
            return Response({"error": "No audio file received"}, status=400)
            
        logger.info(f"Audio file details: size={audio_file.size}, content_type={audio_file.content_type}")
        
        mobile_number = request.POST.get('mobile_number')
        recorder_type = request.POST.get('recorder_type')

        if not all([audio_file, mobile_number, recorder_type]):
            return Response({
                "error": "Missing required fields"
            }, status=400)

        # Generate unique filename
        file_extension = audio_file.name.split('.')[-1]
        file_name = f"testimonials/{uuid.uuid4()}.{file_extension}"

        # Upload to S3
        s3_bucket_name = "yuvachetana-webapp"
        s3_client.upload_fileobj(audio_file, s3_bucket_name, file_name)

        # Generate S3 URL
        audio_url = f"https://{s3_bucket_name}.s3.amazonaws.com/{file_name}"

        # Get fellow instance
        #fellow = FellowProfile.objects.get(mobile_number=mobile_number)

        # Save testimonial
        # testimonial = FellowTestimonial.objects.create(
        #     fellow=fellow,
        #     recorder_type=recorder_type,
        #     audio_url=audio_url
        # )

        return Response({
            "status": "success",
            "audio_url": audio_url
            #"testimonial_id": testimonial.id
        })

    except Exception as e:
        logger.error(f"Error in save_fellow_testimonial: {str(e)}", exc_info=True)
        return Response({"error": str(e)}, status=500)

@api_view(['GET'])
def get_fellow_details_for_consent(request, mobile_number):
    print(f"Fetching details for mobile: {mobile_number}")
    try:
        # Get fellow and their registration details
        fellow = FellowSignUp.objects.get(mobile_number=mobile_number)
        print(f"Found fellow: {fellow.full_name}")
        
        registration = FellowRegistration.objects.get(fellow=fellow)
        print(f"Found registration for fellow")
        
        # Get location names through foreign key relationships
        state_name = registration.state.state_name
        district_name = registration.district.district_name
        mandal_name = registration.mandal.mandal_name
        grampanchayat_name = registration.grampanchayat.gram_panchayat_name
        
        # Combine location names with hyphens
        place = f"{grampanchayat_name}-{mandal_name}-{district_name}-{state_name}"
        print(f"Generated place: {place}")
        
        # Get current date in IST
        current_date = timezone.localtime(timezone.now()).date()
        
        response_data = {
            "status": "success",
            "data": {
                "full_name": fellow.full_name,
                "place": place,
                "current_date": current_date
            }
        }
        print("Sending response:", response_data)
        return Response(response_data)
        
    except FellowSignUp.DoesNotExist:
        print(f"Fellow not found with mobile: {mobile_number}")
        return Response({
            "status": "error",
            "message": "Fellow not found"
        }, status=404)
    except FellowRegistration.DoesNotExist:
        print(f"Registration not found for fellow with mobile: {mobile_number}")
        return Response({
            "status": "error",
            "message": "Fellow registration not found"
        }, status=404)
    except Exception as e:
        print(f"Error processing request: {str(e)}")
        return Response({
            "status": "error",
            "message": str(e)
        }, status=500)

@api_view(['GET'])
def get_universities(request):
    universities = University.objects.all()
    serializer = UniversitySerializer(universities, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_colleges(request):
    university_id = request.GET.get('university')
    if university_id:
        colleges = College.objects.filter(university_id=university_id)
    else:
        colleges = College.objects.all()
    serializer = CollegeSerializer(colleges, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_courses(request):
    college_id = request.GET.get('college')
    if college_id:
        courses = Course.objects.filter(college_id=college_id)
    else:
        courses = Course.objects.all()
    serializer = CourseSerializer(courses, many=True)
    return Response(serializer.data)



