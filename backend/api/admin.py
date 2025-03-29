from django.contrib import admin
from .models import (
    FellowSignUp,
    FellowRegistration,
    FellowPhoto,
    FellowProfile,
    FellowTestimonial,
    TaskDetails,
    State,
    District,
    Mandal,
    GramPanchayat,
    University,
    College,
    Course
)

# Register your models here
admin.site.register(FellowSignUp)
admin.site.register(FellowRegistration)
admin.site.register(FellowPhoto)
admin.site.register(FellowProfile)
admin.site.register(TaskDetails)
admin.site.register(State)
admin.site.register(District)
admin.site.register(Mandal)
admin.site.register(GramPanchayat)
admin.site.register(University)
admin.site.register(College)
admin.site.register(Course)


@admin.register(FellowTestimonial)
class FellowTestimonialAdmin(admin.ModelAdmin):
    list_display = ('fellow', 'recorder_type', 'created_at')
    search_fields = ('fellow__mobile_number', 'recorder_type')
    list_filter = ('recorder_type', 'created_at')
