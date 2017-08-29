from django.db import models
from django.utils import timezone
import uuid


class User(models.Model):
    author_id = models.UUIDField(primary_key=True, 
                                 default=uuid.uuid4, 
                                 editable=False)
    fio = models.CharField(max_length=300)
    purse = models.DecimalField(max_digits=6, decimal_places=2)
    status = models.BooleanField(default=False)
    login = models.CharField(max_length=200)
    password = models.CharField(max_length=200)
    
    def register(self):
        self.purse = 000000.00
        self.save()

    def __str__(self):
        return self.fio
    

class Order(models.Model):
    customer_id = models.UUIDField(primary_key=False, 
                                   default=uuid.uuid4, 
                                   editable=False)
    executor_id = models.UUIDField(primary_key=False, 
                                   default=uuid.uuid4, 
                                   editable=False)
    name = models.CharField(max_length=300)
    cost = models.DecimalField(max_digits=6, decimal_places=2)
    status = models.BooleanField(default=False)
    
    def __str__(self):
        return self.name