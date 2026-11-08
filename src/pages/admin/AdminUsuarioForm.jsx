import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  obtenerUsuarioPorRun,
  crearUsuario,
  actualizarUsuario,
  validarRunChileno,
  formatearRunVisual,
  normalizarRun,
  ROLES_DISPONIBLES,
  obtenerRolActivo
} from '../../data/usuarios';

function AdminUsuarioForm() {
  const { run } = useParams();
  const navigate = useNavigate();
  const esEdicion = Boolean(run);

  const [rolActual] = useState(obtenerRolActivo());

  const [formData, setFormData] = useState({
    run: '',
    nombre: '',
    apellidos: '',
    correo: '',
    telefono: '',
    rol: 'Cliente'
  });

  const [errores, setErrores] = useState({});
  const [errorGlobal, setErrorGlobal] = useState('');
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (esEdicion) {
      const u = obtenerUsuarioPorRun(run);
      if (u) {
        setFormData({
          run: u.run || '',
          nombre: u.nombre || '',
          apellidos: u.apellidos || '',
          correo: u.correo || '',
          telefono: u.telefono || '',
          rol: u.rol || 'Cliente'
        });
      } else {
        setErrorGlobal(`No se encontró ningún usuario con el RUN "${run}".`);
      }
    }
  }, [run, esEdicion]);

  // Si no es Administrador, bloquear acceso
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

    // Validar RUN
    const runLimpio = normalizarRun(formData.run);
    if (!runLimpio) {
      nuevosErrores.run = 'El RUN es obligatorio.';
    } else if (!esEdicion && !validarRunChileno(runLimpio)) {
      nuevosErrores.run = 'El RUN ingresado no es válido (verifique formato y dígito verificador).';
    }

    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es obligatorio.';
    } else if (formData.nombre.trim().length < 2) {
      nuevosErrores.nombre = 'El nombre debe tener al menos 2 caracteres.';
    }

    if (!formData.apellidos.trim()) {
      nuevosErrores.apellidos = 'Los apellidos son obligatorios.';
    } else if (formData.apellidos.trim().length < 2) {
      nuevosErrores.apellidos = 'Los apellidos deben tener al menos 2 caracteres.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.correo.trim()) {
      nuevosErrores.correo = 'El correo electrónico es obligatorio.';
    } else if (!emailRegex.test(formData.correo.trim())) {
      nuevosErrores.correo = 'El formato del correo electrónico no es válido.';
    }

    if (!formData.rol) {
      nuevosErrores.rol = 'Debes asignar un rol al usuario.';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      setErrorGlobal('Por favor corrige los campos marcados en rojo antes de guardar.');
      return;
    }

    try {
      setGuardando(true);
      setErrorGlobal('');

      if (esEdicion) {
        actualizarUsuario(run, formData);
      } else {
        crearUsuario(formData);
      }

      navigate('/admin/usuarios', { replace: true });
    } catch (err) {
      setErrorGlobal(err.message || 'Error al guardar el usuario.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div>
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb small">
          <li className="breadcrumb-item"><Link to="/admin">Dashboard</Link></li>
          <li className="breadcrumb-item"><Link to="/admin/usuarios">Usuarios</Link></li>
          <li className="breadcrumb-item active" aria-current="page">
            {esEdicion ? `Editar (${formatearRunVisual(run)})` : 'Nuevo Usuario'}
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
              {/* RUN */}
              <div className="col-12 col-md-4">
                <label className="form-label fw-semibold small">RUN (Identificador Único) *</label>
                <input
                  type="text"
                  name="run"
                  className={`form-control font-monospace ${errores.run ? 'is-invalid' : ''}`}
                  placeholder="Ej: 19011022K"
                  value={formData.run}
                  onChange={handleChange}
                  disabled={esEdicion}
                />
                {errores.run && <div className="invalid-feedback">{errores.run}</div>}
                {esEdicion ? (
                  <small className="text-muted">El RUN es la clave primaria y no se puede modificar.</small>
                ) : (
                  <small className="text-muted">Ingresa sin puntos ni guión (ej: 19011022K).</small>
                )}
              </div>

              {/* Nombre */}
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

              {/* Apellidos */}
              <div className="col-12 col-md-4">
                <label className="form-label fw-semibold small">Apellidos *</label>
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

              {/* Correo Electrónico */}
              <div className="col-12 col-md-5">
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

              {/* Teléfono */}
              <div className="col-12 col-md-4">
                <label className="form-label fw-semibold small">Teléfono de Contacto</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-telephone"></i></span>
                  <input
                    type="text"
                    name="telefono"
                    className="form-control"
                    placeholder="+56 9 1234 5678"
                    value={formData.telefono}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Rol Asignado */}
              <div className="col-12 col-md-3">
                <label className="form-label fw-semibold small">Rol en el Sistema *</label>
                <select
                  name="rol"
                  className={`form-select ${errores.rol ? 'is-invalid' : ''}`}
                  value={formData.rol}
                  onChange={handleChange}
                >
                  {ROLES_DISPONIBLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
                {errores.rol && <div className="invalid-feedback">{errores.rol}</div>}
              </div>
            </div>

            {/* Acciones */}
            <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
              <Link to="/admin/usuarios" className="btn btn-outline-secondary btn-sm">
                Cancelar
              </Link>
              <button
                type="submit"
                className="btn btn-primary btn-sm fw-semibold d-flex align-items-center gap-1"
                disabled={guardando}
              >
                <i className="bi bi-save"></i>
                {guardando ? 'Guardando...' : esEdicion ? 'Actualizar Cuenta' : 'Crear Usuario'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminUsuarioForm;
