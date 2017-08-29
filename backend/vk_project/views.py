from .forms import Authorization, Registration, Order
from .models import User, Order
from django.shortcuts import render, get_object_or_404, redirect
from django.http import JsonResponse


def orders(request):
    return redirect('index.html')


def register(request):
    if request.method == "POST":
        form = Registration(request.POST)
        if form.is_valid():
            new_user = form.save(commit=False)
            new_user.fio = request.POST.get('fio', None)
            new_user.status = request.POST.get('status', None)
            new_user.login = request.POST.get('login', None)
            new_user.password = request.POST.get('password', None)
            new_user.register()
            return redirect('order_page', pk=new_user.pk)
    else:
        form = Registration()
    return render(request, 'backend/registr.html', {'form': form})


def auth(request):
    user_info = {'nickname': 'jaina', 'balans': 345.24, 'isExecutor': 'true'}
    return render(request, 'vk_project/auth.html', user_info)