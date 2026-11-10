import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  crearUsuario,
  obtenerUsuarioPorRun,
  obtenerUsuarioPorCorreo
} from '../data/usuarios';
import { REGIONES_Y_COMUNAS, obtenerComunasPorRegion } from '../data/regiones';
import {
  esCorreoInstitucionalValido,
  esClaveValida,
  esRunValido,
  esTextoAlfabeticoValido,
  formatearRunGuion
} from '../utils/validaciones';

function validarCampoRegistro(campo, valores) {
  switch (campo) {
    case 'run': {
      const valor = (valores.run || '').trim();
      if (!valor) return 'El RUN es obligatorio.';
      if (!esRunValido(valor)) {
        return 'Debe ingresar un RUN chileno válido sin puntos (ej: 12345678-5).';
      }
      if (obtenerUsuarioPorRun(valor)) {
        return 'Este RUN ya se encuentra registrado en la plataforma.';
      }
      return '';
    }
    case 'nombre': {
      const valor = (valores.nombre || '').trim();
      if (!valor) return 'El campo nombre es obligatorio.';
      if (!esTextoAlfabeticoValido(valor, 2)) {
        return 'Ingrese un nombre válido (mínimo 2 letras, sin números).';
      }
      return '';
    }
    case 'apellidos': {
      const valor = (valores.apellidos || '').trim();
      if (!valor) return 'El campo apellidos es obligatorio.';
      if (!esTextoAlfabeticoValido(valor, 2)) {
        return 'Ingrese apellidos válidos (mínimo 2 letras, sin números).';
      }
      return '';
    }
    case 'correo': {
      const valor = (valores.correo || '').trim();
      if (!valor) return 'El correo electrónico es obligatorio.';
      if (!esCorreoInstitucionalValido(valor)) {
        return 'Solo se aceptan correos con dominios @duoc.cl, @profesor.duoc.cl o @gmail.com';
      }
      if (obtenerUsuarioPorCorreo(valor)) {
        return 'Este correo electrónico ya está registrado en la tienda.';
      }
      return '';
    }
    case 'clave': {
      const valor = valores.clave || '';
      if (!valor) return 'La contraseña es obligatoria.';
      if (!esClaveValida(valor)) {
        return 'La contraseña debe tener entre 4 y 10 caracteres.';
      }
      return '';
    }
    case 'confirmarClave': {
      const confirmar = valores.confirmarClave || '';
      if (!confirmar) return 'Debe confirmar su contraseña.';
      if (confirmar !== (valores.clave || '')) {
        return 'Las contraseñas no coinciden.';
      }
      return '';
    }
    case 'region': {
      return valores.region ? '' : 'Debe seleccionar una región de Chile.';
    }
    case 'comuna': {
      return valores.comuna ? '' : 'Debe seleccionar una comuna.';
    }
    case 'direccion': {
      const valor = (valores.direccion || '').trim();
      if (!valor) return 'La dirección es obligatoria.';
      if (valor.length < 5) {
        return 'La dirección debe ser descriptiva (mínimo 5 caracteres).';
      }
      return '';
    }
    case 'terminos': {
      return valores.terminos ? '' : 'Debe aceptar los términos y condiciones para continuar.';
    }
    default:
      return '';
  }
}

