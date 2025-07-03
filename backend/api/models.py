from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other'),
    ]
    
    QUALIFICATION_CHOICES = [
        ('10th', '10th Grade'),
        ('12th', '12th Grade'),
        ('diploma', 'Diploma'),
        ('bachelor', "Bachelor's Degree"),
        ('master', "Master's Degree"),
        ('phd', 'PhD'),
    ]
    
    REFERRAL_CHOICES = [
        ('social-media', 'Social Media'),
        ('friend-family', 'Friend/Family'),
        ('google-search', 'Google Search'),
        ('advertisement', 'Advertisement'),
        ('news-article', 'News Article'),
        ('government-office', 'Government Office'),
        ('other', 'Other'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    
    # Personal Information
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, blank=True)
    occupation = models.CharField(max_length=100, blank=True)
    phone = models.CharField(max_length=15, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    qualification = models.CharField(max_length=20, choices=QUALIFICATION_CHOICES, blank=True)
    
    # Address Information
    state = models.CharField(max_length=100, blank=True)
    district = models.CharField(max_length=100, blank=True)
    mandal = models.CharField(max_length=100, blank=True)
    panchayath = models.CharField(max_length=100, blank=True)
    
    # Referral Source
    referral_source = models.CharField(max_length=20, choices=REFERRAL_CHOICES, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name} ({self.user.email})"