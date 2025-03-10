from django.db import models

# Create your models here.
from django.db import models

class UserPhoto(models.Model):
    username = models.CharField(max_length=255)
    photo_url = models.URLField()

    def __str__(self):
        return self.username
