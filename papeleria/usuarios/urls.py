from django.urls import path
from .views import inicio_admin, inicio, nuevo_producto_admin, ver_productos_admin, facturar_admin, usuarios_admin, ingresar_inventario_admin, marcas_admin, categorias_admin, nuevo_proveedor_admin, nuevo_cliente_admin, buscar_productos

urlpatterns = [
    path('', inicio, name="inicio"),
    path('inicio_admin/', inicio_admin, name='inicio_admin'),
    path('productos/', nuevo_producto_admin, name='nuevo_producto_admin'),
    path('ver_productos/', ver_productos_admin, name='ver_productos_admin'),
    path('ingresar_inventario/', ingresar_inventario_admin, name='ingresar_inventario_admin'),
    path('marcas/', marcas_admin, name='marcas_admin'),
    path('categorias/', categorias_admin, name='categorias_admin'),
    path('nuevo_proveedor/', nuevo_proveedor_admin, name='nuevo_proveedor_admin'),
    path('nuevo_cliente/', nuevo_cliente_admin, name='nuevo_cliente_admin'),
    path('buscar_productos/', buscar_productos, name='buscar_productos'),

    path('facturar/', facturar_admin, name='facturar_admin'),
    path('usuarios/', usuarios_admin, name='usuarios_admin' ),
]