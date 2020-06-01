from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, JsonResponse
from .models import users
from .models import jobs
from .models import businesses
from .models import events
from .models import categories
from .models import password_tokens
from .models import business_stats
from .models import Orders

from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UsersSerializer
from .serializers import JobSerializer
from .serializers import BusinessSerializer
from .serializers import EventSerializer
from .serializers import CategoriesSerializer
from .serializers import BusinessStatsSerializer
from .serializers import OrdersSerializer
from json import loads, dumps

import stripe
from decouple import config
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import os, sys
currentdir = os.path.dirname(os.path.realpath(__file__))
parentdir = os.path.dirname(currentdir)
sys.path.append(parentdir+'/estore_backend')

import settings

stripe.api_key = config('STRIPE_TEST_SECRET_KEY')

import random
import string
import smtplib, ssl
import imaplib
import email
import base64
from cryptography.fernet import Fernet

def index(request):
    return render(request, "frontend/index.html")

class Signup(APIView):
    
    def get(self, request):
        print('---------------Get Users------------------------')
        objs = users.objects.all()
        serializers = UsersSerializer(objs, many=True)
        return Response(serializers.data)
    
    def post(self, request):
        print('------------------signup---------------------')
        data = loads(request.body)

        if data['update']==True:
            users.objects.filter(username=data['username']).update(password=data['password'])
            return Response(True)

        try:
            obj = users.objects.get(username=data['username'])
        except users.DoesNotExist:  #user does not exist in DB table users
            print('create a new user')
            users.objects.create(first_name= data['first_name'], last_name=data['last_name'], username = data['username'], password = data['password'])
            return Response(None)

        print('do not create, user already exists')

        return Response(request.body)


class Login(APIView):
    def post(self, request):
        print('---------------login------------------------')
        data = loads(request.body)
        if data['update']==True:
            obj = users.objects.get(username=data['username'])

            #this is the encrypted username
            key = Fernet.generate_key()
            encryption_type = Fernet(key)
            encrypted = encryption_type.encrypt(bytes(obj.username, encoding='utf-8'))  
            returnData = {'token': encrypted.decode("utf-8") + ',' + key.decode("utf-8")}
            return Response(returnData)

        try:
            obj = users.objects.get(username=data['username'])

            #this is the encrypted username
            key = Fernet.generate_key()
            encryption_type = Fernet(key)
            encrypted = encryption_type.encrypt(bytes(obj.username, encoding='utf-8'))  
            
        except users.DoesNotExist:  #user does not exist in DB table users
            print('user does not exist')
            return Response(None)
        returnData = {
                    'first_name': obj.first_name,
                    'last_name': obj.last_name,
                    'token': encrypted.decode("utf-8") + ',' + key.decode("utf-8")  #saving the key along with the encrpython
                    }
        return Response(returnData)


class Cookies(APIView):
    def post(self, request):
        print('---------------Cookie checker------------------------')
        data = loads(request.body)

        #getting the token + key from the cookie token recieved from the frontend
        try:
            token, key = data['token'].split(',')
            
        except ValueError:
            return Response({'username': None})

        #decrypting the username
        encryption_type = Fernet(key)
        decrypted = encryption_type.decrypt(bytes(token, encoding='utf-8'))

        try:
            obj = users.objects.get(username=decrypted.decode("utf-8"))

        except users.DoesNotExist:  #user does not exist in DB table users
            print('wrong cookie')
            return Response({'username': None})
        returnData = {
                    'username': obj.username,
                    'password': obj.password,
                    'first':obj.first_name,
                    'full_name':str(obj.first_name) + ' ' + str(obj.last_name),
                    'selectedFile':obj.image
                    }
        return Response(returnData)
        

