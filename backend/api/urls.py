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
    register,
    get_user_details,
    get_task_status,
    get_video_status,
    update_video_status,
    submit_task1,
    submit_task2,
    upload_profile_photo,
    get_fellow_profile,
    update_fellow_profile_section,
    update_fellow_acceptance,
    get_fellow_acceptance
)   

urlpatterns = [
    path('', HelloworldView.as_view(), name='hello-world'),
    path('signup/', signup, name='signup'),
    path('forgot-password/', forgot_password, name='forgot_password'),
    path('login/', login, name='login'),
    path('data-consent/update/', update_data_consent, name='update_data_consent'),
    path('child-protection/update/', update_child_protection_consent, name='update_child_protection'),
    path('user-status/<str:mobile_number>/', get_user_status, name='get_user_status'),
    path('castes/', get_castes, name='get_castes'),
    path('tasks/update/', update_tasks, name='update_tasks'),

    # location api   
    path('states/', get_states, name='get_states'),
    path('districts/', get_districts, name='get_districts'),
    path('mandals/', get_mandals, name='get_mandals'),
    path('villages/', get_villages, name='get_villages'),
    path('register/', register, name='register'),

    # task api
    path('user-details/', get_user_details, name='get_user_details'),
    path('tasks/status/<str:mobile_number>/', get_task_status, name='get_task_status'),
    path('tasks/video-status/update/', update_video_status, name='update_video_status'),
    path('tasks/video-status/<str:mobile_number>/', get_video_status, name='get_video_status'),

    path('tasks/submit-task1/', submit_task1, name='submit_task1'),
    path('tasks/submit-task2/', submit_task2, name='submit_task2'),


    path('upload-profile-photo/', upload_profile_photo, name='upload_profile_photo'), 
    path('fellow-profile/<str:mobile_number>/accept/', update_fellow_acceptance, name='update_fellow_acceptance'),
    path('fellow-profile/<str:mobile_number>/acceptance-status/', get_fellow_acceptance, name='get_fellow_acceptance'),
    path('fellow-profile/<str:mobile_number>/<str:section>/', update_fellow_profile_section, name='update_fellow_profile_section'),
    path('fellow-profile/<str:mobile_number>/', get_fellow_profile, name='get_fellow_profile'),

    #test apist api
    path('upload/', UploadPhotoView.as_view(), name='upload-photo'),

]