function Registro() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Registro de Usuario - LogisTrack Store';
  }, []);

  const [valores, setValores] = useState({
    run: '',
    nombre: '',
    apellidos: '',
    correo: '',
    clave: '',
    confirmarClave: '',
    region: '',
    comuna: '',
    direccion: '',
    terminos: false
  });
  const [errores, setErrores] = useState({});
  const [tocado, setTocado] = useState({});
  const [mostrarClave, setMostrarClave] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
  const [alerta, setAlerta] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [modalTerminosAbierto, setModalTerminosAbierto] = useState(false);

  const comunasDisponibles = obtenerComunasPorRegion(valores.region);

  const handleChange = (campo) => (e) => {
    const valor = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    const nuevosValores = { ...valores, [campo]: valor };

    // Si cambia la región, resetear la comuna seleccionada
    if (campo === 'region') {
      nuevosValores.comuna = '';
    }

    setValores(nuevosValores);

    if (tocado[campo] || campo === 'region' || campo === 'comuna' || campo === 'terminos') {
      const nuevosErrores = {
        ...errores,
        [campo]: validarCampoRegistro(campo, nuevosValores)
      };
      if (campo === 'clave' && tocado.confirmarClave) {
        nuevosErrores.confirmarClave = validarCampoRegistro('confirmarClave', nuevosValores);
      }
      setErrores(nuevosErrores);
    }
  };

  const handleBlur = (campo) => () => {
    let valoresActualizados = valores;
    if (campo === 'run' && valores.run && esRunValido(valores.run)) {
      valoresActualizados = { ...valores, run: formatearRunGuion(valores.run) };
      setValores(valoresActualizados);
    }

    setTocado((prev) => ({ ...prev, [campo]: true }));
    setErrores((prev) => ({
      ...prev,
      [campo]: validarCampoRegistro(campo, valoresActualizados)
    }));
  };

  const claseCampo = (campo, base = 'form-control') => {
    if (!tocado[campo]) return base;
    return `${base} ${errores[campo] ? 'is-invalid' : 'is-valid'}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const campos = [
      'run',
      'nombre',
      'apellidos',
      'correo',
      'clave',
      'confirmarClave',
      'region',
      'comuna',
      'direccion',
      'terminos'
    ];

    const nuevosErrores = {};
    const nuevosTocados = {};
    campos.forEach((c) => {
      nuevosErrores[c] = validarCampoRegistro(c, valores);
      nuevosTocados[c] = true;
    });

    setErrores(nuevosErrores);
    setTocado(nuevosTocados);

    const formularioValido = Object.values(nuevosErrores).every((msg) => !msg);
    if (!formularioValido) {
      setAlerta({
        tipo: 'danger',
        mensaje: 'Por favor revise los campos destacados con errores antes de continuar.'
      });
      return;
    }

    try {
      setEnviando(true);
      const creado = crearUsuario({
        run: valores.run,
        nombre: valores.nombre,
        apellidos: valores.apellidos,
        correo: valores.correo,
        clave: valores.clave,
        region: valores.region,
        comuna: valores.comuna,
        direccion: valores.direccion,
        rol: 'Cliente'
      });

      setAlerta({
        tipo: 'success',
        mensaje: `¡Cuenta creada exitosamente para ${creado.nombre} ${creado.apellidos}! Redirigiendo al inicio de sesión...`
      });

      setTimeout(() => {
        navigate('/login');
      }, 1200);
    } catch (err) {
      setEnviando(false);
      setAlerta({
        tipo: 'danger',
        mensaje: err.message || 'Ocurrió un error al registrar la cuenta.'
      });
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-lg-9 col-xl-8">
        <div className="card shadow-sm border-0 rounded-4 p-4 p-md-5 bg-white">
          <div className="text-center mb-4">
            <div
              className="d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary rounded-circle mb-3"
              style={{ width: '64px', height: '64px' }}
            >
              <i className="bi bi-person-plus-fill fs-2"></i>
            </div>
            <h1 className="h3 fw-bold text-navy">Crear Nueva Cuenta</h1>
            <p className="text-muted small mb-0">
              Completa tus datos para registrarte como cliente en LogisTrack Store
            </p>
          </div>

          {alerta && (
            <div className={`alert alert-${alerta.tipo} alert-dismissible fade show`} role="alert">
              <span>{alerta.mensaje}</span>
              <button
                type="button"
                className="btn-close"
                aria-label="Cerrar"
                onClick={() => setAlerta(null)}
              ></button>
            </div>
          )}

          <form id="formRegistro" noValidate onSubmit={handleSubmit}>
            {/* RUN */}
            <div className="row g-3 mb-3">
              <div className="col-md-12">
                <label htmlFor="regRun" className="form-label">
                  RUN / RUT <span className="campo-obligatorio">*</span>
                </label>
                <div className="input-group has-validation">
                  <span className="input-group-text bg-light text-muted">
                    <i className="bi bi-card-text"></i>
                  </span>
                  <input
                    type="text"
                    className={claseCampo('run')}
                    id="regRun"
                    placeholder="12345678-5"
                    maxLength={10}
                    autoComplete="off"
                    value={valores.run}
                    onChange={handleChange('run')}
                    onBlur={handleBlur('run')}
                    required
                  />
                  {tocado.run && errores.run && (
                    <div className="invalid-feedback">{errores.run}</div>
                  )}
                  {tocado.run && !errores.run && (
                    <div className="valid-feedback">RUN válido.</div>
                  )}
                </div>
                <div className="form-text small text-muted">
                  Ingrese RUN en formato xxxxxxxx-x (sin puntos y con guión, ej: 12345678-5).
                </div>
              </div>
            </div>

            {/* Nombres y Apellidos */}
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label htmlFor="regNombre" className="form-label">
                  Nombre <span className="campo-obligatorio">*</span>
                </label>
                <div className="input-group has-validation">
                  <span className="input-group-text bg-light text-muted">
                    <i className="bi bi-person"></i>
                  </span>
                  <input
                    type="text"
                    className={claseCampo('nombre')}
                    id="regNombre"
                    placeholder="Ej: Juan"
                    autoComplete="given-name"
                    value={valores.nombre}
                    onChange={handleChange('nombre')}
                    onBlur={handleBlur('nombre')}
                    required
                  />
                  {tocado.nombre && errores.nombre && (
                    <div className="invalid-feedback">{errores.nombre}</div>
                  )}
                </div>
              </div>

              <div className="col-md-6">
                <label htmlFor="regApellidos" className="form-label">
                  Apellidos <span className="campo-obligatorio">*</span>
                </label>
                <div className="input-group has-validation">
                  <span className="input-group-text bg-light text-muted">
                    <i className="bi bi-person"></i>
                  </span>
                  <input
                    type="text"
                    className={claseCampo('apellidos')}
                    id="regApellidos"
                    placeholder="Ej: Pérez Soto"
                    autoComplete="family-name"
                    value={valores.apellidos}
                    onChange={handleChange('apellidos')}
                    onBlur={handleBlur('apellidos')}
                    required
                  />
                  {tocado.apellidos && errores.apellidos && (
                    <div className="invalid-feedback">{errores.apellidos}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Correo Electrónico */}
            <div className="row g-3 mb-3">
              <div className="col-md-12">
                <label htmlFor="regCorreo" className="form-label">
                  Correo Electrónico <span className="campo-obligatorio">*</span>
                </label>
                <div className="input-group has-validation">
                  <span className="input-group-text bg-light text-muted">
                    <i className="bi bi-envelope"></i>
                  </span>
                  <input
                    type="email"
                    className={claseCampo('correo')}
                    id="regCorreo"
                    placeholder="ejemplo@duoc.cl"
                    autoComplete="email"
                    value={valores.correo}
                    onChange={handleChange('correo')}
                    onBlur={handleBlur('correo')}
                    required
                  />
                  {tocado.correo && errores.correo && (
                    <div className="invalid-feedback">{errores.correo}</div>
                  )}
                  {tocado.correo && !errores.correo && (
                    <div className="valid-feedback">Correo institucional / gmail válido.</div>
                  )}
                </div>
                <div className="form-text small text-muted">
                  Dominios permitidos: @duoc.cl, @profesor.duoc.cl o @gmail.com
                </div>
              </div>
            </div>

            {/* Contraseña y Confirmación */}
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label htmlFor="regClave" className="form-label">
                  Contraseña <span className="campo-obligatorio">*</span>
                </label>
                <div className="input-group has-validation">
                  <span className="input-group-text bg-light text-muted">
                    <i className="bi bi-lock"></i>
                  </span>
                  <input
                    type={mostrarClave ? 'text' : 'password'}
                    className={claseCampo('clave')}
                    id="regClave"
                    placeholder="De 4 a 10 caracteres"
                    maxLength={10}
                    autoComplete="new-password"
                    value={valores.clave}
                    onChange={handleChange('clave')}
                    onBlur={handleBlur('clave')}
                    required
                  />
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    aria-label="Mostrar u ocultar contraseña"
                    onClick={() => setMostrarClave((prev) => !prev)}
                  >
                    <i className={`bi ${mostrarClave ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                  </button>
                  {tocado.clave && errores.clave && (
                    <div className="invalid-feedback">{errores.clave}</div>
                  )}
                </div>
                <div className="form-text small text-muted">Entre 4 y 10 caracteres.</div>
              </div>

              <div className="col-md-6">
                <label htmlFor="regConfirmarClave" className="form-label">
                  Confirmar Contraseña <span className="campo-obligatorio">*</span>
                </label>
                <div className="input-group has-validation">
                  <span className="input-group-text bg-light text-muted">
                    <i className="bi bi-shield-lock"></i>
                  </span>
                  <input
                    type={mostrarConfirmar ? 'text' : 'password'}
                    className={claseCampo('confirmarClave')}
                    id="regConfirmarClave"
                    placeholder="Repite tu contraseña"
                    maxLength={10}
                    autoComplete="new-password"
                    value={valores.confirmarClave}
                    onChange={handleChange('confirmarClave')}
                    onBlur={handleBlur('confirmarClave')}
                    required
                  />
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    aria-label="Mostrar u ocultar confirmación"
                    onClick={() => setMostrarConfirmar((prev) => !prev)}
                  >
                    <i className={`bi ${mostrarConfirmar ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                  </button>
                  {tocado.confirmarClave && errores.confirmarClave && (
                    <div className="invalid-feedback">{errores.confirmarClave}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Región y Comuna (Selects Encadenados) */}
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label htmlFor="regRegion" className="form-label">
                  Región <span className="campo-obligatorio">*</span>
                </label>
                <div className="input-group has-validation">
                  <span className="input-group-text bg-light text-muted">
                    <i className="bi bi-geo-alt"></i>
                  </span>
                  <select
                    className={claseCampo('region', 'form-select')}
                    id="regRegion"
                    value={valores.region}
                    onChange={handleChange('region')}
                    onBlur={handleBlur('region')}
                    required
                  >
                    <option value="">-- Seleccione una región --</option>
                    {REGIONES_Y_COMUNAS.map((item) => (
                      <option key={item.region} value={item.region}>
                        {item.region}
                      </option>
                    ))}
                  </select>
                  {tocado.region && errores.region && (
                    <div className="invalid-feedback">{errores.region}</div>
                  )}
                </div>
              </div>

              <div className="col-md-6">
                <label htmlFor="regComuna" className="form-label">
                  Comuna <span className="campo-obligatorio">*</span>
                </label>
                <div className="input-group has-validation">
                  <span className="input-group-text bg-light text-muted">
                    <i className="bi bi-pin-map"></i>
                  </span>
                  <select
                    className={claseCampo('comuna', 'form-select')}
                    id="regComuna"
                    value={valores.comuna}
                    onChange={handleChange('comuna')}
                    onBlur={handleBlur('comuna')}
                    disabled={!valores.region}
                    required
                  >
                    <option value="">
                      {valores.region
                        ? '-- Seleccione una comuna --'
                        : '-- Seleccione primero una región --'}
                    </option>
                    {comunasDisponibles.map((comuna) => (
                      <option key={comuna} value={comuna}>
                        {comuna}
                      </option>
                    ))}
                  </select>
                  {tocado.comuna && errores.comuna && (
                    <div className="invalid-feedback">{errores.comuna}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Dirección */}
            <div className="row g-3 mb-3">
              <div className="col-md-12">
                <label htmlFor="regDireccion" className="form-label">
                  Dirección <span className="campo-obligatorio">*</span>
                </label>
                <div className="input-group has-validation">
                  <span className="input-group-text bg-light text-muted">
                    <i className="bi bi-house-door"></i>
                  </span>
                  <input
                    type="text"
                    className={claseCampo('direccion')}
                    id="regDireccion"
                    placeholder="Ej: Av. Providencia 1234, Depto 502"
                    autoComplete="street-address"
                    value={valores.direccion}
                    onChange={handleChange('direccion')}
                    onBlur={handleBlur('direccion')}
                    required
                  />
                  {tocado.direccion && errores.direccion && (
                    <div className="invalid-feedback">{errores.direccion}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Términos y Condiciones */}
            <div className="mb-4">
              <div className="form-check">
                <input
                  className={`form-check-input ${
                    tocado.terminos ? (errores.terminos ? 'is-invalid' : 'is-valid') : ''
                  }`}
                  type="checkbox"
                  id="regTerminos"
                  checked={valores.terminos}
                  onChange={handleChange('terminos')}
                  required
                />
                <label className="form-check-label small text-muted" htmlFor="regTerminos">
                  Declaro que la información proporcionada es verídica y acepto los{' '}
                  <button
                    type="button"
                    className="btn btn-link p-0 align-baseline text-decoration-none text-primary small"
                    onClick={() => setModalTerminosAbierto(true)}
                  >
                    términos de servicio y privacidad
                  </button>{' '}
                  de LogisTrack. <span className="campo-obligatorio">*</span>
                </label>
                {tocado.terminos && errores.terminos && (
                  <div className="invalid-feedback d-block">{errores.terminos}</div>
                )}
              </div>
            </div>

            {/* Botón Submit */}
            <div className="d-grid mb-3">
              <button
                type="submit"
                className="btn btn-brand py-2 shadow-sm"
                id="btnSubmitRegistro"
                disabled={enviando}
              >
                {enviando ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Registrando usuario...
                  </>
                ) : (
                  <>
                    <i className="bi bi-person-check me-2"></i>Crear Cuenta de Usuario
                  </>
                )}
              </button>
            </div>

            {/* Enlace al Login */}
            <div className="text-center pt-2 border-top">
              <p className="small text-muted mb-0">
                ¿Ya posees una cuenta registrada?
                <Link to="/login" className="fw-semibold text-primary text-decoration-none ms-1">
                  Inicia sesión aquí
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Modal Términos y Condiciones */}
      {modalTerminosAbierto && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="modalTerminosLabel"
          style={{ backgroundColor: 'rgba(15, 43, 72, 0.5)' }}
        >
          <div className="modal-dialog modal-dialog-scrollable modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold text-navy" id="modalTerminosLabel">
                  Términos y Condiciones
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Cerrar"
                  onClick={() => setModalTerminosAbierto(false)}
                ></button>
              </div>
              <div className="modal-body py-4">
                <p className="small text-muted">
                  LogisTrack Store es una plataforma orientada a la comercialización y despacho de
                  productos tecnológicos e insumos.
                </p>
                <h6 className="fw-bold small text-navy">1. Privacidad y Seguridad</h6>
                <p className="small text-muted">
                  Los datos ingresados como RUN, correo, dirección y compras se gestionan de forma
                  confidencial y segura.
                </p>
                <h6 className="fw-bold small text-navy">2. Validez Institucional</h6>
                <p className="small text-muted mb-0">
                  El acceso con dominios @duoc.cl y @profesor.duoc.cl otorga beneficios
                  promocionales especiales para la comunidad Duoc UC.
                </p>
              </div>
              <div className="modal-footer border-0 pt-0">
                <button
                  type="button"
                  className="btn btn-brand"
                  onClick={() => setModalTerminosAbierto(false)}
                >
                  Entendido
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Registro;
