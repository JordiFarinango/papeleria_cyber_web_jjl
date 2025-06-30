from django.shortcuts import render
from django.contrib.auth.forms import UserCreationForm

#pagina antes del login
def inicio(request):
    return render(request, 'pagina_principal/inicio.html')

#vistas del administrador
def inicio_admin(request):
    return render(request, 'paginas_administrador/inicio_admin.html')

def productos_admin(request):
    return render(request, 'paginas_administrador/productos.html')

def facturar_admin(request):
    return render(request, 'paginas_administrador/facturar.html')

def usuarios_admin(request):
    return render(request, 'paginas_administrador/usuarios.html')

