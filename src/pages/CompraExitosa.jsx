import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CLAVE_ULTIMA_ORDEN } from '../data/carrito';
import { obtenerOrdenes } from '../data/ordenes';
import { formatearCLP } from '../utils/validaciones';

function obtenerResumenUltimaCompra() {
  try {
    const guardado = sessionStorage.getItem(CLAVE_ULTIMA_ORDEN);
    if (guardado) {
      const parsed = JSON.parse(guardado);
      if (parsed && parsed.items) return parsed;
    }
  } catch {
    // Ignorar error de parseo
  }

  // Fallback a la orden más reciente si se accede directamente a la ruta
  const ordenes = obtenerOrdenes();
  const reciente = ordenes[0];
  if (!reciente) return null;

  const partesCliente = (reciente.cliente || 'Cliente LogisTrack').split(' ');
  return {
    codigoOrden: reciente.id,
    nroCompra: reciente.id.replace('ORD-', '') || '20240705',
    estadoPago: 'EXITO',
    fecha: reciente.fecha,
    datosCliente: {
      nombre: partesCliente[0] || 'Cliente',
      apellidos: partesCliente.slice(1).join(' ') || '',
      correo: reciente.correo || 'cliente@duoc.cl',
      calle: reciente.direccion || 'Av. Departamental 1234',
      departamento: reciente.departamento || '603',
      region: reciente.region || 'Metropolitana de Santiago',
      comuna: reciente.comuna || 'Cerrillos',
      indicaciones:
        reciente.indicaciones || 'El martes no estaremos en el depto, pero puede dejárselo con el conserje.'
    },
    items: (reciente.items || []).map((it) => ({
      sku: it.sku,
      nombre: it.producto || it.nombre,
      precio: it.precio,
      cantidad: it.cantidad,
      subtotal: Number(it.precio) * Number(it.cantidad),
      imagen: it.imagen,
      icono: it.icono || 'bi-box-seam'
    })),
    total: reciente.total
  };
}

function CompraExitosa() {
  const [resumen] = useState(() => obtenerResumenUltimaCompra());
  const [correoEnviado, setCorreoEnviado] = useState(false);

  useEffect(() => {
    document.title = 'Compra Exitosa - LogisTrack Store';
  }, []);

  if (!resumen) {
    return (
      <div className="text-center py-5">
        <h2 className="fw-bold text-navy">No hay un comprobante de compra reciente</h2>
        <Link to="/productos" className="btn btn-brand mt-3">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  const { datosCliente, items, total, codigoOrden, nroCompra } = resumen;

  const handleImprimirPDF = () => {
    window.print();
  };

  const handleEnviarEmail = () => {
    setCorreoEnviado(true);
    setTimeout(() => setCorreoEnviado(false), 4000);
  };

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-lg-10 col-xl-8">
        <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
          {/* Cabecera: Se ha realizado la compra (Figura 7 Anexo 1) */}
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
            <div>
              <h1 className="h4 fw-bold text-navy d-flex align-items-center gap-2 mb-1">
                <i className="bi bi-check-circle text-success fs-3"></i>
                <span>Se ha realizado la compra. nro #{nroCompra}</span>
              </h1>
              <p className="text-muted small mb-0">Completa la siguiente información</p>
            </div>
            <small className="text-muted font-monospace fw-semibold">
              Código orden: {codigoOrden}
            </small>
          </div>

          {/* Datos del Cliente (Read-only como en Figura 7) */}
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

          {/* Tabla resumen de productos comprados */}
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
          <div className="text-center py-3 border-top border-bottom mb-4">
            <h3 className="h4 fw-bold text-navy mb-0">
              Total pagado: {formatearCLP(total)}
            </h3>
          </div>

          {correoEnviado && (
            <div className="alert alert-success text-center py-2 small mb-3" role="alert">
              <i className="bi bi-envelope-check-fill me-2"></i>
              Se ha enviado una copia de la boleta electrónica al correo{' '}
              <strong>{datosCliente.correo}</strong>.
            </div>
          )}

          {/* Botones de Acción (Imprimir boleta en PDF / Enviar boleta por email) */}
          <div className="d-flex justify-content-center flex-wrap gap-3 d-print-none">
            <button
              type="button"
              className="btn btn-danger fw-semibold px-4"
              onClick={handleImprimirPDF}
            >
              <i className="bi bi-file-earmark-pdf me-2"></i>Imprimir boleta en PDF
            </button>
            <button
              type="button"
              className="btn btn-success fw-semibold px-4"
              onClick={handleEnviarEmail}
            >
              <i className="bi bi-envelope-paper me-2"></i>Enviar boleta por email
            </button>
            <Link to="/productos" className="btn btn-outline-primary px-4">
              Seguir comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompraExitosa;
