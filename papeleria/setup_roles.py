import django
import os

os.environ.setdefault('DJANGO_SETTINGS_MODULE','papeleria.settings')
django.setup()

from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from usuarios.models import Producto, Categoria

#1.- Crear los grupos
admin_group, created = Group.objects.get_or_create(name="Administrador")
cajero_group, created = Group.objects.get_or_create(name="Cajero")

#2.- Permisos básicos por modelo
modelos_basicos = [Producto, Categoria]
acciones = ['add', 'change', 'delete', 'view']

#3.- Asignamos todos los permisos al administrador
for modelo in modelos_basicos:
    content_type = ContentType.objects.get_for_model(modelo)
    for accion in acciones:
        codename = f"{accion}_{modelo._meta.model_name}"
        permiso = Permission.objects.get(codename=codename, content_type=content_type)
        admin_group.permissions.add(permiso)        

#4.- Aisgamos los permisos al cajero
    for modelo in modelos_basicos:
        content_type = ContentType.objects.get_for_model(modelo)
        for accion in ['view']:
            codename = f"{accion}_{modelo._meta.model_name}"
            permiso = Permission.objects.get(codename=codename, content_type=content_type)
            cajero_group.permissions.add(permiso)

print("Permisos asignados correctamente al Administrador y cajero")


