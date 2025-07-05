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
    
    # Location Information
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
    
class State(models.Model):
    state_name = models.CharField(max_length=100)

    def __str__(self):
        return self.state_name


class District(models.Model):
    state = models.ForeignKey(State, on_delete=models.CASCADE)
    district_name = models.CharField(max_length=100)
    

    def __str__(self):
        return self.district_name

class Mandal(models.Model):
    district = models.ForeignKey(District, on_delete=models.CASCADE)
    mandal_name = models.CharField(max_length=100)

    def __str__(self):
        return self.mandal_name


class GramPanchayat(models.Model):
    mandal = models.ForeignKey(Mandal, on_delete=models.CASCADE)
    gram_panchayat_name = models.CharField(max_length=100)

    def __str__(self):
        return self.gram_panchayat_name