from rest_framework import serializers
from .models import UserPhoto
from .models import UserSignUp


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
