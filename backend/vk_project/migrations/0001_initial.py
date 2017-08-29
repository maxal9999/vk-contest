# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import uuid


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Order',
            fields=[
                ('id', models.AutoField(serialize=False, verbose_name='ID', auto_created=True, primary_key=True)),
                ('customer_id', models.UUIDField(default=uuid.uuid4, editable=False)),
                ('executor_id', models.UUIDField(default=uuid.uuid4, editable=False)),
                ('name', models.CharField(max_length=300)),
                ('cost', models.DecimalField(max_digits=6, decimal_places=2)),
                ('status', models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('author_id', models.UUIDField(serialize=False, primary_key=True, default=uuid.uuid4, editable=False)),
                ('fio', models.CharField(max_length=300)),
                ('purse', models.DecimalField(max_digits=6, decimal_places=2)),
                ('status', models.BooleanField(default=False)),
                ('login', models.CharField(max_length=200)),
                ('password', models.CharField(max_length=200)),
            ],
        ),
    ]
