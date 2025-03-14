from django.urls import path
from .views import (
    UploadPhotoView, 
    HelloworldView, 
    signup, 
    forgot_password,
    login  # Add login to imports
)

urlpatterns = [
    path('upload/', UploadPhotoView.as_view(), name='upload-photo'),
    path('', HelloworldView.as_view(), name='hello-world'),
    path('signup/', signup, name='signup'),
    path('forgot-password/', forgot_password, name='forgot_password'),
    path('login/', login, name='login'),
]
