from django.db import models
from django.utils import timezone

class Proveedor(models.Model):
    nombre = models.CharField(max_length = 100)
    celular = models.CharField(max_length = 30)
    ruc_cedula = models.CharField(max_length = 30)
    direccion = models.TextField(blank = True)

    def __str__(self):
        return self.nombre
    
class Marca(models.Model):
    nombre = models.CharField(max_length=100)

    def __str__(self):
        return self.nombre

class Categoria(models.Model):
    nombre = models.CharField(max_length=100)

    def __str__(self):
        return self.nombre
    
class Producto(models.Model):
    nombre = models.CharField(max_length=100)
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE)
    marca = models.ForeignKey(Marca, on_delete=models.CASCADE)
    descripcion = models. TextField(blank=True)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField()
    foto = models.ImageField(upload_to='productos_img', blank=True, null=True)

    def __str__(self):
        return f"{self.nombre} - {self.marca}"

class Cliente(models.Model):
    nombre = models.CharField(max_length=200)
    ruc_cedula = models.CharField(max_length=100, unique=True)
    celular = models.CharField(max_length=100)
    direccion = models.TextField(blank=True)
    correo = models.EmailField(blank=True)
    provincia = models.CharField(max_length=200)

    def __str__(self):
        return f"{self.nombre} - {self.ruc_cedula}"

class IngresoInventario(models.Model):
    producto = models.ForeignKey('Producto', on_delete=models.CASCADE)
    cantidad_ingesada = models.PositiveIntegerField()
    fecha_ingreso = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.producto.nombre} - {self.cantidad_ingesada} - el {self.fecha_ingreso.strftime('%Y-%m-%d %H:%M')}"
    
class Factura(models.Model):
    cliente = models.ForeignKey(Cliente, null=True, blank=True, on_delete=models.SET_NULL)
    fecha = models.DateTimeField(default=timezone.now)
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def __str__(self):
        return f"Factura #{self.id} - {self.fecha:%Y-%m-%d}"

# models.py
class DetalleFactura(models.Model):
    factura = models.ForeignKey(Factura, on_delete=models.CASCADE, related_name='detalles')
    producto = models.ForeignKey(Producto, on_delete=models.PROTECT)  # <— definitivo, sin null/blank
    cantidad = models.PositiveIntegerField()
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.factura} "


class Promocion(models.Model):
    # 1 promo activa por producto (si quieres varias, luego lo abrimos con vigencias)
    producto = models.OneToOneField('Producto', on_delete=models.CASCADE, related_name='promocion')
    activo = models.BooleanField(default=True)

    # Tipo simple: bundle (N por precio fijo)
    bundle_cantidad = models.PositiveIntegerField(help_text="Ej: 3 (por 3x)")
    bundle_precio = models.DecimalField(max_digits=10, decimal_places=2, help_text="Ej: 0.10")

    # Opcional: vigencia
    fecha_inicio = models.DateTimeField(blank=True, null=True)
    fecha_fin = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return f"Promo {self.producto.nombre}: {self.bundle_cantidad} por ${self.bundle_precio} ({'activa' if self.activo else 'inactiva'})"

    def esta_vigente(self, ahora=None):
        from django.utils import timezone
        if not self.activo:
            return False
        ahora = ahora or timezone.now()
        if self.fecha_inicio and ahora < self.fecha_inicio:
            return False
        if self.fecha_fin and ahora > self.fecha_fin:
            return False
        return True
