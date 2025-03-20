from django.core.management.base import BaseCommand
import pandas as pd
from api.models import UserSignUp, FellowProfile
from datetime import datetime

class Command(BaseCommand):
    help = 'Import fellow profiles from CSV'

    def handle(self, *args, **kwargs):
        try:
            # Read CSV file
            df = pd.read_csv('Cleaned_Bose_Fellows_Data.csv')
            
            # Track statistics
            created_count = 0
            updated_count = 0
            error_count = 0
            
            for _, row in df.iterrows():
                try:
                    user = UserSignUp.objects.get(mobile_number=str(row['mobile_number']))
                    
                    # Parse date of birth if present
                    dob = None
                    if pd.notna(row.get('date_of_birth')):
                        try:
                            dob = datetime.strptime(str(row['date_of_birth']), '%Y-%m-%d').date()
                        except:
                            self.stdout.write(f"Invalid date format for {row['mobile_number']}")
                    
                    # Create or update profile
                    profile, created = FellowProfile.objects.get_or_create(
                        user=user,
                        defaults={
                            'fellow_id': row.get('fellow_id', ''),
                            'team_leader': row.get('team_leader', ''),
                            'fellow_status': row.get('fellow_status', 'Active'),
                            'performance_score': row.get('performance_score', ''),
                            
                            # Personal Details
                            'gender': row.get('gender', ''),
                            'caste_category': row.get('caste_category', ''),
                            'date_of_birth': dob,
                            'state': row.get('state', ''),
                            'district': row.get('district', ''),
                            'mandal': row.get('mandal', ''),
                            'village': row.get('village', ''),
                            'whatsapp_number': str(row.get('whatsapp_number', '')),
                            'email': row.get('email', ''),
                            
                            # Family Details
                            'mother_name': row.get('mother_name', ''),
                            'mother_occupation': row.get('mother_occupation', ''),
                            'father_name': row.get('father_name', ''),
                            'father_occupation': row.get('father_occupation', ''),
                            
                            # Education Details
                            'current_job': row.get('current_job', ''),
                            'hobbies': row.get('hobbies', ''),
                            'college_name': row.get('college_name', ''),
                            'college_type': row.get('college_type', ''),
                            'study_mode': row.get('study_mode', ''),
                            'stream': row.get('stream', ''),
                            'course': row.get('course', ''),
                            'subjects': row.get('subjects', ''),
                            'semester': row.get('semester', ''),
                            'technical_skills': row.get('technical_skills', ''),
                            'artistic_skills': row.get('artistic_skills', '')
                        }
                    )
                    
                    if created:
                        created_count += 1
                        self.stdout.write(f"Created profile for: {user.full_name}")
                    else:
                        updated_count += 1
                        self.stdout.write(f"Profile exists for: {user.full_name}")
                    
                except UserSignUp.DoesNotExist:
                    error_count += 1
                    self.stdout.write(self.style.ERROR(
                        f"User not found for mobile: {row['mobile_number']}"
                    ))
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