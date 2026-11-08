import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import {
  obtenerUsuarios,
  eliminarUsuario,
  formatearRunVisual,
  obtenerRolActivo
} from '../../data/usuarios';
import { obtenerOrdenes } from '../../data/ordenes';

function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [ordenes, setOrdenes] = useState([]);
  const [filtroTexto, setFiltroTexto] = useState('');
  const [filtroRol, setFiltroRol] = useState('todos');
  const [rolActual, setRolActual] = useState(obtenerRolActivo());
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);
  const [alertaExito, setAlertaExito] = useState('');
  const [errorEliminar, setErrorEliminar] = useState('');

  const cargarDatos = () => {
    setUsuarios(obtenerUsuarios());
    setOrdenes(obtenerOrdenes());
    setRolActual(obtenerRolActivo());
  };

  useEffect(() => {
    cargarDatos();
    window.addEventListener('logistrack_rol_cambiado', cargarDatos);
    window.addEventListener('storage', cargarDatos);
    return () => {
      window.removeEventListener('logistrack_rol_cambiado', cargarDatos);
      window.removeEventListener('storage', cargarDatos);
    };
  }, []);

  // Control estricto de roles (fail-closed): Si es Vendedor, no tiene acceso
  if (rolActual === 'Vendedor') {
    return (
      <div className="alert alert-danger shadow-sm py-4 text-center">
        <i className="bi bi-shield-lock-fill fs-1 text-danger d-block mb-2"></i>
        <h5 className="fw-bold">Acceso Denegado</h5>
        <p className="mb-3">Los usuarios con perfil "Vendedor" no tienen permisos para gestionar cuentas de usuario.</p>
        <Link to="/admin/productos" className="btn btn-primary btn-sm">
          Ir al Catálogo de Productos
        </Link>
      </div>
    );
  }

  // Contar órdenes por usuario
  const contarComprasUsuario = (run, nombre) => {
    return ordenes.filter(
      (o) =>
        (o.clienteRun && o.clienteRun.toUpperCase() === run.toUpperCase()) ||
        (o.cliente && o.cliente.toLowerCase().includes(nombre.toLowerCase()))
    ).length;
  };

  // Filtrado reactivo en vivo
  const usuariosFiltrados = usuarios.filter((u) => {
    const texto = filtroTexto.toLowerCase().trim();
    const coincideTexto =
      !texto ||
      u.nombre.toLowerCase().includes(texto) ||
      u.apellidos.toLowerCase().includes(texto) ||
      u.correo.toLowerCase().includes(texto) ||
      u.run.toLowerCase().includes(texto);

    const coincideRol = filtroRol === 'todos' || u.rol === filtroRol;

    return coincideTexto && coincideRol;
  });

  const handleConfirmarEliminar = () => {
    if (!usuarioAEliminar) return;

    // Validación: No permitir autoeliminarse si es el usuario activo
    if (usuarioAEliminar.rol === 'Administrador' && usuarios.filter((u) => u.rol === 'Administrador').length <= 1) {
      setErrorEliminar('No puedes eliminar el único Administrador del sistema.');
      return;
    }

    eliminarUsuario(usuarioAEliminar.run);
    setAlertaExito(`Usuario ${usuarioAEliminar.nombre} ${usuarioAEliminar.apellidos} eliminado.`);
    setUsuarioAEliminar(null);
    setErrorEliminar('');
    cargarDatos();
    setTimeout(() => setAlertaExito(''), 4000);
  };

  return (
    <div>
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb small">
          <li className="breadcrumb-item"><Link to="/admin">Dashboard</Link></li>
          <li className="breadcrumb-item active" aria-current="page">Usuarios</li>
        </ol>
      </nav>

      {/* Alerta de notificación */}
      {alertaExito && (
        <div className="alert alert-success alert-dismissible fade show shadow-sm" role="alert">
          <i className="bi bi-check-circle-fill me-2"></i>
          {alertaExito}
          <button type="button" className="btn-close" onClick={() => setAlertaExito('')}></button>
        </div>
      )}

      {/* Encabezado y Acción Nuevo */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h5 className="fw-bold text-dark m-0">Gestión de Cuentas de Usuario</h5>
          <small className="text-muted">
            Total: <strong>{usuariosFiltrados.length}</strong> de <strong>{usuarios.length}</strong> cuentas registradas
          </small>
        </div>

        <Link to="/admin/usuarios/nuevo" className="btn btn-primary btn-sm d-flex align-items-center gap-1">
          <i className="bi bi-person-plus-fill"></i> Nuevo Usuario
        </Link>
      </div>

      {/* Filtros */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body p-3">
          <div className="row g-2 align-items-center">
            <div className="col-12 col-md-7">
              <div className="input-group input-group-sm">
                <span className="input-group-text bg-white border-end-0">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 ps-0"
                  placeholder="Buscar por RUN, nombre, apellido o correo electrónico..."
                  value={filtroTexto}
                  onChange={(e) => setFiltroTexto(e.target.value)}
                />
                {filtroTexto && (
                  <button className="btn btn-outline-secondary" type="button" onClick={() => setFiltroTexto('')}>
                    <i className="bi bi-x"></i>
                  </button>
                )}
              </div>
            </div>

            <div className="col-12 col-md-5">
              <select
                className="form-select form-select-sm"
                value={filtroRol}
                onChange={(e) => setFiltroRol(e.target.value)}
              >
                <option value="todos">Todos los roles</option>
                <option value="Administrador">Administrador</option>
                <option value="Vendedor">Vendedor</option>
                <option value="Cliente">Cliente</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de Usuarios */}
      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-3">RUN</th>
                  <th>Usuario</th>
                  <th>Correo Electrónico</th>
                  <th>Teléfono</th>
                  <th className="text-center">Rol Asignado</th>
                  <th className="text-center">Historial</th>
                  <th className="text-end pe-3" style={{ width: '150px' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuariosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-5 text-muted">
                      <i className="bi bi-people fs-1 d-block text-secondary mb-2"></i>
                      No se encontraron usuarios con los criterios de búsqueda.
                    </td>
                  </tr>
                ) : (
                  usuariosFiltrados.map((u) => {
                    const cantCompras = contarComprasUsuario(u.run, u.nombre);
                    let badgeRol = 'bg-secondary';
                    if (u.rol === 'Administrador') badgeRol = 'bg-primary';
                    if (u.rol === 'Vendedor') badgeRol = 'bg-info text-dark';
                    if (u.rol === 'Cliente') badgeRol = 'bg-success';

                    return (
                      <tr key={u.run}>
                        <td className="ps-3 font-monospace fw-semibold text-secondary">
                          {formatearRunVisual(u.run)}
                        </td>
                        <td>
                          <div className="fw-semibold text-dark">{u.nombre} {u.apellidos}</div>
                          <small className="text-muted">Reg: {u.fechaRegistro || '2026-03-01'}</small>
                        </td>
                        <td>
                          <span className="text-dark small">{u.correo}</span>
                        </td>
                        <td>
                          <small className="text-muted">{u.telefono || 'Sin teléfono'}</small>
                        </td>
                        <td className="text-center">
                          <span className={`badge ${badgeRol} px-3 py-1`}>{u.rol}</span>
                        </td>
                        <td className="text-center">
                          <Link
                            to={`/admin/usuarios/${u.run}/historial`}
                            className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1"
                            title="Ver Historial de Compras"
                          >
                            <i className="bi bi-clock-history"></i>
                            <span className="small">{cantCompras} orden(es)</span>
                          </Link>
                        </td>
                        <td className="text-end pe-3">
                          <div className="btn-group btn-group-sm">
                            <Link
                              to={`/admin/usuarios/editar/${u.run}`}
                              className="btn btn-outline-primary"
                              title="Editar Usuario"
                            >
                              <i className="bi bi-pencil-square"></i>
                            </Link>
                            <button
                              type="button"
                              className="btn btn-outline-danger"
                              title="Eliminar Usuario"
                              onClick={() => {
                                setUsuarioAEliminar(u);
                                setErrorEliminar('');
                              }}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de Confirmar Eliminación */}
      {usuarioAEliminar && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header bg-danger text-white">
                <h6 className="modal-title fw-bold">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i> Confirmar Eliminación
                </h6>
                <button type="button" className="btn-close btn-close-white" onClick={() => setUsuarioAEliminar(null)}></button>
              </div>

              <div className="modal-body py-4">
                {errorEliminar && (
                  <div className="alert alert-danger py-2 small mb-3">{errorEliminar}</div>
                )}
                <p className="mb-1">¿Estás seguro de que deseas eliminar permanentemente la cuenta de:</p>
                <div className="p-3 bg-light rounded mt-2 border">
                  <strong className="text-dark">{usuarioAEliminar.nombre} {usuarioAEliminar.apellidos}</strong>
                  <div className="small text-muted font-monospace mt-1">
                    RUN: {formatearRunVisual(usuarioAEliminar.run)} — Rol: {usuarioAEliminar.rol}
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setUsuarioAEliminar(null)}>
                  Cancelar
                </button>
                <button type="button" className="btn btn-danger btn-sm fw-semibold" onClick={handleConfirmarEliminar}>
                  <i className="bi bi-trash me-1"></i> Sí, Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminUsuarios;
