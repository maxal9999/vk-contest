# -*- coding: utf-8 -*-
from .models import User, Order, AuthToken
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render, get_object_or_404, redirect
from django.http import JsonResponse
from decimal import *
import json
from uuid import UUID, uuid4, uuid5
import re


UUID_GENERATOR = UUID('e59a4b4e-f741-4a48-9c54-ab3e59a91a40')
UUID_PATTERN = '^[0-9A-Fa-f]{8}\-[0-9A-Fa-f]{4}\-[0-9A-Fa-f]{4}\-[0-9A-Fa-f]{4}\-[0-9A-Fa-f]{12}$'


class BaseClass:
    _author_id = None
    _enter_json = None
    _token_id = None
    _request = None
    
    def __init__(self, request):
        self._request = request
        self.__init_author_id(request)
        self.__init_enter_rec(request)
        
    def __init_author_id(self, request):
        self._token_id = request.COOKIES.get('token_id', None)
        if not re.match(UUID_PATTERN, str(self._token_id)):
            return
        
        author_rec = AuthToken.objects.filter(token_id=UUID(self._token_id))
        if not author_rec.exists():
            return
        
        self._author_id = author_rec.values('author_id')[0].get('author_id', None)
        
    def __init_enter_rec(self, request):
        try:
            self._enter_json = json.loads(request.body.decode())
        except:
            self._enter_json = {}
            
    def author_id(self):
        return self._author_id
    
    def enter_json(self):
        return self._enter_json
    
    def token_id(self):
        return self._token_id
    
    
class Authorize(BaseClass):
    
    def auth(self):
        if not self._token_id or not self._author_id:
            return render(self._request, 'vk_project/auth.html', {})
        
        user_rec = User.objects.get(author_id=self._author_id)
        user_info = {'nickname': user_rec.login, 
                     'balans': str(user_rec.purse), 
                     'author_id': str(user_rec.author_id),
                     'token_id': str(self._token_id)}
        return render(self._request, 'vk_project/auth.html', user_info)
    
    def signin(self):
        if not self._request.method == "POST":
            return render(self._request, 'vk_project/auth.html', {})
            
        login = self._enter_json.get('login', None)
        pass_txt = self._enter_json.get('password', None)
        password = uuid5(UUID_GENERATOR, pass_txt)
        if not login or not password:
            raise Warning('Incorrect data')
        
        current_user = User.objects.filter(login__contains=login, 
                                           password__contains=password)
        if not current_user.exists():
            raise Warning('Login or password failed')
        
        user_rec = current_user.values('purse', 'login', 'author_id')[0]
        author_token = AuthToken.objects.filter(author_id__contains=user_rec.get('author_id', None))
        if author_token.exists():
            author_token_id = author_token.values('token_id')[0].get('token_id', None)
        else:
            author_token = AuthToken()
            author_token.creation(user_rec.get('author_id', None))
            author_token_id = author_token.token_id
        user_info = {'nickname': user_rec.get('login', None), 
                     'balans': str(user_rec.get('purse', None)), 
                     'author_id': str(user_rec.get('author_id', None)),
                     'token_id': str(author_token_id)}
        return JsonResponse(user_info)
    
    @csrf_exempt
    def signup(self):
        if not self._request.method == "POST":
            return render(self._request, 'vk_project/auth.html', {})
            
        login = self._enter_json.get('login', None)
        pass_txt = self._enter_json.get('password', None)
        password = uuid5(UUID_GENERATOR, pass_txt)
        if not login or not password:
            raise Warning('Incorrect data')
            
        current_user = User.objects.filter(login__contains=login, 
                                           password__contains=password)
        if current_user.exists():
            raise Warning('Login or password exists')
        
        new_user = User()
        new_user.login = login
        new_user.password = password
        new_user.register()
        
        author_token = AuthToken()
        author_token.author_id = new_user.author_id
        author_token.token_id = uuid4()
        author_token.save()
        
        user_info = {'nickname': login, 
                     'balans': '0.00', 
                     'author_id': str(new_user.author_id),
                     'token_id': str(author_token.token_id)}
        return JsonResponse(user_info)
    
    @csrf_exempt
    def change(self):
        res = {'balans': ''}
        if not self._token_id or not self._author_id:
            return JsonResponse(res)
        
        user_rec = User.objects.get(author_id=self._author_id)
        curr_balans = user_rec.purse or 0.00
        
        delta = self._enter_json.get('delta', None)
        if not delta:
            return JsonResponse({'balans': str(curr_balans)})
            
        user_rec.purse += delta
        user_rec.save()
        return JsonResponse({'balans': str(user_rec.purse)})
    
    
    @csrf_exempt
    def signout(self):
        res = {}
        if not self._request.method == "POST":
            return JsonResponse(res)
        
        if not self._token_id:
            return JsonResponse(res)
    
        author_rec = AuthToken.objects.filter(token_id=UUID(self._token_id))
        if author_rec.exists():
            author_rec.delete()
            
        return JsonResponse(res)