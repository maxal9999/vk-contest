from django.conf.urls import include, url
from django.contrib import admin
from vk_project import views
from django.views.generic.base import RedirectView

urlpatterns = [
    url(r'^admin/', include(admin.site.urls)),
    url(r'^$', views.auth, name='auth'),
    #url(r'^order/(?P<pk>([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})+)/$', views.order_page, name='order_page'),
    url(r'^orders/$', RedirectView.as_view(pattern_name='auth', permanent=False)),
]
