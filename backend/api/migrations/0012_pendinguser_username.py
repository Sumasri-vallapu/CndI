# Generated migration for adding username field to PendingUser model

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0011_host_username_speaker_username'),
    ]

    operations = [
        migrations.AddField(
            model_name='pendinguser',
            name='username',
            field=models.CharField(blank=True, max_length=50),
        ),
    ]