class PostJob(APIView):
    def get(self, request):
        obj = jobs.objects.all()
        serializers = JobSerializer(obj, many=True)
        return Response(serializers.data)

    def post(self, request):
        print('------------------------Post a Job------------------------')
        data = request.data
        path=''
        if data['edit_mode']=='false':
            img_data = request.FILES['image']
            path = default_storage.save(settings.MEDIA_ROOT+'/frontend/static/frontend/media/jobs/'+data['form_name_of_job']+'_'+data['username']+'.jpeg', ContentFile(img_data.read()))
    
        try:
            obj = jobs.objects.get(name_of_job=data['form_name_of_job'], job_of=data['username'])
            if data['edit_mode']==True:
                jobs.objects.filter(name_of_job=data['form_name_of_job'], job_of=data['username']).update(
                    type_of_job=data['form_type_of_job'], url_of_company=data['form_url_of_company'], 
                    contact_information=data['form_contact_information'], location_of_job=data['form_location_of_job'], 
                    description_of_job=data['form_description_of_job'])
                print('job edited')
                return Response(None)
        except jobs.DoesNotExist:  #this job does not exist, creating job
            jobs.objects.create(
                name_of_job=data['form_name_of_job'],
                type_of_job=data['form_type_of_job'],
                url_of_company=data['form_url_of_company'],
                contact_information=data['form_contact_information'],
                location_of_job=data['form_location_of_job'],
                description_of_job=data['form_description_of_job'],
                job_of=data['username'], image=path
                )
            print('job created')
            return Response('data')
        print('job not created')
        return Response(None)


class PostBusiness(APIView):
    def get(self, request):
        obj = businesses.objects.all()
        serializers = BusinessSerializer(obj, many=True)
        return Response(serializers.data)

    def post(self, request):
        print('---------------Post a Business------------------------')
        data = request.data
        path=''
        if data['edit_mode']=='false':
            img_data = request.FILES['image']
            path = default_storage.save(settings.MEDIA_ROOT+'/frontend/static/frontend/media/businesses/'+data['business_name']+'_'+data['username']+'.jpeg', ContentFile(img_data.read()))
            print(path)

        try:
            obj = businesses.objects.get(business_name=data['business_name'], business_of=data['username'])
            if data['edit_mode']==True:
                businesses.objects.filter(business_name=data['business_name'], business_of=data['username']).update(
                    business_contact=data['business_contact'], business_location=data['business_location'], 
                    business_url=data['business_url'], business_description=data['business_description'],
                    business_type=data['business_type'])
                print('business edited')
                return Response(None)
        except businesses.DoesNotExist:  #this business does not exist, creating business
            businesses.objects.create(
                business_name = data['business_name'], 
                business_type=data['business_type'],
                business_contact = data['business_contact'],
                business_location = data['business_location'],
                business_url = data['business_url'],
                business_description = data['business_description'],
                business_of=data['username'], image=path
                )
            print('business created')
            return Response('data')
        print('business not created')
        return Response(None)
        
class PostEvent(APIView):
    def get(self, request):
        obj = events.objects.all()
        serializers = EventSerializer(obj, many=True)
        return Response(serializers.data)

    def post(self, request):
        print('---------------Post a Event------------------------')
        data = request.data
        path=''
        if data['edit_mode']=='false':
            img_data = request.FILES['image']
            path = default_storage.save(settings.MEDIA_ROOT+'/frontend/static/frontend/media/events/'+data['event_name']+'_'+data['username']+'.jpeg', ContentFile(img_data.read()))
        
        try:
            obj = events.objects.get(event_name=data['event_name'], event_of=data['username'])

            if data['edit_mode']==True:
                events.objects.filter(event_name=data['event_name'], event_of=data['username']).update(
                    event_contact=data['event_contact'], event_date=data['date'], 
                    event_description=data['event_description'], event_price=data['event_price'], 
                    event_type=data['event_type'])
                print('event edited')
                return Response(None)
        except events.DoesNotExist:
            if data['edit_mode'] == True:
                print('hello')
            events.objects.create(
                event_name = data['event_name'], 
                event_price=data['event_price'], 
                event_date=data['date'], 
                event_contact=data['event_contact'], 
                event_type=data['event_type'], 
                event_description=data['event_description'],
                event_of=data['username'], image=path
                )
            print('event created')
            return Response('data')
        print('event not created')
        return Response(None)
        
class GetBusinesses(APIView):
    def post(self, request):
        print('---------------Get Businesses------------------------')
        data = loads(request.body)
        objs = businesses.objects.all()
        if objs == None:
            return Response({'None':None})
        serializers = BusinessSerializer(objs, many=True)
        return Response(serializers.data)

class GetJobs(APIView):
    def post(self, request):
        print('---------------Get Jobs------------------------')
        data = loads(request.body)
        objs = jobs.objects.all()
        if objs == None:
            return Response({'None':None})
        serializers = JobSerializer(objs, many=True)
        return Response(serializers.data)

