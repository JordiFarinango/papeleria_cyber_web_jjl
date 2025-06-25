from django.urls import path
from .views import registro, inicio_admin, inicio

urlpatterns = [
    path('', inicio, name="inicio"),
    path('inicio_admin', inicio_admin, name='inicio'),
    path('registro/', registro, name='registro'),
    #path('inicio_admin/', inicio_admin, name='inicio_admin')
]