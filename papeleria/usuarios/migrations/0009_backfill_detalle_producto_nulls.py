from django.db import migrations
from decimal import Decimal

def backfill_null_products(apps, schema_editor):
    Categoria = apps.get_model('usuarios', 'Categoria')
    Marca = apps.get_model('usuarios', 'Marca')
    Producto = apps.get_model('usuarios', 'Producto')
    Detalle = apps.get_model('usuarios', 'DetalleFactura')

    # Crear/obtener categoría y marca “placeholder”
    cat, _ = Categoria.objects.get_or_create(nombre='[Eliminados]')
    mar, _ = Marca.objects.get_or_create(nombre='[Genérica]')

    # Crear/obtener producto placeholder
    placeholder, _ = Producto.objects.get_or_create(
        nombre='[Producto eliminado]',
        categoria=cat,
        marca=mar,
        defaults=dict(
            descripcion='Producto placeholder para detalles históricos',
            precio=Decimal('0.00'),
            stock=0,
        ),
    )

    # Asignar placeholder a todos los detalles con producto NULL
    Detalle.objects.filter(producto__isnull=True).update(producto=placeholder)

def noop(apps, schema_editor):
    pass

class Migration(migrations.Migration):
    dependencies = [
        # deja aquí lo que Django puso automáticamente (la última migración de usuarios)
    ]
    operations = [
        migrations.RunPython(backfill_null_products, noop),
    ]
