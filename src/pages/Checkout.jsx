import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  obtenerCarrito,
  vaciarCarrito,
  calcularTotalCarrito,
  CLAVE_ULTIMA_ORDEN
} from '../data/carrito';
import { obtenerSesionActiva } from '../data/usuarios';
import { crearOrden } from '../data/ordenes';
import { REGIONES_Y_COMUNAS, obtenerComunasPorRegion } from '../data/regiones';
import {
  esCorreoInstitucionalValido,
  esTextoAlfabeticoValido,
  formatearCLP
} from '../utils/validaciones';
import api, { extraerMensajeError } from '../services/api';

function validarFormularioCheckout(datos) {
  const errores = {};

  if (!(datos.nombre || '').trim()) {
    errores.nombre = 'El nombre del cliente es obligatorio.';
  } else if (!esTextoAlfabeticoValido(datos.nombre, 2)) {
    errores.nombre = 'Ingrese un nombre válido (mínimo 2 letras).';
  }

  if (!(datos.apellidos || '').trim()) {
    errores.apellidos = 'Los apellidos del cliente son obligatorios.';
  } else if (!esTextoAlfabeticoValido(datos.apellidos, 2)) {
    errores.apellidos = 'Ingrese apellidos válidos (mínimo 2 letras).';
  }

  if (!(datos.correo || '').trim()) {
    errores.correo = 'El correo electrónico es obligatorio.';
  } else if (!esCorreoInstitucionalValido(datos.correo)) {
    errores.correo = 'Ingrese un correo válido (@duoc.cl, @profesor.duoc.cl o @gmail.com).';
  }

  if (!(datos.calle || '').trim() || datos.calle.trim().length < 4) {
    errores.calle = 'Debe ingresar la calle y numeración de entrega (mín. 4 caracteres).';
  }

  if (!datos.region) {
    errores.region = 'Debe seleccionar una región.';
  }

  if (!datos.comuna) {
    errores.comuna = 'Debe seleccionar una comuna.';
  }

  return errores;
}

function obtenerDatosInicialesCheckout(sesionActiva, intentoPrevio = null) {
  if (intentoPrevio) {
    return {
      nombre: intentoPrevio.nombre || '',
      apellidos: intentoPrevio.apellidos || '',
      correo: intentoPrevio.correo || '',
      calle: intentoPrevio.calle || '',
      departamento: intentoPrevio.departamento || '',
      region: intentoPrevio.region || 'Metropolitana de Santiago',
      comuna: intentoPrevio.comuna || 'Cerrillos',
      indicaciones: intentoPrevio.indicaciones || ''
    };
  }

  if (sesionActiva) {
    const partesNombre = (sesionActiva.nombre || '').split(' ');
    const nombre = sesionActiva.nombre || partesNombre[0] || '';
    const apellidos = sesionActiva.apellidos || partesNombre.slice(1).join(' ') || 'Usuario';

    return {
      nombre,
      apellidos,
      correo: sesionActiva.correo || '',
      calle: sesionActiva.direccion || 'Av. Departamental 1234',
      departamento: '',
      region: sesionActiva.region || 'Metropolitana de Santiago',
      comuna: sesionActiva.comuna || 'Cerrillos',
      indicaciones: ''
    };
  }

  return {
    nombre: '',
    apellidos: '',
    correo: '',
    calle: '',
    departamento: '',
    region: 'Metropolitana de Santiago',
    comuna: 'Cerrillos',
    indicaciones: ''
  };
}

