from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.forms import UserCreationForm
from django.contrib import messages
from .models import Marca, Categoria, Proveedor, Producto, Cliente
from django.http import JsonResponse
from django.template.loader import render_to_string
from django.views.decorators.csrf import csrf_exempt
import json


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
        foto = request.FILES.get('foto')

        marca = get_object_or_404(Marca, id=marca_id)
        categoria = get_object_or_404(Categoria, id=categoria_id)

        if nombre:
            guardar_producto = Producto(nombre=nombre, descripcion=descripcion, stock=stock, precio=precio, categoria=categoria, marca=marca, foto=foto)
            guardar_producto.save()
            return redirect('nuevo_producto_admin')
        
    return render(request, 'paginas_administrador/agregar/nuevo_producto.html', {
        'marcas_diccionario': marcas,
        'categorias_diccionario': categorias,
    })

def ver_productos_admin(request):
    productos = Producto.objects.all()
    marcas = Marca.objects.all()
    categorias = Categoria.objects.all()
    return render(request, 'paginas_administrador/ver/ver_productos.html',{
        'categorias': categorias,
        'marcas': marcas,
        'productos': productos
    })

def eliminar_producto(request):
    producto_id = request.POST.get("id_producto")
    producto_eli = get_object_or_404(Producto, id=producto_id)
    producto_eli.delete()
    return redirect('ver_productos_admin')

def editar_producto(request):
    id_producto = request.POST.get("id_producto_editar")
    nombre = request.POST.get("nombre")
    descripcion = request.POST.get("descripcion")
    stock = request.POST.get("stock")
    precio = request.POST.get("precio")
    marca_id = request.POST.get("marca_id")
    categoria_id = request.POST.get("categoria_id")
    foto = request.FILES.get("foto_url")

    if nombre:
        producto = get_object_or_404(Producto, id=id_producto)
        producto.nombre = nombre
        producto.descripcion = descripcion
        producto.stock = stock
        producto.precio = precio

        # 🔧 Aquí conviertes los IDs en instancias
        if marca_id:
            producto.marca = get_object_or_404(Marca, id=marca_id)
        if categoria_id:
            producto.categoria = get_object_or_404(Categoria, id=categoria_id)
        # Solo actualiza la foto si se cargó una nueva
        if foto:
            producto.foto = foto
        producto.save()
        return redirect('ver_productos_admin')



def ingresar_inventario_admin(request):
    productos = Producto.objects.all()
    categorias = Categoria.objects.all()

    return render(request, 'paginas_administrador/agregar/ingresar_inventario.html',{
        'categorias': categorias,
        'productos': productos,
    })

def marcas_admin(request):
    marcas = Marca.objects.all()
    if request.method == 'POST': #si dio clic en guardar
        nombre = request.POST.get('nombre') #entonces guarda lo el contenido que haya escrito del cuadro del html con id nombre en esta varaible nombre

        if nombre: #verifica si la variable en verdad tiene algun valor
            nueva_marca = Marca(nombre=nombre) #quiero crear una nueva marca con este nombre (primer 'nombre' es del modelo Marca de models, y el segundo 'nombre' es de la variable creada arriba)
            nueva_marca.save() #se guarda la marca en la base de datos
            return redirect('marcas_admin') #cuando se guarde, redirigimos al usuarios a marcas.html
    return render(request, 'paginas_administrador/agregar/marcas.html',{
        'marcas': marcas
    })

def editar_marcas(request):
    marca_id = request.POST.get("marca_id")
    nombre = request.POST.get("nombre")

    if nombre:
        marca = get_object_or_404(Marca, id = marca_id)
        marca.nombre = nombre
        marca.save()
        return redirect ("marcas_admin")

def categorias_admin(request):
    categorias = Categoria.objects.all()
    if request.method == 'POST':
        nombre = request.POST.get('nombre')

        if nombre:
            nueva_categoria = Categoria(nombre=nombre)
            nueva_categoria.save()
            return redirect('categorias_admin')
    return render(request, 'paginas_administrador/agregar/categorias.html',{
        'categorias':categorias
    })

