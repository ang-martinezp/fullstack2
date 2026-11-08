import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  obtenerOrdenes,
  actualizarEstadoOrden,
  eliminarOrden,
  ESTADOS_ORDEN
} from '../../data/ordenes';
import { obtenerRolActivo } from '../../data/usuarios';

function AdminOrdenes() {
  const [ordenes, setOrdenes] = useState([]);
  const [filtroTexto, setFiltroTexto] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [rolActual, setRolActual] = useState(obtenerRolActivo());
  const [ordenAEliminar, setOrdenAEliminar] = useState(null);
  const [alertaExito, setAlertaExito] = useState('');

  const cargarDatos = () => {
    setOrdenes(obtenerOrdenes());
    setRolActual(obtenerRolActivo());
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

  const esAdmin = rolActual === 'Administrador';

  // Métricas rápidas
  const totalFacturado = ordenes.reduce((acc, o) => acc + (Number(o.total) || 0), 0);
  const ordenesEntregadas = ordenes.filter((o) => o.estado === 'Entregado').length;
  const ordenesPendientes = ordenes.filter((o) => o.estado === 'Pendiente' || o.estado === 'En despacho').length;

  // Filtrado en vivo
  const ordenesFiltradas = ordenes.filter((o) => {
    const texto = filtroTexto.toLowerCase().trim();
    const coincideTexto =
      !texto ||
      o.id.toLowerCase().includes(texto) ||
      (o.cliente && o.cliente.toLowerCase().includes(texto)) ||
      (o.correo && o.correo.toLowerCase().includes(texto));

    const coincideEstado = filtroEstado === 'todos' || o.estado === filtroEstado;

    return coincideTexto && coincideEstado;
  });

  const handleCambioEstado = (id, nuevoEstado) => {
    actualizarEstadoOrden(id, nuevoEstado);
    setAlertaExito(`Estado de la orden ${id} actualizado a "${nuevoEstado}".`);
    cargarDatos();
    setTimeout(() => setAlertaExito(''), 3500);
  };

  const handleConfirmarEliminar = () => {
    if (!ordenAEliminar || !esAdmin) return;
    eliminarOrden(ordenAEliminar.id);
    setAlertaExito(`Orden ${ordenAEliminar.id} eliminada.`);
    setOrdenAEliminar(null);
    cargarDatos();
    setTimeout(() => setAlertaExito(''), 3500);
  };

  return (
    <div>
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb small">
          <li className="breadcrumb-item"><Link to="/admin">Dashboard</Link></li>
          <li className="breadcrumb-item active" aria-current="page">Órdenes de Compra</li>
        </ol>
      </nav>

      {/* Alerta de notificación */}
      {alertaExito && (
        <div className="alert alert-success alert-dismissible fade show shadow-sm" role="alert">
          <i className="bi bi-check-circle-fill me-2"></i>
          {alertaExito}
          <button type="button" className="btn-close" onClick={() => setAlertaExito('')}></button>
        </div>
      )}

      {/* Tarjetas de Resumen KPI */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card shadow-sm border-0 p-3 h-100">
            <small className="text-muted text-uppercase fw-semibold">Total Órdenes</small>
            <h3 className="fw-bold my-1 text-dark">{ordenes.length}</h3>
            <small className="text-secondary">Transacciones procesadas</small>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card shadow-sm border-0 p-3 h-100">
            <small className="text-muted text-uppercase fw-semibold">Total Facturado</small>
            <h3 className="fw-bold my-1 text-success">${totalFacturado.toLocaleString('es-CL')}</h3>
            <small className="text-secondary">Ingresos brutos</small>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card shadow-sm border-0 p-3 h-100">
            <small className="text-muted text-uppercase fw-semibold">Entregadas</small>
            <h3 className="fw-bold my-1 text-primary">{ordenesEntregadas}</h3>
            <small className="text-secondary">Despachos completados</small>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card shadow-sm border-0 p-3 h-100">
            <small className="text-muted text-uppercase fw-semibold">Pendientes / Tránsito</small>
            <h3 className="fw-bold my-1 text-warning">{ordenesPendientes}</h3>
            <small className="text-secondary">Requieren atención</small>
          </div>
        </div>
      </div>

      {/* Barra de Filtros */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body p-3">
          <div className="row g-2 align-items-center">
            <div className="col-12 col-md-7">
              <div className="input-group input-group-sm">
                <span className="input-group-text bg-white border-end-0">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 ps-0"
                  placeholder="Buscar por N° orden, nombre de cliente o correo..."
                  value={filtroTexto}
                  onChange={(e) => setFiltroTexto(e.target.value)}
                />
                {filtroTexto && (
                  <button className="btn btn-outline-secondary" type="button" onClick={() => setFiltroTexto('')}>
                    <i className="bi bi-x"></i>
                  </button>
                )}
              </div>
            </div>

            <div className="col-12 col-md-5">
              <select
                className="form-select form-select-sm"
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
              >
                <option value="todos">Todos los estados</option>
                {ESTADOS_ORDEN.map((est) => (
                  <option key={est} value={est}>
                    {est}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de Órdenes */}
      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-3" style={{ width: '130px' }}>N° Orden</th>
                  <th>Cliente</th>
                  <th>Fecha</th>
                  <th className="text-end">Monto Total</th>
                  <th className="text-center" style={{ width: '180px' }}>Estado</th>
                  <th className="text-end pe-3" style={{ width: '140px' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {ordenesFiltradas.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-5 text-muted">
                      <i className="bi bi-receipt fs-1 d-block text-secondary mb-2"></i>
                      No se encontraron órdenes registradas.
                    </td>
                  </tr>
                ) : (
                  ordenesFiltradas.map((ord) => {
                    let badgeClass = 'bg-secondary';
                    if (ord.estado === 'Entregado') badgeClass = 'bg-success';
                    if (ord.estado === 'Pendiente') badgeClass = 'bg-warning text-dark';
                    if (ord.estado === 'En despacho') badgeClass = 'bg-info text-dark';
                    if (ord.estado === 'Cancelada') badgeClass = 'bg-danger';

                    return (
                      <tr key={ord.id}>
                        <td className="ps-3 font-monospace fw-semibold text-secondary">{ord.id}</td>
                        <td>
                          <div className="fw-semibold text-dark">{ord.cliente}</div>
                          <small className="text-muted">{ord.correo || 'Sin correo asociado'}</small>
                        </td>
                        <td>{ord.fecha}</td>
                        <td className="text-end fw-bold text-dark">
                          ${Number(ord.total).toLocaleString('es-CL')}
                        </td>
                        <td className="text-center">
                          <select
                            className={`form-select form-select-sm border ${badgeClass} text-white fw-semibold`}
                            style={{ cursor: 'pointer', textAlignLast: 'center' }}
                            value={ord.estado}
                            onChange={(e) => handleCambioEstado(ord.id, e.target.value)}
                          >
                            {ESTADOS_ORDEN.map((est) => (
                              <option key={est} value={est} className="bg-white text-dark">
                                {est}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="text-end pe-3">
                          <div className="btn-group btn-group-sm">
                            <Link
                              to={`/admin/ordenes/${ord.id}/boleta`}
                              className="btn btn-outline-primary"
                              title="Ver Boleta Electrónica"
                            >
                              <i className="bi bi-file-earmark-text me-1"></i> Boleta
                            </Link>
                            {esAdmin && (
                              <button
                                type="button"
                                className="btn btn-outline-danger"
                                title="Eliminar Orden"
                                onClick={() => setOrdenAEliminar(ord)}
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            )}
                          </div>
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

      {/* Modal Confirmar Eliminación */}
      {ordenAEliminar && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header bg-danger text-white">
                <h6 className="modal-title fw-bold">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i> Eliminar Registro de Orden
                </h6>
                <button type="button" className="btn-close btn-close-white" onClick={() => setOrdenAEliminar(null)}></button>
              </div>

              <div className="modal-body py-4">
                <p className="mb-1">¿Estás seguro de que deseas eliminar permanentemente la orden:</p>
                <div className="p-3 bg-light rounded mt-2 border">
                  <strong>{ordenAEliminar.id}</strong> — Cliente: {ordenAEliminar.cliente}
                  <div className="small text-muted font-monospace mt-1">
                    Total: ${Number(ordenAEliminar.total).toLocaleString('es-CL')} | Estado: {ordenAEliminar.estado}
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setOrdenAEliminar(null)}>
                  Cancelar
                </button>
                <button type="button" className="btn btn-danger btn-sm fw-semibold" onClick={handleConfirmarEliminar}>
                  <i className="bi bi-trash me-1"></i> Sí, Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminOrdenes;
