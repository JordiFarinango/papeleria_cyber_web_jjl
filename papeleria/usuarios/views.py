from django.shortcuts import render
from django.contrib.auth.forms import UserCreationForm


def inicio(request):
    return render(request, 'pagina_principal/inicio.html')


def inicio_admin(request):
    return render(request, 'paginas_administrador/inicio_admin.html')
