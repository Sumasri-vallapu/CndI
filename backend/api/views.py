import boto3
import uuid
import json
import logging
import os
from django.conf import settings
from django.utils import timezone
from api.models import DistrictLead, TeamLead
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
from datetime import datetime, timedelta, date


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
    TestimonialProgress,
    TestimonialRecord,
    ChildrenProfile,
    LearningCenter,
    FellowAttendance,
    ChildrenAttendance,
    StudentAssessment

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
    TestimonialSubmitSerializer,
    ChildrenProfileSerializer,
    FellowAttendanceSerializer,
    ChildrenAttendanceSerializer,
    StudentAssessmentSerializer
)

from django.db.models import Count
import base64
from django.core.files.base import ContentFile
from datetime import timedelta, date


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
    if not mobile_number:
        return Response({
            'status': 'error',
            'message': 'Mobile number is required'
        }, status=400)

    try:
        serializer = FellowRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'status': 'success',
                'message': 'Registration successful',
                'data': serializer.data
            })
        return Response({
            'status': 'error',
            'errors': serializer.errors
        }, status=400)
    except Exception as e:
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=400)
   



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
    try:
        profile = FellowProfile.objects.get(mobile_number=mobile_number)
        
        # Serialize different sections
        personal_data = FellowProfilePersonalSerializer(profile).data
        education_data = FellowProfileEducationSerializer(profile).data
        family_data = FellowProfileFamilySerializer(profile).data
        skills_data = FellowProfileSkillsSerializer(profile).data

        # Convert empty strings to None for new fields
        for field in ['type_of_college', 'mode_of_study', 'technical_skills', 'artistic_skills']:
            if field in education_data and education_data[field] == '':
                education_data[field] = None

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
def update_fellow_profile(request, mobile_number, section):
    try:
        fellow = FellowProfile.objects.get(mobile_number=mobile_number)
        
        if section == 'education_details':
            serializer = FellowProfileEducationSerializer(
                fellow, 
                data=request.data,
                partial=True
            )
            if serializer.is_valid():
                # Handle multi-select fields
                if 'technical_skills' in request.data:
                    # Ensure it's stored as comma-separated string
                    if isinstance(request.data['technical_skills'], list):
                        request.data['technical_skills'] = ', '.join(request.data['technical_skills'])
                
                if 'artistic_skills' in request.data:
                    if isinstance(request.data['artistic_skills'], list):
                        request.data['artistic_skills'] = ', '.join(request.data['artistic_skills'])
                
                serializer.save()
                return Response({
                    'status': 'success',
                    'message': 'Profile updated successfully'
                })
            return Response({
                'status': 'error',
                'message': serializer.errors
            }, status=400)
        
        # Handle other sections
        section_serializers = {
            'personal_details': FellowProfilePersonalSerializer,
            'family_details': FellowProfileFamilySerializer,
            'skills': FellowProfileSkillsSerializer
        }
        
        SerializerClass = section_serializers.get(section)
        if not SerializerClass:
            return Response({
                'status': 'error',
                'message': f'Invalid section: {section}'
            }, status=400)
            
        serializer = SerializerClass(fellow, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'status': 'success',
                'message': f'{section} updated successfully'
            })
        print("❌ Serializer Errors:", serializer.errors)
        return Response({
            'status': 'error',
            'message': serializer.errors
        }, status=400)
            
    except FellowProfile.DoesNotExist:
        return Response({
            'status': 'error',
            'message': 'Profile not found'
        }, status=404)

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

#Learning Center API

@api_view(['POST'])
def save_learning_center(request):
    print("🟡 Incoming Request:", request.data)

    mobile_number = request.data.get('mobile_number')
    data = request.data.get('center_data')

    if isinstance(data, str):
        try:
            data = json.loads(data)
        except Exception as e:
            print("❌ JSON parse error:", str(e))
            return Response({"error": f"Invalid JSON: {str(e)}"}, status=400)

    if not mobile_number or not data:
        print("❌ Missing mobile_number or center_data")
        return Response({"error": "Missing required fields"}, status=400)

    try:
        user = FellowSignUp.objects.get(mobile_number=mobile_number)
        print("✅ User found:", user.full_name)

        lc, created = LearningCenter.objects.update_or_create(
            mobile_number=mobile_number,
            defaults={
                "full_name": data['fullName'],
                "team_lead_name": data['teamLeadName'],
                "district_lead_name": data['districtLeadName'],
                "status": data['status'],
                "state_id": data['address']['state'],
                "district_id": data['address']['district'],
                "mandal_id": data['address']['mandal'],
                "village_id": data['address']['village'],
                "pincode": data['address']['pincode'],
                "colony_name": data['address']['colonyName'],
                "door_number": data['address']['doorNumber'],
                "landmark": data['address']['landmark'],
            }
        )

        return Response({"status": "success", "message": "Learning center data saved"})

    except Exception as e:
        print("❌ Exception while saving:", str(e))
        return Response({"error": str(e)}, status=500)

