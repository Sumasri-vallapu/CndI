from django.core.management.base import BaseCommand
from api.models import Speaker


class Command(BaseCommand):
    help = 'Approve all pending speakers (for demo purposes)'

    def handle(self, *args, **kwargs):
        # Approve all speakers
        updated = Speaker.objects.filter(approval_status='pending').update(approval_status='approved')

        # Update speakers without images to add default images
        speakers_without_images = Speaker.objects.filter(profile_image='')
        image_counter = 1

        for speaker in speakers_without_images:
            # Assign random profile image based on gender (alternate)
            gender = 'men' if image_counter % 2 == 1 else 'women'
            speaker.profile_image = f'https://randomuser.me/api/portraits/{gender}/{(image_counter % 10) + 1}.jpg'

            # Add location if missing
            if not speaker.location:
                speaker.location = 'United States'

            # Add languages if missing
            if not speaker.languages:
                speaker.languages = 'English'

            # Add industry if missing
            if not speaker.industry:
                speaker.industry = speaker.expertise.title()

            speaker.save()
            image_counter += 1

        self.stdout.write(self.style.SUCCESS(f'✅ Approved {updated} speakers'))
        self.stdout.write(self.style.SUCCESS(f'✅ Updated {speakers_without_images.count()} speakers with images and missing fields'))
        self.stdout.write(self.style.SUCCESS(f'✅ Total approved speakers: {Speaker.objects.filter(approval_status="approved").count()}'))
