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
    full_name = models.CharField(max_length=101, editable=False)
    password = models.CharField(max_length=100)
    unique_number = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    device_info = models.TextField(null=True, blank=True)
    profile_photo_url = models.URLField(max_length=500, blank=True, null=True)

    # Progress tracking fields
    is_registered = models.BooleanField(default=False)
    has_submitted_tasks = models.BooleanField(default=False)
    is_selected = models.BooleanField(default=False)
    has_agreed_to_data_consent = models.BooleanField(default=False)
    has_agreed_to_child_protection = models.BooleanField(default=False)
    final_access_granted = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        self.surname = self.surname.upper()
        self.given_name = self.given_name.upper()
        self.full_name = f"{self.surname} {self.given_name}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.full_name} - {'Selected' if self.is_selected else 'Not Selected'}"


class State(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class District(models.Model):
    state = models.ForeignKey(State, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Mandal(models.Model):
    district = models.ForeignKey(District, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class GramPanchayat(models.Model):
    mandal = models.ForeignKey(Mandal, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class CasteCategory(models.Model):
    name = models.CharField(max_length=50)


class Registration(models.Model):
    user = models.ForeignKey(UserSignUp, on_delete=models.CASCADE, related_name='registrations')
    mobile_number = models.CharField(max_length=15)
    full_name = models.CharField(max_length=100)
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=10)
    caste_category = models.CharField(max_length=20)
    
    # Location fields
    state = models.ForeignKey(State, on_delete=models.CASCADE)
    district = models.ForeignKey(District, on_delete=models.CASCADE)
    mandal = models.ForeignKey(Mandal, on_delete=models.CASCADE)
    village = models.ForeignKey(GramPanchayat, on_delete=models.CASCADE)
    
    # Task status fields
    TASK_STATUS_CHOICES = [
        ('NOT_STARTED', 'Not Started'),
        ('UNDER_REVIEW', 'Under Review'),
        ('SENT_BACK', 'Sent Back'),
        ('APPROVED', 'Approved'),
        ('NOT_APPROVED', 'Not Approved'),
    ]
    task1_status = models.CharField(max_length=20, choices=TASK_STATUS_CHOICES, default='NOT_STARTED')
    task2_status = models.CharField(max_length=20, choices=TASK_STATUS_CHOICES, default='NOT_STARTED')
    
    # Video and task tracking
    isvideo1seen = models.BooleanField(default=False)
    isvideo2seen = models.BooleanField(default=False)
    istask1submitted = models.BooleanField(default=False)
    istask2submitted = models.BooleanField(default=False)

    # Metadata
    insert_timestamp = models.DateTimeField(auto_now_add=True)
    is_approved = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.full_name} - {self.mobile_number}"

    class Meta:
        db_table = 'api_registration'
        ordering = ['-insert_timestamp']


class Task_details(models.Model):
    user = models.ForeignKey(UserSignUp, on_delete=models.CASCADE, related_name='learning_centers')
    mobile_number = models.CharField(max_length=15)
    
    # Task 1 details
    lc_state = models.ForeignKey(State, on_delete=models.CASCADE, default=36)
    lc_district = models.ForeignKey(District, on_delete=models.CASCADE)
    lc_mandal = models.ForeignKey(Mandal, on_delete=models.CASCADE)
    lc_grampanchayat = models.ForeignKey(GramPanchayat, on_delete=models.CASCADE)
    lc_photo_s3_url = models.URLField(max_length=500, blank=True, null=True)
    
    # Task 2 details
    students_marks_s3_url = models.URLField(max_length=500, blank=True, null=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Learning Center - {self.user.full_name} - {self.lc_grampanchayat.name}"


class FellowProfile(models.Model):
    # Link to UserSignUp using mobile number
    user = models.ForeignKey(UserSignUp, on_delete=models.CASCADE, related_name='fellow_profile')
    
    # Hero Section
    fellow_id = models.CharField(max_length=50, blank=True)
    team_leader = models.CharField(max_length=100, blank=True)
    fellow_status = models.CharField(max_length=20, default="Active")
    performance_score = models.CharField(max_length=20, blank=True)

    # Personal Details
    gender = models.CharField(max_length=20, blank=True)
    caste_category = models.CharField(max_length=50, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    state = models.CharField(max_length=100, blank=True)
    district = models.CharField(max_length=100, blank=True)
    mandal = models.CharField(max_length=100, blank=True)
    village = models.CharField(max_length=100, blank=True)
    whatsapp_number = models.CharField(max_length=15, blank=True)
    email = models.EmailField(blank=True)

    # Family Details
    mother_name = models.CharField(max_length=100, blank=True)
    mother_occupation = models.CharField(max_length=100, blank=True)
    father_name = models.CharField(max_length=100, blank=True)
    father_occupation = models.CharField(max_length=100, blank=True)

    # Education Details
    current_job = models.CharField(max_length=100, blank=True)
    hobbies = models.TextField(blank=True)
    college_name = models.CharField(max_length=200, blank=True)
    college_type = models.CharField(max_length=50, blank=True)
    study_mode = models.CharField(max_length=50, blank=True)
    stream = models.CharField(max_length=100, blank=True)
    course = models.CharField(max_length=100, blank=True)
    subjects = models.TextField(blank=True)
    semester = models.CharField(max_length=20, blank=True)
    technical_skills = models.TextField(blank=True)
    artistic_skills = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Fellow Profile - {self.user.full_name}"
