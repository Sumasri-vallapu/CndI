from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from api.models import Speaker, UserProfile


class Command(BaseCommand):
    help = 'Creates fake speaker profiles for testing'

    def handle(self, *args, **kwargs):
        fake_speakers = [
            {
                'email': 'elon.musk@speaker.com',
                'first_name': 'Elon',
                'last_name': 'Musk',
                'bio': 'Entrepreneur and business magnate. CEO of Tesla, SpaceX, and xAI. Passionate about innovation, space exploration, and sustainable energy.',
                'expertise': 'technology',
                'speaking_topics': 'Innovation, Space Exploration, Electric Vehicles, AI, Entrepreneurship',
                'experience_years': 20,
                'hourly_rate': 10000.00,
                'availability_status': 'available',
                'website': 'https://twitter.com/elonmusk',
                'location': 'Austin, TX',
                'languages': 'English',
                'industry': 'Technology'
            },
            {
                'email': 'sarah.chen@speaker.com',
                'first_name': 'Sarah',
                'last_name': 'Chen',
                'bio': 'Leading AI researcher and tech innovator. Former Meta executive with expertise in machine learning and product development.',
                'expertise': 'technology',
                'speaking_topics': 'Artificial Intelligence, Machine Learning, Product Strategy, Tech Leadership',
                'experience_years': 12,
                'hourly_rate': 3500.00,
                'availability_status': 'available',
                'website': ''
            },
            {
                'email': 'dr.james.wilson@speaker.com',
                'first_name': 'James',
                'last_name': 'Wilson',
                'bio': 'Renowned medical researcher specializing in innovative healthcare solutions. Pioneer in telemedicine and digital health transformation.',
                'expertise': 'healthcare',
                'speaking_topics': 'Digital Health, Telemedicine, Medical Innovation, Patient Care',
                'experience_years': 18,
                'hourly_rate': 4500.00,
                'availability_status': 'busy',
                'website': ''
            },
            {
                'email': 'maria.rodriguez@speaker.com',
                'first_name': 'Maria',
                'last_name': 'Rodriguez',
                'bio': 'Financial strategist and investment expert. Former Goldman Sachs partner with deep expertise in global markets and fintech.',
                'expertise': 'business',
                'speaking_topics': 'Financial Strategy, Investment, Fintech, Global Markets, Leadership',
                'experience_years': 15,
                'hourly_rate': 5000.00,
                'availability_status': 'available',
                'website': ''
            },
            {
                'email': 'david.kim@speaker.com',
                'first_name': 'David',
                'last_name': 'Kim',
                'bio': 'Tech entrepreneur and startup advisor. Built and scaled multiple successful tech companies. Expert in cloud computing and SaaS.',
                'expertise': 'technology',
                'speaking_topics': 'Startups, Cloud Computing, SaaS, Scaling Businesses, Tech Entrepreneurship',
                'experience_years': 10,
                'hourly_rate': 3000.00,
                'availability_status': 'available',
                'website': ''
            },
            {
                'email': 'lisa.thompson@speaker.com',
                'first_name': 'Lisa',
                'last_name': 'Thompson',
                'bio': 'Management consultant and business transformation expert. Helped Fortune 500 companies navigate digital transformation.',
                'expertise': 'business',
                'speaking_topics': 'Business Strategy, Digital Transformation, Change Management, Leadership',
                'experience_years': 16,
                'hourly_rate': 4000.00,
                'availability_status': 'busy',
                'website': ''
            },
            {
                'email': 'dr.amit.patel@speaker.com',
                'first_name': 'Amit',
                'last_name': 'Patel',
                'bio': 'Education reformer and EdTech pioneer. Former university dean passionate about accessible education and online learning.',
                'expertise': 'education',
                'speaking_topics': 'Educational Innovation, EdTech, Online Learning, Curriculum Design',
                'experience_years': 14,
                'hourly_rate': 2500.00,
                'availability_status': 'available',
                'website': ''
            },
            {
                'email': 'sophia.martinez@speaker.com',
                'first_name': 'Sophia',
                'last_name': 'Martinez',
                'bio': 'Environmental scientist and climate activist. Leading researcher in sustainable technologies and green energy solutions.',
                'expertise': 'science',
                'speaking_topics': 'Climate Change, Sustainability, Green Energy, Environmental Policy',
                'experience_years': 11,
                'hourly_rate': 3200.00,
                'availability_status': 'available',
                'website': ''
            },
            {
                'email': 'robert.johnson@speaker.com',
                'first_name': 'Robert',
                'last_name': 'Johnson',
                'bio': 'Public health expert and policy advisor. Former CDC director with expertise in pandemic response and healthcare systems.',
                'expertise': 'healthcare',
                'speaking_topics': 'Public Health, Healthcare Policy, Pandemic Response, Health Systems',
                'experience_years': 22,
                'hourly_rate': 6000.00,
                'availability_status': 'available',
                'website': ''
            },
            {
                'email': 'emily.wong@speaker.com',
                'first_name': 'Emily',
                'last_name': 'Wong',
                'bio': 'Marketing strategist and brand expert. Built iconic brands for major tech companies and startups worldwide.',
                'expertise': 'business',
                'speaking_topics': 'Brand Strategy, Marketing, Growth Hacking, Consumer Psychology',
                'experience_years': 9,
                'hourly_rate': 2800.00,
                'availability_status': 'available',
                'website': ''
            }
        ]

        created_count = 0
        for speaker_data in fake_speakers:
            # Check if user already exists
            if User.objects.filter(email=speaker_data['email']).exists():
                self.stdout.write(self.style.WARNING(f"User {speaker_data['email']} already exists, skipping..."))
                continue

            # Create user
            user = User.objects.create_user(
                username=speaker_data['email'],
                email=speaker_data['email'],
                first_name=speaker_data['first_name'],
                last_name=speaker_data['last_name'],
                password='password123'  # Default password for testing
            )

            # Create UserProfile
            UserProfile.objects.create(user=user)

            # Create Speaker profile
            Speaker.objects.create(
                user=user,
                bio=speaker_data['bio'],
                expertise=speaker_data['expertise'],
                speaking_topics=speaker_data['speaking_topics'],
                experience_years=speaker_data['experience_years'],
                hourly_rate=speaker_data['hourly_rate'],
                availability_status=speaker_data['availability_status'],
                website=speaker_data['website']
            )

            created_count += 1
            self.stdout.write(self.style.SUCCESS(f"Created speaker: {speaker_data['first_name']} {speaker_data['last_name']}"))

        self.stdout.write(self.style.SUCCESS(f"\nSuccessfully created {created_count} fake speakers!"))
