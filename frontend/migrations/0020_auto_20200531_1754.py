# Generated by Django 2.2.12 on 2020-05-31 12:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('frontend', '0019_users_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='users',
            name='image',
            field=models.CharField(blank=True, max_length=300),
        ),
    ]
