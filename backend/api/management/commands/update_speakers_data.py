from django.core.management.base import BaseCommand
from api.models import Speaker


class Command(BaseCommand):
    help = 'Updates existing speakers with location and language data'

    def handle(self, *args, **kwargs):
        updates = {
            'elon.musk@speaker.com': {
                'location': 'Austin, TX',
                'languages': 'English',
                'industry': 'Technology'
            },
            'sarah.chen@speaker.com': {
                'location': 'San Francisco, CA',
                'languages': 'English, Mandarin',
                'industry': 'Technology'
            },
            'dr.james.wilson@speaker.com': {
                'location': 'New York, NY',
                'languages': 'English',
                'industry': 'Healthcare'
            },
            'maria.rodriguez@speaker.com': {
                'location': 'Miami, FL',
                'languages': 'English, Spanish',
                'industry': 'Finance'
            },
            'david.kim@speaker.com': {
                'location': 'Seattle, WA',
                'languages': 'English, Korean',
                'industry': 'Technology'
            },
            'lisa.thompson@speaker.com': {
                'location': 'Chicago, IL',
                'languages': 'English',
                'industry': 'Consulting'
            },
            'dr.amit.patel@speaker.com': {
                'location': 'Boston, MA',
                'languages': 'English, Hindi, Gujarati',
                'industry': 'Education'
            },
            'sophia.martinez@speaker.com': {
                'location': 'Portland, OR',
                'languages': 'English, Spanish',
                'industry': 'Environmental Science'
            },
            'robert.johnson@speaker.com': {
                'location': 'Atlanta, GA',
                'languages': 'English',
                'industry': 'Healthcare'
            },
            'emily.wong@speaker.com': {
                'location': 'Los Angeles, CA',
                'languages': 'English, Cantonese',
                'industry': 'Marketing'
            }
        }

        updated_count = 0
        for email, data in updates.items():
            try:
                speaker = Speaker.objects.get(user__email=email)
                speaker.location = data['location']
                speaker.languages = data['languages']
                speaker.industry = data['industry']
                speaker.save()
                updated_count += 1
                self.stdout.write(self.style.SUCCESS(f"Updated {email}"))
            except Speaker.DoesNotExist:
                self.stdout.write(self.style.WARNING(f"Speaker not found: {email}"))

        self.stdout.write(self.style.SUCCESS(f"\nSuccessfully updated {updated_count} speakers!"))
