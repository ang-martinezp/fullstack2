import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { autenticarUsuario } from '../data/usuarios';
import { esCorreoInstitucionalValido, esClaveValida } from '../utils/validaciones';

function validarCampoLogin(campo, valores) {
  switch (campo) {
    case 'correo': {
      const valor = (valores.correo || '').trim();
      if (!valor) return 'El correo electrónico es obligatorio.';
      if (!esCorreoInstitucionalValido(valor)) {
        return 'Debe ingresar un correo válido con dominio @duoc.cl, @profesor.duoc.cl o @gmail.com';
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
    default:
      return '';
  }
}

function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Iniciar Sesión - LogisTrack Store';
  }, []);

  const [valores, setValores] = useState({
    correo: '',
    clave: '',
    recordar: false
  });
  const [errores, setErrores] = useState({});
  const [tocado, setTocado] = useState({});
  const [mostrarClave, setMostrarClave] = useState(false);
  const [alerta, setAlerta] = useState(null);
  const [enviando, setEnviando] = useState(false);

  // Estado del modal de recuperación de contraseña
  const [modalRecuperarAbierto, setModalRecuperarAbierto] = useState(false);
  const [recuperarCorreo, setRecuperarCorreo] = useState('');
  const [mensajeRecuperacion, setMensajeRecuperacion] = useState(null);

  const handleChange = (campo) => (e) => {
    const nuevoValor = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    const actualizados = { ...valores, [campo]: nuevoValor };
    setValores(actualizados);

    if (tocado[campo]) {
      setErrores((prev) => ({
        ...prev,
        [campo]: validarCampoLogin(campo, actualizados)
      }));
    }
  };

  const handleBlur = (campo) => () => {
    setTocado((prev) => ({ ...prev, [campo]: true }));
    setErrores((prev) => ({
      ...prev,
      [campo]: validarCampoLogin(campo, valores)
    }));
  };

  const claseCampo = (campo) => {
    if (!tocado[campo]) return 'form-control';
    return `form-control ${errores[campo] ? 'is-invalid' : 'is-valid'}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const errorCorreo = validarCampoLogin('correo', valores);
    const errorClave = validarCampoLogin('clave', valores);
    const nuevosErrores = { correo: errorCorreo, clave: errorClave };

    setErrores(nuevosErrores);
    setTocado({ correo: true, clave: true });

    if (errorCorreo || errorClave) {
      setAlerta({
        tipo: 'danger',
        mensaje: 'Por favor, complete correctamente los campos requeridos.'
      });
      return;
    }

    const resultado = autenticarUsuario(valores.correo, valores.clave);
    if (!resultado.exito) {
      setErrores((prev) => ({ ...prev, clave: resultado.error }));
      setAlerta({
        tipo: 'danger',
        mensaje: resultado.error
      });
      return;
    }

    const { usuario } = resultado;
    const destino =
      usuario.rol === 'Administrador' || usuario.rol === 'Vendedor' ? '/admin' : '/';

    setEnviando(true);
    setAlerta({
      tipo: 'success',
      mensaje: `¡Bienvenido/a, ${usuario.nombre}! Has iniciado sesión como ${usuario.rol}. Redirigiendo...`
    });

    setTimeout(() => {
      navigate(destino);
    }, 900);
  };

  const handleRecuperarClave = (e) => {
    e.preventDefault();
    const correo = recuperarCorreo.trim();
    if (!correo || !esCorreoInstitucionalValido(correo)) {
      setMensajeRecuperacion({
        tipo: 'danger',
        texto: 'Por favor, ingresa un correo válido (@duoc.cl, @profesor.duoc.cl o @gmail.com).'
      });
      return;
    }
    setMensajeRecuperacion({
      tipo: 'success',
      texto: `Se han enviado las instrucciones de recuperación al correo: ${correo}`
    });
    setRecuperarCorreo('');
  };

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-sm-10 col-md-8 col-lg-5 col-xl-5">
        <div className="card shadow-sm border-0 rounded-4 p-4 p-md-5 bg-white">
          <div className="text-center mb-4">
            <div
              className="d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary rounded-circle mb-3"
              style={{ width: '64px', height: '64px' }}
            >
              <i className="bi bi-person-circle fs-2"></i>
            </div>
            <h1 className="h4 fw-bold text-navy">Iniciar Sesión</h1>
            <p className="text-muted small mb-0">
              Ingresa tus credenciales para acceder a LogisTrack Store
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

          <form id="formLogin" noValidate onSubmit={handleSubmit}>
            {/* Correo Electrónico */}
            <div className="mb-3">
              <label htmlFor="loginCorreo" className="form-label">
                Correo Electrónico <span className="campo-obligatorio">*</span>
              </label>
              <div className="input-group has-validation">
                <span className="input-group-text bg-light text-muted">
                  <i className="bi bi-envelope"></i>
                </span>
                <input
                  type="email"
                  className={claseCampo('correo')}
                  id="loginCorreo"
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
              </div>
              <div className="form-text small text-muted">
                Dominios permitidos: @duoc.cl, @profesor.duoc.cl o @gmail.com
              </div>
            </div>

            {/* Contraseña */}
            <div className="mb-3">
              <label htmlFor="loginClave" className="form-label">
                Contraseña <span className="campo-obligatorio">*</span>
              </label>
              <div className="input-group has-validation">
                <span className="input-group-text bg-light text-muted">
                  <i className="bi bi-lock"></i>
                </span>
                <input
                  type={mostrarClave ? 'text' : 'password'}
                  className={claseCampo('clave')}
                  id="loginClave"
                  placeholder="Entre 4 y 10 caracteres"
                  maxLength={10}
                  autoComplete="current-password"
                  value={valores.clave}
                  onChange={handleChange('clave')}
                  onBlur={handleBlur('clave')}
                  required
                />
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  id="btnToggleClave"
                  aria-label="Mostrar u ocultar contraseña"
                  onClick={() => setMostrarClave((prev) => !prev)}
                >
                  <i className={`bi ${mostrarClave ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                </button>
                {tocado.clave && errores.clave && (
                  <div className="invalid-feedback">{errores.clave}</div>
                )}
              </div>
              <div className="form-text small text-muted">
                Longitud requerida: entre 4 y 10 caracteres
              </div>
            </div>

            {/* Opciones adicionales */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="recordarSesion"
                  checked={valores.recordar}
                  onChange={handleChange('recordar')}
                />
                <label className="form-check-label small text-muted" htmlFor="recordarSesion">
                  Recordarme
                </label>
              </div>
              <button
                type="button"
                className="btn btn-link p-0 text-decoration-none small text-primary"
                onClick={() => {
                  setMensajeRecuperacion(null);
                  setModalRecuperarAbierto(true);
                }}
              >
                ¿Olvidaste tu clave?
              </button>
            </div>

            {/* Botón Submit */}
            <div className="d-grid mb-3">
              <button
                type="submit"
                className="btn btn-brand py-2 shadow-sm"
                id="btnSubmitLogin"
                disabled={enviando}
              >
                {enviando ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Iniciando sesión...
                  </>
                ) : (
                  <>
                    <i className="bi bi-box-arrow-in-right me-2"></i>Iniciar Sesión
                  </>
                )}
              </button>
            </div>

            {/* Enlace a Registro */}
            <div className="text-center pt-2 border-top">
              <p className="small text-muted mb-0">
                ¿No tienes una cuenta aún?
                <Link to="/registro" className="fw-semibold text-primary text-decoration-none ms-1">
                  Registrarse aquí
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Modal de Recuperación de Contraseña */}
      {modalRecuperarAbierto && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="modalRecuperarLabel"
          style={{ backgroundColor: 'rgba(15, 43, 72, 0.5)' }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold text-navy" id="modalRecuperarLabel">
                  Recuperación de Contraseña
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Cerrar"
                  onClick={() => setModalRecuperarAbierto(false)}
                ></button>
              </div>
              <form onSubmit={handleRecuperarClave}>
                <div className="modal-body py-4">
                  <p className="text-muted small">
                    Ingresa tu correo institucional (@duoc.cl, @profesor.duoc.cl o @gmail.com) para
                    enviarte las instrucciones de restablecimiento de contraseña.
                  </p>
                  {mensajeRecuperacion && (
                    <div className={`alert alert-${mensajeRecuperacion.tipo} py-2 small`}>
                      {mensajeRecuperacion.texto}
                    </div>
                  )}
                  <div className="mb-2">
                    <label htmlFor="recuperarCorreo" className="form-label">
                      Correo registrado
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="recuperarCorreo"
                      placeholder="tu_correo@duoc.cl"
                      value={recuperarCorreo}
                      onChange={(e) => setRecuperarCorreo(e.target.value)}
                    />
                  </div>
                </div>
                <div className="modal-footer border-0 pt-0">
                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={() => setModalRecuperarAbierto(false)}
                  >
                    Cerrar
                  </button>
                  <button type="submit" className="btn btn-brand">
                    Enviar Instrucciones
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
