# Generated migration for adding username field to Host and Speaker models

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0010_host_approval_status_host_approved_at_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='host',
            name='username',
            field=models.CharField(default='', help_text='Unique username for messaging', max_length=50, unique=True),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='speaker',
            name='username',
            field=models.CharField(default='', help_text='Unique username for messaging', max_length=50, unique=True),
            preserve_default=False,
        ),
    ]
