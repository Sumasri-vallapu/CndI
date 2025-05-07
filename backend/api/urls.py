from django.urls import path
from .views import NameSubmitView

urlpatterns = [
    path("submit-name/", NameSubmitView.as_view(), name="submit-name"),
]