class GetEvents(APIView):
    def post(self, request):
        print('---------------Get Events------------------------')
        data = loads(request.body)
        objs = events.objects.all()
        if objs == None:
            return Response({'None':None})
        serializers = EventSerializer(objs, many=True)
        return Response(serializers.data)

class GetEventsUser(APIView):
    def post(self, request):
        print('---------------Get Events of user x------------------------')
        data = loads(request.body)
        objs = events.objects.filter(event_of=data['username'])
        if objs == None:
            return Response({'None':None})
        serializers = EventSerializer(objs, many=True)
        return Response(serializers.data)

class GetJobsUser(APIView):
    def post(self, request):
        print('---------------Get Jobs of user x------------------------')
        data = loads(request.body)
        objs = jobs.objects.filter(job_of=data['username'])
        if objs == None:
            return Response({'None':None})
        serializers = JobSerializer(objs, many=True)
        return Response(serializers.data)

class GetBusinessesUser(APIView):
    def post(self, request):
        print('---------------Get Businesses of user x------------------------')
        data = loads(request.body)
        objs = businesses.objects.filter(business_of=data['username'])
        if objs == None:
            return Response({'None':None})        
        serializers = BusinessSerializer(objs, many=True)
        return Response(serializers.data)


class DeleteItem(APIView):
    def post(self, request):
        print('---------------Delete a Post------------------------')
        data = loads(request.body)
        if data['type']=='businesses':
            obj = businesses.objects.get(id=data['ID'])
        elif data['type']=='events':
            obj = events.objects.get(id=data['ID'])
        elif data['type']=='jobs':
            obj = jobs.objects.get(id=data['ID'])
        elif data['type']=='users':
            obj = users.objects.get(id=data['ID'])
        elif data['type']=='categories':
            obj = categories.objects.get(id=data['ID'])
        obj.delete()

        return Response(None)

class Categories(APIView):
    def get(self, request):
        print('---------------Get Categories------------------------')
        objs = categories.objects.all()
        if objs == None:
            return Response({'None':None})
        serializers = CategoriesSerializer(objs, many=True)
        return Response(serializers.data)

    def post(self, request):
        print('---------------Create a category------------------------')
        data = loads(request.body)            
        try:
            obj = categories.objects.get(category_type=data['category_type'], category_name=data['category_name'])
        except categories.DoesNotExist:
            categories.objects.create(category_type = data['category_type'], category_name = data['category_name'])
            print('category created')
            return Response(request.body)
        print('category not created')
        return Response(None)

#sending the email for changing the password
class SendEmail(APIView):
    
    def post(self, request):
        def randomString(stringLength=5):
            letters = string.ascii_letters
            return ''.join(random.choice(letters) for i in range(stringLength))

        print('---------------Send token------------------------')
        data = loads(request.body)

        #processing after the token has been read
        if data['password_token'] != '':
            obj = password_tokens.objects.get(username=data['username'])
            field_obj = password_tokens._meta.get_field('token')
            
            token_from_db = field_obj.value_from_object(obj)
            #token matched item
            if token_from_db == data['password_token']:
                return Response(True)
            else:
                return Response(False)

        try:
            obj = users.objects.get(username=data['username'])
        except users.DoesNotExist:
            print('No such user exists')
            return Response(False)
        flag_for_update = False
        try:
            obj = password_tokens.objects.get(username=data['username'])
            flag_for_update = True
        except users.DoesNotExist:
            flag_for_update = False

        receiver_email = data['username']
        sender_email = 'botdiscord2020@gmail.com'
        password = 'covid19in2020'
        port = 465
        context = ssl.create_default_context()
        
        rand_string = randomString()
        email_message = "Subject: Verfication Code \n\n %s" % rand_string
        
        with smtplib.SMTP_SSL("smtp.gmail.com", port, context=context) as server:
            server.login(sender_email, password)
            server.sendmail(sender_email, receiver_email, email_message)
            print('email sent/not sent')
            #if the email was sent successfully then add the token to DB, update or create new
            if flag_for_update:
                password_tokens.objects.filter(username=data['username']).update(token=rand_string)
            else:
                password_tokens.objects.create(username = data['username'], token = rand_string)
        return Response(True)

