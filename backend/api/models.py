from django.db import models
import uuid



class FellowSignUp(models.Model):  
    """
    This model is for the fellow signup details
    """
    
    
    mobile_number = models.CharField(max_length=10)
    surname = models.CharField(max_length=50)
    given_name = models.CharField(max_length=50)
    full_name = models.CharField(max_length=101, editable=False)
    password = models.CharField(max_length=100)
    unique_number = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)

    # Progress tracking fields
    is_registered = models.BooleanField(default=False)
    has_submitted_tasks = models.BooleanField(default=False)
    has_agreed_to_data_consent = models.BooleanField(default=False)
    has_agreed_to_child_protection = models.BooleanField(default=False)

    is_selected = models.BooleanField(default=False)  
    is_accepted_offer_letter = models.BooleanField(default=False)
    accepted_offer_letter_date = models.DateTimeField(null=True, blank=True) 
    final_access_granted = models.BooleanField(default=False)   

    ip_address = models.GenericIPAddressField(null=True, blank=True)
    device_info = models.TextField(null=True, blank=True)  


    def get_user_status(self):
        if not self.is_registered:
            return "PENDING_REGISTRATION"
        elif not self.has_submitted_tasks:
            return "PENDING_TASK_SUBMISSION"
        elif not self.is_accepted_offer_letter:
            return "PENDING_OFFER_ACCEPTANCE"
        elif not self.has_agreed_to_child_protection:
            return "PENDING_CHILD_PROTECTION_CONSENT"
        elif not self.has_agreed_to_data_consent:
            return "PENDING_DATA_CONSENT"
        else:
            return "ACCESS_GRANTED"



    def save(self, *args, **kwargs):
        self.surname = self.surname.upper()
        self.given_name = self.given_name.upper()
        self.full_name = f"{self.surname} {self.given_name}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.full_name} - {'Selected' if self.is_selected else 'Not Selected'}"

    class Meta:
        unique_together = [['mobile_number', 'full_name']]




class FellowRegistration(models.Model):
    """
    Stores detailed registration information for each FellowSignUp entry.
    """


    fellow = models.OneToOneField(FellowSignUp, on_delete=models.CASCADE, related_name='fellow_registration')
    date_of_birth = models.DateField()

    GENDER_CHOICES = [
        ('MALE', 'Male'),
        ('FEMALE', 'Female'),
        ('OTHER', 'Other'),
    ]

    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    
    CASTE_CATEGORY_CHOICES = [
        ('ST', 'ST'),
        ('SC', 'SC'),
        ('BC', 'BC'),
        ('OBC', 'OBC'),
        ('OC', 'OC'),
        ('MUSLIM', 'Muslim'),
        ('CHRISTIAN', 'Christian'),
        ('OTHER', 'Other'),
    ]
    caste_category = models.CharField(max_length=20, choices=CASTE_CATEGORY_CHOICES)
    
    # Location fields
    state = models.ForeignKey(State, on_delete=models.CASCADE, default=36)
    district = models.ForeignKey(District, on_delete=models.CASCADE)
    mandal = models.ForeignKey(Mandal, on_delete=models.CASCADE)
    grampanchayat = models.ForeignKey(GramPanchayat, on_delete=models.CASCADE)   
    
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
    is_approved = models.BooleanField(default=False) 

    # Metadata
    academic_year = models.CharField(max_length=9)
    batch = models.CharField(max_length=10)


    def save(self, *args, **kwargs):
        # Determine academic year and batch
        now = timezone.now()
        current_year = now.year
        current_month = now.month

        # Academic year starts in June
        if current_month < 6: 
            self.academic_year = str(current_year - 1)
        else:
            self.academic_year = str(current_year)

        # Batch naming logic (batch1 for 2024, batch2 for 2025, etc.)
        self.batch = f"BATCH{int(self.academic_year) - 2023}"

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.fellow.full_name} - {self.fellow.mobile_number}"




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


class CasteCategory(models.Model):
    
    caste_category_name = models.CharField(max_length=50)

    def __str__(self):
        return self.caste_category_name


class TaskDetails(models.Model):
    user = models.ForeignKey(Registration, on_delete=models.CASCADE, related_name='learning_centers')
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
    user = models.ForeignKey(Registration, on_delete=models.CASCADE, related_name='fellow_profile') 
    mobile_number = models.CharField(max_length=15, blank=True, unique=True)     
    # Hero Section
    fellow_id = models.CharField(max_length=50, blank=True)
    team_leader = models.CharField(max_length=100, blank=True)
    fellow_status = models.CharField(max_length=10, default="Active")
    performance_score = models.CharField(max_length=20, blank=True) 


    email = models.EmailField(blank=True) 
    profile_photo_url = models.URLField(max_length=500, blank=True, null=True)  


    # Family Details
    mother_name = models.CharField(max_length=100, blank=True)
    mother_occupation = models.CharField(max_length=100, blank=True)
    father_name = models.CharField(max_length=100, blank=True)
    father_occupation = models.CharField(max_length=100, blank=True)
    any_job_at_present = models.BooleanField(default=False) 

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














class FellowPhoto(models.Model):
    username = models.CharField(max_length=255)
    photo_url = models.URLField()

    def __str__(self):
        return self.username 