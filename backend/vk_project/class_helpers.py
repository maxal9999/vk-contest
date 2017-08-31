# -*- coding: utf-8 -*-
from .models import User, Order, AuthToken
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render, get_object_or_404, redirect
from django.http import JsonResponse
from decimal import *
import json
from uuid import UUID, uuid4, uuid5
import re
from .constants import *


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
            
    def warning_res(self, text):
        return JsonResponse({'error': text})
            
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
            return self.warning_res('Некорректные данные')
        
        current_user = User.objects.filter(login__contains=login, 
                                           password__contains=password)
        if not current_user.exists():
            return self.warning_res('Пользователь не найден')
        
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
            return self.warning_res('Некорректные данные')
            
        current_user = User.objects.filter(login__contains=login, 
                                           password__contains=password)
        if current_user.exists():
            return self.warning_res('Пользователь с такими данными уже существует')
        
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
    

class Orders(BaseClass):
    
    @csrf_exempt
    def order_new(self):
        res = {
               'order_id': '',
               'customer_id': '', 
               'executor_id': '', 
               'title': '',       
               'price': '',     
               'status': '',     
               'descr': '',
               'comment_txt': '',
               'create_date': '',
               'start_date': '', 
               'end_date': '',
            }
        
        if not self._request.method == "POST":
            return JsonResponse(res)
        
        if not self._token_id or not self._author_id:
            return JsonResponse(res)
        
        user_rec = User.objects.get(author_id=self._author_id)
        curr_balans = user_rec.purse or 0.00
            
        descr = self._enter_json.get('descr', None)
        price = self._enter_json.get('price', None)
        title = self._enter_json.get('title', None)
        
        if not curr_balans > 0 or not price or \
                Decimal(price) > Decimal(curr_balans):
            return self.warning_res('Недостаточно средств на счете')
        
        delta = Decimal(Decimal(curr_balans) - Decimal(price)*COMMISION_UP).quantize(Decimal('.01'), 
                                                                                     rounding=ROUND_DOWN)
        user_rec.purse = delta
        user_rec.save()
        
        new_order = Order()
        new_order.customer_id = user_rec.author_id
        new_order.descr = descr
        new_order.title = title
        new_order.price = price
        new_order.creation()
        
        res = {}
        order_dict = {
               'order_id': str(new_order.order_id),
               'customer_id': str(new_order.customer_id), 
               'executor_id': None, 
               'title': new_order.title,       
               'price': new_order.price,     
               'status': new_order.status,     
               'descr': new_order.descr,
               'comment_txt': new_order.comment_txt,
               'create_date': new_order.create_date,
               'start_date': None, 
               'end_date': None,
            }
        
        res['order'] = order_dict
        res['balans'] = str(delta)
        return JsonResponse(res) 

    @csrf_exempt
    def order_in_work(self):
        res = { 
               'executor_id': '', 
               'start_date': '', 
            }
        
        if not self._request.method == "POST":
            return JsonResponse(res)
        
        if not self._token_id or not self._author_id:
            return JsonResponse(res)
            
        order_id = self._enter_json.get('id', None)
        if not order_id:
            return self.warning_res('Некорретные данные')
        
        order_id = UUID(order_id)
        order_exist = Order.objects.filter(order_id=order_id).using('orders')
        if not order_exist.exists():
            return self.warning_res('Заказ не найден')
        
        order_rec = Order.objects.using('orders').get(order_id=order_id)
        order_rec.order_id = order_id
        order_rec.executor_id = author_id
        order_rec.start_date = timezone.now()
        order_rec.status = 1
        order_rec.update()
        
        res['executor_id'] = str(order_rec.executor_id)
        res['start_date'] = str(order_rec.start_date)
        return JsonResponse(res)

    @csrf_exempt
    def order_done(self):
        res = { 
               'end_date': '', 
               'comment_txt': '', 
            }
        
        if not self._request.method == "POST":
            return JsonResponse(res)
        
        if not self._token_id or not self._author_id:
            return JsonResponse(res)
        
        order_id = self._enter_json.get('id', None)
        comment = self._enter_json.get('comment', None)
        if not order_id:
            return self.warning_res('Некорретные данные')
        
        order_id = UUID(order_id)
        order_exist = Order.objects.filter(order_id=order_id).using('orders')
        if not order_exist.exists():
            return self.warning_res('Заказ не найден')
        
        order_rec = Order.objects.using('orders').get(order_id=order_id)
        order_rec.order_id = order_id
        order_rec.comment_txt = comment
        order_rec.end_date = timezone.now()
        order_rec.status = 2
        order_rec.update()
        
        user = User.objects.get(author_id=self._author_id)
        user.purse += Decimal(order_rec.price * COMMISION_DOWN).quantize(Decimal('.01'), 
                                                                         rounding=ROUND_DOWN)
        user.save()
        
        order_dict = {}
        order_dict['end_date'] = str(order_rec.end_date)
        order_dict['comment_txt'] = str(order_rec.comment_txt)
        res = {}
        res['order'] = order_dict
        res['balans'] = user.purse
        return JsonResponse(res)

    @csrf_exempt
    def order_list(self):
        res = {} 
        if not self._request.method == "POST":
            return JsonResponse(res)
        
        if not self._token_id or not self._author_id:
            return JsonResponse(res)
        
        filter = self._enter_json.get('filter', None)
        if not filter:
            return JsonResponse(res)
        
        page = filter.get('page', None)
        executor_id = filter.get('executor_id', None)
        customer_id = filter.get('customer_id', None)
        
        if page is None and not executor_id and not customer_id:
            return JsonResponse(res)
        
        offset = COUNT * page
        limit = offset + COUNT
        if executor_id:
            orders = Order.objects.filter(executor_id=executor_id).order_by('-start_date').using('orders')[offset:limit+1]
        elif customer_id:
            orders = Order.objects.filter(customer_id=customer_id).order_by('-start_date').using('orders')[offset:limit+1]
        else:
            orders = Order.objects.filter(status=0).exclude(customer_id=self._author_id).order_by('-start_date').using('orders')[offset:limit+1]
        
        result_list = list(orders.values('order_id', 
                                         'customer_id', 
                                         'executor_id', 
                                         'title', 
                                         'price', 
                                         'status', 
                                         'descr', 
                                         'comment_txt', 
                                         'create_date', 
                                         'start_date', 
                                         'end_date'))
        
        user_list = set()
        for res in result_list:
            exec_id = res.get('executor_id', None)
            if exec_id:
                user_list.add(exec_id)
            cust_id = res.get('customer_id', None)
            if cust_id:
                user_list.add(cust_id)
            for elem, value in res.items():
                if elem == 'status':
                    continue
                
                res[elem] = str(value)
        
        def func(rec):
            rec['author_id'] = str(rec.get('author_id', None) or '')
            return rec
        
        users = []
        if user_list:
            users = list(User.objects.filter(author_id__in=list(user_list)).values('author_id', 'login'))
            users = list(map(func, users))
        
        has_next = len(result_list) > COUNT
        if has_next:
            result_list.pop(COUNT)
        res = {}
        res['orders'] = result_list
        res['users'] = users
        res['has_next'] = has_next
        return JsonResponse(res)