@api_view(['GET'])
def get_district_leads_by_district(request, district_id):
    leads = DistrictLead.objects.filter(district_id=district_id)
    data = [{"id": lead.id, "name": lead.name} for lead in leads]
    return Response(data)


@api_view(['GET'])
def get_team_leads_by_dl(request):
    dl_id = request.GET.get('dl_id')
    leads = TeamLead.objects.filter(district_lead_id=dl_id)
    data = [{"id": lead.id, "name": lead.name} for lead in leads]
    return Response(data)


#Learning Center Photo Upload
@api_view(['POST'])
@parser_classes([MultiPartParser])
def upload_lc_photo(request):
    mobile_number = request.data.get('mobile_number')
    photo = request.FILES.get('photo')

    if not mobile_number or not photo:
        return Response({"error": "Both mobile number and photo are required"}, status=400)

    try:
        user = FellowSignUp.objects.get(mobile_number=mobile_number)

        ext = photo.name.split('.')[-1]
        filename = f"lc_photos/{user.unique_number}.{ext}"

        s3_client.upload_fileobj(
            photo,
            settings.AWS_STORAGE_BUCKET_NAME,  # from .env or settings.py
            filename,
            ExtraArgs={'ContentType': photo.content_type}
        )

        photo_url = f"https://{settings.AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com/{filename}"

        lc, _ = LearningCenter.objects.get_or_create(mobile_number=mobile_number)
        lc.lc_photo_url = photo_url
        lc.save()

        return Response({
            "status": "success",
            "photo_url": photo_url
        })

    except FellowSignUp.DoesNotExist:
        return Response({"error": "User not found"}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['POST'])
def delete_lc_photo(request):
    mobile_number = request.data.get('mobile_number')
    if not mobile_number:
        return Response({"error": "mobile_number is required"}, status=400)

    try:
        lc = LearningCenter.objects.get(mobile_number=mobile_number)
        photo_url = lc.lc_photo_url

        if not photo_url:
            return Response({"message": "No photo to delete"}, status=400)

        # Extract the S3 key from URL
        s3_key = photo_url.split(".com/")[-1]

        # Delete from S3
        s3_client.delete_object(
            Bucket=settings.AWS_STORAGE_BUCKET_NAME,
            Key=s3_key
        )

        # Remove URL from DB
        lc.lc_photo_url = None
        lc.save()

        return Response({"status": "success", "message": "Photo deleted"})

    except LearningCenter.DoesNotExist:
        return Response({"error": "Learning Center not found"}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=500)


#Fetch LearningCenter Details
    
@api_view(['GET'])
def get_learning_center(request, mobile_number):
    try:
        lc = LearningCenter.objects.get(mobile_number=mobile_number)
        return Response({
            "fullName": lc.full_name,
            "teamLeadName": lc.team_lead_name,
            "districtLeadName": lc.district_lead_name,
            "status": lc.status,
            "lc_photo_url": lc.lc_photo_url,
            "address": {
                "state": str(lc.state_id),
                "district": str(lc.district_id),
                "mandal": str(lc.mandal_id),
                "village": str(lc.village_id),
                "pincode": lc.pincode,
                #"fullAddress": lc.full_address,
                "colonyName": lc.colony_name,
                "doorNumber": lc.door_number,
                "landmark": lc.landmark,
            }
        })
    except LearningCenter.DoesNotExist:
        return Response({"message": "No data found"}, status=404)

