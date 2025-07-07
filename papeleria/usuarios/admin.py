from django.contrib import admin
from .models import Categoria, Producto, Marca, Proveedor

admin.site.register(Proveedor)
admin.site.register(Marca)
admin.site.register(Categoria)
admin.site.register(Producto)
