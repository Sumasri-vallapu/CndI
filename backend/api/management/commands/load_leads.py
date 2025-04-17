import csv
import os

from django.core.management.base import BaseCommand
from api.models import District, DistrictLead, TeamLead
from django.conf import settings

class Command(BaseCommand):
    help = "Load District Leads and Team Leads from CSV"

    def handle(self, *args, **kwargs):
        data_dir = os.path.join(settings.BASE_DIR, "data")
        district_leads_path = os.path.join(data_dir, "district_leads.csv")
        team_leads_path = os.path.join(data_dir, "team_leads.csv")

        # ✅ Load District Leads
        self.stdout.write("📥 Loading District Leads...")
        with open(district_leads_path, newline='', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            for row in reader:
                dl_id = row["dl_id"].strip()
                name = row["name"].strip()
                district_id = row["district_id"].strip()

                try:
                    district = District.objects.get(id=district_id)
                except District.DoesNotExist:
                    self.stdout.write(self.style.ERROR(f"❌ District ID {district_id} not found"))
                    continue

                district_lead, created = DistrictLead.objects.get_or_create(
                    dl_id=dl_id,
                    name=name,
                    district=district
                )
                if created:
                    self.stdout.write(self.style.SUCCESS(f"✅ Created DL {name} for District {district.district_name}"))
                else:
                    self.stdout.write(f"ℹ️ DL {name} already exists for District {district.district_name}")

        # ✅ Load Team Leads
        self.stdout.write("📥 Loading Team Leads...")
        with open(team_leads_path, newline='', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            for row in reader:
                name = row["TL_Name"].strip()
                dl_id = row["DL_ID"].strip()

                # Get all DistrictLead objects matching this dl_id (can be across districts)
                matching_leads = DistrictLead.objects.filter(dl_id=dl_id)
                if not matching_leads.exists():
                    self.stdout.write(self.style.ERROR(f"❌ DL ID {dl_id} not found for TL {name}"))
                    continue

                for district_lead in matching_leads:
                    team_lead, created = TeamLead.objects.get_or_create(
                        name=name,
                        district_lead=district_lead
                    )
                    if created:
                        self.stdout.write(self.style.SUCCESS(
                            f"✅ Created TL {name} under DL {district_lead.name} (District {district_lead.district.district_name})"
                        ))
                    else:
                        self.stdout.write(f"ℹ️ TL {name} already exists under DL {district_lead.name} (District {district_lead.district.district_name})")

        self.stdout.write(self.style.SUCCESS("🎉 Done loading all District & Team Leads."))
