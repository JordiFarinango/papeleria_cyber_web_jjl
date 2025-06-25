from django.urls import path
from .views import inicio_admin, inicio

urlpatterns = [
    path('', inicio, name="inicio"),
    path('inicio_admin', inicio_admin, name='inicio_admin'),
]