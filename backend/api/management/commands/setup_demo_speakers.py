from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from api.models import Speaker, UserProfile


class Command(BaseCommand):
    help = 'Setup demo speakers - deletes all existing and creates 20 new ones with images'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.WARNING('🗑️  Deleting all existing speakers...'))

        # Delete all existing speakers (this will cascade delete users)
        speaker_count = Speaker.objects.count()
        Speaker.objects.all().delete()

        self.stdout.write(self.style.SUCCESS(f'✅ Deleted {speaker_count} existing speakers'))

        self.stdout.write(self.style.WARNING('📦 Creating 20 new speakers with images...'))

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
                'industry': 'Technology',
                'profile_image': 'https://randomuser.me/api/portraits/men/1.jpg'
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
                'website': '',
                'location': 'San Francisco, CA',
                'languages': 'English, Mandarin',
                'industry': 'Technology',
                'profile_image': 'https://randomuser.me/api/portraits/women/1.jpg'
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
                'website': '',
                'location': 'Boston, MA',
                'languages': 'English',
                'industry': 'Healthcare',
                'profile_image': 'https://randomuser.me/api/portraits/men/2.jpg'
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
                'website': '',
                'location': 'New York, NY',
                'languages': 'English, Spanish',
                'industry': 'Finance',
                'profile_image': 'https://randomuser.me/api/portraits/women/2.jpg'
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
                'website': '',
                'location': 'Seattle, WA',
                'languages': 'English, Korean',
                'industry': 'Technology',
                'profile_image': 'https://randomuser.me/api/portraits/men/3.jpg'
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
                'website': '',
                'location': 'Chicago, IL',
                'languages': 'English',
                'industry': 'Consulting',
                'profile_image': 'https://randomuser.me/api/portraits/women/3.jpg'
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
                'website': '',
                'location': 'Mumbai, India',
                'languages': 'English, Hindi, Gujarati',
                'industry': 'Education',
                'profile_image': 'https://randomuser.me/api/portraits/men/4.jpg'
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
                'website': '',
                'location': 'Los Angeles, CA',
                'languages': 'English, Spanish',
                'industry': 'Environment',
                'profile_image': 'https://randomuser.me/api/portraits/women/4.jpg'
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
                'website': '',
                'location': 'Atlanta, GA',
                'languages': 'English',
                'industry': 'Public Health',
                'profile_image': 'https://randomuser.me/api/portraits/men/5.jpg'
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
                'website': '',
                'location': 'Singapore',
                'languages': 'English, Mandarin, Cantonese',
                'industry': 'Marketing',
                'profile_image': 'https://randomuser.me/api/portraits/women/5.jpg'
            },
            {
                'email': 'michael.brown@speaker.com',
                'first_name': 'Michael',
                'last_name': 'Brown',
                'bio': 'Cybersecurity expert and ethical hacker. Former NSA consultant specializing in network security and threat prevention.',
                'expertise': 'technology',
                'speaking_topics': 'Cybersecurity, Ethical Hacking, Network Security, Data Protection',
                'experience_years': 13,
                'hourly_rate': 4200.00,
                'availability_status': 'available',
                'website': '',
                'location': 'Washington, DC',
                'languages': 'English',
                'industry': 'Cybersecurity',
                'profile_image': 'https://randomuser.me/api/portraits/men/6.jpg'
            },
            {
                'email': 'priya.sharma@speaker.com',
                'first_name': 'Priya',
                'last_name': 'Sharma',
                'bio': 'Data scientist and AI ethics researcher. Leading voice in responsible AI development and algorithmic fairness.',
                'expertise': 'technology',
                'speaking_topics': 'Data Science, AI Ethics, Algorithmic Fairness, Machine Learning',
                'experience_years': 8,
                'hourly_rate': 3300.00,
                'availability_status': 'available',
                'website': '',
                'location': 'Bangalore, India',
                'languages': 'English, Hindi, Tamil',
                'industry': 'Technology',
                'profile_image': 'https://randomuser.me/api/portraits/women/6.jpg'
            },
            {
                'email': 'carlos.garcia@speaker.com',
                'first_name': 'Carlos',
                'last_name': 'Garcia',
                'bio': 'International business consultant. Expert in cross-cultural management and global market expansion strategies.',
                'expertise': 'business',
                'speaking_topics': 'International Business, Cross-Cultural Management, Global Strategy',
                'experience_years': 17,
                'hourly_rate': 4800.00,
                'availability_status': 'busy',
                'website': '',
                'location': 'Mexico City, Mexico',
                'languages': 'Spanish, English, Portuguese',
                'industry': 'International Business',
                'profile_image': 'https://randomuser.me/api/portraits/men/7.jpg'
            },
            {
                'email': 'jennifer.lee@speaker.com',
                'first_name': 'Jennifer',
                'last_name': 'Lee',
                'bio': 'HR transformation leader and workplace culture expert. Helped companies build diverse and inclusive organizations.',
                'expertise': 'business',
                'speaking_topics': 'HR Strategy, DEI, Workplace Culture, Talent Management',
                'experience_years': 14,
                'hourly_rate': 3700.00,
                'availability_status': 'available',
                'website': '',
                'location': 'Toronto, Canada',
                'languages': 'English, French',
                'industry': 'Human Resources',
                'profile_image': 'https://randomuser.me/api/portraits/women/7.jpg'
            },
            {
                'email': 'alex.novak@speaker.com',
                'first_name': 'Alex',
                'last_name': 'Novak',
                'bio': 'Blockchain and cryptocurrency expert. Pioneer in decentralized finance and Web3 technologies.',
                'expertise': 'technology',
                'speaking_topics': 'Blockchain, Cryptocurrency, DeFi, Web3, NFTs',
                'experience_years': 7,
                'hourly_rate': 5500.00,
                'availability_status': 'available',
                'website': '',
                'location': 'London, UK',
                'languages': 'English',
                'industry': 'Blockchain',
                'profile_image': 'https://randomuser.me/api/portraits/men/8.jpg'
            },
            {
                'email': 'nina.okonkwo@speaker.com',
                'first_name': 'Nina',
                'last_name': 'Okonkwo',
                'bio': 'Social entrepreneur and impact investor. Founded multiple NGOs focused on poverty alleviation and education in Africa.',
                'expertise': 'social impact',
                'speaking_topics': 'Social Entrepreneurship, Impact Investing, Sustainable Development, Africa',
                'experience_years': 12,
                'hourly_rate': 3600.00,
                'availability_status': 'available',
                'website': '',
                'location': 'Lagos, Nigeria',
                'languages': 'English, Igbo, French',
                'industry': 'Social Impact',
                'profile_image': 'https://randomuser.me/api/portraits/women/8.jpg'
            },
            {
                'email': 'daniel.cohen@speaker.com',
                'first_name': 'Daniel',
                'last_name': 'Cohen',
                'bio': 'Venture capitalist and startup mentor. Invested in over 50 successful startups including unicorns.',
                'expertise': 'business',
                'speaking_topics': 'Venture Capital, Startup Funding, Entrepreneurship, Innovation',
                'experience_years': 19,
                'hourly_rate': 7500.00,
                'availability_status': 'busy',
                'website': '',
                'location': 'Tel Aviv, Israel',
                'languages': 'English, Hebrew',
                'industry': 'Venture Capital',
                'profile_image': 'https://randomuser.me/api/portraits/men/9.jpg'
            },
            {
                'email': 'rachel.kim@speaker.com',
                'first_name': 'Rachel',
                'last_name': 'Kim',
                'bio': 'UX/UI design expert and design thinking advocate. Led design teams at Google and Airbnb.',
                'expertise': 'design',
                'speaking_topics': 'UX Design, Product Design, Design Thinking, User Research',
                'experience_years': 11,
                'hourly_rate': 3800.00,
                'availability_status': 'available',
                'website': '',
                'location': 'Seoul, South Korea',
                'languages': 'Korean, English',
                'industry': 'Design',
                'profile_image': 'https://randomuser.me/api/portraits/women/9.jpg'
            },
            {
                'email': 'thomas.mueller@speaker.com',
                'first_name': 'Thomas',
                'last_name': 'Mueller',
                'bio': 'Manufacturing innovation expert and Industry 4.0 evangelist. Leading the digital transformation of traditional industries.',
                'expertise': 'engineering',
                'speaking_topics': 'Industry 4.0, Manufacturing, IoT, Automation, Smart Factories',
                'experience_years': 21,
                'hourly_rate': 4600.00,
                'availability_status': 'available',
                'website': '',
                'location': 'Munich, Germany',
                'languages': 'German, English',
                'industry': 'Manufacturing',
                'profile_image': 'https://randomuser.me/api/portraits/men/10.jpg'
            },
            {
                'email': 'isabella.rossi@speaker.com',
                'first_name': 'Isabella',
                'last_name': 'Rossi',
                'bio': 'Fashion industry innovator and sustainable fashion advocate. Transforming the fashion industry through eco-friendly practices.',
                'expertise': 'fashion',
                'speaking_topics': 'Sustainable Fashion, Fashion Tech, Circular Economy, Ethical Manufacturing',
                'experience_years': 10,
                'hourly_rate': 3400.00,
                'availability_status': 'available',
                'website': '',
                'location': 'Milan, Italy',
                'languages': 'Italian, English, French',
                'industry': 'Fashion',
                'profile_image': 'https://randomuser.me/api/portraits/women/10.jpg'
            }
        ]

        created_count = 0
        for speaker_data in fake_speakers:
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
                website=speaker_data['website'],
                location=speaker_data.get('location', ''),
                languages=speaker_data.get('languages', 'English'),
                industry=speaker_data.get('industry', ''),
                profile_image=speaker_data.get('profile_image', ''),
                approval_status='approved'  # Auto-approve for demo
            )

            created_count += 1
            self.stdout.write(self.style.SUCCESS(f'✅ Created: {speaker_data["first_name"]} {speaker_data["last_name"]}'))

        self.stdout.write('')
        self.stdout.write(self.style.SUCCESS(f'🎉 Successfully created {created_count} speakers!'))
        self.stdout.write(self.style.SUCCESS(f'🎯 All speakers are auto-approved and have profile images'))
        self.stdout.write('')
        self.stdout.write(self.style.WARNING(f'💡 Refresh your frontend to see the speakers!'))
