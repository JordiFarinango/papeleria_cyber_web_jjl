/*Función para la barra de navegación para que aparezcan los submenus*/

document.addEventListener('DOMContentLoaded', function () {
  const menus = [
    { boton: 'btn-productos', submenu: 'submenu-productos' },
    { boton: 'btn-usuarios', submenu: 'submenu-usuarios' },
    { boton: 'btn-facturacion', submenu: 'submenu-facturacion' },
    { boton: 'btn-extras', submenu: 'submenu-extras' },


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
  const tbody = document.getElementById('tabla-busqueda-body');
  if (!inputBusqueda || !tbody) return;

  inputBusqueda.addEventListener('input', function () {
    const query = inputBusqueda.value;

    fetch(`/buscar_productos/?q=${encodeURIComponent(query)}`)
      .then(response => response.json())
      .then(data => {
        tbody.innerHTML = data.html; // reemplaza solo las filas
      })
      .catch(error => {
        console.error('Error en la búsqueda:', error);
      });
  });
});

function calcularConPromo(cantidad, precioUnit, promoN, promoPrecio) {
  const pN = parseInt(promoN, 10);
  const pF = parseFloat(promoPrecio);

  if (!pN || !pF) {
    return {
      subtotal: cantidad * precioUnit,
      texto: 'Ninguna'
    };
  }

  const bundles = Math.floor(cantidad / pN);
  const resto = cantidad % pN;

  const subtotal = (bundles * pF) + (resto * precioUnit);

  let texto = 'Ninguna';
  if (bundles > 0) {
    texto = `${pN}x$${pF.toFixed(2)} × ${bundles}`;
    if (resto > 0) texto += ` + ${resto} sin promo`;
  }

  return { subtotal, texto };
}


// carrito de compras
// carrito de compras (REEMPLAZA ESTE LISTENER COMPLETO)
document.addEventListener('click', function (e) {
  if (!e.target.classList.contains('agregar-carrito')) return;

  const boton = e.target;
  const id = boton.dataset.id;
  const nombre = boton.getAttribute('data-nombre');
  const marca = boton.getAttribute('data-marca');
  const categoria = boton.getAttribute('data-categoria');
  const precio = parseFloat(boton.getAttribute('data-precio'));
  const stock = parseInt(boton.dataset.stock, 10);

  // promo (si existe en el botón)
  const promoN = boton.getAttribute('data-promo-n') || '';
  const promoPrecio = boton.getAttribute('data-promo-precio') || '';

  const nombreCompleto = `${nombre} (${marca} - ${categoria})`;

  const filas = document.querySelectorAll('#cuerpo-carrito tr');
  let productoEncontrado = false;

  filas.forEach(fila => {
    const celdaNombre = fila.querySelector('td');
    if (celdaNombre && celdaNombre.textContent === nombreCompleto) {
      // Ya existe en el carrito → incrementamos
      const celdaCantidad = fila.children[1];
      let cantidadActual = parseInt(celdaCantidad.textContent);

      if (cantidadActual >= stock) {
        alert("No hay suficiente stock disponible.");
        productoEncontrado = true;
        return;
      }

      cantidadActual += 1;
      celdaCantidad.textContent = cantidadActual;
      fila.dataset.cantidad = String(cantidadActual);

      // leer promo guardada en la fila (si no tenía, queda vacía)
      const filaPromoN = fila.dataset.promoN || '';
      const filaPromoPrecio = fila.dataset.promoPrecio || '';

      const { subtotal, texto } = calcularConPromo(
        cantidadActual,
        precio,
        filaPromoN,
        filaPromoPrecio
      );

      const celdaPromo = fila.children[2];
      celdaPromo.textContent = texto || 'Ninguna';

      const celdaSubtotal = fila.children[3];
      celdaSubtotal.classList.add('subtotal');
      celdaSubtotal.textContent = `$${subtotal.toFixed(2)}`;

      // asegurar datasets clave
      fila.classList.add('carrito-item');
      fila.dataset.id = id;
      fila.dataset.precio = String(precio);
      fila.dataset.stock = String(stock);

      productoEncontrado = true;
    }
  });

// ---- cuando agregas un producto nuevo al carrito ----
  if (!productoEncontrado) {
    if (stock <= 0) {
      alert("No hay stock disponible.");
      return;
    }

    // NUEVA FILA con promo aplicada si corresponde
    const { subtotal, texto } = calcularConPromo(1, precio, promoN, promoPrecio);

    const nuevaFila = document.createElement('tr');
    nuevaFila.classList.add('carrito-item');
    nuevaFila.dataset.id = id;
    nuevaFila.dataset.precio = String(precio);
    nuevaFila.dataset.stock = String(stock);
    nuevaFila.dataset.cantidad = '1';
    if (promoN) nuevaFila.dataset.promoN = String(promoN);
    if (promoPrecio) nuevaFila.dataset.promoPrecio = String(promoPrecio);

    nuevaFila.innerHTML = `
      <td class="p-2 border">${nombreCompleto}</td>
      <td class="p-2 border">1</td>
      <td class="p-2 border">${texto || 'Ninguna'}</td>
      <td class="p-2 border subtotal">$${subtotal.toFixed(2)}</td>
      <td class="p-2 border text-center">
        <button type="button" 
          class="carrito-eliminar bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3 py-1 rounded-full transition">
          Eliminar
        </button>
      </td>
    `;


    document.getElementById('cuerpo-carrito').appendChild(nuevaFila);
  }


  recalcularTotal();
});

// ---- eliminar de 1 en 1 ----
document.addEventListener('click', function (e) {
  if (!e.target.classList.contains('carrito-eliminar')) return;

  const fila = e.target.closest('tr');
  const celdaCantidad = fila.children[1];
  const celdaPromo = fila.children[2];
  const celdaSubtotal = fila.children[3];

  let cantidad = parseInt(fila.dataset.cantidad, 10);

  cantidad -= 1;

  if (cantidad <= 0) {
    fila.remove();
    recalcularTotal();
    return;
  }

  // actualizar fila
  fila.dataset.cantidad = String(cantidad);
  celdaCantidad.textContent = cantidad;

  const precio = parseFloat(fila.dataset.precio);
  const promoN = fila.dataset.promoN || '';
  const promoPrecio = fila.dataset.promoPrecio || '';

  const { subtotal, texto } = calcularConPromo(cantidad, precio, promoN, promoPrecio);

  celdaPromo.textContent = texto || 'Ninguna';
  celdaSubtotal.textContent = `$${subtotal.toFixed(2)}`;

  recalcularTotal();
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

document.addEventListener('DOMContentLoaded', function () {
  const btnCobrar = document.getElementById('btn-cobrar');
  if (!btnCobrar) return; // Evita error si no existe el botón

  btnCobrar.addEventListener('click', function () {
    console.log('✅ Click en Cobrar');

    // 1️⃣ Seleccionamos todas las filas del carrito
    const filas = document.querySelectorAll('#cuerpo-carrito tr.carrito-item');
    const items = [];

    // 2️⃣ Recorremos cada fila
    filas.forEach(fila => {
      const id = fila.dataset.id;
      const cantidad = parseInt(fila.dataset.cantidad, 10);
      const precio = parseFloat(fila.dataset.precio);

      items.push({ id, cantidad, precio });
    });

    // 3️⃣ Validación rápida
    console.log('📦 Items del carrito:', items);
    if (items.length === 0) {
      alert('El carrito está vacío.');
      return;
    }

    // 4️⃣ Si es "Factura (Con Datos)", armamos el payload de cliente
    const tipo = document.getElementById('tipo-comprador')?.value;
    let cliente = null;
    if (tipo === 'CL') {
      cliente = {
        cedula: document.getElementById('cli-cedula')?.value || '',
        nombre: document.getElementById('cli-nombre')?.value || '',
        celular: document.getElementById('cli-celular')?.value || '',
        direccion: document.getElementById('cli-direccion')?.value || '',
        correo: document.getElementById('cli-correo')?.value || '',
        provincia: document.getElementById('cli-provincia')?.value || ''
      };
    }

    // 5️⃣ Enviamos items (+ cliente si aplica)
    fetch('/facturar/confirmar/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken'),
      },
      body: JSON.stringify({ items, cliente }) // ← ahora mandamos cliente o null
    })
    .then(r => r.json())
    .then(data => {
      if (data.ok) {
        // Abre el PDF (por ahora la vista de prueba con xhtml2pdf)
        window.open(`/facturas/pdf/${data.factura_id}/`, '_blank');

        // Recarga la página actual después de un instante
        setTimeout(() => {
          window.location.reload();
        }, 400); // Ajusta a 700ms si tu navegador se demora
      } else {
        alert(data.error || 'No se pudo completar la compra.');
      }
    })
    .catch(err => {
      console.error(err);
      alert('Error de red al procesar la compra.');
    });

  });
});



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

