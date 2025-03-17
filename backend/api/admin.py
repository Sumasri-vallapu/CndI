from django.contrib import admin
from .models import (
    UserPhoto, 
    UserSignUp, 
    Registration, 
    Task_details,
    State,
    District,
    Mandal,
    GramPanchayat
)

# Register your models here
admin.site.register(UserPhoto)
admin.site.register(UserSignUp)
admin.site.register(Registration)
admin.site.register(Task_details)
admin.site.register(State)
admin.site.register(District)
admin.site.register(Mandal)
admin.site.register(GramPanchayat)
