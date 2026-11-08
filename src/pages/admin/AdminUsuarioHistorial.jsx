import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { obtenerUsuarioPorRun, formatearRunVisual } from '../../data/usuarios';
import { obtenerOrdenesPorUsuario } from '../../data/ordenes';

function AdminUsuarioHistorial() {
  const { run } = useParams();
  const [usuario, setUsuario] = useState(null);
  const [ordenes, setOrdenes] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (run) {
      const u = obtenerUsuarioPorRun(run);
      setUsuario(u);

      const ords = obtenerOrdenesPorUsuario(run);
      setOrdenes(ords);
    }
    setCargando(false);
  }, [run]);

  if (cargando) {
    return <div className="text-center py-5 text-muted">Cargando historial de compras...</div>;
  }

  if (!usuario) {
    return (
      <div className="alert alert-warning py-4 text-center shadow-sm">
        <i className="bi bi-person-x-fill fs-1 text-warning d-block mb-2"></i>
        <h5 className="fw-bold">Usuario no encontrado</h5>
        <p className="mb-3">No existe ningún usuario registrado con el identificador "{run}".</p>
        <Link to="/admin/usuarios" className="btn btn-outline-primary btn-sm">
          Volver a Usuarios
        </Link>
      </div>
    );
  }

  const gastoTotal = ordenes.reduce((acc, o) => acc + (Number(o.total) || 0), 0);
  const promedioCompra = ordenes.length > 0 ? Math.round(gastoTotal / ordenes.length) : 0;

  return (
    <div>
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb small">
          <li className="breadcrumb-item"><Link to="/admin">Dashboard</Link></li>
          <li className="breadcrumb-item"><Link to="/admin/usuarios">Usuarios</Link></li>
          <li className="breadcrumb-item active" aria-current="page">
            Historial de Compras ({formatearRunVisual(usuario.run)})
          </li>
        </ol>
      </nav>

      {/* Tarjeta de Perfil del Cliente */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body p-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div className="d-flex align-items-center gap-3">
              <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-circle fs-2 d-flex align-items-center justify-content-center" style={{ width: '64px', height: '64px' }}>
                <i className="bi bi-person-check-fill"></i>
              </div>
              <div>
                <h5 className="fw-bold text-dark m-0">{usuario.nombre} {usuario.apellidos}</h5>
                <span className="font-monospace text-secondary small d-block">
                  RUN: {formatearRunVisual(usuario.run)}
                </span>
                <small className="text-muted">
                  <i className="bi bi-envelope me-1"></i>{usuario.correo}
                  {usuario.telefono && <span className="ms-2"><i className="bi bi-telephone me-1"></i>{usuario.telefono}</span>}
                </small>
              </div>
            </div>

            <div className="d-flex align-items-center gap-2">
              <span className={`badge ${usuario.rol === 'Administrador' ? 'bg-primary' : usuario.rol === 'Vendedor' ? 'bg-info text-dark' : 'bg-success'} px-3 py-2 fs-6`}>
                Rol: {usuario.rol}
              </span>
              <Link to="/admin/usuarios" className="btn btn-outline-secondary btn-sm">
                <i className="bi bi-arrow-left me-1"></i> Volver a Usuarios
              </Link>
            </div>
          </div>

          {/* Métricas del Cliente */}
          <div className="row g-3 mt-3 pt-3 border-top">
            <div className="col-12 col-md-4">
              <div className="p-3 bg-light rounded text-center">
                <small className="text-muted d-block text-uppercase fw-semibold">Total de Órdenes</small>
                <h4 className="fw-bold text-dark m-0 mt-1">{ordenes.length}</h4>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="p-3 bg-light rounded text-center">
                <small className="text-muted d-block text-uppercase fw-semibold">Gasto Total Acumulado</small>
                <h4 className="fw-bold text-success m-0 mt-1">${gastoTotal.toLocaleString('es-CL')}</h4>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="p-3 bg-light rounded text-center">
                <small className="text-muted d-block text-uppercase fw-semibold">Ticket Promedio</small>
                <h4 className="fw-bold text-primary m-0 mt-1">${promedioCompra.toLocaleString('es-CL')}</h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Listado de Compras */}
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
          <h6 className="fw-bold text-dark m-0">
            <i className="bi bi-receipt-cutoff me-2 text-primary"></i> Órdenes Realizadas por el Usuario
          </h6>
          <span className="badge bg-light text-dark border">
            {ordenes.length} compra(s) registrada(s)
          </span>
        </div>

        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-3">N° Orden</th>
                  <th>Fecha</th>
                  <th>Detalle de Productos</th>
                  <th className="text-end">Monto Total</th>
                  <th className="text-center">Estado</th>
                  <th className="text-end pe-3">Comprobante</th>
                </tr>
              </thead>
              <tbody>
                {ordenes.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-5 text-muted">
                      <i className="bi bi-cart-x fs-1 d-block text-secondary mb-2"></i>
                      Este usuario aún no registra compras ni órdenes en la tienda.
                    </td>
                  </tr>
                ) : (
                  ordenes.map((o) => {
                    let badgeEstado = 'bg-secondary';
                    if (o.estado === 'Entregado') badgeEstado = 'bg-success';
                    if (o.estado === 'Pendiente') badgeEstado = 'bg-warning text-dark';
                    if (o.estado === 'En despacho') badgeEstado = 'bg-info text-dark';
                    if (o.estado === 'Cancelada') badgeEstado = 'bg-danger';

                    return (
                      <tr key={o.id}>
                        <td className="ps-3 font-monospace fw-semibold text-secondary">{o.id}</td>
                        <td>{o.fecha}</td>
                        <td>
                          {o.items && o.items.length > 0 ? (
                            <ul className="list-unstyled mb-0 small">
                              {o.items.map((it, idx) => (
                                <li key={idx}>
                                  <i className="bi bi-box me-1 text-muted"></i>
                                  <strong>{it.cantidad}x</strong> {it.producto || it.nombre}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <span className="text-muted small">Sin detalle</span>
                          )}
                        </td>
                        <td className="text-end fw-bold text-dark">
                          ${Number(o.total).toLocaleString('es-CL')}
                        </td>
                        <td className="text-center">
                          <span className={`badge ${badgeEstado}`}>{o.estado}</span>
                        </td>
                        <td className="text-end pe-3">
                          <Link
                            to={`/admin/ordenes/${o.id}/boleta`}
                            className="btn btn-outline-primary btn-sm d-inline-flex align-items-center gap-1"
                          >
                            <i className="bi bi-file-earmark-text"></i> Ver Boleta
                          </Link>
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
    </div>
  );
}

export default AdminUsuarioHistorial;