class SubmitTestimonialView(APIView):
    def post(self, request):
        serializer = TestimonialSubmitSerializer(data=request.data)
        if serializer.is_valid():
            try:
                mobile = serializer.validated_data["mobile_number"]
                stakeholder = serializer.validated_data["stakeholder_type"]
                form_data = serializer.validated_data["form_data"]
                audio_base64 = serializer.validated_data["audio_url"]  # This will be base64 string

                # Log the received data for debugging
                logger.info(f"Received testimonial data for mobile: {mobile}, stakeholder: {stakeholder}")

                # Convert base64 to file
                try:
                    # Remove data URI header if present
                    if 'base64,' in audio_base64:
                        audio_base64 = audio_base64.split('base64,')[1]
                    
                    audio_data = base64.b64decode(audio_base64)
                except Exception as e:
                    logger.error(f"Base64 decoding error: {str(e)}")
                    return Response({"error": "Invalid audio data"}, status=status.HTTP_400_BAD_REQUEST)

                # Generate unique filename
                file_name = f"testimonials/{uuid.uuid4()}.webm"

                try:
                    # Upload to S3
                    s3_client = boto3.client('s3')
                    s3_bucket_name = "yuvachetana-webapp"
                    
                    s3_client.put_object(
                        Bucket=s3_bucket_name,
                        Key=file_name,
                        Body=audio_data,
                        ContentType='audio/webm'
                    )

                    # Generate S3 URL
                    audio_url = f"https://{s3_bucket_name}.s3.amazonaws.com/{file_name}"
                    logger.info(f"Successfully uploaded audio to S3: {audio_url}")

                except Exception as e:
                    logger.error(f"S3 upload error: {str(e)}")
                    return Response({"error": "Failed to upload audio"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

                # Save to database
                try:
                    progress, _ = TestimonialProgress.objects.get_or_create(
                        mobile_number=mobile
                    )
                    progress.update_stakeholder(stakeholder, form_data, audio_url)
                    logger.info(f"Successfully saved testimonial record to database")

                    return Response({
                        "message": "Testimonial saved successfully",
                        "audio_url": audio_url
                    }, status=status.HTTP_200_OK)

                except Exception as e:
                    logger.error(f"Database error: {str(e)}")
                    return Response({"error": "Failed to save testimonial"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            except Exception as e:
                logger.error(f"Unexpected error in SubmitTestimonialView: {str(e)}")
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        logger.error(f"Validation errors: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RecorderSummaryView(APIView):
    def get(self, request):
        mobile = request.GET.get("mobile")
        if not mobile:
            return Response({"error": "mobile is required"}, status=400)

        try:
            # Get counts for each stakeholder type
            counts = (
                TestimonialRecord.objects
                .filter(mobile_number=mobile)
                .values("stakeholder_type")
                .annotate(count=Count("id"))
            )

            # Get latest record for each stakeholder type
            latest_records = {}
            for stakeholder in dict(TestimonialRecord.STAKEHOLDER_CHOICES).keys():
                latest = (
                    TestimonialRecord.objects
                    .filter(mobile_number=mobile, stakeholder_type=stakeholder)
                    .order_by('-created_at')
                    .first()
                )
                if latest:
                    latest_records[stakeholder] = {
                        'stakeholder_type': latest.stakeholder_type,
                        'audio_url': latest.audio_url,
                        'created_at': latest.created_at.isoformat(),
                        'mobile_number': latest.mobile_number
                    }

            return Response({
                'mobile_number': mobile,
                'counts': {rec["stakeholder_type"]: rec["count"] for rec in counts},
                'latest_records': latest_records
            })

        except Exception as e:
            return Response({"error": str(e)}, status=500)

@api_view(['POST'])
def save_child_profile(request):
    print("📩 [POST] save_child_profile called")
    
    # ✅ Renamed for clarity
    fellow_mobile_number = request.data.get('fellow_mobile_number')
    if not fellow_mobile_number:
        print("❌ No fellow mobile number provided in request")
        return Response({"error": "Fellow mobile number is required"}, status=400)

    try:
        fellow = FellowSignUp.objects.get(mobile_number=fellow_mobile_number)
        print(f"✅ Fellow found: {fellow.full_name} ({fellow_mobile_number})")
    except FellowSignUp.DoesNotExist:
        print(f"❌ Fellow not found with mobile number: {fellow_mobile_number}")
        return Response({"error": "Fellow not found with this mobile number"}, status=404)

    child_id = request.data.get('id')
    instance = None
    if child_id:
        instance = ChildrenProfile.objects.filter(id=child_id, fellow=fellow).first()
        print(f"✏️ Updating existing child ID: {child_id}" if instance else f"⚠️ No child found with ID {child_id} for this fellow")

    print("📦 Payload received:", dict(request.data))

    serializer = ChildrenProfileSerializer(instance, data=request.data, partial=True)
    if serializer.is_valid():
        child = serializer.save(fellow=fellow)
        print(f"✅ Child profile saved with ID: {child.id}")
        return Response({
            "status": "success",
            "message": "Child profile saved successfully",
            "child_id": child.id,
            "data": ChildrenProfileSerializer(child).data
        }, status=200)

    print("❌ Serializer errors:", serializer.errors)
    return Response({"status": "error", "errors": serializer.errors}, status=400)


@api_view(['GET'])
def get_child_profiles(request, mobile_number):
    print(f"📩 [GET] get_child_profiles for mobile: {mobile_number}")
    try:
        fellow = FellowSignUp.objects.get(mobile_number=mobile_number)
        print(f"✅ Fellow found: {fellow.full_name}")
    except FellowSignUp.DoesNotExist:
        print(f"❌ Fellow not found with mobile: {mobile_number}")
        return Response({"error": "Fellow not found"}, status=404)

    children = ChildrenProfile.objects.filter(fellow=fellow)
    print(f"📦 Found {children.count()} children for fellow {fellow.full_name}")
    serializer = ChildrenProfileSerializer(children, many=True)
    return Response({
        "status": "success",
        "count": len(serializer.data),
        "data": serializer.data
    }, status=200)


@api_view(['GET'])
def get_child_profile_by_id(request, child_id):
    print(f"📩 [GET] get_child_profile_by_id called with child_id: {child_id}")
    try:
        child = ChildrenProfile.objects.get(id=child_id)
        print(f"✅ Child found: {child.full_name} (ID: {child.id})")
    except ChildrenProfile.DoesNotExist:
        print(f"❌ Child not found with ID: {child_id}")
        return Response({"error": "Child profile not found"}, status=404)

    serializer = ChildrenProfileSerializer(child)
    return Response({
        "status": "success",
        "data": serializer.data
    }, status=200)


@api_view(['POST'])
@parser_classes([MultiPartParser])
def upload_child_photo(request):
    print("📩 [POST] upload_child_photo called")

    child_id = request.data.get("child_id")
    photo = request.FILES.get("photo")

    if not child_id or not photo:
        return Response({"error": "child_id and photo are required"}, status=400)

    try:
        child = ChildrenProfile.objects.get(id=child_id)
    except ChildrenProfile.DoesNotExist:
        return Response({"error": "Child not found"}, status=404)

    bucket_name = settings.AWS_STORAGE_BUCKET_NAME
    ext = photo.name.split(".")[-1]
    key = f"children/photos/{uuid.uuid4()}.{ext}"

    try:
        s3 = boto3.client(
            "s3",
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY
        )

        s3.upload_fileobj(
            photo,
            bucket_name,
            key,
            ExtraArgs={  # ✅ No ACL here
                "ContentType": photo.content_type
            }
        )

        s3_url = f"https://{bucket_name}.s3.amazonaws.com/{key}"
        child.child_photo_s3_url = s3_url
        child.save()

        print(f"✅ Uploaded to S3: {s3_url}")
        return Response({"status": "success", "photo_url": s3_url}, status=200)

    except Exception as e:
        print(f"❌ S3 upload failed: {e}")
        return Response({"error": "Upload failed", "details": str(e)}, status=500)


@api_view(['DELETE'])
def delete_child_profile(request, child_id):
    print(f"📩 [DELETE] delete_child_profile called with child_id={child_id}")

    try:
        child = ChildrenProfile.objects.get(id=child_id)
        full_name = child.full_name
        child.delete()
        print(f"✅ Deleted child profile: {full_name} (ID: {child_id})")
        return Response({"status": "success", "message": f"Child '{full_name}' deleted successfully."})
    
    except ChildrenProfile.DoesNotExist:
        print(f"❌ Child not found with ID: {child_id}")
        return Response({"status": "error", "message": "Child not found"}, status=404)
    
    except Exception as e:
        print(f"❌ Unexpected error during deletion: {e}")
        return Response({"status": "error", "message": "Something went wrong"}, status=500)


#attendance 
@api_view(["POST"])
def save_fellow_attendance(request):
    data = request.data
    mobile = data.get("mobile_number")
    date = data.get("date")
    status = data.get("status")
    week = data.get("week")

    fellow = FellowProfile.objects.filter(mobile_number=mobile).first()
    if not fellow:
        return Response({"status": "error", "message": "Fellow not found"}, status=400)

    # Save or update record
    obj, created = FellowAttendance.objects.update_or_create(
        fellow=fellow,
        date=date,
        defaults={"status": status, "week": week}
    )

    return Response({"status": "success", "message": "Attendance saved"})




@api_view(["GET"])
def get_fellow_attendance_history(request, mobile_number):
    try:
        fellow = FellowProfile.objects.get(mobile_number=mobile_number)
    except FellowProfile.DoesNotExist:
        return Response({"status": "error", "message": "Fellow not found"}, status=404)

    start_date_str = request.query_params.get("start_date")
    end_date_str = request.query_params.get("end_date")

    if not start_date_str or not end_date_str:
        return Response({"status": "error", "message": "Missing date range"}, status=400)

    try:
        start_date = datetime.strptime(start_date_str, "%Y-%m-%d").date()
        end_date = datetime.strptime(end_date_str, "%Y-%m-%d").date()
    except ValueError:
        return Response({"status": "error", "message": "Invalid date format"}, status=400)

    # Create the full list of dates in range
    all_days = [(start_date + timedelta(days=i)) for i in range((end_date - start_date).days + 1)]

    # Query existing attendance records
    attendance_qs = FellowAttendance.objects.filter(fellow=fellow, date__range=(start_date, end_date))
    attendance_map = {att.date: att for att in attendance_qs}

    results = []
    for day in all_days:
        if day in attendance_map:
            att = attendance_map[day]
            results.append({
                "date": att.date.strftime("%Y-%m-%d"),
                "status": att.status
            })
        else:
            results.append({
                "date": day.strftime("%Y-%m-%d"),
                "status": "Not Marked"
            })

    return Response({"status": "success", "data": results})



@api_view(['POST'])
def save_children_attendance(request):
    print("📩 [POST] save_attendance called")

    data = request.data
    records = data.get("attendance", [])
    date = data.get("date")
    week = data.get("week")

    if not date or not records:
        return Response({"error": "Date and attendance records are required."}, status=400)

    saved_count = 0
    for item in records:
        child_id = item.get("child_id")
        status = item.get("status")

        try:
            child = ChildrenProfile.objects.get(id=child_id)
        except ChildrenProfile.DoesNotExist:
            continue  # skip if invalid child ID

        # Create or update attendance
        obj, created = ChildrenAttendance.objects.update_or_create(
            child=child,
            date=date,
            defaults={"status": status, "week": week}
        )
        saved_count += 1

    return Response({
        "status": "success",
        "message": f"{saved_count} attendance records saved successfully."
    }, status=200)



@api_view(['GET'])
def get_children_attendance_by_date(request):
    date = request.GET.get("date")
    week = request.GET.get("week")  # optional
    mobile = request.GET.get("mobile")

    if not date or not mobile:
        return Response({"error": "Date and mobile number are required."}, status=400)

    try:
        fellow = FellowSignUp.objects.get(mobile_number=mobile)
    except FellowSignUp.DoesNotExist:
        return Response({"error": "Fellow not found."}, status=404)

    children = ChildrenProfile.objects.filter(fellow=fellow)
    attendance = ChildrenAttendance.objects.filter(child__in=children, date=date)

    if week:
        attendance = attendance.filter(week=week)

    serializer = ChildrenAttendanceSerializer(attendance, many=True)
    return Response({
        "status": "success",
        "count": len(serializer.data),
        "data": serializer.data
    }, status=200)

#Assessment View
# views.py


@api_view(['POST'])
def submit_assessments(request):
    data = request.data
    fellow_mobile_number = data.get('fellow_mobile_number')
    assessment_type = data.get('assessment_type')
    scores = data.get('scores', [])

    if not scores:
        return Response({'status': 'error', 'message': 'No scores provided'}, status=status.HTTP_400_BAD_REQUEST)

    for score in scores:
        student_id = score['student_id']
        reading_level = score['reading_level']
        speaking_level = score['speaking_level']

        # Check if assessment already exists
        existing_assessment = StudentAssessment.objects.filter(
            student_id=student_id,
            assessment_type=assessment_type,
            fellow_mobile_number=fellow_mobile_number
        ).first()

        if existing_assessment:
            # Update existing record
            existing_assessment.reading_level = reading_level
            existing_assessment.speaking_level = speaking_level
            existing_assessment.save()
        else:
            # Create new record
            StudentAssessment.objects.create(
                student_id=student_id,
                fellow_mobile_number=fellow_mobile_number,
                assessment_type=assessment_type,
                reading_level=reading_level,
                speaking_level=speaking_level
            )

    return Response({'status': 'success', 'message': 'Assessments submitted successfully'}, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_assessments(request):
    fellow_mobile_number = request.GET.get('fellow_mobile_number')
    assessment_type = request.GET.get('assessment_type')

    if not fellow_mobile_number or not assessment_type:
        return Response({'status': 'error', 'message': 'Missing parameters'}, status=status.HTTP_400_BAD_REQUEST)

    assessments = StudentAssessment.objects.filter(
        fellow_mobile_number=fellow_mobile_number,
        assessment_type=assessment_type
    ).values('student_id', 'reading_level', 'speaking_level')

    return Response({'status': 'success', 'data': list(assessments)}, status=status.HTTP_200_OK)



