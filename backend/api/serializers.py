from rest_framework import serializers
from .models import (
    FellowSignUp,

    
    Registration,
    Task_details,


    UserPhoto,
    FellowProfile
)

from rest_framework import serializers
from .models import FellowSignUp

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
        fields = [
            'fellow',
            'mobile_number',
            'full_name',
            'date_of_birth',
            'gender',
            'caste_category',
            'state',
            'district',
            'mandal',
            'grampanchayat', 
            'academic_year',
            'batch',
            'task1_status',
            'task2_status',
            'isvideo1seen',
            'isvideo2seen',
            'istask1submitted',
            'istask2submitted',
            'is_approved'
        ]
        read_only_fields = ['fellow']


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
        model = Registration
        fields = ['isvideo1seen', 'isvideo2seen']




class UserPhotoSerializer(serializers.ModelSerializer):
    photo = serializers.ImageField(required=True)  # ✅ Add this to handle file uploads

    class Meta:
        model = UserPhoto
        fields = ['username', 'photo']  # ✅ Remove 'photo_url' from here

    def create(self, validated_data):
        validated_data.pop('photo')  # ✅ Remove 'photo' from validated_data
        return UserPhoto.objects.create(**validated_data)