function abrirModalEditarMarcas(id, nombre){
  document.getElementById("modalEditar").classList.remove("hidden");

  document.getElementById("marca_id").value = id;
  document.getElementById("nombre").value = nombre;

}

function abrirModalEditarCategoria(id, nombre){
  document.getElementById("modalEditar").classList.remove("hidden");

  document.getElementById("id_categoria").value = id;
  document.getElementById("nombre_cat").value = nombre;

}

// CONSUMIDOR FINAL O CON DATOS?
document.addEventListener('DOMContentLoaded', function () {
  const tipoSelect = document.getElementById('tipo-comprador');
  const btnCliente = document.getElementById('btn-abrir-cliente');
  const resumen = document.getElementById('resumen-cliente');
  const resumenNombre = document.getElementById('resumen-cliente-nombre');

  if (!tipoSelect || !btnCliente || !resumen || !resumenNombre) return;

  // Estado simple (lo iremos usando luego)
  let clienteSeleccionado = null; // { id: .., nombre: .. } o null

  tipoSelect.addEventListener('change', () => {
    const tipo = tipoSelect.value; // 'CF' o 'CL'
    if (tipo === 'CL') {
      btnCliente.classList.remove('hidden');
    } else {
      btnCliente.classList.add('hidden');
      // limpiar resumen si vuelven a CF
      clienteSeleccionado = null;
      resumen.classList.add('hidden');
      resumenNombre.textContent = '';
    }
  });

  // Por ahora solo probamos que responde; luego abrirá el modal
  btnCliente.addEventListener('click', () => {
    console.log('Abrir modal de cliente (aún no creado)');
  });
});

