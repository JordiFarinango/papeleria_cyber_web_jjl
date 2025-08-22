from django.db import migrations
from decimal import Decimal

def backfill_null_products(apps, schema_editor):
    Producto = apps.get_model('usuarios', 'Producto')
    Categoria = apps.get_model('usuarios', 'Categoria')
    Marca = apps.get_model('usuarios', 'Marca')
    Detalle = apps.get_model('usuarios', 'DetalleFactura')

    # 1) Crear/obtener categoria y marca "placeholder"
    cat, _ = Categoria.objects.get_or_create(nombre='[Eliminados]')
    mar, _ = Marca.objects.get_or_create(nombre='[Genérica]')

    # 2) Crear/obtener producto placeholder
    placeholder, _ = Producto.objects.get_or_create(
        nombre='[Producto eliminado]',
        categoria=cat,
        marca=mar,
        defaults=dict(
            descripcion='Producto placeholder para detalles históricos',
            precio=Decimal('0.00'),
            stock=0,
        )
    )

    # 3) Asignar ese producto a todos los DetalleFactura.producto NULL
    Detalle.objects.filter(producto__isnull=True).update(producto=placeholder)

def reverse_noop(apps, schema_editor):
    # No tiene reversa segura
    pass

class Migration(migrations.Migration):
    dependencies = [
        ('usuarios', '0007_detallefactura_categoria_nombre_and_more'),
    ]
    operations = [
        migrations.RunPython(backfill_null_products, reverse_noop),
    ]
