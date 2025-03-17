from rest_framework import serializers
from .models import (
    UserPhoto,
    UserSignUp,
    Registration,
    Task_details
)


class UserPhotoSerializer(serializers.ModelSerializer):
    photo = serializers.ImageField(required=True)  # ✅ Add this to handle file uploads

    class Meta:
        model = UserPhoto
        fields = ['username', 'photo']  # ✅ Remove 'photo_url' from here

    def create(self, validated_data):
        validated_data.pop('photo')  # ✅ Remove 'photo' from validated_data
        return UserPhoto.objects.create(**validated_data)




class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSignUp
        fields = ['id', 'mobile_number', 'surname', 'given_name', 'password', 'unique_number', 'created_at', 'ip_address', 'device_info']


class RegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Registration
        fields = [
            'user',
            'mobile_number',
            'full_name',
            'date_of_birth',
            'gender',
            'caste_category',
            'state',
            'district',
            'mandal',
            'village',
            'insert_timestamp',
            'is_approved'
        ]
        read_only_fields = ['insert_timestamp', 'is_approved']

    def create(self, validated_data):
        # Ensure user is set from the view
        if 'user' not in validated_data:
            raise serializers.ValidationError("User is required")
        return super().create(validated_data)


class TaskDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task_details
        fields = [
            'user', 'mobile_number', 'lc_district', 'lc_mandal', 
            'lc_grampanchayat', 'lc_photo_s3_url', 'students_marks_s3_url'
        ]

class VideoStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Registration
        fields = ['isvideo1seen', 'isvideo2seen']