document.addEventListener('DOMContentLoaded', function () {
  const modal = document.getElementById('modal-cliente');
  const btnAbrir = document.getElementById('btn-abrir-cliente');
  const btnCancelar = document.getElementById('btn-cliente-cancelar');

  if (!modal || !btnAbrir || !btnCancelar) return;

  btnAbrir.addEventListener('click', () => {
    modal.classList.remove('hidden');
    document.getElementById('cli-cedula')?.focus();
  });

  btnCancelar.addEventListener('click', () => {
    modal.classList.add('hidden');
  });

  // Cerrar al hacer click fuera del cuadro
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.add('hidden');
  });
});

document.addEventListener('DOMContentLoaded', function () {
  const inpCedula = document.getElementById('cli-cedula');
  const inpNombre = document.getElementById('cli-nombre');
  const inpCel = document.getElementById('cli-celular');
  const inpDir = document.getElementById('cli-direccion');
  const inpCorreo = document.getElementById('cli-correo');
  const inpProv = document.getElementById('cli-provincia');

  if (!inpCedula) return;

  inpCedula.addEventListener('blur', function () {
    const ced = inpCedula.value.trim();
    if (!ced) return;

    fetch(`/clientes/buscar/?cedula=${encodeURIComponent(ced)}`)
      .then(r => r.json())
      .then(data => {
        if (data.found) {
          const c = data.cliente;
          inpNombre.value = c.nombre || '';
          inpCel.value = c.celular || '';
          inpDir.value = c.direccion || '';
          inpCorreo.value = c.correo || '';
          inpProv.value = c.provincia || '';
        } else {
          // No existe: limpiamos (por si venía algo de antes)
          inpNombre.value = '';
          inpCel.value = '';
          inpDir.value = '';
          inpCorreo.value = '';
          inpProv.value = '';
        }
      })
      .catch(err => console.error('Error buscando cliente:', err));
  });
});


