from django.core.management.base import BaseCommand
import csv
from api.models import State, District, Mandal, GramPanchayat

class Command(BaseCommand):
    help = 'Load location data from CSV'

    def handle(self, *args, **kwargs):
        with open('backend/ts_grampanchayatelectionsdata.csv', 'r') as file:
            csv_reader = csv.reader(file)
            next(csv_reader)  # Skip header
            
            for row in csv_reader:
                state_id, state_name, district_id, district_name, mandal_id, mandal_name, gpcode, gp_name = row

                # Create or get State
                state, _ = State.objects.get_or_create(
                    id=int(state_id),
                    defaults={'name': state_name}
                )

                # Create or get District
                district, _ = District.objects.get_or_create(
                    id=int(district_id),
                    defaults={
                        'name': district_name,
                        'state': state
                    }
                )

                # Create or get Mandal
                mandal, _ = Mandal.objects.get_or_create(
                    id=int(mandal_id),
                    defaults={
                        'name': mandal_name,
                        'district': district
                    }
                )

                # Create or get GramPanchayat
                gram_panchayat, _ = GramPanchayat.objects.get_or_create(
                    id=int(gpcode),
                    defaults={
                        'name': gp_name,
                        'mandal': mandal
                    }
                )
                
                self.stdout.write(f"Processed: {state_name} -> {district_name} -> {mandal_name} -> {gp_name}") 