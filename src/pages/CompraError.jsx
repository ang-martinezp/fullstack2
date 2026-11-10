import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { obtenerCarrito, calcularTotalCarrito, CLAVE_ULTIMA_ORDEN } from '../data/carrito';
import { obtenerSesionActiva } from '../data/usuarios';
import { formatearCLP } from '../utils/validaciones';

function obtenerResumenError() {
  try {
    const guardado = sessionStorage.getItem(CLAVE_ULTIMA_ORDEN);
    if (guardado) {
      const parsed = JSON.parse(guardado);
      if (parsed && parsed.items) return parsed;
    }
  } catch {
    // Ignorar
  }

  const carrito = obtenerCarrito();
  const sesion = obtenerSesionActiva();
  return {
    codigoOrden: 'ORD-20240705',
    nroCompra: '20240705',
    estadoPago: 'ERROR',
    motivoError: 'No se pudo procesar el pago con el medio seleccionado.',
    datosCliente: {
      nombre: sesion?.nombre || 'Pedro',
      apellidos: sesion?.apellidos || 'Hacker',
      correo: sesion?.correo || 'pedro.hacker20@duoc.cl',
      calle: sesion?.direccion || 'Los Crisantemos, Edificio Norte',
      departamento: 'Depto 603',
      region: sesion?.region || 'Metropolitana de Santiago',
      comuna: sesion?.comuna || 'Cerrillos',
      indicaciones: 'El martes no estaremos en el depto, pero puede dejárselo con el conserje.'
    },
    items: carrito,
    total: calcularTotalCarrito(carrito)
  };
}

function CompraError() {
  const [resumen] = useState(() => obtenerResumenError());

  useEffect(() => {
    document.title = 'Error en el Pago - LogisTrack Store';
  }, []);

  const { datosCliente, items, total, nroCompra, motivoError } = resumen;

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-lg-10 col-xl-8">
        <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
          {/* Cabecera: No se pudo realizar el pago (Figura 8 Anexo 1) */}
          <div className="mb-3">
            <h1 className="h4 fw-bold text-navy d-flex align-items-center gap-2 mb-1">
              <i className="bi bi-x-circle text-danger fs-3"></i>
              <span>No se pudo realizar el pago. nro #{nroCompra}</span>
            </h1>
            <p className="text-muted small mb-2">Detalle de comprar</p>
            {motivoError && (
              <div className="alert alert-danger py-2 px-3 small mb-3" role="alert">
                <i className="bi bi-exclamation-octagon-fill me-2"></i>
                {motivoError}
              </div>
            )}
          </div>

          {/* Botón central: VOLVER A REALIZAR EL PAGO (Figura 8 Anexo 1) */}
          <div className="text-center mb-4">
            <Link
              to="/checkout"
              className="btn btn-success fw-bold px-4 py-2 text-uppercase shadow-sm"
            >
              VOLVER A REALIZAR EL PAGO
            </Link>
          </div>

          {/* Datos del Cliente */}
          <div className="row g-3 mb-4">
            <div className="col-12 col-md-4">
              <label className="form-label small text-muted mb-1">Nombre*</label>
              <input
                type="text"
                className="form-control bg-light"
                value={datosCliente.nombre}
                readOnly
              />
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label small text-muted mb-1">Apellidos*</label>
              <input
                type="text"
                className="form-control bg-light"
                value={datosCliente.apellidos}
                readOnly
              />
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label small text-muted mb-1">Correo*</label>
              <input
                type="email"
                className="form-control bg-light"
                value={datosCliente.correo}
                readOnly
              />
            </div>
          </div>

          {/* Dirección de entrega de los productos */}
          <div className="mb-4 pt-3 border-top">
            <h2 className="h6 fw-bold text-navy mb-3">Dirección de entrega de los productos</h2>
            <div className="row g-3">
              <div className="col-12 col-md-7">
                <label className="form-label small text-muted mb-1">Calle*</label>
                <input
                  type="text"
                  className="form-control bg-light"
                  value={datosCliente.calle}
                  readOnly
                />
              </div>
              <div className="col-12 col-md-5">
                <label className="form-label small text-muted mb-1">Departamento (opcional)</label>
                <input
                  type="text"
                  className="form-control bg-light"
                  value={datosCliente.departamento || 'Sin especificar'}
                  readOnly
                />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label small text-muted mb-1">Región*</label>
                <input
                  type="text"
                  className="form-control bg-light"
                  value={datosCliente.region}
                  readOnly
                />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label small text-muted mb-1">Comuna*</label>
                <input
                  type="text"
                  className="form-control bg-light"
                  value={datosCliente.comuna}
                  readOnly
                />
              </div>
              <div className="col-12">
                <label className="form-label small text-muted mb-1">
                  Indicaciones para la entrega (opcional)
                </label>
                <textarea
                  className="form-control bg-light"
                  rows="2"
                  value={
                    datosCliente.indicaciones ||
                    'Sin indicaciones adicionales para el despacho.'
                  }
                  readOnly
                ></textarea>
              </div>
            </div>
          </div>

          {/* Tabla resumen de productos */}
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
                {items.map((item, idx) => (
                  <tr key={item.sku || idx}>
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
                          <i className={`bi ${item.icono || 'bi-box-seam'} fs-5 text-navy`}></i>
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

          {/* Total Pagado */}
          <div className="text-center py-3 border-top">
            <h3 className="h4 fw-bold text-navy mb-0">
              Total pagado: {formatearCLP(total)}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompraError;
