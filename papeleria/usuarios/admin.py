from django.contrib import admin
from .models import Categoria, Producto, Marca, Proveedor, Cliente

admin.site.register(Proveedor)
admin.site.register(Marca)
admin.site.register(Categoria)
admin.site.register(Producto)
admin.site.register(Cliente)