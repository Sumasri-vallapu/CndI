# Generated migration for adding username field to Host and Speaker models

from django.db import migrations, models
import re


def generate_unique_username(base_username, existing_usernames):
    """Generate a unique username based on base_username."""
    # Clean the base username - remove special characters
    base_username = re.sub(r'[^a-zA-Z0-9_]', '', base_username.lower())

    # Ensure it starts with a letter or underscore
    if base_username and not base_username[0].isalpha() and base_username[0] != '_':
        base_username = 'user_' + base_username

    # If empty after cleaning, use 'user'
    if not base_username:
        base_username = 'user'

    # Check if username exists
    username = base_username
    counter = 1

    while username in existing_usernames:
        username = f"{base_username}{counter}"
        counter += 1

    existing_usernames.add(username)
    return username


def get_base_username_from_user(user):
    """Generate base username from user's email or name."""
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


def populate_usernames(apps, schema_editor):
    """Populate usernames for existing Host and Speaker records."""
    Host = apps.get_model('api', 'Host')
    Speaker = apps.get_model('api', 'Speaker')

    existing_usernames = set()

    # Generate usernames for all hosts
    for host in Host.objects.all():
        base_username = get_base_username_from_user(host.user)
        username = generate_unique_username(base_username, existing_usernames)
        host.username = username
        host.save()

    # Generate usernames for all speakers
    for speaker in Speaker.objects.all():
        base_username = get_base_username_from_user(speaker.user)
        username = generate_unique_username(base_username, existing_usernames)
        speaker.username = username
        speaker.save()


def reverse_populate_usernames(apps, schema_editor):
    """Reverse migration - set all usernames to empty string."""
    pass  # No need to reverse, field will be removed


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0010_host_approval_status_host_approved_at_and_more'),
    ]

    operations = [
        # Step 1: Add username field as nullable without unique constraint
        migrations.AddField(
            model_name='host',
            name='username',
            field=models.CharField(max_length=50, null=True, blank=True, help_text='Unique username for messaging'),
        ),
        migrations.AddField(
            model_name='speaker',
            name='username',
            field=models.CharField(max_length=50, null=True, blank=True, help_text='Unique username for messaging'),
        ),

        # Step 2: Populate usernames for existing records
        migrations.RunPython(populate_usernames, reverse_populate_usernames),

        # Step 3: Make username non-nullable and unique
        migrations.AlterField(
            model_name='host',
            name='username',
            field=models.CharField(max_length=50, unique=True, help_text='Unique username for messaging'),
        ),
        migrations.AlterField(
            model_name='speaker',
            name='username',
            field=models.CharField(max_length=50, unique=True, help_text='Unique username for messaging'),
        ),
    ]