function Checkout() {
  const navigate = useNavigate();
  const [items] = useState(() => obtenerCarrito());
  const [sesion] = useState(() => obtenerSesionActiva());

  const [formData, setFormData] = useState(() => {
    let previo = null;
    try {
      const guardado = sessionStorage.getItem(CLAVE_ULTIMA_ORDEN);
      if (guardado) {
        const parsed = JSON.parse(guardado);
        if (parsed && parsed.estadoPago === 'ERROR') {
          previo = parsed.datosCliente;
        }
      }
    } catch {
      // Ignorar
    }
    return obtenerDatosInicialesCheckout(obtenerSesionActiva(), previo);
  });

  const [errores, setErrores] = useState({});
  const [alertaError, setAlertaError] = useState('');
  const [procesando, setProcesando] = useState(false);

  useEffect(() => {
    document.title = 'Checkout y Pago - LogisTrack Store';
  }, []);

  const total = calcularTotalCarrito(items);
  const comunasDisponibles = obtenerComunasPorRegion(formData.region);

  const handleChange = (campo) => (e) => {
    const valor = e.target.value;
    const nuevos = { ...formData, [campo]: valor };

    if (campo === 'region') {
      const nuevasComunas = obtenerComunasPorRegion(valor);
      nuevos.comuna = nuevasComunas[0] || '';
    }

    setFormData(nuevos);
    if (errores[campo]) {
      setErrores((prev) => ({ ...prev, [campo]: '' }));
    }
  };

  const construirResumenOrden = (codigoOrden, estadoPago, motivoError = '') => {
    const direccionCompleta = formData.departamento.trim()
      ? `${formData.calle.trim()}, Depto ${formData.departamento.trim()}`
      : formData.calle.trim();

    return {
      codigoOrden,
      nroCompra: String(codigoOrden).replace('ORD-', '') || '20240705',
      estadoPago,
      motivoError,
      fecha: new Date().toISOString().split('T')[0],
      datosCliente: { ...formData },
      direccionCompleta,
      items: items.map((it) => ({
        sku: it.sku,
        codigo: it.sku,
        nombre: it.nombre,
        producto: it.nombre,
        precio: it.precio,
        cantidad: it.cantidad,
        subtotal: it.subtotal,
        imagen: it.imagen,
        icono: it.icono
      })),
      total
    };
  };

  // Conexión con POST /api/pedidos de order-service
  const procesarPago = async (simularFallo = false) => {
    const nuevosErrores = validarFormularioCheckout(formData);
    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length > 0) {
      setAlertaError('Por favor completa todos los campos obligatorios antes de procesar el pago.');
      return;
    }

    // Verificar si algún producto supera el stock disponible
    const itemSinStock = items.find((it) => {
      return Number(it.stockDisponible ?? 99) < Number(it.cantidad);
    });

    if (simularFallo || itemSinStock) {
      const codigoFallido = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
      const motivo = itemSinStock
        ? `Stock insuficiente para "${itemSinStock.nombre}" (disponible: ${itemSinStock.stockDisponible}).`
        : 'La transacción fue rechazada por la pasarela de pago.';

      const resumenFallido = construirResumenOrden(codigoFallido, 'ERROR', motivo);
      sessionStorage.setItem(CLAVE_ULTIMA_ORDEN, JSON.stringify(resumenFallido));
      navigate('/checkout/error');
      return;
    }

    setProcesando(true);
    setAlertaError('');

    try {
      const direccionCompleta = formData.departamento.trim()
        ? `${formData.calle.trim()}, Depto ${formData.departamento.trim()}`
        : formData.calle.trim();

      // Payload oficial para el microservicio order-service (POST /api/pedidos)
      const payloadPedido = {
        proveedorId: 1, // ID por defecto en order-service para pedidos de tienda
        fechaEntregaEsperada: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        observaciones: `Cliente: ${formData.nombre.trim()} ${formData.apellidos.trim()} | Correo: ${formData.correo.trim()} | Dirección: ${direccionCompleta}, ${formData.comuna}, ${formData.region}`
      };

      let idOrdenReal = null;
      try {
        const { data: ordenCreadaBackend } = await api.post('/api/pedidos', payloadPedido);
        idOrdenReal = ordenCreadaBackend?.id;
      } catch (errApi) {
        console.warn('Advertencia al registrar en order-service:', extraerMensajeError(errApi));
      }

      const codigoOrden = idOrdenReal ? `ORD-${String(idOrdenReal).padStart(4, '0')}` : `ORD-${Date.now().toString().slice(-6)}`;

      // Guardar también en la capa local para generación de boleta y admin
      crearOrden({
        id: codigoOrden,
        cliente: `${formData.nombre.trim()} ${formData.apellidos.trim()}`.trim(),
        clienteRun: sesion?.run || '201234567',
        correo: formData.correo.trim().toLowerCase(),
        telefono: sesion?.telefono || '+56 9 9988 7766',
        direccion: direccionCompleta,
        comuna: formData.comuna,
        region: formData.region,
        estado: 'Pendiente',
        items: items.map((it) => ({
          sku: it.sku,
          producto: it.nombre,
          nombre: it.nombre,
          cantidad: it.cantidad,
          precio: it.precio,
          imagen: it.imagen,
          icono: it.icono
        })),
        total
      });

      const resumenExitoso = construirResumenOrden(codigoOrden, 'EXITO');
      sessionStorage.setItem(CLAVE_ULTIMA_ORDEN, JSON.stringify(resumenExitoso));

      vaciarCarrito();
      navigate('/checkout/exito');
    } catch (err) {
      setAlertaError(extraerMensajeError(err));
    } finally {
      setProcesando(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    procesarPago(false);
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-5">
        <i className="bi bi-cart-x display-1 text-muted"></i>
        <h2 className="fw-bold text-navy mt-3">No hay productos para procesar el pago</h2>
        <p className="text-muted">Agrega productos a tu carrito antes de ir al Checkout.</p>
        <Link to="/productos" className="btn btn-brand mt-2">
          Explorar Catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-lg-10 col-xl-9">
        <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
            <div>
              <h1 className="h4 fw-bold text-navy mb-1">Carrito de compra</h1>
              <p className="text-muted small mb-0">Completa la siguiente información</p>
            </div>
            <div className="btn btn-primary fw-bold px-4 py-2 shadow-sm pe-none">
              Total a pagar: {formatearCLP(total)}
            </div>
          </div>

          <div className="table-responsive mb-4 border rounded-3">
            <table className="table align-middle mb-0">
              <thead className="table-light small">
                <tr>
                  <th style={{ width: '70px' }}>Imagen</th>
                  <th>Nombre</th>
                  <th className="text-end">Precio</th>
                  <th className="text-center">Cantidad</th>
                  <th className="text-end">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.sku}>
                    <td>
                      <div
                        className="rounded d-flex align-items-center justify-content-center"
                        style={{ width: '44px', height: '44px', backgroundColor: '#eef2f6' }}
                      >
                        {item.imagen ? (
                          <img
                            src={item.imagen}
                            alt={item.nombre}
                            className="img-fluid"
                            style={{ maxHeight: '36px', objectFit: 'contain' }}
                          />
                        ) : (
                          <i className={`bi ${item.icono} fs-5 text-navy`}></i>
                        )}
                      </div>
                    </td>
                    <td className="fw-semibold text-navy small">{item.nombre}</td>
                    <td className="text-end small">{formatearCLP(item.precio)}</td>
                    <td className="text-center small">{item.cantidad}</td>
                    <td className="text-end fw-bold small text-navy">
                      {formatearCLP(item.subtotal)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {alertaError && (
            <div className="alert alert-danger py-2 px-3 small mb-4" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {alertaError}
            </div>
          )}

          <form id="formCheckout" noValidate onSubmit={handleSubmit}>
            <div className="mb-4 pt-2 border-top">
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
                <div>
                  <h2 className="h5 fw-bold text-navy mb-0">Información del cliente</h2>
                  <p className="text-muted small mb-0">Completa la siguiente información</p>
                </div>
                {sesion && (
                  <span className="badge bg-success-subtle text-success border border-success">
                    <i className="bi bi-person-check-fill me-1"></i>
                    Autocompletado desde tu sesión activa ({sesion.correo})
                  </span>
                )}
              </div>

              <div className="row g-3 mt-1">
                <div className="col-12 col-md-6">
                  <label htmlFor="chkNombre" className="form-label small">
                    Nombre <span className="campo-obligatorio">*</span>
                  </label>
                  <input
                    type="text"
                    id="chkNombre"
                    className={`form-control ${errores.nombre ? 'is-invalid' : ''}`}
                    placeholder="Ingresa tu nombre"
                    value={formData.nombre}
                    onChange={handleChange('nombre')}
                    required
                  />
                  {errores.nombre && <div className="invalid-feedback">{errores.nombre}</div>}
                </div>

                <div className="col-12 col-md-6">
                  <label htmlFor="chkApellidos" className="form-label small">
                    Apellidos <span className="campo-obligatorio">*</span>
                  </label>
                  <input
                    type="text"
                    id="chkApellidos"
                    className={`form-control ${errores.apellidos ? 'is-invalid' : ''}`}
                    placeholder="Ingresa tus apellidos"
                    value={formData.apellidos}
                    onChange={handleChange('apellidos')}
                    required
                  />
                  {errores.apellidos && <div className="invalid-feedback">{errores.apellidos}</div>}
                </div>

                <div className="col-12 col-md-6">
                  <label htmlFor="chkCorreo" className="form-label small">
                    Correo <span className="campo-obligatorio">*</span>
                  </label>
                  <input
                    type="email"
                    id="chkCorreo"
                    className={`form-control ${errores.correo ? 'is-invalid' : ''}`}
                    placeholder="ejemplo@duoc.cl"
                    value={formData.correo}
                    onChange={handleChange('correo')}
                    required
                  />
                  {errores.correo && <div className="invalid-feedback">{errores.correo}</div>}
                </div>
              </div>
            </div>

            <div className="mb-4 pt-3 border-top">
              <h2 className="h5 fw-bold text-navy mb-0">Dirección de entrega de los productos</h2>
              <p className="text-muted small mb-3">Ingrese dirección de forma detallada</p>

              <div className="row g-3">
                <div className="col-12 col-md-8">
                  <label htmlFor="chkCalle" className="form-label small">
                    Calle <span className="campo-obligatorio">*</span>
                  </label>
                  <input
                    type="text"
                    id="chkCalle"
                    className={`form-control ${errores.calle ? 'is-invalid' : ''}`}
                    placeholder="Ej: Los Crisantemos, Edificio Norte 1234"
                    value={formData.calle}
                    onChange={handleChange('calle')}
                    required
                  />
                  {errores.calle && <div className="invalid-feedback">{errores.calle}</div>}
                </div>

                <div className="col-12 col-md-4">
                  <label htmlFor="chkDepartamento" className="form-label small">
                    Departamento (opcional)
                  </label>
                  <input
                    type="text"
                    id="chkDepartamento"
                    className="form-control"
                    placeholder="Ej: 603"
                    value={formData.departamento}
                    onChange={handleChange('departamento')}
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label htmlFor="chkRegion" className="form-label small">
                    Región <span className="campo-obligatorio">*</span>
                  </label>
                  <select
                    id="chkRegion"
                    className={`form-select ${errores.region ? 'is-invalid' : ''}`}
                    value={formData.region}
                    onChange={handleChange('region')}
                    required
                  >
                    <option value="">-- Seleccione región --</option>
                    {REGIONES_Y_COMUNAS.map((r) => (
                      <option key={r.region} value={r.region}>
                        {r.region}
                      </option>
                    ))}
                  </select>
                  {errores.region && <div className="invalid-feedback">{errores.region}</div>}
                </div>

                <div className="col-12 col-md-6">
                  <label htmlFor="chkComuna" className="form-label small">
                    Comuna <span className="campo-obligatorio">*</span>
                  </label>
                  <select
                    id="chkComuna"
                    className={`form-select ${errores.comuna ? 'is-invalid' : ''}`}
                    value={formData.comuna}
                    onChange={handleChange('comuna')}
                    disabled={!formData.region}
                    required
                  >
                    <option value="">-- Seleccione comuna --</option>
                    {comunasDisponibles.map((comuna) => (
                      <option key={comuna} value={comuna}>
                        {comuna}
                      </option>
                    ))}
                  </select>
                  {errores.comuna && <div className="invalid-feedback">{errores.comuna}</div>}
                </div>

                <div className="col-12">
                  <label htmlFor="chkIndicaciones" className="form-label small">
                    Indicaciones para la entrega (opcional)
                  </label>
                  <textarea
                    id="chkIndicaciones"
                    className="form-control"
                    rows="2"
                    placeholder="Ej: Entre calles, color del edificio, no tiene timbre"
                    value={formData.indicaciones}
                    onChange={handleChange('indicaciones')}
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 pt-3 border-top">
              <Link to="/carrito" className="btn btn-outline-secondary">
                <i className="bi bi-arrow-left me-1"></i>Volver al Carrito
              </Link>

              <div className="d-flex flex-wrap gap-2">
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={() => procesarPago(true)}
                  disabled={procesando}
                  title="Simular fallo de pasarela"
                >
                  <i className="bi bi-x-octagon me-1"></i>Simular error de pago
                </button>
                <button
                  type="submit"
                  className="btn btn-success btn-lg fw-bold px-4 shadow-sm"
                  id="btnPagarAhora"
                  disabled={procesando}
                >
                  {procesando ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Procesando...
                    </>
                  ) : (
                    <>Pagar ahora {formatearCLP(total)}</>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Checkout;