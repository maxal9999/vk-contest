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
from .constants import *


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
    return Orders(request).order_new()


@csrf_exempt
def order_in_work(request):
    return Orders(request).order_in_work()


@csrf_exempt
def order_done(request):
    return Orders(request).order_done()


@csrf_exempt
def order_list(request):
    return Orders(request).order_list()