document.addEventListener('DOMContentLoaded', function () {
  const btnAceptar = document.getElementById('btn-cliente-aceptar');
  const modal = document.getElementById('modal-cliente');
  const resumen = document.getElementById('resumen-cliente');
  const resumenNombre = document.getElementById('resumen-cliente-nombre');
  const inpNombre = document.getElementById('cli-nombre');

  if (!btnAceptar || !modal || !resumen || !resumenNombre || !inpNombre) return;

  btnAceptar.addEventListener('click', () => {
    const nombre = inpNombre.value.trim();
    if (!nombre) {
      alert("Por favor, ingresa el nombre del cliente.");
      return;
    }

    // Mostrar el resumen con el nombre
    resumenNombre.textContent = nombre;
    resumen.classList.remove('hidden');

    // Cerrar modal
    modal.classList.add('hidden');
  });
});


// Lightbox para imágenes de productos
document.addEventListener('DOMContentLoaded', function () {
  const viewer = document.getElementById('img-viewer');
  const bigImg = document.getElementById('img-viewer-img');
  if (!viewer || !bigImg) return;

  function openViewer(src) {
    bigImg.src = src;
    viewer.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
  }
  function closeViewer() {
    viewer.classList.add('hidden');
    bigImg.src = '';
    document.body.classList.remove('overflow-hidden');
  }

  // Delegación: cualquier <img data-lightbox> dentro del documento
  document.addEventListener('click', (e) => {
    const thumb = e.target.closest('img[data-lightbox]');
    if (thumb) {
      const src = thumb.getAttribute('data-full') || thumb.src;
      openViewer(src);
      return;
    }
    // Cerrar si se hace clic en el overlay o en la imagen grande
    if (!viewer.classList.contains('hidden') &&
        (e.target === viewer || e.target === bigImg)) {
      closeViewer();
    }
  });

  // Cerrar con ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !viewer.classList.contains('hidden')) {
      closeViewer();
    }
  });
});


