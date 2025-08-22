from django.urls import path
from .views import inicio_admin, inicio, nuevo_producto_admin, ver_productos_admin, facturar_admin, usuarios_admin, ingresar_inventario_admin, marcas_admin, categorias_admin, nuevo_proveedor_admin, nuevo_cliente_admin, buscar_productos, filtrar_productos_por_categoria, actualizar_stock, eliminar_cliente, editar_cliente, eliminar_proveedor, editar_proveedor, eliminar_producto, editar_producto, editar_marcas, editar_categoria, confirmar_venta, buscar_cliente_cedula, factura_pdf, actualizar_stock_lote, historial_ventas, factura_pdf_historial, eliminar_venta, filtrar_productos_ver

urlpatterns = [
    path('', inicio, name="inicio"),
    path('inicio_admin/', inicio_admin, name='inicio_admin'),
    path('productos/', nuevo_producto_admin, name='nuevo_producto_admin'),
    path('ver_productos/', ver_productos_admin, name='ver_productos_admin'),
    path('facturar/confirmar/', confirmar_venta, name='confirmar_venta'),
    path('clientes/buscar/', buscar_cliente_cedula, name='buscar_cliente_cedula'),
    path('eliminar_producto', eliminar_producto, name='eliminar_producto'),
    path('editar_producto', editar_producto, name="editar_producto"), 
    path('ingresar_inventario/', ingresar_inventario_admin, name='ingresar_inventario_admin'),
    path('marcas/', marcas_admin, name='marcas_admin'),
    path('editar/marca/', editar_marcas, name='editar_marca'),
    path('categorias/', categorias_admin, name='categorias_admin'),
    path('editar/categoria/', editar_categoria, name='editar_categoria'),
    path('nuevo_proveedor/', nuevo_proveedor_admin, name='nuevo_proveedor_admin'),
    path('nuevo_cliente/', nuevo_cliente_admin, name='nuevo_cliente_admin'),
    path('buscar_productos/', buscar_productos, name='buscar_productos'),
    path('filtrar_productos_ver/', filtrar_productos_ver, name='filtrar_productos_ver'),

    path('actualizar-stock-lote/', actualizar_stock_lote, name='actualizar_stock_lote'),

    path('filtrar_productos_por_categoria/<int:categoria_id>/', filtrar_productos_por_categoria, name='filtrar_productos_por_categoria'),
    path('actualizar-stock/', actualizar_stock, name='actualizar_stock'),

    path('eliminar/proveedor/', eliminar_proveedor, name='eliminar_proveedor'),
    path('editar/proveedor/', editar_proveedor, name='editar_proveedor'),
    path('eliminar/cliente/', eliminar_cliente, name="eliminar_cliente"),
    path('editar/cliente/', editar_cliente, name="editar_cliente"),

    path('facturar/', facturar_admin, name='facturar_admin'),
    path('usuarios/', usuarios_admin, name='usuarios_admin' ),
    path('facturas/pdf/<int:factura_id>/', factura_pdf, name='factura_pdf'),
    path('historial_ventas', historial_ventas, name='historial_ventas'),
    path("facturas/<int:pk>/pdf/", factura_pdf_historial, name="factura_pdf_html"),
    path("facturas/<int:factura_id>/eliminar/", eliminar_venta, name="eliminar_venta"),


]