from django.urls import path
from .views import (
    UploadPhotoView, 
    HelloworldView, 
    signup, 
    forgot_password,
    login,
    update_tasks,
    update_data_consent,
    update_child_protection_consent,
    get_user_status,
    get_castes,
    get_states,
    get_districts,
    get_mandals,
    get_villages,
    register
)

urlpatterns = [
    path('upload/', UploadPhotoView.as_view(), name='upload-photo'),
    path('', HelloworldView.as_view(), name='hello-world'),
    path('signup/', signup, name='signup'),
    path('forgot-password/', forgot_password, name='forgot_password'),
    path('login/', login, name='login'),
    path('tasks/update/', update_tasks, name='update_tasks'),
    path('data-consent/update/', update_data_consent, name='update_data_consent'),
    path('child-protection/update/', update_child_protection_consent, name='update_child_protection'),
    path('user-status/<str:mobile_number>/', get_user_status, name='get_user_status'),
    path('castes/', get_castes, name='get_castes'),
    path('states/', get_states, name='get_states'),
    path('districts/', get_districts, name='get_districts'),
    path('mandals/', get_mandals, name='get_mandals'),
    path('villages/', get_villages, name='get_villages'),
    path('register/', register, name='register'),
]
