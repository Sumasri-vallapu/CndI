from rest_framework import serializers
from .models import UserPhoto

class UserPhotoSerializer(serializers.ModelSerializer):
    photo = serializers.ImageField(required=True)  # ✅ Add this to handle file uploads

    class Meta:
        model = UserPhoto
        fields = ['username', 'photo']  # ✅ Remove 'photo_url' from here

    def create(self, validated_data):
        validated_data.pop('photo')  # ✅ Remove 'photo' from validated_data
        return UserPhoto.objects.create(**validated_data)
