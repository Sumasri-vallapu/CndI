#!/usr/bin/env python
"""
Database Setup Script for C&I Platform
Initializes the database with all necessary data for local development
"""

import os
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth.models import User
from api.models import Speaker, Host, UserProfile, State, District
from django.core.management import call_command

def main():
    print("=" * 60)
    print("Setting up C&I Platform Database")
    print("=" * 60)

    # Check current state
    print("\n1. Checking current database state...")
    print(f"   - Users: {User.objects.count()}")
    print(f"   - Speakers: {Speaker.objects.count()}")
    print(f"   - Hosts: {Host.objects.count()}")
    print(f"   - States: {State.objects.count()}")
    print(f"   - Districts: {District.objects.count()}")

    # Create superuser if needed
    print("\n2. Setting up admin user...")
    if not User.objects.filter(username='admin').exists():
        User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='admin123'
        )
        print("   ✓ Admin user created (username: admin, password: admin123)")
    else:
        print("   ✓ Admin user already exists")

    # Load location data
    print("\n3. Loading location data...")
    if State.objects.count() == 0:
        print("   Loading states, districts, mandals from CSV...")
        call_command('load_locations')
        print(f"   ✓ Loaded: {State.objects.count()} states, {District.objects.count()} districts")
    else:
        print(f"   ✓ Location data already loaded")

    # Create fake speakers
    print("\n4. Creating sample speakers...")
    if Speaker.objects.count() == 0:
        call_command('create_fake_speakers')
        print(f"   ✓ Created {Speaker.objects.count()} speakers")
    else:
        print(f"   ✓ {Speaker.objects.count()} speakers already exist")

    # Create sample hosts
    print("\n5. Creating sample hosts...")
    hosts_data = [
        {
            'email': 'tech.events@corp.com',
            'first_name': 'John',
            'last_name': 'Anderson',
            'company_name': 'TechCorp Events',
            'organization_type': 'corporate',
            'bio': 'Leading corporate event organizer.',
        },
        {
            'email': 'sarah.university@edu.org',
            'first_name': 'Sarah',
            'last_name': 'Williams',
            'company_name': 'State University',
            'organization_type': 'educational',
            'bio': 'University events coordinator.',
        },
        {
            'email': 'nonprofit.events@org.com',
            'first_name': 'Michael',
            'last_name': 'Brown',
            'company_name': 'Community Action Network',
            'organization_type': 'nonprofit',
            'bio': 'Nonprofit organization hosting community events.',
        },
    ]

    created = 0
    for host_data in hosts_data:
        if not User.objects.filter(email=host_data['email']).exists():
            user = User.objects.create_user(
                username=host_data['email'],
                email=host_data['email'],
                first_name=host_data['first_name'],
                last_name=host_data['last_name'],
                password='password123'
            )
            UserProfile.objects.create(user=user)
            Host.objects.create(
                user=user,
                company_name=host_data['company_name'],
                organization_type=host_data['organization_type'],
                bio=host_data['bio']
            )
            created += 1

    if created > 0:
        print(f"   ✓ Created {created} hosts")
    else:
        print(f"   ✓ {Host.objects.count()} hosts already exist")

    # Final summary
    print("\n" + "=" * 60)
    print("DATABASE SETUP COMPLETE!")
    print("=" * 60)
    print(f"\nTotal Users: {User.objects.count()}")
    print(f"Speakers: {Speaker.objects.count()}")
    print(f"Hosts: {Host.objects.count()}")
    print(f"Location Data: {State.objects.count()} states, {District.objects.count()} districts")

    print("\n📝 Login Credentials:")
    print("   Admin: admin / admin123")
    print("   Speakers: [speaker-email] / password123")
    print("   Hosts: [host-email] / password123")

    print("\n✅ Ready to test!")
    print("   Backend: python manage.py runserver 127.0.0.1:8000")
    print("   Frontend: cd ../frontend && npm run dev")
    print("   Admin Panel: http://localhost:8000/admin/")
    print("=" * 60)

if __name__ == '__main__':
    main()
