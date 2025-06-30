from django.urls import path
from .views import inicio_admin, inicio, productos_admin, facturar_admin, usuarios_admin

urlpatterns = [
    path('', inicio, name="inicio"),
    path('inicio_admin/', inicio_admin, name='inicio_admin'),
    path('productos/', productos_admin, name='productos_admin'),
    path('facturar/', facturar_admin, name='facturar_admin'),
    path('usuarios/', usuarios_admin, name='usuarios_admin' )
]