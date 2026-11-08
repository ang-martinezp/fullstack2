import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  obtenerOrdenPorId,
  actualizarEstadoOrden,
  ESTADOS_ORDEN
} from '../../data/ordenes';
import { formatearRunVisual } from '../../data/usuarios';

function AdminBoleta() {
  const { id } = useParams();
  const [orden, setOrden] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [alerta, setAlerta] = useState('');

  const cargarOrden = () => {
    if (id) {
      const ord = obtenerOrdenPorId(id);
      setOrden(ord);
    }
    setCargando(false);
  };

  useEffect(() => {
    cargarOrden();
  }, [id]);

  if (cargando) {
    return <div className="text-center py-5 text-muted">Cargando comprobante de orden...</div>;
  }

  if (!orden) {
    return (
      <div className="alert alert-warning py-4 text-center shadow-sm">
        <i className="bi bi-file-earmark-x fs-1 text-warning d-block mb-2"></i>
        <h5 className="fw-bold">Orden no encontrada</h5>
        <p className="mb-3">No se encontró ninguna orden registrada con el código "{id}".</p>
        <Link to="/admin/ordenes" className="btn btn-outline-primary btn-sm">
          Volver a Órdenes
        </Link>
      </div>
    );
  }

  const items = orden.items || [];
  const neto = orden.neto || Math.round(Number(orden.total) / 1.19);
  const iva = orden.iva || (Number(orden.total) - neto);

  const handleCambioEstado = (nuevoEstado) => {
    actualizarEstadoOrden(orden.id, nuevoEstado);
    setAlerta(`Estado actualizado a "${nuevoEstado}".`);
    cargarOrden();
    setTimeout(() => setAlerta(''), 3000);
  };

  const handleImprimir = () => {
    window.print();
  };

  return (
    <div>
      {/* Barra de Acciones Superior (oculta al imprimir) */}
      <div className="d-print-none mb-3">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb small mb-2">
            <li className="breadcrumb-item"><Link to="/admin">Dashboard</Link></li>
            <li className="breadcrumb-item"><Link to="/admin/ordenes">Órdenes</Link></li>
            <li className="breadcrumb-item active" aria-current="page">Boleta {orden.id}</li>
          </ol>
        </nav>

        {alerta && (
          <div className="alert alert-success py-2 px-3 small d-flex align-items-center gap-2 mb-3">
            <i className="bi bi-check-circle-fill"></i>
            {alerta}
          </div>
        )}

        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 pb-3 border-bottom">
          <div className="d-flex align-items-center gap-2">
            <Link to="/admin/ordenes" className="btn btn-outline-secondary btn-sm">
              <i className="bi bi-arrow-left me-1"></i> Volver a Órdenes
            </Link>
            <div className="d-flex align-items-center gap-2">
              <span className="small text-muted fw-semibold">Estado actual:</span>
              <select
                className="form-select form-select-sm"
                style={{ width: '160px' }}
                value={orden.estado}
                onChange={(e) => handleCambioEstado(e.target.value)}
              >
                {ESTADOS_ORDEN.map((est) => (
                  <option key={est} value={est}>
                    {est}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-primary btn-sm d-flex align-items-center gap-2 shadow-sm"
            onClick={handleImprimir}
          >
            <i className="bi bi-printer-fill"></i> Imprimir Boleta Electrónica
          </button>
        </div>
      </div>

      {/* Contenedor Imprimible de Boleta Electrónica (Formato SII) */}
      <div className="card shadow border p-4 p-md-5 bg-white mx-auto" style={{ maxWidth: '820px' }}>
        {/* Cabecera: Empresa vs Timbre SII */}
        <div className="row align-items-start mb-4">
          <div className="col-12 col-md-7 mb-3 mb-md-0">
            <div className="d-flex align-items-center gap-2 mb-2">
              <i className="bi bi-box-seam-fill fs-2 text-primary"></i>
              <h3 className="fw-bold m-0 text-navy">LogisTrack SpA</h3>
            </div>
            <p className="small text-muted mb-1">
              <strong>Giro:</strong> Venta de Equipamiento Tecnológico, Insumos y Logística
            </p>
            <p className="small text-muted mb-1">
              <strong>Casa Matriz:</strong> Av. España 8, Santiago Centro, Región Metropolitana
            </p>
            <p className="small text-muted mb-0">
              <strong>Contacto:</strong> contacto@logistrack.cl | +56 2 2999 8888
            </p>
          </div>

          <div className="col-12 col-md-5">
            <div className="border border-2 border-danger rounded text-center p-3">
              <h6 className="fw-bold text-danger mb-1 font-monospace">R.U.T.: 76.543.210-K</h6>
              <h5 className="fw-bold text-danger my-1">BOLETA ELECTRÓNICA</h5>
              <h5 className="fw-bold text-danger mb-1 font-monospace">N° {orden.id}</h5>
              <small className="text-danger fw-semibold d-block" style={{ fontSize: '0.72rem' }}>
                S.I.I. — SANTIAGO CENTRO
              </small>
            </div>
          </div>
        </div>

        {/* Datos del Receptor / Cliente */}
        <div className="border rounded p-3 mb-4 bg-light bg-opacity-50">
          <div className="row g-2 small">
            <div className="col-12 col-md-6">
              <strong>SEÑOR(A):</strong> <span className="text-dark">{orden.cliente}</span>
            </div>
            <div className="col-12 col-md-6">
              <strong>R.U.T.:</strong>{' '}
              <span className="font-monospace text-dark">
                {orden.clienteRun ? formatearRunVisual(orden.clienteRun) : '66.666.666-6'}
              </span>
            </div>
            <div className="col-12 col-md-6">
              <strong>DIRECCIÓN:</strong>{' '}
              <span className="text-dark">{orden.direccion || 'Av. Departamental 1234, Cerrillos'}</span>
            </div>
            <div className="col-12 col-md-6">
              <strong>CIUDAD / COMUNA:</strong>{' '}
              <span className="text-dark">{orden.comuna || 'Santiago'}, {orden.region || 'Región Metropolitana'}</span>
            </div>
            <div className="col-12 col-md-6">
              <strong>FECHA DE EMISIÓN:</strong> <span className="text-dark">{orden.fecha}</span>
            </div>
            <div className="col-12 col-md-6">
              <strong>ESTADO PAGO / ENTREGA:</strong>{' '}
              <span className="badge bg-success-subtle text-success border border-success ms-1">
                {orden.estado}
              </span>
            </div>
          </div>
        </div>

        {/* Tabla de Detalle de Productos */}
        <div className="table-responsive mb-4">
          <table className="table table-bordered align-middle mb-0">
            <thead className="table-light">
              <tr className="small text-uppercase">
                <th className="text-center" style={{ width: '70px' }}>Cant.</th>
                <th>Detalle del Producto / Servicio</th>
                <th className="text-end" style={{ width: '130px' }}>P. Unitario</th>
                <th className="text-end" style={{ width: '130px' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-muted small">
                    Sin desglose de ítems detallado en esta orden.
                  </td>
                </tr>
              ) : (
                items.map((it, idx) => {
                  const cant = Number(it.cantidad || 1);
                  const prec = Number(it.precio || 0);
                  const sub = cant * prec;

                  return (
                    <tr key={idx}>
                      <td className="text-center fw-bold">{cant}</td>
                      <td>
                        <div className="fw-semibold text-dark">{it.producto || it.nombre}</div>
                        {it.sku && <small className="text-muted font-monospace">{it.sku}</small>}
                      </td>
                      <td className="text-end">${prec.toLocaleString('es-CL')}</td>
                      <td className="text-end fw-semibold">${sub.toLocaleString('es-CL')}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Desglose Monetario (Neto, IVA, Total) */}
        <div className="row justify-content-end mb-4">
          <div className="col-12 col-md-5">
            <table className="table table-sm table-borderless mb-0">
              <tbody>
                <tr>
                  <td className="text-muted small">MONTO NETO:</td>
                  <td className="text-end fw-semibold font-monospace">${neto.toLocaleString('es-CL')}</td>
                </tr>
                <tr>
                  <td className="text-muted small">I.V.A. (19%):</td>
                  <td className="text-end fw-semibold font-monospace">${iva.toLocaleString('es-CL')}</td>
                </tr>
                <tr className="border-top border-2 border-dark">
                  <td className="fw-bold fs-6 text-dark">TOTAL A PAGAR:</td>
                  <td className="text-end fw-bold fs-5 text-dark font-monospace">
                    ${Number(orden.total).toLocaleString('es-CL')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Pie de Boleta con Timbre Electrónico Simulado */}
        <div className="border-top pt-3 mt-4 text-center">
          <div className="font-monospace text-muted small mb-1" style={{ letterSpacing: '4px' }}>
            || | | ||| | || |||| | ||| || ||| | ||||| | |||
          </div>
          <small className="text-muted d-block" style={{ fontSize: '0.72rem' }}>
            Timbre Electrónico D.S.I.I. — Res. N° 80 de 2014. Verifique documento en www.sii.cl
          </small>
        </div>
      </div>
    </div>
  );
}

export default AdminBoleta;
