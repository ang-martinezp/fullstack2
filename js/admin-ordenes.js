document.addEventListener('DOMContentLoaded', () => {
  // Inicialización de órdenes base en localStorage si no existen
  function inicializarOrdenes() {
    if (!localStorage.getItem('logistrack_ordenes')) {
      const ordenesBase = [
        {
          id: 'ORD-1001',
          fecha: '2026-09-18',
          cliente: 'Juan Pérez González',
          correo: 'juan.perez@duoc.cl',
          total: 395980,
          estado: 'Entregado',
          items: [
            { producto: 'Laptop DELL Latitude', cantidad: 1, precio: 389990 },
            { producto: 'Pasta Térmica Artic MX4', cantidad: 1, precio: 5990 }
          ]
        },
        {
          id: 'ORD-1002',
          fecha: '2026-09-19',
          cliente: 'María Alejandra Silva',
          correo: 'm.silva@profesor.duoc.cl',
          total: 10470,
          estado: 'Pendiente',
          items: [
            { producto: 'Papel A4 Resma', cantidad: 3, precio: 3490 }
          ]
        },
        {
          id: 'ORD-1003',
          fecha: '2026-09-20',
          cliente: 'Carlos Tapia',
          correo: 'carlos.tapia@gmail.com',
          total: 5990,
          estado: 'En despacho',
          items: [
            { producto: 'Pasta Térmica Artic MX4', cantidad: 1, precio: 5990 }
          ]
        }
      ];
      localStorage.setItem('logistrack_ordenes', JSON.stringify(ordenesBase));
    }
  }

  inicializarOrdenes();

  // Referencias del DOM
  const selectRol = document.getElementById('select-rol-simulado');
  const navUsuarios = document.getElementById('nav-usuarios');
  const alertaRol = document.getElementById('alerta-rol');
  const subtituloRol = document.getElementById('subtitulo-rol');
  const tablaCuerpo = document.getElementById('tabla-ordenes-cuerpo');
  const totalOrdenes = document.getElementById('total-ordenes');
  const inputFiltro = document.getElementById('input-filtro-ordenes');

  function obtenerRol() {
    return (localStorage.getItem('logistrack_rol_activo') || 'Administrador').trim();
  }

  // Control estricto de roles
  function aplicarPermisos() {
    const rol = obtenerRol();
    const rolLower = rol.toLowerCase();

    // 1. Cliente: No tiene acceso al panel
    if (rolLower === 'cliente') {
      alert('Acceso Denegado: Los clientes solo tienen acceso a la tienda.');
      window.location.href = 'index.html';
      return;
    }

    // 2. Vendedor: Puede ver la lista y el detalle (oculta usuarios)
    if (rolLower === 'vendedor') {
      if (navUsuarios) navUsuarios.classList.add('d-none');
      if (subtituloRol) subtituloRol.textContent = 'Modo Vendedor: Consulta de órdenes y especificaciones de despacho';
      if (alertaRol) {
        alertaRol.textContent = 'Perfil Vendedor: Tienes autorización para visualizar el listado de pedidos y consultar el detalle de cada compra.';
        alertaRol.classList.remove('d-none');
      }
    } 
    // 3. Administrador: Control total
    else {
      if (navUsuarios) navUsuarios.classList.remove('d-none');
      if (subtituloRol) subtituloRol.textContent = 'Consulta y seguimiento de compras realizadas';
      if (alertaRol) alertaRol.classList.add('d-none');
    }

    renderizarTabla(inputFiltro ? inputFiltro.value : '');
  }

  // Selector reactivo de rol
  if (selectRol) {
    selectRol.value = obtenerRol();
    selectRol.addEventListener('change', (e) => {
      localStorage.setItem('logistrack_rol_activo', e.target.value);
      aplicarPermisos();
    });
  }

  function leerOrdenes() {
    return JSON.parse(localStorage.getItem('logistrack_ordenes')) || [];
  }

  // Renderizado dinámico de filas
  function renderizarTabla(termino = '') {
    const ordenes = leerOrdenes();
    const filtro = termino.trim().toLowerCase();

    const filtradas = ordenes.filter(o => 
      (o.id && o.id.toLowerCase().includes(filtro)) ||
      (o.cliente && o.cliente.toLowerCase().includes(filtro)) ||
      (o.estado && o.estado.toLowerCase().includes(filtro))
    );

    if (totalOrdenes) totalOrdenes.textContent = filtradas.length;
    if (!tablaCuerpo) return;

    if (filtradas.length === 0) {
      tablaCuerpo.innerHTML = `
        <tr>
          <td colspan="6" class="text-center py-5 text-muted">
            <i class="bi bi-inbox fs-1 d-block text-secondary mb-2"></i>
            No se encontraron órdenes de compra registradas.
          </td>
        </tr>
      `;
      return;
    }

    tablaCuerpo.innerHTML = filtradas.map(ord => {
      let badgeClass = 'bg-secondary';
      if (ord.estado === 'Entregado') badgeClass = 'bg-success';
      if (ord.estado === 'Pendiente') badgeClass = 'bg-warning text-dark';
      if (ord.estado === 'En despacho') badgeClass = 'bg-info text-dark';

      return `
        <tr>
          <td class="ps-3 fw-bold font-monospace text-secondary">${ord.id}</td>
          <td>
            <div class="fw-semibold text-dark">${ord.cliente}</div>
            <small class="text-muted">${ord.correo || 'Sin correo asociado'}</small>
          </td>
          <td>${ord.fecha}</td>
          <td class="text-end fw-bold text-dark">$${Number(ord.total).toLocaleString('es-CL')}</td>
          <td class="text-center">
            <span class="badge ${badgeClass}">${ord.estado}</span>
          </td>
          <td class="pe-3 text-end">
            <button type="button" class="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1" onclick="verDetalleOrden('${ord.id}')">
              <i class="bi bi-eye-fill"></i> Detalle
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  // Modal de Detalle
  window.verDetalleOrden = function(idOrden) {
    const ordenes = leerOrdenes();
    const ord = ordenes.find(o => String(o.id) === String(idOrden));
    if (!ord) return;

    const contenedor = document.getElementById('modal-orden-contenido');
    if (!contenedor) return;

    const items = ord.items || [];
    const itemsHTML = items.length > 0
      ? items.map(item => `
          <li class="list-group-item d-flex justify-content-between align-items-center px-0 py-2">
            <div>
              <span class="fw-semibold text-dark">${item.producto}</span>
              <small class="text-muted d-block">${item.cantidad} unidad(es) x $${Number(item.precio).toLocaleString('es-CL')}</small>
            </div>
            <span class="fw-bold text-dark">$${Number(item.cantidad * item.precio).toLocaleString('es-CL')}</span>
          </li>
        `).join('')
      : '<li class="list-group-item px-0 text-muted small">No hay desglose de productos para esta orden.</li>';

    contenedor.innerHTML = `
      <ul class="list-group list-group-flush small mb-3">
        <li class="list-group-item d-flex justify-content-between px-0 py-2">
          <span class="text-muted fw-semibold">N° Orden:</span>
          <span class="fw-bold font-monospace text-primary">${ord.id}</span>
        </li>
        <li class="list-group-item d-flex justify-content-between px-0 py-2">
          <span class="text-muted fw-semibold">Fecha:</span>
          <span>${ord.fecha || '20/09/2026'}</span>
        </li>
        <li class="list-group-item d-flex justify-content-between px-0 py-2">
          <span class="text-muted fw-semibold">Cliente:</span>
          <span class="fw-bold text-dark">${ord.cliente}</span>
        </li>
        <li class="list-group-item d-flex justify-content-between px-0 py-2">
          <span class="text-muted fw-semibold">Correo:</span>
          <span>${ord.correo || 'No especificado'}</span>
        </li>
        <li class="list-group-item d-flex justify-content-between px-0 py-2">
          <span class="text-muted fw-semibold">Estado de Despacho:</span>
          <span class="badge bg-success">${ord.estado || 'Completada'}</span>
        </li>
      </ul>

      <h6 class="fw-bold mt-3 mb-2 small text-uppercase text-secondary">Artículos Comprados</h6>
      <ul class="list-group list-group-flush border-top border-bottom small mb-3">
        ${itemsHTML}
      </ul>

      <div class="d-flex justify-content-between align-items-center pt-2">
        <span class="fw-bold fs-6">Total Orden:</span>
        <span class="fw-bold text-success fs-5">$${Number(ord.total).toLocaleString('es-CL')} CLP</span>
      </div>
    `;

    const modalEl = document.getElementById('modal-detalle-orden');
    const modalInstancia = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
    modalInstancia.show();
  };

  if (inputFiltro) {
    inputFiltro.addEventListener('input', (e) => {
      renderizarTabla(e.target.value);
    });
  }

  // Inicialización
  aplicarPermisos();
});