class GetBusinessesStats(APIView):
    def post(self, request):
        data = loads(request.body)
        print('---------------Get stats of business_id =x------------------------')

        if data['like'] != False or data['comment']!=False:
            if data['no_cookie'] == False:
                try:
                    #if this line throws a DoesNotExist error then we create a new entry
                    obj = business_stats.objects.get(username=data['username'], business_id=data['business_id'])
                    #otherwise if entry exists then we update it
                    business_stats.objects.filter(username=data['username'], business_id=data['business_id']).update(like = data['like'], comment = data['comment'], comment_text = data['comment_text'])
                    print('business stat updated for user x')
                    return Response(True)
                except business_stats.DoesNotExist:  #this user has not commented/liked the data['business_id']
                    print('business stat created for user x')
                    business_stats.objects.create(username= data['username'], full_name= data['full_name'], business_id=data['business_id'], like = data['like'], comment = data['comment'], comment_text = data['comment_text'])
                    return Response(True)
        
        objs = business_stats.objects.filter(business_id=data['business_id'])
        if objs == None:
            #no record of this business
            return Response(False)        
        serializers = BusinessStatsSerializer(objs, many=True)
        return Response(serializers.data)
        
class Payment(APIView):
    def get(self, request):
        print('---------------Get Orders------------------------')
        objs = Orders.objects.all()
        serializers = OrdersSerializer(objs, many=True)
        return Response(serializers.data)

    def post(self, request):
        data = loads(request.body)
        print('---------------Payment------------------------')
        
        #the amount is in cents
        amount = float(data['event_price'])*100
        amount = int(amount)
        
        try:
            # charge once off on the token
            charge = stripe.Charge.create(
                amount=amount,  # cents
                currency="usd",
                receipt_email=data['username'],
                source=data['stripe_token']
            )

            # creating the order history at our own end
            Orders.objects.create(
                username= data['username'],
                event_id = data['event_id'], 
                event_price = amount, 
                reference_number = data['stripe_token'])
            
            #section for emailing transaction record
            receiver_email = data['username']
            sender_email = 'botdiscord2020@gmail.com'
            password = 'covid19in2020'
            port = 465
            context = ssl.create_default_context()
            content = 'This email is meant for your record only! You have successfully purchased ticket for event ' + str(data['event_name']) + ' for $' + str(data['event_price']) + ' with a reference number of ' + str(data['stripe_token'])
            email_message = "Subject: Payment Successful \n\n %s" %content
            
            with smtplib.SMTP_SSL("smtp.gmail.com", port, context=context) as server:
                server.login(sender_email, password)
                server.sendmail(sender_email, receiver_email, email_message)
                print('transaction done, check stripe account')

            return Response(status=HTTP_200_OK)

        except stripe.error.CardError as e:
            body = e.json_body
            err = body.get('error', {})
            return Response({"message": f"{err.get('message')}"}, status=HTTP_400_BAD_REQUEST)

        except stripe.error.RateLimitError as e:
            # Too many requests made to the API too quickly
            return Response({"message": "Rate limit error"}, status=HTTP_400_BAD_REQUEST)

        except stripe.error.InvalidRequestError as e:
            # Invalid parameters were supplied to Stripe's API
            return Response({"message": "Invalid parameters"}, status=HTTP_400_BAD_REQUEST)

        except stripe.error.AuthenticationError as e:
            # Authentication with Stripe's API failed
            # (maybe you changed API keys recently)
            return Response({"message": "Not authenticated"}, status=HTTP_400_BAD_REQUEST)

        except stripe.error.APIConnectionError as e:
            # Network communication with Stripe failed
            return Response({"message": "Network error"}, status=HTTP_400_BAD_REQUEST)

        except stripe.error.StripeError as e:
            # Display a very generic error to the user, and maybe send
            # yourself an email
            return Response({"message": "Something went wrong. You were not charged. Please try again."}, status=HTTP_400_BAD_REQUEST)

        except Exception as e:
            # send an email to ourselves
            return Response({"message": "A serious error occurred. We have been notifed."}, status=HTTP_400_BAD_REQUEST)
        
        return Response({"message": "A serious error occurred. We have been notifed."}, status=HTTP_400_BAD_REQUEST)


class UploadProfile(APIView):
    def post(self, request):
        print('---------------Upload Proflie---------------')
        data = request.data
        path=''
        img_data = request.FILES['image']
        path = default_storage.save(settings.MEDIA_ROOT+'/frontend/static/frontend/media/users/'+data['username']+'.jpeg', ContentFile(img_data.read()))
        
        users.objects.filter(username=data['username']).update(image=path)

        return Response(None)