# Generated by Django 2.2.12 on 2020-05-22 20:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('frontend', '0011_businesses_business_type'),
    ]

    operations = [
        migrations.CreateModel(
            name='password_tokens',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('username', models.CharField(max_length=100)),
                ('token', models.CharField(max_length=10)),
            ],
        ),
    ]
