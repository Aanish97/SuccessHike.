from rest_framework import serializers
from frontend.models import users
from frontend.models import jobs
from frontend.models import events
from frontend.models import businesses
from frontend.models import categories
from frontend.models import business_stats
from frontend.models import Orders

class UsersSerializer(serializers.ModelSerializer):
    class Meta:
        model = users
        fields = '__all__'

class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = jobs
        fields = '__all__'

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = events
        fields = '__all__'

class BusinessSerializer(serializers.ModelSerializer):
    class Meta:
        model = businesses
        fields = '__all__'

class CategoriesSerializer(serializers.ModelSerializer):
    class Meta:
        model = categories
        fields = '__all__'

class BusinessStatsSerializer(serializers.ModelSerializer):
    class Meta:
        model = business_stats
        fields = '__all__'

class OrdersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Orders
        fields = '__all__'