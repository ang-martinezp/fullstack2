document.addEventListener('DOMContentLoaded', () => {
  // Backdoor de desarrollo (?reset=admin)
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('reset') === 'admin') {
    localStorage.setItem('logistrack_rol_activo', 'Administrador');
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  // Inicialización de respaldo si se accede directamente a esta vista
  function inicializarCatalogo() {
    if (!localStorage.getItem('logistrack_productos')) {
      const productosIniciales = [
        { codigo: 'SKU-001', nombre: 'Laptop DELL Latitude', categoria: 'Tecnología', precio: 389990, stock: 8, stockCritico: 3 },
        { codigo: 'SKU-003', nombre: 'Pasta Térmica Artic MX4', categoria: 'Mantención', precio: 5990, stock: 2, stockCritico: 5 },
        { codigo: 'SKU-004', nombre: 'Papel A4 Resma', categoria: 'Insumos', precio: 3490, stock: 25, stockCritico: 10 }
      ];
      localStorage.setItem('logistrack_productos', JSON.stringify(productosIniciales));
    }
  }

  inicializarCatalogo();

  // Referencias del DOM
  const selectRol = document.getElementById('select-rol-simulado');
  const navUsuarios = document.getElementById('nav-usuarios');
  const alertaRol = document.getElementById('alerta-rol');
  const tablaCuerpo = document.getElementById('tabla-productos-cuerpo');
  const totalRegistros = document.getElementById('total-registros');
  const inputFiltro = document.getElementById('input-filtro');

  // Control de Roles y Permisos
  let rolActual = localStorage.getItem('logistrack_rol_activo') || 'Administrador';

  function aplicarPermisos(rol) {
    if (rol === 'Cliente') {
      alert('Acceso Denegado: Los usuarios con perfil "Cliente" no tienen acceso al panel administrativo.');
      window.location.href = 'index.html';
      return;
    }
    if (rol === 'Vendedor') {
      if (navUsuarios) navUsuarios.classList.add('d-none');
      if (alertaRol) {
        alertaRol.textContent = 'Modo Vendedor: Tienes acceso al catálogo y existencias de productos.';
        alertaRol.classList.remove('d-none');
      }
    } else {
      if (navUsuarios) navUsuarios.classList.remove('d-none');
      if (alertaRol) alertaRol.classList.add('d-none');
    }
  }

  if (selectRol) {
    selectRol.value = rolActual;
    aplicarPermisos(rolActual);

    selectRol.addEventListener('change', (e) => {
      rolActual = e.target.value;
      localStorage.setItem('logistrack_rol_activo', rolActual);
      aplicarPermisos(rolActual);
    });
  }

  // Funciones de persistencia
  function leerProductos() {
    return JSON.parse(localStorage.getItem('logistrack_productos')) || [];
  }

  // Renderizado dinámico con filtro en tiempo real
  function renderizarTabla(termino = '') {
    const productos = leerProductos();
    const filtro = termino.trim().toLowerCase();

    const filtrados = productos.filter(p => 
      (p.codigo && p.codigo.toLowerCase().includes(filtro)) ||
      (p.nombre && p.nombre.toLowerCase().includes(filtro)) ||
      (p.categoria && p.categoria.toLowerCase().includes(filtro))
    );

    if (totalRegistros) {
      totalRegistros.textContent = filtrados.length;
    }

    if (!tablaCuerpo) return;

    if (filtrados.length === 0) {
      tablaCuerpo.innerHTML = `
        <tr>
          <td colspan="8" class="text-center py-5 text-muted">
            <i class="bi bi-search fs-1 d-block text-secondary mb-2"></i>
            No se encontraron productos que coincidan con la búsqueda.
          </td>
        </tr>
      `;
      return;
    }

    tablaCuerpo.innerHTML = filtrados.map(p => {
      const stockActual = Number(p.stock);
      const stockCritico = Number(p.stockCritico || 0);
      const esCritico = stockActual <= stockCritico;

      return `
        <tr>
          <td class="ps-3 fw-semibold text-secondary">${p.codigo}</td>
          <td>
            <div class="fw-bold">${p.nombre}</div>
            <small class="text-muted">${p.descripcion || 'Sin descripción adicional'}</small>
          </td>
          <td>
            <span class="badge bg-light text-dark border">${p.categoria}</span>
          </td>
          <td class="text-end fw-bold">$${Number(p.precio).toLocaleString('es-CL')}</td>
          <td class="text-center fw-bold ${esCritico ? 'text-danger' : 'text-dark'}">${stockActual}</td>
          <td class="text-center text-muted">${stockCritico}</td>
          <td class="text-center">
            ${esCritico 
              ? '<span class="badge bg-warning text-dark"><i class="bi bi-exclamation-triangle-fill me-1"></i>Crítico</span>' 
              : '<span class="badge bg-success">Normal</span>'}
          </td>
          <td class="pe-3 text-end">
            <div class="btn-group btn-group-sm">
              <a href="admin-producto-form.html?codigo=${encodeURIComponent(p.codigo)}" class="btn btn-outline-secondary" title="Editar producto">
                <i class="bi bi-pencil-square"></i>
              </a>
              <button type="button" class="btn btn-outline-danger" onclick="eliminarProducto('${p.codigo}')" title="Eliminar producto">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  // Función global para el evento onclick de la tabla
  window.eliminarProducto = function(codigo) {
    if (confirm(`¿Estás seguro de que deseas eliminar el producto con código "${codigo}"?`)) {
      let productos = leerProductos();
      productos = productos.filter(p => p.codigo !== codigo);
      localStorage.setItem('logistrack_productos', JSON.stringify(productos));
      renderizarTabla(inputFiltro ? inputFiltro.value : '');
    }
  };

  if (inputFiltro) {
    inputFiltro.addEventListener('input', (e) => {
      renderizarTabla(e.target.value);
    });
  }

  // Carga inicial
  renderizarTabla();
});