document.addEventListener("DOMContentLoaded", function () {
  const selCat = document.getElementById("categoria-select");
  const inpBuscar = document.getElementById("buscar-nombre");
  const tbody = document.getElementById("tabla-productos");
  const loteBody = document.getElementById("lote-body");
  const loteVacio = document.getElementById("lote-vacio");
  const btnGuardar = document.getElementById("btn-guardar-lote");

  if (!selCat || !tbody) return;

  // Estado del lote en memoria: [{producto_id, nombre, cantidad}]
  let lote = [];

  function renderLote() {
    // limpiar
    loteBody.innerHTML = "";

    if (lote.length === 0) {
      const tr = document.createElement("tr");
      tr.id = "lote-vacio";
      tr.innerHTML = `<td colspan="3" class="px-2 py-4 text-center text-gray-500">Aún no agregas nada</td>`;
      loteBody.appendChild(tr);
      btnGuardar.disabled = true;
      return;
    }

    lote.forEach((it, idx) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td class="px-2 py-2">${it.nombre}</td>
        <td class="px-2 py-2">
          <input type="number" min="1" value="${it.cantidad}" data-idx="${idx}" class="lote-cant border rounded p-1 w-20">
        </td>
        <td class="px-2 py-2">
          <button data-idx="${idx}" class="lote-remove text-red-600 hover:text-red-800">Quitar</button>
        </td>`;
      loteBody.appendChild(tr);
    });
    btnGuardar.disabled = false;
  }

  function cargarProductos() {
    const cat = selCat.value;
    if (!cat) {
      tbody.innerHTML = `<tr><td colspan="4" class="px-2 py-3 text-gray-500">Selecciona una categoría</td></tr>`;
      return;
    }
    const q = encodeURIComponent(inpBuscar.value || "");
    fetch(`/filtrar_productos_por_categoria/${cat}/?q=${q}`)
      .then(r => r.text())
      .then(html => {
        tbody.innerHTML = html;
      })
      .catch(err => {
        console.error(err);
        tbody.innerHTML = `<tr><td colspan="4" class="px-2 py-3 text-red-600">Error cargando productos</td></tr>`;
      });
  }

  selCat.addEventListener("change", cargarProductos);
  inpBuscar?.addEventListener("input", () => {
    // si no hay categoría, no buscamos
    if (!selCat.value) return;
    cargarProductos();
  });

  // Agregar al lote (delegación)
  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("btn-agregar-lote")) {
      const tr = e.target.closest("tr");
      const pid = tr.getAttribute("data-producto-id");
      const nombre = tr.children[0].textContent.trim();
      const input = tr.querySelector(".input-cantidad");
      const cant = parseInt(input.value, 10);

      if (!cant || cant <= 0) {
        alert("Ingresa una cantidad válida");
        return;
      }

      // si ya existe en el lote, suma
      const idx = lote.findIndex(x => String(x.producto_id) === String(pid));
      if (idx >= 0) {
        lote[idx].cantidad += cant;
      } else {
        lote.push({ producto_id: pid, nombre, cantidad: cant });
      }

      // limpiar input y re-render
      input.value = "";
      renderLote();
    }

    // quitar del lote
    if (e.target.classList.contains("lote-remove")) {
      const idx = parseInt(e.target.getAttribute("data-idx"), 10);
      lote.splice(idx, 1);
      renderLote();
    }
  });

  // Cambiar cantidades dentro del lote
  document.addEventListener("input", function (e) {
    if (e.target.classList.contains("lote-cant")) {
      const idx = parseInt(e.target.getAttribute("data-idx"), 10);
      let val = parseInt(e.target.value, 10);
      if (!val || val <= 0) val = 1;
      lote[idx].cantidad = val;
    }
  });

  btnGuardar.addEventListener("click", function () {
    if (lote.length === 0) return;

    fetch('/actualizar-stock-lote/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken'),
      },
      body: JSON.stringify({ items: lote })
    })
    .then(r => r.json())
    .then(data => {
      // ✅ La vista ya puso messages.success/error en sesión.
      // Solo recargamos para que el toast aparezca en la nueva carga.
      window.location.reload();
    })
    .catch(err => {
      console.error(err);
      // Si hubo un error de red (ni siquiera llegó al servidor),
      // mostramos un toast inmediato (no habrá mensaje en sesión).
      window.toaster?.show('error', 'Error de red al guardar el lote.');
    });
  });


  // helper csrf (ya lo tienes, lo reutilizo)
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
});


document.addEventListener("DOMContentLoaded", function () {
  const selCat = document.getElementById("categoria-select-ver");
  const inpBuscar = document.getElementById("buscar-nombre-ver");
  const tbody = document.getElementById("tabla-productos-ver");

  if (!selCat || !tbody) return;

  function cargarProductos() {
    const cat = selCat.value;
    const q = encodeURIComponent(inpBuscar.value || "");

    // si no seleccionó categoría ni buscó nada
    if (!cat && !q) {
      tbody.innerHTML = `<tr><td colspan="8" class="px-4 py-3 text-gray-500">Selecciona una categoría o busca un producto</td></tr>`;
      return;
    }

    fetch(`/filtrar_productos_ver/?cat=${cat}&q=${q}`)
      .then(r => r.text())
      .then(html => {
        tbody.innerHTML = html;
      })
      .catch(err => {
        console.error(err);
        tbody.innerHTML = `<tr><td colspan="8" class="px-4 py-3 text-red-600">Error cargando productos</td></tr>`;
      });
  }

  selCat.addEventListener("change", cargarProductos);
  inpBuscar.addEventListener("input", cargarProductos);
});


