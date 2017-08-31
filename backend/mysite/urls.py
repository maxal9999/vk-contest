from django.conf.urls import include, url
from django.contrib import admin
from vk_project import views
from django.views.generic.base import RedirectView

urlpatterns = [
    url(r'^admin/', include(admin.site.urls)),
    url(r'^$', views.auth, name='auth'),
    url(r'^orders/$', RedirectView.as_view(pattern_name='auth', permanent=False)),
    url(r'^api/v1/signin$', views.signin, name='signin'),
    url(r'^api/v1/signup$', views.signup, name='signup'),
    url(r'^api/v1/balance/change$', views.change, name='change'),
    url(r'^api/v1/signout$', views.signout, name='signout'),
    url(r'^api/v1/order/new$', views.order_new, name='order_new'),
    url(r'^api/v1/order/in_work$', views.order_in_work, name='order_in_work'),
    url(r'^api/v1/order/done$', views.order_done, name='order_done'),
    url(r'^api/v1/order/list$', views.order_list, name='order_list'),
    url(r'^.+$', RedirectView.as_view(pattern_name='auth', permanent=False)),
]
