from django.shortcuts import render
from django.contrib.auth.forms import UserCreationForm

def registro(request):
    return render(request, 'registro.html', {
        'form' : UserCreationForm  
    })


def inicio_admin(request):
    return render(request, 'inicio_admin.html')
