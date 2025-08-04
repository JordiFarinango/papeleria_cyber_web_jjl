/*Función para la barra de navegación para que aparezcan los submenus*/

document.addEventListener('DOMContentLoaded', function () {
  const menus = [
    { boton: 'btn-productos', submenu: 'submenu-productos' },
    { boton: 'btn-usuarios', submenu: 'submenu-usuarios' }
  ];

  menus.forEach(menu => {
    const boton = document.getElementById(menu.boton);
    const submenu = document.getElementById(menu.submenu);

    if (boton && submenu) {
      boton.addEventListener('click', () => {
        submenu.classList.toggle('hidden');
      });
    }
  });
});

/* el buscador de productos de facturar.html */
document.addEventListener('DOMContentLoaded', function () {
  const inputBusqueda = document.getElementById('buscador-producto');
  const resultadoDiv = document.getElementById('resultado-productos');

  if (inputBusqueda) {
    inputBusqueda.addEventListener('input', function () {
      const query = inputBusqueda.value;

      fetch(`/buscar_productos/?q=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(data => {
          resultadoDiv.innerHTML = data.html;
        })
        .catch(error => {
          console.error('Error en la búsqueda:', error);
        });
    });
  }
});


// carrito de compras
document.addEventListener('click', function (e) {
  if (e.target.classList.contains('agregar-carrito')) {
    const boton = e.target;
    const id = boton.getAttribute('data-id');
    const nombre = boton.getAttribute('data-nombre');
    const marca = boton.getAttribute('data-marca');
    const categoria = boton.getAttribute('data-categoria');
    const precio = parseFloat(boton.getAttribute('data-precio'));
    const stock = parseInt(boton.getAttribute('data-stock')); // nuevo

    const nombreCompleto = `${nombre} (${marca} - ${categoria})`;

    const filas = document.querySelectorAll('#cuerpo-carrito tr');
    let productoEncontrado = false;

    filas.forEach(fila => {
      const celdaNombre = fila.querySelector('td');
      if (celdaNombre.textContent === nombreCompleto) {
        const celdaCantidad = fila.children[1];
        let cantidadActual = parseInt(celdaCantidad.textContent);

        if (cantidadActual >= stock) {
          alert("No hay suficiente stock disponible.");
          productoEncontrado = true;
          return;
        }

        cantidadActual += 1;
        celdaCantidad.textContent = cantidadActual;

        const celdaSubtotal = fila.children[3];
        celdaSubtotal.textContent = `$${(cantidadActual * precio).toFixed(2)}`;

        productoEncontrado = true;
      }
    });

    if (!productoEncontrado) {
      if (stock <= 0) {
        alert("No hay stock disponible.");
        return;
      }

      const nuevaFila = document.createElement('tr');
      nuevaFila.innerHTML = `
        <td class="p-2 border">${nombreCompleto}</td>
        <td class="p-2 border">1</td>
        <td class="p-2 border">Ninguna</td>
        <td class="p-2 border subtotal">$${precio.toFixed(2)}</td>
      `;
      document.getElementById('cuerpo-carrito').appendChild(nuevaFila);
    }

    recalcularTotal();
  }
});

function recalcularTotal() {
  let total = 0;
  const subtotales = document.querySelectorAll('#cuerpo-carrito .subtotal');
  subtotales.forEach(celda => {
    const valor = parseFloat(celda.textContent.replace('$', '')) || 0;
    total += valor;
  });

  document.getElementById('total-carrito').textContent = total.toFixed(2);
}


//Funcion para mostrar los productos para ingresar el inventario nuevo
document.addEventListener("DOMContentLoaded", function () {
    const selectCategoria = document.getElementById("categoria-select");
    const cuerpoTabla = document.getElementById("tabla-productos");

    selectCategoria.addEventListener("change", function () {
        const categoriaId = this.value;

        // Si no se selecciona ninguna categoría
        if (!categoriaId) {
            cuerpoTabla.innerHTML = "<tr><td colspan='4'>Selecciona una categoría</td></tr>";
            return;
        }

        fetch(`/filtrar_productos_por_categoria/${categoriaId}/`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error al cargar productos");
                }
                return response.text();
            })
            .then(data => {
                cuerpoTabla.innerHTML = data;
            })
            .catch(error => {
                cuerpoTabla.innerHTML = "<tr><td colspan='4'>Hubo un error al cargar productos</td></tr>";
                console.error(error);
            });
    });
});

// para actualizar el stock
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('btn-actualizar-stock')) {
        const fila = e.target.closest('tr');
        const productoId = fila.getAttribute('data-producto-id');
        const inputCantidad = fila.querySelector('.input-cantidad');
        const cantidad = parseInt(inputCantidad.value);

        if (!cantidad || cantidad <= 0) {
            alert("Ingresa una cantidad válida");
            return;
        }

        fetch('/actualizar-stock/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
            },
            body: JSON.stringify({
                producto_id: productoId,
                cantidad: cantidad
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.exito) {
                // Actualizar el valor mostrado
                const stockActualTd = fila.querySelector('.stock-actual');
                stockActualTd.textContent = data.nuevo_stock;
                inputCantidad.value = '';
            } else {
                alert("Error: " + data.error);
            }
        });
    }
});

// Función para obtener CSRF
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function abrirModalEliminar(id, nombre) {
  document.getElementById("modalClienteId").value = id;
  document.getElementById("modalTexto").textContent = `¿Estás seguro de que deseas eliminar a "${nombre}"?`;
  document.getElementById("modalEliminar").classList.remove("hidden");
}
function cerrarModal() {
  document.getElementById("modalEliminar").classList.add("hidden");
}

function abrirModalEditar(id, nombre, ruc_cedula, celular, direccion, correo, provincia) {
    // Mostramos el modal
    document.getElementById("modalEditar").classList.remove("hidden");
    // Llenamos los campos del formulario con los datos correctos
    document.getElementById("editarClienteId").value = id;
    document.getElementById("editarNombre").value = nombre;
    document.getElementById("editarCedula").value = ruc_cedula;
    document.getElementById("editarCelular").value = celular;
    document.getElementById("editarDireccion").value = direccion;
    document.getElementById("editarCorreo").value = correo;
    document.getElementById("editarProvincia").value = provincia;
}
function cerrarModalEditar() {
    document.getElementById("modalEditar").classList.add("hidden");
}


function modalEliminarProveedor(id, nombre){
  document.getElementById("id_proveedor").value = id;
  document.getElementById("modalTexto").textContent = `¿Esta seguro de que desea eliminar al proveedor "${nombre}"?`;
  document.getElementById("modalEliminar").classList.remove("hidden");
}

function cerrarModalProveedor(){
  document.getElementById("modalEliminar").classList.add("hidden");
}


function modalEditarProveedor(id, nombre, celular, ruc_cedula, direccion){
  document.getElementById("modalEditar").classList.remove("hidden");

  document.getElementById("id_proveedor_eli").value = id;
  document.getElementById("nombre").value = nombre;
  document.getElementById("celular").value = celular;
  document.getElementById("ruc_cedula").value = ruc_cedula;
  document.getElementById("direccion").value = direccion;
}

function modalEliminarProducto(id, nombre){
  document.getElementById("id_producto").value = id;
  document.getElementById("modalTextoProductoEli").textContent = `¿Está seguro de que desea eliminar el producto "${nombre}"`;
  document.getElementById("modalEliminar").classList.remove("hidden");
}

function modalEditarProducto(id, nombre, marca_id, categoria_id, descripcion, precio, stock, foto_url){
  document.getElementById("modalEditar").classList.remove("hidden");

  document.getElementById("id_producto_editar").value= id
  document.getElementById("nombre").value = nombre;
  document.getElementById("marca_id").value = marca_id;
  document.getElementById("categoria_id").value = categoria_id;
  document.getElementById("descripcion").value = descripcion;
  document.getElementById("precio").value = precio;
  document.getElementById("stock").value = stock;
  document.getElementById("preview_foto").src = foto_url;

}
