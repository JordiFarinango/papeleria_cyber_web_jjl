from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm
from .models import Marca, Categoria, Proveedor

#pagina antes del login
def inicio(request):
    return render(request, 'pagina_principal/inicio.html')

#vistas del administrador
def inicio_admin(request):
    return render(request, 'paginas_administrador/inicio_admin.html')

def nuevo_producto_admin(request):
    return render(request, 'paginas_administrador/nuevo_producto.html')

def ver_productos_admin(request):
    return render(request, 'paginas_administrador/ver_productos.html')

def ingresar_inventario_admin(request):
    return render(request, 'paginas_administrador/ingresar_inventario.html')

def marcas_admin(request):
    if request.method == 'POST': #si dio clic en guardar
        nombre = request.POST.get('nombre') #entonces guarda lo el contenido que haya escrito del cuadro del html con id nombre en esta varaible nombre

        if nombre: #verifica si la variable en verdad tiene algun valor
            nueva_marca = Marca(nombre=nombre) #quiero crear una nueva marca con este nombre (primer 'nombre' es del modelo Marca de models, y el segundo 'nombre' es de la variable creada arriba)
            nueva_marca.save() #se guarda la marca en la base de datos
            return redirect('marcas_admin') #cuando se guarde, redirigimos al usuarios a marcas.html
    return render(request, 'paginas_administrador/marcas.html')

def categorias_admin(request):
    if request.method == 'POST':
        nombre = request.POST.get('nombre')

        if nombre:
            nueva_categoria = Categoria(nombre=nombre)
            nueva_categoria.save()
            return redirect('categorias_admin')
    return render(request, 'paginas_administrador/categorias.html')

def nuevo_proveedor_admin(request):
    if request.method == 'POST':
        nombre = request.POST.get('nombre')
        celular = request.POST.get('celular')
        cedula = request.POST.get('cedula')
        direccion = request.POST.get('direccion')

        if nombre and celular and cedula and direccion:
            nuevo_proveedor = Proveedor(nombre=nombre, celular=celular, ruc_cedula=cedula, direccion=direccion)
            nuevo_proveedor.save()
            return redirect('nuevo_proveedor_admin')


    return render (request, 'paginas_administrador/nuevo_proveedor.html')






def facturar_admin(request):
    return render(request, 'paginas_administrador/facturar.html')

def usuarios_admin(request):
    return render(request, 'paginas_administrador/usuarios.html')

