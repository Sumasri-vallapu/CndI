from django.core.management.base import BaseCommand
import csv
from api.models import State, District, Mandal, GramPanchayat

class Command(BaseCommand):
    help = 'Load location data from CSV'

    def handle(self, *args, **kwargs):
        with open('backend/data/ts_grampanchayatelectionsdata.csv', 'r') as file:
            csv_reader = csv.reader(file)
            next(csv_reader)  # Skip header
            
            for row in csv_reader:
                state_id, state_name, district_id, district_name, mandal_id, mandal_name, gpcode, gp_name = row
                state, _ = State.objects.get_or_create(
                    id=int(state_id),
                    defaults={'state_name': state_name}
                )  

                district, _ = District.objects.get_or_create(
                    id=int(district_id),
                    defaults={
                        'district_name': district_name,
                        'state': state
                    }
                )

                mandal, _ = Mandal.objects.get_or_create(
                    id=int(mandal_id),
                    defaults={
                        'mandal_name': mandal_name,
                        'district': district
                    }
                )

                gram_panchayat, _ = GramPanchayat.objects.get_or_create(
                    id=int(gpcode),
                    defaults={
                        'gram_panchayat_name': gp_name,
                        'mandal': mandal
                    }
                )

                self.stdout.write(f"Processed: {state_name} -> {district_name} -> {mandal_name} -> {gp_name}") 