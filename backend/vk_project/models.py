from django.db import models
from django.utils import timezone
import uuid


class User(models.Model):
    author_id = models.UUIDField(primary_key=True, 
                                 default=uuid.uuid4, 
                                 editable=False)
    purse = models.DecimalField(max_digits=8, decimal_places=2)
    status = models.BooleanField(default=False)
    login = models.CharField(max_length=200)
    password = models.CharField(max_length=200)
    
    def register(self):
        self.purse = 000000.00
        self.save()

    def __str__(self):
        return self.login
    
    
class AuthToken(models.Model):
    author_id = models.UUIDField(primary_key=False, 
                                 default=uuid.uuid4, 
                                 editable=False)
    token_id = models.UUIDField(primary_key=False, 
                                 default=uuid.uuid4, 
                                 editable=False)
    def creation(self, author_id):
        self.author_id = author_id
        self.token_id = uuid.uuid4()
        self.save()
    

class Order(models.Model):
    order_id = models.UUIDField(primary_key=True, 
                                default=uuid.uuid4, 
                                editable=False)
    customer_id = models.UUIDField(primary_key=False, 
                                   default=uuid.uuid4, 
                                   editable=False)
    executor_id = models.UUIDField(primary_key=False, 
                                   default=uuid.uuid4, 
                                   editable=False)
    title = models.CharField(max_length=300, default='')
    price = models.DecimalField(max_digits=8, decimal_places=2)
    status = models.PositiveSmallIntegerField()
    descr = models.CharField(max_length=1000, default='')
    comment_txt = models.CharField(max_length=500, default='')
    create_date = models.DateTimeField(auto_now_add=True)
    start_date = models.DateTimeField(default=timezone.now())
    end_date = models.DateTimeField(default=timezone.now())
    
    def creation(self):
        self.status = 0
        self.save(using='orders')
        
    def update(self):
        self.save(using='orders')
    
    def __str__(self):
        return self.title