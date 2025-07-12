from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.forms import UserCreationForm
from django.contrib import messages
from .models import Marca, Categoria, Proveedor, Producto, Cliente

#pagina antes del login
def inicio(request):
    return render(request, 'pagina_principal/inicio.html')

#vistas del administrador
def inicio_admin(request):
    return render(request, 'paginas_administrador/inicio_admin.html')

def nuevo_producto_admin(request):
    marcas = Marca.objects.all()
    categorias = Categoria.objects.all()

    if request.method == 'POST':
        nombre = request.POST.get('nombre')
        descripcion = request.POST.get('descripcion')
        stock = request.POST.get('stock')
        precio = request.POST.get('precio')
        categoria_id = request.POST.get('categoria')
        marca_id = request.POST.get('marca')

        marca = get_object_or_404(Marca, id=marca_id)
        categoria = get_object_or_404(Categoria, id=categoria_id)

        if nombre:
            guardar_producto = Producto(nombre=nombre, descripcion=descripcion, stock=stock, precio=precio, categoria=categoria, marca=marca)
            guardar_producto.save()
            return redirect('nuevo_producto_admin')
        
    return render(request, 'paginas_administrador/agregar/nuevo_producto.html', {
        'marcas_diccionario': marcas,
        'categorias_diccionario': categorias,
    })

def ver_productos_admin(request):
    productos = Producto.objects.all()
    return render(request, 'paginas_administrador/ver/ver_productos.html',{
        'productos': productos
    })

def ingresar_inventario_admin(request):
    return render(request, 'paginas_administrador/agregar/ingresar_inventario.html')

def marcas_admin(request):
    if request.method == 'POST': #si dio clic en guardar
        nombre = request.POST.get('nombre') #entonces guarda lo el contenido que haya escrito del cuadro del html con id nombre en esta varaible nombre

        if nombre: #verifica si la variable en verdad tiene algun valor
            nueva_marca = Marca(nombre=nombre) #quiero crear una nueva marca con este nombre (primer 'nombre' es del modelo Marca de models, y el segundo 'nombre' es de la variable creada arriba)
            nueva_marca.save() #se guarda la marca en la base de datos
            return redirect('marcas_admin') #cuando se guarde, redirigimos al usuarios a marcas.html
    return render(request, 'paginas_administrador/agregar/marcas.html')

def categorias_admin(request):
    if request.method == 'POST':
        nombre = request.POST.get('nombre')

        if nombre:
            nueva_categoria = Categoria(nombre=nombre)
            nueva_categoria.save()
            return redirect('categorias_admin')
    return render(request, 'paginas_administrador/agregar/categorias.html')

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
    return render (request, 'paginas_administrador/agregar/nuevo_proveedor.html')

def nuevo_cliente_admin(request):
    clientes = Cliente.objects.all()

    if request.method == 'POST':
        nombre = request.POST.get('nombre')
        cedula = request.POST.get('cedula')
        celular = request.POST.get('celular')
        direccion = request.POST.get('direccion')
        correo = request.POST.get('correo')
        provincia = request.POST.get('provincia')

        if Cliente.objects.filter(ruc_cedula=cedula).exists():
            messages.error(request, "Esta cédula ya existe.")
            return redirect('nuevo_cliente_admin')

        if nombre:
            nuevo_cliente = Cliente(nombre=nombre, ruc_cedula=cedula, direccion=direccion, correo=correo, celular=celular, provincia=provincia)
            nuevo_cliente.save()
            return redirect('nuevo_cliente_admin')
        
    return render(request, 'paginas_administrador/agregar/nuevo_cliente.html',{
        'clientes_diccionario': clientes
    })
    

    
def facturar_admin(request):
    return render(request, 'paginas_administrador/facturar.html')



def usuarios_admin(request):
    return render(request, 'paginas_administrador/agregar/usuarios.html')

