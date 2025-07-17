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

    const nombreCompleto = `${nombre} (${marca} - ${categoria})`;

    // Verificar si el producto ya está en el carrito
    const filas = document.querySelectorAll('#cuerpo-carrito tr');
    let productoEncontrado = false;

    filas.forEach(fila => {
      const celdaNombre = fila.querySelector('td');
      if (celdaNombre.textContent === nombreCompleto) {
        // Ya existe: aumentar la cantidad y actualizar subtotal
        const celdaCantidad = fila.children[1];
        let cantidadActual = parseInt(celdaCantidad.textContent);
        cantidadActual += 1;
        celdaCantidad.textContent = cantidadActual;

        const celdaSubtotal = fila.children[3];
        celdaSubtotal.textContent = `$${(cantidadActual * precio).toFixed(2)}`;

        productoEncontrado = true;
      }
    });

    // Si no existe, agregar una nueva fila
    if (!productoEncontrado) {
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


/*
document.addEventListener('DOMContentLoaded', function () {
  const botonProductos = document.getElementById('btn-productos');
  const submenuProductos = document.getElementById('submenu-productos');

  if (botonProductos && submenuProductos) {
    botonProductos.addEventListener('click', () => {
      submenuProductos.classList.toggle('hidden');
    });
  }
});

document.addEventListener('DOMContentLoaded', function () {
  const botonUsuarios = document.getElementById('btn-usuarios');
  const submenuUsuarios = document.getElementById('submenu-usuarios');

  if (botonUsuarios && submenuUsuarios) {
    botonUsuarios.addEventListener('click', () => {
      submenuUsuarios.classList.toggle('hidden');
    });
  }
});

*/