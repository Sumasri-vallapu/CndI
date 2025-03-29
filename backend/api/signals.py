from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import FellowRegistration, FellowProfile

@receiver(post_save, sender=FellowRegistration)
def create_fellow_profile(sender, instance, created, **kwargs):
    """Create FellowProfile when FellowRegistration is created"""
    if created:
        try:
            # Check if profile already exists
            FellowProfile.objects.get(user=instance.fellow)
        except FellowProfile.DoesNotExist:
            # Create new profile with all fields
            FellowProfile.objects.create(
                user=instance.fellow,
                mobile_number=instance.fellow.mobile_number,
                date_of_birth=instance.date_of_birth,
                gender=instance.gender,
                caste_category=instance.caste_category,
                state=instance.state,
                district=instance.district,
                mandal=instance.mandal,
                grampanchayat=instance.grampanchayat,
                batch=instance.batch,
                academic_year=instance.academic_year,
                # Initialize education fields as empty
                semester='',
                type_of_college='',
                study_mode='',
                stream='',
                subjects='',
                mode_of_study='',
                technical_skills='',
                artistic_skills=''
            ) 