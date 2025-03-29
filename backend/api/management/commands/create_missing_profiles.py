from django.core.management.base import BaseCommand
from api.models import FellowRegistration, FellowProfile

class Command(BaseCommand):
    help = 'Create missing FellowProfile records for existing registrations'

    def handle(self, *args, **kwargs):
        registrations = FellowRegistration.objects.all()
        created_count = 0

        for registration in registrations:
            try:
                # Check if profile exists
                FellowProfile.objects.get(user=registration.fellow)
                self.stdout.write(f"Profile exists for {registration.fellow.mobile_number}")
            except FellowProfile.DoesNotExist:
                # Create new profile
                FellowProfile.objects.create(
                    user=registration.fellow,
                    mobile_number=registration.fellow.mobile_number,
                    date_of_birth=registration.date_of_birth,
                    gender=registration.gender,
                    caste_category=registration.caste_category,
                    state=registration.state,
                    district=registration.district,
                    mandal=registration.mandal,
                    grampanchayat=registration.grampanchayat,
                    batch=registration.batch,
                    academic_year=registration.academic_year
                )
                created_count += 1
                self.stdout.write(f"Created profile for {registration.fellow.mobile_number}")

        self.stdout.write(f"Created {created_count} new profiles") 