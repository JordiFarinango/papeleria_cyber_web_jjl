from django.urls import path
from .views import registro, inicio_admin

urlpatterns = [
    path('', inicio_admin, name='inicio'),
    path('registro/', registro, name='registro'),
    #path('inicio_admin/', inicio_admin, name='inicio_admin')
]