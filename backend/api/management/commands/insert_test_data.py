from django.core.management.base import BaseCommand
from api.models import State, District, Mandal, GramPanchayat

class Command(BaseCommand):
    help = 'Insert test data for locations'

    def handle(self, *args, **kwargs):
        # Create State
        state = State.objects.create(name="Telangana")
        self.stdout.write(f"Created state: {state.name} with ID: {state.id}")

        # Create District
        district = District.objects.create(
            state=state,
            name="Hyderabad"
        )
        self.stdout.write(f"Created district: {district.name} with ID: {district.id}")

        # Create Mandal
        mandal = Mandal.objects.create(
            district=district,
            name="Test Mandal"
        )
        self.stdout.write(f"Created mandal: {mandal.name} with ID: {mandal.id}")

        # Create Village/Gram Panchayat
        village = GramPanchayat.objects.create(
            mandal=mandal,
            name="Test Village"
        )
        self.stdout.write(f"Created village: {village.name} with ID: {village.id}") 