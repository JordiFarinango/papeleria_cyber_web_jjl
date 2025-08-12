from django.contrib import admin
from .models import Categoria, Producto, Marca, Proveedor, Cliente, IngresoInventario, Factura, DetalleFactura, Promocion

admin.site.register(Proveedor)
admin.site.register(Marca)
admin.site.register(Categoria)
admin.site.register(Producto)
admin.site.register(Cliente)
admin.site.register(IngresoInventario)
admin.site.register(Factura)
admin.site.register(DetalleFactura)
@admin.register(Promocion)
class PromocionAdmin(admin.ModelAdmin):
    list_display = ('producto', 'bundle_cantidad', 'bundle_precio', 'activo', 'fecha_inicio', 'fecha_fin')
    list_filter = ('activo',)
    search_fields = ('producto__nombre',)
