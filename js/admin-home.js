document.addEventListener('DOMContentLoaded', () => {
  console.log('LogisTrack: Iniciando admin-home.js...');

  // Backdoor de desarrollo (?reset=admin)
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('reset') === 'admin') {
    localStorage.setItem('logistrack_rol_activo', 'Administrador');
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  // 1. Inicialización de datos base si no existen
  function inicializarDatosBase() {
    if (!localStorage.getItem('logistrack_productos')) {
      const productosIniciales = [
        { codigo: 'SKU-001', nombre: 'Laptop DELL Latitude', categoria: 'Tecnología', precio: 389990, stock: 8, stockCritico: 3 },
        { codigo: 'SKU-003', nombre: 'Pasta Térmica Artic MX4', categoria: 'Mantención', precio: 5990, stock: 2, stockCritico: 5 },
        { codigo: 'SKU-004', nombre: 'Papel A4 Resma', categoria: 'Insumos', precio: 3490, stock: 25, stockCritico: 10 }
      ];
      localStorage.setItem('logistrack_productos', JSON.stringify(productosIniciales));
    }

    if (!localStorage.getItem('logistrack_usuarios')) {
      const usuariosIniciales = [
        { run: '19011022K', nombre: 'Oliver', apellidos: 'Duncan', correo: 'oliver@duoc.cl', rol: 'Administrador' },
        { run: '185421110', nombre: 'Angel', apellidos: 'Martinez', correo: 'angel@duoc.cl', rol: 'Vendedor' },
        { run: '201234567', nombre: 'Alfredo', apellidos: 'De La Hoz', correo: 'alfredo@gmail.com', rol: 'Cliente' }
      ];
      localStorage.setItem('logistrack_usuarios', JSON.stringify(usuariosIniciales));
    }

    if (!localStorage.getItem('logistrack_ordenes')) {
      const ordenesDemo = [
        { id: 'ORD-1001', cliente: 'Alfredo De La Hoz', fecha: '2026-03-28', total: 389990, estado: 'Completada' },
        { id: 'ORD-1002', cliente: 'Angel Martinez', fecha: '2026-03-29', total: 20980, estado: 'Pendiente' }
      ];
      localStorage.setItem('logistrack_ordenes', JSON.stringify(ordenesDemo));
    }
  }

  inicializarDatosBase();

  // 2. Control de Permisos y Roles
  const selectRol = document.getElementById('select-rol-simulado');
  const navUsuarios = document.getElementById('nav-usuarios');
  const alertaRol = document.getElementById('alerta-rol');
  const seccionUsuariosHome = document.getElementById('seccion-usuarios-home');

  let rolActual = localStorage.getItem('logistrack_rol_activo') || 'Administrador';

  function aplicarPermisos(rol) {
    if (rol === 'Cliente') {
      alert('Acceso Denegado: Los usuarios con perfil "Cliente" no tienen acceso al panel de administración.');
      window.location.href = 'index.html';
      return;
    }
    if (rol === 'Vendedor') {
      if (navUsuarios) navUsuarios.classList.add('d-none');
      if (seccionUsuariosHome) seccionUsuariosHome.classList.add('d-none');
      if (alertaRol) {
        alertaRol.textContent = 'Modo Vendedor: Visualización restringida a métricas de productos y órdenes.';
        alertaRol.classList.remove('d-none');
      }
    } else {
      if (navUsuarios) navUsuarios.classList.remove('d-none');
      if (seccionUsuariosHome) seccionUsuariosHome.classList.remove('d-none');
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

  // 3. Renderizado de Métricas (KPIs) e Inventario
  function actualizarDashboard() {
    const productos = JSON.parse(localStorage.getItem('logistrack_productos')) || [];
    const usuarios = JSON.parse(localStorage.getItem('logistrack_usuarios')) || [];
    const ordenes = JSON.parse(localStorage.getItem('logistrack_ordenes')) || [];

    const totalProductosEl = document.getElementById('kpi-total-productos');
    const totalCriticosEl = document.getElementById('kpi-stock-critico');
    const totalUsuariosEl = document.getElementById('kpi-total-usuarios');
    const totalOrdenesEl = document.getElementById('kpi-total-ordenes');

    const productosCriticos = productos.filter(p => Number(p.stock) <= Number(p.stockCritico || 0));

    if (totalProductosEl) totalProductosEl.textContent = productos.length;
    if (totalCriticosEl) totalCriticosEl.textContent = productosCriticos.length;
    if (totalUsuariosEl) totalUsuariosEl.textContent = usuarios.length;
    if (totalOrdenesEl) totalOrdenesEl.textContent = ordenes.length;

    // Tabla de resumen en Home (busca por ID de tabla o tbody)
    const tbodyStock = document.getElementById('tabla-resumen-stock') || document.querySelector('#tabla-stock-home tbody');
    if (tbodyStock) {
      if (productos.length === 0) {
        tbodyStock.innerHTML = `<tr><td colspan="5" class="text-center text-muted py-3">No hay productos registrados.</td></tr>`;
      } else {
        tbodyStock.innerHTML = productos.slice(0, 5).map(p => {
          const esCritico = Number(p.stock) <= Number(p.stockCritico || 0);
          return `
            <tr>
              <td class="ps-3 fw-semibold">${p.codigo}</td>
              <td>${p.nombre}</td>
              <td class="text-end fw-bold">$${Number(p.precio).toLocaleString('es-CL')}</td>
              <td class="text-center fw-bold ${esCritico ? 'text-danger' : 'text-dark'}">${p.stock}</td>
              <td class="text-center pe-3">
                ${esCritico 
                  ? '<span class="badge bg-warning text-dark"><i class="bi bi-exclamation-triangle-fill me-1"></i>Crítico</span>' 
                  : '<span class="badge bg-success">Normal</span>'}
              </td>
            </tr>
          `;
        }).join('');
      }
    }
  }

  actualizarDashboard();
  console.log('LogisTrack: Dashboard cargado correctamente.');
});