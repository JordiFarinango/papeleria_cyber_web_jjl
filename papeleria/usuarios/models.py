from django.db import models

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
