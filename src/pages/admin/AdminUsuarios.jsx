import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  obtenerUsuarios,
  cambiarEstadoUsuario
} from '../../services/adminUsuarioService';
import { obtenerOrdenes } from '../../services/adminOrdenService';
import { obtenerRolActual } from '../../services/authService';

function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [ordenes, setOrdenes] = useState([]);
  const [filtroTexto, setFiltroTexto] = useState('');
  const [filtroRol, setFiltroRol] = useState('todos');
  const [rolActual, setRolActual] = useState(obtenerRolActual());
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);
  const [alertaExito, setAlertaExito] = useState('');
  const [errorEliminar, setErrorEliminar] = useState('');

  const cargarDatos = async () => {
    try {
      const [usrs, ords] = await Promise.all([
        obtenerUsuarios(),
        obtenerOrdenes().catch(() => [])
      ]);
      setUsuarios(usrs);
      setOrdenes(ords);
      setRolActual(obtenerRolActual());
    } catch (err) {
      setErrorEliminar(err.message || 'Error al cargar usuarios.');
    }
  };

  useEffect(() => {
    cargarDatos();
    window.addEventListener('logistrack_rol_cambiado', cargarDatos);
    window.addEventListener('logistrack_auth_cambiado', cargarDatos);
    return () => {
      window.removeEventListener('logistrack_rol_cambiado', cargarDatos);
      window.removeEventListener('logistrack_auth_cambiado', cargarDatos);
    };
  }, []);

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

  const contarComprasUsuario = (nombre) => {
    return ordenes.filter(
      (o) => o.cliente && nombre && o.cliente.toLowerCase().includes(nombre.toLowerCase())
    ).length;
  };

  const usuariosFiltrados = usuarios.filter((u) => {
    const texto = filtroTexto.toLowerCase().trim();
    const coincideTexto =
      !texto ||
      u.nombre.toLowerCase().includes(texto) ||
      u.apellidos.toLowerCase().includes(texto) ||
      u.correo.toLowerCase().includes(texto) ||
      u.username.toLowerCase().includes(texto);

    const coincideRol = filtroRol === 'todos' || u.rol === filtroRol;

    return coincideTexto && coincideRol;
  });

  const handleConfirmarEliminar = async () => {
    if (!usuarioAEliminar) return;

    if (usuarioAEliminar.rol === 'Administrador' && usuarios.filter((u) => u.rol === 'Administrador' && u.activo).length <= 1) {
      setErrorEliminar('No puedes desactivar el único Administrador activo del sistema.');
      return;
    }

    try {
      const nuevoEstado = usuarioAEliminar.activo ? 'INACTIVO' : 'ACTIVO';
      await cambiarEstadoUsuario(usuarioAEliminar.id, nuevoEstado);
      setAlertaExito(`Usuario ${usuarioAEliminar.nombre} ${usuarioAEliminar.apellidos} marcado como ${nuevoEstado}.`);
      setUsuarioAEliminar(null);
      setErrorEliminar('');
      await cargarDatos();
      setTimeout(() => setAlertaExito(''), 4000);
    } catch (err) {
      setErrorEliminar(err.message || 'No se pudo cambiar el estado del usuario.');
    }
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
                  <th className="ps-3">Username</th>
                  <th>Usuario</th>
                  <th>Correo Electrónico</th>
                  <th>Estado</th>
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
                    const cantCompras = contarComprasUsuario(u.nombre);
                    let badgeRol = 'bg-secondary';
                    if (u.rol === 'Administrador') badgeRol = 'bg-primary';
                    if (u.rol === 'Vendedor') badgeRol = 'bg-info text-dark';
                    if (u.rol === 'Cliente') badgeRol = 'bg-success';

                    return (
                      <tr key={u.id}>
                        <td className="ps-3 font-monospace fw-semibold text-secondary">
                          @{u.username}
                        </td>
                        <td>
                          <div className="fw-semibold text-dark">{u.nombre} {u.apellidos}</div>
                          <small className="text-muted">ID: #{u.id}</small>
                        </td>
                        <td>
                          <span className="text-dark small">{u.correo}</span>
                        </td>
                        <td>
                          <span className={`badge ${u.activo ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'} border`}>
                            {u.estado}
                          </span>
                        </td>
                        <td className="text-center">
                          <span className={`badge ${badgeRol} px-3 py-1`}>{u.rol}</span>
                        </td>
                        <td className="text-center">
                          <Link
                            to={`/admin/usuarios/${u.id}/historial`}
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
                              to={`/admin/usuarios/editar/${u.id}`}
                              className="btn btn-outline-primary"
                              title="Editar Usuario"
                            >
                              <i className="bi bi-pencil-square"></i>
                            </Link>
                            <button
                              type="button"
                              className="btn btn-outline-danger"
                              title={u.activo ? 'Desactivar Usuario' : 'Activar Usuario'}
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
                    @{usuarioAEliminar.username} — Rol: {usuarioAEliminar.rol}
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
