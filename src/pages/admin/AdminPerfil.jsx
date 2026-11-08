import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  obtenerUsuarioActivo,
  obtenerRolActivo,
  actualizarUsuario,
  formatearRunVisual,
  establecerRolActivo,
  ROLES_DISPONIBLES
} from '../../data/usuarios';

function AdminPerfil() {
  const [usuario, setUsuario] = useState(obtenerUsuarioActivo());
  const [rolActual, setRolActual] = useState(obtenerRolActivo());

  // Formulario de datos personales
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    correo: '',
    telefono: ''
  });

  // Formulario de contraseña
  const [passwordData, setPasswordData] = useState({
    actual: '',
    nueva: '',
    confirmacion: ''
  });

  const [alertaPerfil, setAlertaPerfil] = useState('');
  const [alertaPassword, setAlertaPassword] = useState('');
  const [errorPassword, setErrorPassword] = useState('');

  const cargarDatos = () => {
    const u = obtenerUsuarioActivo();
    setUsuario(u);
    setRolActual(obtenerRolActivo());
    if (u) {
      setFormData({
        nombre: u.nombre || '',
        apellidos: u.apellidos || '',
        correo: u.correo || '',
        telefono: u.telefono || ''
      });
    }
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

  const handleActualizarPerfil = (e) => {
    e.preventDefault();
    if (!usuario) return;

    actualizarUsuario(usuario.run, formData);
    setAlertaPerfil('Datos de la cuenta actualizados correctamente.');
    cargarDatos();
    setTimeout(() => setAlertaPerfil(''), 3500);
  };

  const handleCambiarPassword = (e) => {
    e.preventDefault();
    setErrorPassword('');

    if (!passwordData.actual) {
      setErrorPassword('Debes ingresar tu contraseña actual.');
      return;
    }
    if (passwordData.nueva.length < 6) {
      setErrorPassword('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (passwordData.nueva !== passwordData.confirmacion) {
      setErrorPassword('La nueva contraseña y su confirmación no coinciden.');
      return;
    }

    setAlertaPassword('¡Contraseña actualizada con éxito!');
    setPasswordData({ actual: '', nueva: '', confirmacion: '' });
    setTimeout(() => setAlertaPassword(''), 3500);
  };

  const handleCambiarRol = (e) => {
    const nuevo = e.target.value;
    establecerRolActivo(nuevo);
    setRolActual(nuevo);
  };

  const esAdmin = rolActual === 'Administrador';

  return (
    <div>
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb small">
          <li className="breadcrumb-item"><Link to="/admin">Dashboard</Link></li>
          <li className="breadcrumb-item active" aria-current="page">Mi Perfil</li>
        </ol>
      </nav>

      {/* Tarjeta de Encabezado de Perfil */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body p-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div className="d-flex align-items-center gap-3">
              <div className="bg-primary text-white p-3 rounded-circle fs-2 d-flex align-items-center justify-content-center shadow-sm" style={{ width: '72px', height: '72px' }}>
                <i className="bi bi-person-circle"></i>
              </div>
              <div>
                <h4 className="fw-bold text-dark m-0">{usuario?.nombre} {usuario?.apellidos}</h4>
                <div className="text-secondary small font-monospace mt-1">
                  RUN: {formatearRunVisual(usuario?.run)}
                </div>
                <div className="d-flex align-items-center gap-2 mt-1">
                  <span className={`badge ${esAdmin ? 'bg-primary' : 'bg-info text-dark'} px-3 py-1`}>
                    Rol: {rolActual}
                  </span>
                  <small className="text-muted">
                    <i className="bi bi-envelope me-1"></i>{usuario?.correo}
                  </small>
                </div>
              </div>
            </div>

            {/* Simulador rápido de rol en perfil */}
            <div className="p-3 bg-light rounded border text-md-end">
              <small className="text-muted d-block fw-semibold mb-1">Simular sesión como:</small>
              <select
                className="form-select form-select-sm fw-semibold"
                style={{ width: '160px' }}
                value={rolActual}
                onChange={handleCambiarRol}
              >
                {ROLES_DISPONIBLES.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Columna Izquierda: Información Personal */}
        <div className="col-12 col-lg-7">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white border-bottom py-3">
              <h6 className="fw-bold text-dark m-0">
                <i className="bi bi-pencil-square text-primary me-2"></i> Información de Contacto
              </h6>
            </div>

            <div className="card-body p-4">
              {alertaPerfil && (
                <div className="alert alert-success py-2 px-3 small d-flex align-items-center gap-2 mb-3">
                  <i className="bi bi-check-circle-fill"></i>
                  {alertaPerfil}
                </div>
              )}

              <form onSubmit={handleActualizarPerfil}>
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold">Nombre</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      required
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold">Apellidos</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.apellidos}
                      onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
                      required
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold">Correo Electrónico</label>
                    <input
                      type="email"
                      className="form-control"
                      value={formData.correo}
                      onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                      required
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold">Teléfono</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.telefono}
                      onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                      placeholder="+56 9 8765 4321"
                    />
                  </div>
                </div>

                <div className="d-flex justify-content-end mt-4 pt-3 border-top">
                  <button type="submit" className="btn btn-primary btn-sm fw-semibold d-flex align-items-center gap-1">
                    <i className="bi bi-save"></i> Guardar Cambios
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Seguridad y Permisos */}
        <div className="col-12 col-lg-5">
          {/* Tarjeta de Permisos Activos */}
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-header bg-white border-bottom py-3">
              <h6 className="fw-bold text-dark m-0">
                <i className="bi bi-shield-check text-success me-2"></i> Permisos de la Cuenta
              </h6>
            </div>
            <div className="card-body p-3">
              <ul className="list-group list-group-flush small">
                <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                  <span>Acceso a Dashboard</span>
                  <span className="badge bg-success"><i className="bi bi-check"></i> Habilitado</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                  <span>Consulta de Productos y Stock</span>
                  <span className="badge bg-success"><i className="bi bi-check"></i> Habilitado</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                  <span>Visualización y Emisión de Boletas</span>
                  <span className="badge bg-success"><i className="bi bi-check"></i> Habilitado</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                  <span>Crear / Editar / Eliminar Productos</span>
                  <span className={`badge ${esAdmin ? 'bg-success' : 'bg-secondary'}`}>
                    {esAdmin ? 'Habilitado' : 'Solo Lectura'}
                  </span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                  <span>Gestión de Cuentas de Usuario</span>
                  <span className={`badge ${esAdmin ? 'bg-success' : 'bg-danger'}`}>
                    {esAdmin ? 'Habilitado' : 'Bloqueado'}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Tarjeta de Cambio de Contraseña */}
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white border-bottom py-3">
              <h6 className="fw-bold text-dark m-0">
                <i className="bi bi-key text-warning me-2"></i> Cambiar Contraseña
              </h6>
            </div>
            <div className="card-body p-4">
              {alertaPassword && (
                <div className="alert alert-success py-2 px-3 small d-flex align-items-center gap-2 mb-3">
                  <i className="bi bi-check-circle-fill"></i>
                  {alertaPassword}
                </div>
              )}
              {errorPassword && (
                <div className="alert alert-danger py-2 px-3 small d-flex align-items-center gap-2 mb-3">
                  <i className="bi bi-exclamation-triangle-fill"></i>
                  {errorPassword}
                </div>
              )}

              <form onSubmit={handleCambiarPassword}>
                <div className="mb-2">
                  <label className="form-label small fw-semibold">Contraseña Actual</label>
                  <input
                    type="password"
                    className="form-control form-control-sm"
                    value={passwordData.actual}
                    onChange={(e) => setPasswordData({ ...passwordData, actual: e.target.value })}
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label small fw-semibold">Nueva Contraseña</label>
                  <input
                    type="password"
                    className="form-control form-control-sm"
                    value={passwordData.nueva}
                    onChange={(e) => setPasswordData({ ...passwordData, nueva: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Confirmar Nueva Contraseña</label>
                  <input
                    type="password"
                    className="form-control form-control-sm"
                    value={passwordData.confirmacion}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmacion: e.target.value })}
                  />
                </div>
                <button type="submit" className="btn btn-outline-primary btn-sm w-100 fw-semibold">
                  Actualizar Contraseña
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPerfil;
