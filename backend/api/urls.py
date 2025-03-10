from django.urls import path
from .views import UploadPhotoView, HelloworldView

urlpatterns = [
    path('upload/', UploadPhotoView.as_view(), name='upload-photo'),
    path('', HelloworldView.as_view(), name='hello-world'),
]
