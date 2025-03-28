from django.core.management.base import BaseCommand
import pandas as pd
from api.models import UserSignUp
import uuid

class Command(BaseCommand):
    help = 'Import Bose fellows data from CSV'

    def handle(self, *args, **kwargs):
        try:
            # Read CSV file
            df = pd.read_csv('backend/data/Cleaned_Bose_Fellows_Data.csv')
            
            # Track statistics
            created_count = 0
            updated_count = 0
            error_count = 0
            
            for _, row in df.iterrows():
                try:
                    # Extract name parts (assuming full_name is in the format "SURNAME GIVEN_NAME")
                    full_name = str(row['full_name']).strip().upper()
                    name_parts = full_name.split(' ', 1)
                    surname = name_parts[0] if len(name_parts) > 0 else ''
                    given_name = name_parts[1] if len(name_parts) > 1 else ''
                    
                    # Create or update user
                    user, created = UserSignUp.objects.get_or_create(
                        mobile_number=str(row['mobile_number']),
                        defaults={
                            'surname': surname,
                            'given_name': given_name,
                            'password': str(row['mobile_number']),  # Using mobile number as default password
                            'unique_number': uuid.uuid4(),
                            'is_registered': True,  # Since they are already fellows
                            'is_selected': True,
                            'has_agreed_to_data_consent': True,
                            'has_agreed_to_child_protection': True,
                            'final_access_granted': True
                        }
                    )
                    
                    if created:
                        created_count += 1
                        self.stdout.write(f"Created user: {full_name}")
                    else:
                        updated_count += 1
                        self.stdout.write(f"User exists: {full_name}")
                    
                except Exception as e:
                    error_count += 1
                    self.stdout.write(self.style.ERROR(
                        f"Error processing row {row['mobile_number']}: {str(e)}"
                    ))
            
            # Print summary
            self.stdout.write(self.style.SUCCESS(
                f"\nImport completed:\n"
                f"Created: {created_count}\n"
                f"Updated: {updated_count}\n"
                f"Errors: {error_count}"
            ))
            
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Failed to import data: {str(e)}")) 