def editar_categoria(request):
    categoria_id = request.POST.get("id_categoria")
    nombre = (request.POST.get("nombre_cat") or "").strip()

    if not nombre:
        messages.error(request, "El nombre no puede estar vacío.")
        return redirect("categorias_admin")

    categoria = get_object_or_404(Categoria, id=categoria_id)
    categoria.nombre = nombre
    categoria.save()
    messages.success(request, "Categoría actualizada correctamente.")
    return redirect("categorias_admin")


def nuevo_proveedor_admin(request):
    proveedores = Proveedor.objects.all()
    if request.method == 'POST':
        nombre = request.POST.get('nombre')
        celular = request.POST.get('celular')
        cedula = request.POST.get('cedula')
        direccion = request.POST.get('direccion')

        if nombre and celular and cedula and direccion:
            nuevo_proveedor = Proveedor(nombre=nombre, celular=celular, ruc_cedula=cedula, direccion=direccion)
            nuevo_proveedor.save()
            return redirect('nuevo_proveedor_admin')
    return render (request, 'paginas_administrador/agregar/nuevo_proveedor.html',{
        'proveedores' : proveedores
    })

def eliminar_proveedor(request):
    proveedor_id = request.POST.get("id_proveedor")
    proveedor = get_object_or_404(Proveedor, id=proveedor_id)
    proveedor.delete()
    return redirect('nuevo_proveedor_admin')

def editar_proveedor(request):
    id_proveedor = request.POST.get("id_proveedor_eli")
    nombre = request.POST.get("nombre")
    celular = request.POST.get("celular")
    ruc_cedula = request.POST.get("ruc_cedula")
    direccion = request.POST.get("direccion")

    if nombre:
        proveedor = get_object_or_404(Proveedor, id=id_proveedor)
        proveedor.nombre = nombre
        proveedor.celular = celular
        proveedor.ruc_cedula = ruc_cedula
        proveedor.direccion = direccion
        proveedor.save()
        return redirect("nuevo_proveedor_admin")
   






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



def buscar_productos(request):
    query = request.GET.get('q', '') #http://127.0.0.1:8000/buscar_productos?q=lapiz, query almacena lo que estamos buscando, si no hay nada devuelve '', para que no de error
    productos = Producto.objects.filter(nombre__icontains=query)[:7] #nombre es el campo del modelo Producto, _icontains, significa que contenga lo que tenga en query, sin importar mayusculas o minusculas, y que solo limite a 10 resultados, 
    html = render_to_string('fragmentos/productos_filtrados.html',{'productos': productos}) #productos filtrados
    return JsonResponse({'html': html}) #Json devuelve un diccionario convertido en JSON y puede ser leido desde javascript, para armar el div de resultado-productos


def filtrar_productos_por_categoria(request, categoria_id):
    productos = Producto.objects.filter(categoria_id=categoria_id)
    return render(request, 'fragmentos/filtrar_productos_por_categoria.html', {
        'productos': productos})

@csrf_exempt
def actualizar_stock(request):
    if request.method == 'POST':
        try:
            datos = json.loads(request.body)
            producto_id = datos.get('producto_id')
            cantidad = int(datos.get('cantidad'))

            producto = Producto.objects.get(id=producto_id)
            producto.stock += cantidad
            producto.save()

            return JsonResponse({'exito': True, 'nuevo_stock': producto.stock})
        except Producto.DoesNotExist:
            return JsonResponse({'exito': False, 'error': 'Producto no encontrado'})
        except Exception as e:
            return JsonResponse({'exito': False, 'error': str(e)})

    return JsonResponse({'exito': False, 'error': 'Método no permitido'})


def eliminar_cliente(request):

    cliente_id = request.POST.get("cliente_id")
    cliente = get_object_or_404(Cliente, id=cliente_id)
    cliente.delete()
    return redirect("nuevo_cliente_admin")

def editar_cliente(request):
    cliente_id = request.POST.get('modalClienteId')
    nombre = request.POST.get('nombre')
    cedula = request.POST.get('ruc_cedula')
    celular = request.POST.get('celular')
    direccion = request.POST.get('direccion')
    correo = request.POST.get('correo')
    provincia = request.POST.get('provincia')

    if nombre:
        cliente = get_object_or_404(Cliente, id=cliente_id)
        cliente.nombre = nombre
        cliente.ruc_cedula = cedula
        cliente.celular = celular
        cliente.direccion = direccion
        cliente.correo = correo
        cliente.provincia = provincia
        cliente.save()

        return redirect('nuevo_cliente_admin')


    