# Generated migration for Conversation model and Message model updates

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('api', '0007_speaker_industry_speaker_languages_speaker_location'),
    ]

    operations = [
        # Create Conversation model
        migrations.CreateModel(
            name='Conversation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('subject', models.CharField(blank=True, max_length=200)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('event', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='conversations', to='api.event')),
                ('host', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='host_conversations', to=settings.AUTH_USER_MODEL)),
                ('speaker', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='speaker_conversations', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-updated_at'],
            },
        ),
        migrations.AlterUniqueTogether(
            name='conversation',
            unique_together={('host', 'speaker', 'event')},
        ),
        # Remove old fields from Message
        migrations.RemoveField(
            model_name='message',
            name='event',
        ),
        migrations.RemoveField(
            model_name='message',
            name='subject',
        ),
        # Add conversation field to Message
        migrations.AddField(
            model_name='message',
            name='conversation',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='messages', to='api.conversation'),
            preserve_default=False,
        ),
    ]
