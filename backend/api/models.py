from django.db import models
import uuid


class UserPhoto(models.Model):
    username = models.CharField(max_length=255)
    photo_url = models.URLField()

    def __str__(self):
        return self.username


class UserSignUp(models.Model):
    mobile_number = models.CharField(max_length=15, unique=True)
    surname = models.CharField(max_length=50)
    given_name = models.CharField(max_length=50)
    full_name = models.CharField(max_length=101, editable=False)  # 50 + 50 + 1 for space
    password = models.CharField(max_length=100)  # Storing as plain text for now
    unique_number = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    device_info = models.TextField(null=True, blank=True)  # Store entire request headers

    # ✅ New Fields for User Progress Tracking
    is_registered = models.BooleanField(default=False)  # Has the user submitted full details?
    has_submitted_tasks = models.BooleanField(default=False)  # Has the user submitted required tasks?
    is_selected = models.BooleanField(default=False)  # Has the user been approved for the program?
    has_agreed_to_data_consent = models.BooleanField(default=False)  # Has the user agreed to data consent?
    has_agreed_to_child_protection = models.BooleanField(default=False)  # Has the user agreed to child protection terms?
    final_access_granted = models.BooleanField(default=False)  # Has the user completed all steps?

    def save(self, *args, **kwargs):
        # Convert names to uppercase and create full_name before saving
        self.surname = self.surname.upper()
        self.given_name = self.given_name.upper()
        self.full_name = f"{self.surname} {self.given_name}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.full_name} - {'Selected' if self.is_selected else 'Not Selected'}"
