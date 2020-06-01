# Generated by Django 2.2.12 on 2020-05-12 22:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('frontend', '0004_auto_20200513_0213'),
    ]

    operations = [
        migrations.AddField(
            model_name='businesses',
            name='username',
            field=models.CharField(default='guest', max_length=100),
        ),
        migrations.AddField(
            model_name='events',
            name='username',
            field=models.CharField(default='guest', max_length=100),
        ),
        migrations.AddField(
            model_name='jobs',
            name='username',
            field=models.CharField(default='guest', max_length=100),
        ),
        migrations.AlterField(
            model_name='users',
            name='created_at',
            field=models.DateTimeField(auto_now=True),
        ),
    ]
