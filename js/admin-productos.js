document.addEventListener('DOMContentLoaded', () => {
  // Inicialización de inventario base si no existe en localStorage
  function inicializarCatalogo() {
    if (!localStorage.getItem('logistrack_productos')) {
      const productosIniciales = [
        { codigo: 'SKU-001', nombre: 'Laptop DELL Latitude', categoria: 'Tecnología', precio: 389990, stock: 8, stockCritico: 3, imagen: '', descripcion: 'Laptop corporativa para uso administrativo.' },
        { codigo: 'SKU-003', nombre: 'Pasta Térmica Artic MX4', categoria: 'Mantención', precio: 5990, stock: 2, stockCritico: 5, imagen: '', descripcion: 'Compuesto térmico de alto rendimiento.' },
        { codigo: 'SKU-004', nombre: 'Papel A4 Resma', categoria: 'Insumos', precio: 3490, stock: 25, stockCritico: 10, imagen: '', descripcion: 'Resma de 500 hojas tamaño carta.' }
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
  const btnNuevoProducto = document.getElementById('btn-nuevo-producto');
  const subtituloRol = document.getElementById('subtitulo-rol');

  // Obtener rol normalizado desde localStorage
  function obtenerRol() {
    return (localStorage.getItem('logistrack_rol_activo') || 'Administrador').trim();
  }

  // Aplicación estricta de permisos según la pauta
  function aplicarPermisos() {
    const rol = obtenerRol();
    const rolLower = rol.toLowerCase();

    // 1. Cliente: No tiene acceso a administración
    if (rolLower === 'cliente') {
      alert('Acceso Denegado: Los clientes solo tienen acceso a la tienda.');
      window.location.href = 'index.html';
      return;
    }

    // 2. Vendedor: Solo visualiza listado y detalle
    if (rolLower === 'vendedor') {
      if (navUsuarios) navUsuarios.classList.add('d-none');
      if (btnNuevoProducto) btnNuevoProducto.classList.add('d-none');
      if (subtituloRol) subtituloRol.textContent = 'Modo Vendedor: Consulta de productos y visualización de detalles';
      if (alertaRol) {
        alertaRol.textContent = 'Perfil Vendedor: Tienes acceso de solo lectura al catálogo y detalle de productos.';
        alertaRol.classList.remove('d-none');
      }
    } 
    // 3. Administrador: Acceso total
    else {
      if (navUsuarios) navUsuarios.classList.remove('d-none');
      if (btnNuevoProducto) btnNuevoProducto.classList.remove('d-none');
      if (subtituloRol) subtituloRol.textContent = 'Gestión completa de existencias, altas, bajas y modificaciones';
      if (alertaRol) alertaRol.classList.add('d-none');
    }

    renderizarTabla(inputFiltro ? inputFiltro.value : '');
  }

  // Evento del selector de rol simulado
  if (selectRol) {
    selectRol.value = obtenerRol();
    selectRol.addEventListener('change', (e) => {
      localStorage.setItem('logistrack_rol_activo', e.target.value);
      aplicarPermisos();
    });
  }

  function leerProductos() {
    return JSON.parse(localStorage.getItem('logistrack_productos')) || [];
  }

  // Renderizado dinámico de la tabla
  function renderizarTabla(termino = '') {
    const productos = leerProductos();
    const filtro = termino.trim().toLowerCase();
    const esVendedor = obtenerRol().toLowerCase() === 'vendedor';

    const filtrados = productos.filter(p => 
      (p.codigo && p.codigo.toLowerCase().includes(filtro)) ||
      (p.nombre && p.nombre.toLowerCase().includes(filtro)) ||
      (p.categoria && p.categoria.toLowerCase().includes(filtro))
    );

    if (totalRegistros) totalRegistros.textContent = filtrados.length;
    if (!tablaCuerpo) return;

    if (filtrados.length === 0) {
      tablaCuerpo.innerHTML = `
        <tr>
          <td colspan="8" class="text-center py-5 text-muted">
            <i class="bi bi-search fs-1 d-block text-secondary mb-2"></i>
            No se encontraron productos coincidentes.
          </td>
        </tr>
      `;
      return;
    }

    tablaCuerpo.innerHTML = filtrados.map(p => {
      const stockActual = Number(p.stock);
      const stockCritico = Number(p.stockCritico || 0);
      const esCritico = stockActual <= stockCritico;
      const esGratis = Number(p.precio) === 0;

      // Restricción de botones de acción
      let accionesHTML = '';
      if (esVendedor) {
        // VENDEDOR: Exclusivamente botón de detalle
        accionesHTML = `
          <button type="button" class="btn btn-sm btn-outline-primary" onclick="verDetalleProducto('${p.codigo}')">
            <i class="bi bi-eye-fill me-1"></i>Detalle
          </button>
        `;
      } else {
        // ADMINISTRADOR: Detalle + Editar + Eliminar
        accionesHTML = `
          <div class="btn-group btn-group-sm">
            <button type="button" class="btn btn-outline-primary" onclick="verDetalleProducto('${p.codigo}')" title="Ver detalle">
              <i class="bi bi-eye-fill"></i>
            </button>
            <a href="admin-producto-form.html?codigo=${encodeURIComponent(p.codigo)}" class="btn btn-outline-secondary" title="Editar producto">
              <i class="bi bi-pencil-square"></i>
            </a>
            <button type="button" class="btn btn-outline-danger" onclick="eliminarProducto('${p.codigo}')" title="Eliminar producto">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        `;
      }

      return `
        <tr>
          <td class="ps-3 fw-semibold text-secondary font-monospace">${p.codigo}</td>
          <td>
            <div class="fw-bold text-dark">${p.nombre}</div>
            <small class="text-muted text-truncate d-inline-block" style="max-width: 250px;">
              ${p.descripcion || 'Sin descripción'}
            </small>
          </td>
          <td>
            <span class="badge bg-light text-dark border">${p.categoria}</span>
          </td>
          <td class="text-end fw-bold">
            ${esGratis ? '<span class="badge bg-success">FREE</span>' : '$' + Number(p.precio).toLocaleString('es-CL')}
          </td>
          <td class="text-center fw-bold ${esCritico ? 'text-danger' : 'text-dark'}">${stockActual}</td>
          <td class="text-center text-muted">${stockCritico}</td>
          <td class="text-center">
            ${esCritico 
              ? '<span class="badge bg-warning text-dark"><i class="bi bi-exclamation-triangle-fill me-1"></i>Crítico</span>' 
              : '<span class="badge bg-success">Normal</span>'}
          </td>
          <td class="pe-3 text-end">
            ${accionesHTML}
          </td>
        </tr>
      `;
    }).join('');
  }

  // Apertura del modal de detalle
  window.verDetalleProducto = function(codigo) {
    const productos = leerProductos();
    const p = productos.find(item => item.codigo.toUpperCase() === codigo.toUpperCase());
    if (!p) return;

    document.getElementById('modal-codigo').textContent = p.codigo;
    document.getElementById('modal-nombre').textContent = p.nombre;
    document.getElementById('modal-categoria').textContent = p.categoria;
    document.getElementById('modal-precio').textContent = Number(p.precio) === 0 ? 'FREE ($0 CLP)' : `$${Number(p.precio).toLocaleString('es-CL')} CLP`;
    document.getElementById('modal-stock').textContent = `${p.stock} unidades`;
    document.getElementById('modal-stock-critico').textContent = `${p.stockCritico || 0} unidades`;
    document.getElementById('modal-descripcion').textContent = p.descripcion || 'Sin descripción registrada.';

    const esCritico = Number(p.stock) <= Number(p.stockCritico || 0);
    const badgeEstado = document.getElementById('modal-estado-badge');
    if (badgeEstado) {
      badgeEstado.innerHTML = esCritico 
        ? '<span class="badge bg-warning text-dark"><i class="bi bi-exclamation-triangle-fill me-1"></i>Stock Crítico</span>' 
        : '<span class="badge bg-success">Stock Normal</span>';
    }

    const contenedorImg = document.getElementById('modal-contenedor-img');
    const elementoImg = document.getElementById('modal-imagen');
    if (contenedorImg && elementoImg) {
      if (p.imagen && p.imagen.trim() !== '') {
        elementoImg.src = p.imagen;
        contenedorImg.classList.remove('d-none');
      } else {
        contenedorImg.classList.add('d-none');
      }
    }

    const modalEl = document.getElementById('modal-detalle-producto');
    const modalInstancia = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
    modalInstancia.show();
  };

  // Bloqueo de eliminación para vendedores
  window.eliminarProducto = function(codigo) {
    if (obtenerRol().toLowerCase() !== 'administrador') {
      alert('Acceso Denegado: Los vendedores no tienen permisos para eliminar productos.');
      return;
    }
    if (confirm(`¿Estás seguro de eliminar el producto "${codigo}"?`)) {
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
  aplicarPermisos();
});