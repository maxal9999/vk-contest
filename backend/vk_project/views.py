# -*- coding: utf-8 -*-

from .forms import Authorization, Registration, Order
from .models import User, Order, AuthToken
from django.shortcuts import render, get_object_or_404, redirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
import json
from uuid import UUID, uuid4, uuid5
import re
from decimal import *
from .class_helpers import *


UUID_GENERATOR = UUID('e59a4b4e-f741-4a48-9c54-ab3e59a91a40')
UUID_PATTERN = '^[0-9A-Fa-f]{8}\-[0-9A-Fa-f]{4}\-[0-9A-Fa-f]{4}\-[0-9A-Fa-f]{4}\-[0-9A-Fa-f]{12}$'
COMMISION_UP = Decimal(1.05)
COMMISION_DOWN = Decimal(0.95)
COUNT = 20


def orders(request):
    return redirect('index.html')


def auth(request):
    return Authorize(request).auth()


@csrf_exempt
def signin(request):
    return Authorize(request).signin()
    

@csrf_exempt
def signup(request):
    return Authorize(request).signup()


@csrf_exempt
def change(request):
    return Authorize(request).change()


@csrf_exempt
def signout(request):
    return Authorize(request).signout()


@csrf_exempt
def order_new(request):
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
    
    if not request.method == "POST":
        return JsonResponse(res)
    
    token_id = request.COOKIES.get('token_id', None)
    if not re.match(UUID_PATTERN, str(token_id)):
        return JsonResponse(res)
    
    author_rec = AuthToken.objects.filter(token_id=UUID(token_id))
    if not author_rec.exists():
        return JsonResponse(res)
    
    author_id = author_rec.values('author_id')[0].get('author_id', None)
    user_rec = User.objects.get(author_id=author_id)
    curr_balans = user_rec.purse or 0.00
    
    try:
        enter_json = json.loads(request.body.decode())
    except:
        enter_json = {}
        
    descr = enter_json.get('descr', None)
    price = enter_json.get('price', None)
    title = enter_json.get('title', None)
    
    if not curr_balans > 0 or not price or \
            Decimal(price) > Decimal(curr_balans):
        raise Warning('Not enough money')
    
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
def order_in_work(request):
    res = { 
           'executor_id': '', 
           'start_date': '', 
        }
    
    if not request.method == "POST":
        return JsonResponse(res)
    
    token_id = request.COOKIES.get('token_id', None)
    if not re.match(UUID_PATTERN, str(token_id)):
        return JsonResponse(res)
    
    author_rec = AuthToken.objects.filter(token_id=UUID(token_id))
    if not author_rec.exists():
        return JsonResponse(res)
    
    author_id = author_rec.values('author_id')[0].get('author_id', None)
    
    try:
        enter_json = json.loads(request.body.decode())
    except:
        enter_json = {}
        
    order_id = enter_json.get('id', None)
    if not order_id:
        raise Warning('Order not found')
    
    order_id = UUID(order_id)
    order_exist = Order.objects.filter(order_id=order_id).using('orders')
    if not order_exist.exists():
        raise Warning('Order not found')
    
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
def order_done(request):
    res = { 
           'end_date': '', 
           'comment_txt': '', 
        }
    
    if not request.method == "POST":
        return JsonResponse(res)
    
    token_id = request.COOKIES.get('token_id', None)
    if not re.match(UUID_PATTERN, str(token_id)):
        return JsonResponse(res)
    
    author_rec = AuthToken.objects.filter(token_id=UUID(token_id))
    if not author_rec.exists():
        return JsonResponse(res)
    
    author_id = author_rec.values('author_id')[0].get('author_id', None)
    
    try:
        enter_json = json.loads(request.body.decode())
    except:
        enter_json = {}
        
    order_id = enter_json.get('id', None)
    comment = enter_json.get('comment', None)
    if not order_id:
        raise Warning('Order not found')
    
    order_id = UUID(order_id)
    order_exist = Order.objects.filter(order_id=order_id).using('orders')
    if not order_exist.exists():
        raise Warning('Order not found')
    
    order_rec = Order.objects.using('orders').get(order_id=order_id)
    order_rec.order_id = order_id
    order_rec.comment_txt = comment
    order_rec.end_date = timezone.now()
    order_rec.status = 2
    order_rec.update()
    
    user = User.objects.get(author_id=author_id)
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
def order_list(request):
    res = {} 
    if not request.method == "POST":
        return JsonResponse(res)
    
    token_id = request.COOKIES.get('token_id', None)
    if not re.match(UUID_PATTERN, str(token_id)):
        return JsonResponse(res)
    
    author_rec = AuthToken.objects.filter(token_id=UUID(token_id))
    if not author_rec.exists():
        return JsonResponse(res)
    
    author_id = author_rec.values('author_id')[0].get('author_id', None)
    
    try:
        enter_json = json.loads(request.body.decode())
    except:
        enter_json = {}
    
    filter = enter_json.get('filter', None)
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
        orders = Order.objects.filter(status=0).exclude(customer_id=author_id).order_by('-start_date').using('orders')[offset:limit+1]
        #orders = Order.objects.all().order_by('-start_date').using('orders')[offset:limit+1]
    
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