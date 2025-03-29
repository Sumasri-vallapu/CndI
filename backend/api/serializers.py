from rest_framework import serializers
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
    Course
)

class FellowSignUpSerializer(serializers.ModelSerializer):
    class Meta:
        model = FellowSignUp
        fields = '__all__'
        read_only_fields = ['id', 'unique_number', 'full_name', 'created_at']

    def validate(self, data):
        surname = data.get('surname', '').upper()
        given_name = data.get('given_name', '').upper()
        full_name = f"{surname} {given_name}"
        mobile_number = data.get('mobile_number')

        if FellowSignUp.objects.filter(mobile_number=mobile_number, full_name=full_name).exists():
            raise serializers.ValidationError({
                "mobile_number": "A user with this mobile number and name already exists."
            })

        return data


class FellowRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = FellowRegistration
        fields = '__all__'
        read_only_fields = ['mobile_number', 'academic_year', 'batch']


class TaskDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskDetails
        fields = [
            'user',
            'mobile_number',
            'lc_district',
            'lc_mandal',
            'lc_grampanchayat',
            'lc_photo_s3_url',
            'students_marks_s3_url'
        ]

class VideoStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = FellowRegistration
        fields = ['isvideo1seen', 'isvideo2seen']


class FellowPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = FellowPhoto
        fields = ['fellow', 'photo_url']

class FellowTestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = FellowTestimonial
        fields = ['fellow', 'recorder_type', 'audio_url', 'created_at']

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        fields = ['id', 'name']

class StateSerializer(LocationSerializer):
    class Meta(LocationSerializer.Meta):
        model = State
        fields = ['id', 'state_name']

class DistrictSerializer(LocationSerializer):
    class Meta(LocationSerializer.Meta):
        model = District
        fields = ['id', 'district_name']

class MandalSerializer(LocationSerializer):
    class Meta(LocationSerializer.Meta):
        model = Mandal
        fields = ['id', 'mandal_name']

class GramPanchayatSerializer(LocationSerializer):
    class Meta(LocationSerializer.Meta):
        model = GramPanchayat
        fields = ['id', 'gram_panchayat_name']

class FellowProfilePersonalSerializer(serializers.ModelSerializer):
    state_name = serializers.CharField(source='state.state_name', read_only=True)
    district_name = serializers.CharField(source='district.district_name', read_only=True)
    mandal_name = serializers.CharField(source='mandal.mandal_name', read_only=True)
    grampanchayat_name = serializers.CharField(source='grampanchayat.gram_panchayat_name', read_only=True)
    full_name = serializers.CharField(source='user.full_name', read_only=True)

    class Meta:
        model = FellowProfile
        fields = [
            'full_name', 'mobile_number', 'email', 'gender', 
            'caste_category', 'date_of_birth', 
            'state', 'state_name',
            'district', 'district_name',
            'mandal', 'mandal_name',
            'grampanchayat', 'grampanchayat_name',
            'fellow_id', 'team_leader', 
            'fellow_status', 'performance_score',
            'batch', 'academic_year'
        ]
        read_only_fields = ['full_name', 'mobile_number', 'state_name', 'district_name', 'mandal_name', 'grampanchayat_name']

class FellowProfileEducationSerializer(serializers.ModelSerializer):
    university_name = serializers.CharField(source='university.name', read_only=True)
    college_name = serializers.CharField(source='college.name', read_only=True)
    course_name = serializers.CharField(source='course.name', read_only=True)

    class Meta:
        model = FellowProfile
        fields = [
            'university', 'university_name',
            'college', 'college_name',
            'course', 'course_name',
            'semester', 'college_type', 
            'study_mode', 'stream', 
            'subjects'
        ]

class FellowProfileFamilySerializer(serializers.ModelSerializer):
    class Meta:
        model = FellowProfile
        fields = [
            'mother_name', 'mother_occupation', 
            'father_name', 'father_occupation',
            'any_job_at_present', 'current_job'
        ]

class FellowProfileSkillsSerializer(serializers.ModelSerializer):
    class Meta:
        model = FellowProfile
        fields = ['hobbies', 'technical_skills', 'artistic_skills']

class UniversitySerializer(serializers.ModelSerializer):
    class Meta:
        model = University
        fields = ['id', 'name']

class CollegeSerializer(serializers.ModelSerializer):
    class Meta:
        model = College
        fields = ['id', 'name']

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['id', 'name']



