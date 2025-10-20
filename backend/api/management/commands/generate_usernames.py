"""
Django management command to generate usernames for existing Host and Speaker users
who don't have usernames yet.

Usage:
    python manage.py generate_usernames

This command will:
1. Find all Hosts and Speakers without usernames
2. Generate unique usernames based on their email or name
3. Update their records in the database
"""

from django.core.management.base import BaseCommand
from django.db import transaction
from api.models import Host, Speaker
import re


class Command(BaseCommand):
    help = 'Generate usernames for existing hosts and speakers without usernames'

    def add_arguments(self, parser):
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Show what would be done without making changes',
        )

    def generate_username(self, base_username, model_class):
        """
        Generate a unique username based on base_username.
        If base_username exists, append numbers until a unique one is found.
        """
        # Clean the base username - remove special characters
        base_username = re.sub(r'[^a-zA-Z0-9_]', '', base_username.lower())

        # Ensure it starts with a letter or underscore
        if base_username and not base_username[0].isalpha() and base_username[0] != '_':
            base_username = 'user_' + base_username

        # If empty after cleaning, use 'user'
        if not base_username:
            base_username = 'user'

        # Check if username exists in both Host and Speaker models
        username = base_username
        counter = 1

        while (Host.objects.filter(username=username).exists() or
               Speaker.objects.filter(username=username).exists()):
            username = f"{base_username}{counter}"
            counter += 1

        return username

    def get_base_username_from_user(self, user):
        """
        Generate base username from user's email or name
        """
        # Try to use email prefix first
        if user.email:
            email_prefix = user.email.split('@')[0]
            if email_prefix:
                return email_prefix

        # Fall back to first name + last name
        if user.first_name and user.last_name:
            return f"{user.first_name}{user.last_name}"
        elif user.first_name:
            return user.first_name
        elif user.last_name:
            return user.last_name

        # Last resort: use user ID
        return f"user{user.id}"

    def handle(self, *args, **options):
        dry_run = options['dry_run']

        if dry_run:
            self.stdout.write(self.style.WARNING('DRY RUN MODE - No changes will be made'))

        # Find hosts without usernames
        hosts_without_username = Host.objects.filter(username__isnull=True) | Host.objects.filter(username='')
        hosts_count = hosts_without_username.count()

        # Find speakers without usernames
        speakers_without_username = Speaker.objects.filter(username__isnull=True) | Speaker.objects.filter(username='')
        speakers_count = speakers_without_username.count()

        total_count = hosts_count + speakers_count

        if total_count == 0:
            self.stdout.write(self.style.SUCCESS('✓ All hosts and speakers already have usernames!'))
            return

        self.stdout.write(f'\nFound {hosts_count} hosts and {speakers_count} speakers without usernames.')
        self.stdout.write('Generating usernames...\n')

        # Process hosts
        hosts_updated = 0
        for host in hosts_without_username:
            base_username = self.get_base_username_from_user(host.user)
            new_username = self.generate_username(base_username, Host)

            if dry_run:
                self.stdout.write(
                    f"[DRY RUN] Would set username for Host '{host.user.get_full_name()}' "
                    f"({host.user.email}) to: {new_username}"
                )
            else:
                with transaction.atomic():
                    host.username = new_username
                    host.save()
                    hosts_updated += 1
                    self.stdout.write(
                        self.style.SUCCESS(
                            f"✓ Set username for Host '{host.user.get_full_name()}' to: {new_username}"
                        )
                    )

        # Process speakers
        speakers_updated = 0
        for speaker in speakers_without_username:
            base_username = self.get_base_username_from_user(speaker.user)
            new_username = self.generate_username(base_username, Speaker)

            if dry_run:
                self.stdout.write(
                    f"[DRY RUN] Would set username for Speaker '{speaker.user.get_full_name()}' "
                    f"({speaker.user.email}) to: {new_username}"
                )
            else:
                with transaction.atomic():
                    speaker.username = new_username
                    speaker.save()
                    speakers_updated += 1
                    self.stdout.write(
                        self.style.SUCCESS(
                            f"✓ Set username for Speaker '{speaker.user.get_full_name()}' to: {new_username}"
                        )
                    )

        # Summary
        self.stdout.write('\n' + '='*50)
        if dry_run:
            self.stdout.write(self.style.WARNING(f'\nDRY RUN COMPLETE'))
            self.stdout.write(f'Would update {hosts_count} hosts and {speakers_count} speakers')
            self.stdout.write('\nRun without --dry-run to apply changes')
        else:
            self.stdout.write(self.style.SUCCESS(f'\n✓ COMPLETED'))
            self.stdout.write(f'Updated {hosts_updated} hosts and {speakers_updated} speakers')
        self.stdout.write('='*50 + '\n')
