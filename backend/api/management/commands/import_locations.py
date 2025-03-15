import pandas as pd
from django.core.management.base import BaseCommand
from api.models import State, District, Mandal, GramPanchayat  # ✅ Ensure correct import path

class Command(BaseCommand):
    help = "Import location data from CSV into Django models"

    def handle(self, *args, **kwargs):
        # ✅ Path to your CSV file (update if needed)
        csv_file_path = "ts_grampanchayatelectionsdata.csv"

        try:
            df = pd.read_csv(csv_file_path)
        except FileNotFoundError:
            self.stdout.write(self.style.ERROR(f"CSV file not found: {csv_file_path}"))
            return

        # ✅ Caching to reduce DB queries
        state_cache = {}
        district_cache = {}
        mandal_cache = {}

        for _, row in df.iterrows():
            # ✅ Insert State
            if row["state_id"] not in state_cache:
                state, _ = State.objects.get_or_create(
                    id=row["state_id"],
                    defaults={"name": row["state_name"]}
                )
                state_cache[row["state_id"]] = state
            else:
                state = state_cache[row["state_id"]]

            # ✅ Insert District
            if row["district_id"] not in district_cache:
                district, _ = District.objects.get_or_create(
                    id=row["district_id"],
                    defaults={"name": row["district_name"], "state": state}
                )
                district_cache[row["district_id"]] = district
            else:
                district = district_cache[row["district_id"]]

            # ✅ Insert Mandal
            if row["mandal_id"] not in mandal_cache:
                mandal, _ = Mandal.objects.get_or_create(
                    id=row["mandal_id"],
                    defaults={"name": row["mandal_name"], "district": district}
                )
                mandal_cache[row["mandal_id"]] = mandal
            else:
                mandal = mandal_cache[row["mandal_id"]]

            # ✅ Insert Village
            GramPanchayat.objects.get_or_create(
                name=row["gp_name"],
                mandal=mandal
            )

        self.stdout.write(self.style.SUCCESS("✅ Successfully imported location data"))
