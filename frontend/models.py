from django.db import models
from django import forms

class users(models.Model):
    id = models.AutoField(primary_key=True, unique=False, blank=True)
    first_name = models.CharField(max_length=100, unique=True)
    last_name = models.CharField(max_length=100, unique=True)
    username = models.CharField(max_length=100, unique=True)
    password = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True, blank=True)
    image = models.CharField(max_length=300, blank=True)
    
class jobs(models.Model):
    id = models.AutoField(primary_key=True, unique=False, blank=True)
    name_of_job = models.CharField(max_length=100)
    type_of_job = models.CharField(max_length=100)
    contact_information = models.CharField(max_length=100)
    location_of_job = models.CharField(max_length=100)
    url_of_company = models.CharField(max_length=100)
    description_of_job = models.CharField(max_length=100)
    job_of = models.CharField(max_length=100)
    image = models.ImageField(upload_to='job_images', blank=True)

class businesses(models.Model):
    id = models.AutoField(primary_key=True, unique=False, blank=True)
    business_name = models.CharField(max_length=100)
    business_type = models.CharField(max_length=100)
    business_contact = models.CharField(max_length=100)
    business_location = models.CharField(max_length=100)
    business_url = models.CharField(max_length=100)
    business_description = models.CharField(max_length=100)
    business_of = models.CharField(max_length=100)
    image = models.ImageField(upload_to='business_images', blank=True)
    
class events(models.Model):
    id = models.AutoField(primary_key=True, unique=False, blank=True)
    event_name = models.CharField(max_length=100)
    event_price = models.CharField(max_length=100)
    event_date = models.CharField(max_length=100)
    event_contact = models.CharField(max_length=100)
    event_type = models.CharField(max_length=100)
    event_description = models.CharField(max_length=100)
    event_of = models.CharField(max_length=100)
    image = models.ImageField(upload_to='event_images', blank=True)

class categories(models.Model):
    id = models.AutoField(primary_key=True, unique=False, blank=True)
    category_type = models.CharField(max_length=10)
    category_name = models.CharField(max_length=100)

class password_tokens(models.Model):
    id = models.AutoField(primary_key=True, unique=False, blank=True)
    username = models.CharField(max_length=100)
    token = models.CharField(max_length=10)

class business_stats(models.Model):
    id = models.AutoField(primary_key=True, unique=False, blank=True)
    #username of the reviewer
    username = models.CharField(max_length=100)
    full_name = models.CharField(max_length=100)
    business_id = models.CharField(max_length=100)
    like = models.BooleanField(default=False)
    comment = models.BooleanField(default=False)
    comment_text = models.CharField(max_length=200)

class Orders(models.Model):
    id = models.AutoField(primary_key=True, unique=False, blank=True)
    username = models.CharField(max_length=100)
    event_id = models.CharField(max_length=100)
    event_price = models.IntegerField()
    #reference_number will be unique and made sure in view.py
    reference_number = models.CharField(max_length=100)

        