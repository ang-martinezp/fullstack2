import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  obtenerUsuarioPorId,
  crearUsuario,
  actualizarUsuario,
  ROLES_USUARIO_BACKEND
} from '../../services/adminUsuarioService';
import { obtenerRolActual } from '../../services/authService';

function AdminUsuarioForm() {
  const { run: idParam } = useParams();
  const navigate = useNavigate();
  const esEdicion = Boolean(idParam);

  const [rolActual] = useState(obtenerRolActual());

  const [formData, setFormData] = useState({
    username: '',
    nombre: '',
    apellidos: '',
    correo: '',
    rol: 'Cliente'
  });

  const [errores, setErrores] = useState({});
  const [errorGlobal, setErrorGlobal] = useState('');
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    const cargarUsuario = async () => {
      if (!esEdicion) return;
      try {
        const u = await obtenerUsuarioPorId(idParam);
        setFormData({
          username: u.username || '',
          nombre: u.nombre || '',
          apellidos: u.apellidos || '',
          correo: u.correo || '',
          rol: u.rol || 'Cliente'
        });
      } catch (err) {
        setErrorGlobal(err.message || `No se encontró ningún usuario con ID "${idParam}".`);
      }
    };
    cargarUsuario();
  }, [idParam, esEdicion]);

  if (rolActual === 'Vendedor') {
    return (
      <div className="alert alert-danger shadow-sm py-4 text-center">
        <i className="bi bi-shield-lock-fill fs-1 text-danger d-block mb-2"></i>
        <h5 className="fw-bold">Acceso Denegado</h5>
        <p className="mb-3">Los usuarios con perfil "Vendedor" no tienen permisos para crear o editar usuarios.</p>
        <Link to="/admin/productos" className="btn btn-primary btn-sm">
          Volver a Productos
        </Link>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errores[name]) {
      setErrores((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};
    if (!formData.username.trim() || formData.username.trim().length < 3) {
      nuevosErrores.username = 'El username debe tener al menos 3 caracteres.';
    }
    if (!formData.nombre.trim() || formData.nombre.trim().length < 2) {
      nuevosErrores.nombre = 'El nombre debe tener al menos 2 caracteres.';
    }
    if (!formData.apellidos.trim() || formData.apellidos.trim().length < 2) {
      nuevosErrores.apellidos = 'El apellido es obligatorio.';
    }
    if (!formData.correo.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
      nuevosErrores.correo = 'Ingresa un correo electrónico válido.';
    }
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) {
      setErrorGlobal('Por favor corrige los errores marcados antes de guardar.');
      return;
    }

    try {
      setGuardando(true);
      setErrorGlobal('');
      if (esEdicion) {
        await actualizarUsuario(idParam, formData);
      } else {
        await crearUsuario(formData);
      }
      navigate('/admin/usuarios', { replace: true });
    } catch (err) {
      setErrorGlobal(err.message || 'Ocurrió un error al guardar el usuario.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div>
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb small">
          <li className="breadcrumb-item"><Link to="/admin">Dashboard</Link></li>
          <li className="breadcrumb-item"><Link to="/admin/usuarios">Usuarios</Link></li>
          <li className="breadcrumb-item active" aria-current="page">
            {esEdicion ? `Editar (#${idParam})` : 'Nuevo Usuario'}
          </li>
        </ol>
      </nav>

      <div className="card shadow-sm border-0">
        <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
          <h6 className="fw-bold text-dark m-0">
            <i className={`bi ${esEdicion ? 'bi-person-gear' : 'bi-person-plus-fill'} me-2 text-primary`}></i>
            {esEdicion ? `Modificar Cuenta: ${formData.nombre} ${formData.apellidos}` : 'Registro de Nueva Cuenta de Usuario'}
          </h6>
          <span className="text-muted small">* Campos obligatorios</span>
        </div>

        <div className="card-body p-4">
          {errorGlobal && (
            <div className="alert alert-danger py-2 px-3 small d-flex align-items-center gap-2 mb-4" role="alert">
              <i className="bi bi-exclamation-triangle-fill fs-5"></i>
              <div>{errorGlobal}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="row g-3">
              <div className="col-12 col-md-4">
                <label className="form-label fw-semibold small">Username *</label>
                <input
                  type="text"
                  name="username"
                  className={`form-control font-monospace ${errores.username ? 'is-invalid' : ''}`}
                  placeholder="Ej: jperez"
                  value={formData.username}
                  onChange={handleChange}
                />
                {errores.username && <div className="invalid-feedback">{errores.username}</div>}
              </div>

              <div className="col-12 col-md-4">
                <label className="form-label fw-semibold small">Nombre *</label>
                <input
                  type="text"
                  name="nombre"
                  className={`form-control ${errores.nombre ? 'is-invalid' : ''}`}
                  placeholder="Ej: Oliver"
                  value={formData.nombre}
                  onChange={handleChange}
                />
                {errores.nombre && <div className="invalid-feedback">{errores.nombre}</div>}
              </div>

              <div className="col-12 col-md-4">
                <label className="form-label fw-semibold small">Apellido *</label>
                <input
                  type="text"
                  name="apellidos"
                  className={`form-control ${errores.apellidos ? 'is-invalid' : ''}`}
                  placeholder="Ej: Duncan"
                  value={formData.apellidos}
                  onChange={handleChange}
                />
                {errores.apellidos && <div className="invalid-feedback">{errores.apellidos}</div>}
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold small">Correo Electrónico *</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-envelope"></i></span>
                  <input
                    type="email"
                    name="correo"
                    className={`form-control ${errores.correo ? 'is-invalid' : ''}`}
                    placeholder="usuario@duoc.cl"
                    value={formData.correo}
                    onChange={handleChange}
                  />
                  {errores.correo && <div className="invalid-feedback">{errores.correo}</div>}
                </div>
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold small">Rol Asignado *</label>
                <select
                  name="rol"
                  className="form-select"
                  value={formData.rol}
                  onChange={handleChange}
                >
                  {ROLES_USUARIO_BACKEND.map((r) => (
                    <option key={r.value} value={r.label}>
                      {r.label} ({r.value})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
              <Link to="/admin/usuarios" className="btn btn-outline-secondary">
                Cancelar
              </Link>
              <button type="submit" className="btn btn-primary fw-semibold px-4" disabled={guardando}>
                {guardando ? 'Guardando...' : esEdicion ? 'Actualizar Usuario' : 'Registrar Usuario'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminUsuarioForm;
