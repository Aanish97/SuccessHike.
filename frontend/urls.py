from django.urls import path, re_path
from django.contrib import admin
from . import views

urlpatterns = [
    path('', views.index),

    path('signup/', views.Signup.as_view()),
    path('login/', views.Login.as_view()),
    path('cookies/', views.Cookies.as_view()),
    path('postjob/', views.PostJob.as_view()),
    path('postbusiness/', views.PostBusiness.as_view()),
    path('postevent/', views.PostEvent.as_view()),
    path('getbusinesses/', views.GetBusinesses.as_view()),
    path('getbusinessesusers/', views.GetBusinessesUser.as_view()),
    path('getjobs/', views.GetJobs.as_view()),
    path('getjobsusers/', views.GetJobsUser.as_view()),
    path('getevents/', views.GetEvents.as_view()),
    path('geteventsusers/', views.GetEventsUser.as_view()),
    path('deleteitem/', views.DeleteItem.as_view() ),
    path('categories/', views.Categories.as_view() ),
    path('sendemail/', views.SendEmail.as_view() ),
    path('businessstats/', views.GetBusinessesStats.as_view() ),
    path('pay/', views.Payment.as_view() ),
    path('uploadprofile/', views.UploadProfile.as_view() ),
    re_path(r'^(?:.*)/?$',views.index),
]

