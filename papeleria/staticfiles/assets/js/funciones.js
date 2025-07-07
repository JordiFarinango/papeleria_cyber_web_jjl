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