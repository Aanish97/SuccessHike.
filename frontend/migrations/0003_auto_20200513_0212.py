# Generated by Django 2.2.12 on 2020-05-12 21:12

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('frontend', '0002_auto_20200513_0210'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='businesses',
            name='username',
        ),
        migrations.RemoveField(
            model_name='events',
            name='username',
        ),
        migrations.RemoveField(
            model_name='jobs',
            name='username',
        ),
    ]
