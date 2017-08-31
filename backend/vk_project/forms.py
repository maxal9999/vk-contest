from django import forms
from .models import User, Order


class Authorization(forms.ModelForm):

    class Meta:
        model = User
        fields = ('login', 'password',)
        

class Registration(forms.ModelForm):

    class Meta:
        model = User
        fields = ('login', 'password')
        
        
class Order(forms.ModelForm):

    class Meta:
        model = Order
        fields = ('title', 'price', 'status')