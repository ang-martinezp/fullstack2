document.addEventListener('DOMContentLoaded', () => {
  // Backdoor de desarrollo (?reset=admin)
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('reset') === 'admin') {
    localStorage.setItem('logistrack_rol_activo', 'Administrador');
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  // Elementos del DOM
  const selectRol = document.getElementById('select-rol-simulado');
  const navUsuarios = document.getElementById('nav-usuarios');
  const alertaRol = document.getElementById('alerta-rol');
  const tablaCuerpo = document.getElementById('tabla-usuarios-cuerpo');
  const totalUsuarios = document.getElementById('total-usuarios');
  const inputFiltro = document.getElementById('input-filtro-usuarios');

  // Control de Roles y Restricción Estricta
  let rolActual = localStorage.getItem('logistrack_rol_activo') || 'Administrador';

  function aplicarPermisos(rol) {
    if (rol === 'Cliente') {
      alert('Acceso Denegado: Los usuarios con perfil "Cliente" no tienen acceso al panel administrativo.');
      window.location.href = 'index.html';
      return;
    }
    if (rol === 'Vendedor') {
      alert('Acceso Denegado: Los usuarios con perfil "Vendedor" no tienen permisos para gestionar cuentas de usuario.');
      window.location.href = 'admin-productos.html';
      return;
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

  // Formateo visual de RUN chileno (Ej: 19011022K -> 19.011.022-K)
  function formatearRunVisual(runRaw) {
    if (!runRaw) return '';
    const limpio = runRaw.replace(/[^0-9kK]/g, '').toUpperCase();
    if (limpio.length < 2) return limpio;
    const cuerpo = limpio.slice(0, -1);
    const dv = limpio.slice(-1);
    return `${Number(cuerpo).toLocaleString('es-CL')}-${dv}`;
  }

  // Persistencia de Usuarios
  function leerUsuarios() {
    let usuarios = JSON.parse(localStorage.getItem('logistrack_usuarios'));
    if (!usuarios || usuarios.length === 0) {
      usuarios = [
        { run: '19011022K', nombre: 'Oliver', apellidos: 'Duncan', correo: 'oliver@duoc.cl', rol: 'Administrador' },
        { run: '185421110', nombre: 'Angel', apellidos: 'Martinez', correo: 'angel@duoc.cl', rol: 'Vendedor' },
        { run: '201234567', nombre: 'Alfredo', apellidos: 'De La Hoz', correo: 'alfredo@gmail.com', rol: 'Cliente' }
      ];
      localStorage.setItem('logistrack_usuarios', JSON.stringify(usuarios));
    }
    return usuarios;
  }

  function guardarUsuarios(usuarios) {
    localStorage.setItem('logistrack_usuarios', JSON.stringify(usuarios));
  }

  // Renderizado dinámico de la tabla con filtro
  function renderizarTabla(termino = '') {
    const usuarios = leerUsuarios();
    const filtro = termino.trim().toLowerCase();

    const filtrados = usuarios.filter(u => {
      const runLimpio = (u.run || '').toLowerCase();
      const nombreCompleto = `${u.nombre || ''} ${u.apellidos || ''}`.toLowerCase();
      const correo = (u.correo || '').toLowerCase();
      const rol = (u.rol || '').toLowerCase();

      return runLimpio.includes(filtro) ||
             nombreCompleto.includes(filtro) ||
             correo.includes(filtro) ||
             rol.includes(filtro);
    });

    if (totalUsuarios) {
      totalUsuarios.textContent = filtrados.length;
    }

    if (!tablaCuerpo) return;

    if (filtrados.length === 0) {
      tablaCuerpo.innerHTML = `
        <tr>
          <td colspan="5" class="text-center py-5 text-muted">
            <i class="bi bi-people fs-1 d-block text-secondary mb-2"></i>
            No se encontraron usuarios que coincidan con la búsqueda.
          </td>
        </tr>
      `;
      return;
    }

    tablaCuerpo.innerHTML = filtrados.map(u => {
      let badgeClase = 'bg-secondary';
      if (u.rol === 'Administrador') badgeClase = 'bg-dark';
      if (u.rol === 'Vendedor') badgeClase = 'bg-info text-dark';
      if (u.rol === 'Cliente') badgeClase = 'bg-primary';

      return `
        <tr>
          <td class="ps-3 fw-semibold text-secondary">${formatearRunVisual(u.run)}</td>
          <td>
            <div class="fw-bold text-dark">${u.nombre} ${u.apellidos}</div>
          </td>
          <td>
            <a href="mailto:${u.correo}" class="text-decoration-none text-muted small">
              <i class="bi bi-envelope me-1"></i>${u.correo}
            </a>
          </td>
          <td class="text-center">
            <span class="badge ${badgeClase}">${u.rol}</span>
          </td>
          <td class="pe-3 text-end">
            <div class="btn-group btn-group-sm">
              <a href="admin-usuario-form.html?run=${encodeURIComponent(u.run)}" class="btn btn-outline-secondary" title="Editar usuario">
                <i class="bi bi-pencil-square"></i>
              </a>
              <button type="button" class="btn btn-outline-danger" onclick="eliminarUsuario('${u.run}')" title="Eliminar usuario">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  // Función global para eliminar usuarios
  window.eliminarUsuario = function(run) {
    if (confirm(`¿Estás seguro de que deseas eliminar al usuario con RUN ${formatearRunVisual(run)}?`)) {
      let usuarios = leerUsuarios();
      usuarios = usuarios.filter(u => u.run.toUpperCase() !== run.toUpperCase());
      guardarUsuarios(usuarios);
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