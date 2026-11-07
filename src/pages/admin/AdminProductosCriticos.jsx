import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  obtenerProductosCriticos,
  actualizarProducto
} from '../../data/productos';
import { obtenerRolActivo } from '../../data/usuarios';

function AdminProductosCriticos() {
  const [criticos, setCriticos] = useState([]);
  const [rolActual, setRolActual] = useState(obtenerRolActivo());
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [cantidadReponer, setCantidadReponer] = useState(10);
  const [mensajeExito, setMensajeExito] = useState('');

  const cargarDatos = () => {
    setCriticos(obtenerProductosCriticos());
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

  const handleReponerStock = (e) => {
    e.preventDefault();
    if (!productoSeleccionado || !esAdmin) return;

    const sku = productoSeleccionado.sku || productoSeleccionado.codigo;
    const nuevoStock = Number(productoSeleccionado.stock) + Number(cantidadReponer);

    actualizarProducto(sku, { stock: nuevoStock });
    setMensajeExito(`Se agregaron +${cantidadReponer} unidades a "${productoSeleccionado.nombre}". Stock actualizado a ${nuevoStock}.`);
    setProductoSeleccionado(null);
    setCantidadReponer(10);
    cargarDatos();

    setTimeout(() => setMensajeExito(''), 4500);
  };

  return (
    <div>
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb small">
          <li className="breadcrumb-item"><Link to="/admin">Dashboard</Link></li>
          <li className="breadcrumb-item"><Link to="/admin/productos">Productos</Link></li>
          <li className="breadcrumb-item active" aria-current="page">Stock Crítico</li>
        </ol>
      </nav>

      {/* Alerta de reposición */}
      {mensajeExito && (
        <div className="alert alert-success alert-dismissible fade show shadow-sm" role="alert">
          <i className="bi bi-check-circle-fill me-2"></i>
          {mensajeExito}
          <button type="button" className="btn-close" onClick={() => setMensajeExito('')}></button>
        </div>
      )}

      {/* Encabezado y resumen */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h5 className="fw-bold text-dark m-0 d-flex align-items-center gap-2">
            <i className="bi bi-exclamation-triangle-fill text-warning"></i>
            Listado de Productos en Stock Crítico
          </h5>
          <small className="text-muted">
            Ítems cuyo stock actual es menor o igual al umbral mínimo de seguridad
          </small>
        </div>

        <div className="d-flex gap-2">
          <Link to="/admin/productos" className="btn btn-outline-secondary btn-sm">
            <i className="bi bi-arrow-left me-1"></i> Volver a Todos los Productos
          </Link>
        </div>
      </div>

      {/* Card principal */}
      <div className="card shadow-sm border-0">
        <div className="card-header bg-warning bg-opacity-10 border-bottom border-warning border-opacity-25 py-3 d-flex justify-content-between align-items-center">
          <span className="fw-bold text-dark">
            <i className="bi bi-shield-exclamation me-1 text-warning"></i>
            {criticos.length} producto(s) en alerta de desabastecimiento
          </span>
          <span className="badge bg-warning text-dark border">Prioridad Alta</span>
        </div>

        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-3">Código / SKU</th>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th className="text-center">Stock Actual</th>
                  <th className="text-center">Umbral Mínimo</th>
                  <th className="text-center">Déficit</th>
                  <th className="text-end pe-3">Acción Rápida</th>
                </tr>
              </thead>
              <tbody>
                {criticos.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-5 text-success">
                      <i className="bi bi-check-circle-fill fs-1 d-block mb-2 text-success"></i>
                      <h6 className="fw-bold">¡Inventario Óptimo!</h6>
                      <p className="text-muted small mb-0">
                        No hay ningún producto bajo el umbral de stock crítico en este momento.
                      </p>
                    </td>
                  </tr>
                ) : (
                  criticos.map((p) => {
                    const sku = p.sku || p.codigo;
                    const stock = Number(p.stock);
                    const minimo = Number(p.stockCritico);
                    const deficit = minimo - stock;

                    return (
                      <tr key={sku}>
                        <td className="ps-3 font-monospace fw-semibold text-secondary">{sku}</td>
                        <td>
                          <div className="fw-semibold text-dark">{p.nombre}</div>
                          <small className="text-muted">{p.descripcion}</small>
                        </td>
                        <td>
                          <span className="badge bg-secondary-subtle text-secondary border">
                            {p.categoriaLabel || p.categoria}
                          </span>
                        </td>
                        <td className="text-center">
                          <span className="badge bg-danger fs-6 px-3 py-1">
                            {stock} un.
                          </span>
                        </td>
                        <td className="text-center fw-semibold text-muted">
                          {minimo} un.
                        </td>
                        <td className="text-center">
                          {deficit > 0 ? (
                            <span className="badge bg-danger-subtle text-danger border border-danger">
                              -{deficit} un.
                            </span>
                          ) : (
                            <span className="badge bg-warning-subtle text-dark border">En el límite</span>
                          )}
                        </td>
                        <td className="text-end pe-3">
                          {esAdmin ? (
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-success d-inline-flex align-items-center gap-1"
                              onClick={() => {
                                setProductoSeleccionado(p);
                                setCantidadReponer(10);
                              }}
                            >
                              <i className="bi bi-plus-lg"></i> Reponer Stock
                            </button>
                          ) : (
                            <span className="text-muted small">Solo lectura</span>
                          )}
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

      {/* Modal de Reposición Rápida */}
      {productoSeleccionado && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header bg-success text-white">
                <h6 className="modal-title fw-bold">
                  <i className="bi bi-box-arrow-in-down me-2"></i> Reponer Stock
                </h6>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setProductoSeleccionado(null)}
                ></button>
              </div>

              <form onSubmit={handleReponerStock}>
                <div className="modal-body py-4">
                  <h6 className="fw-bold text-dark">{productoSeleccionado.nombre}</h6>
                  <p className="small text-muted font-monospace mb-3">
                    Código: {productoSeleccionado.sku || productoSeleccionado.codigo}
                  </p>

                  <div className="p-3 bg-light rounded border mb-3">
                    <div className="row text-center">
                      <div className="col-6 border-end">
                        <small className="text-muted d-block">Stock Actual</small>
                        <span className="fw-bold fs-5 text-danger">{productoSeleccionado.stock} un.</span>
                      </div>
                      <div className="col-6">
                        <small className="text-muted d-block">Umbral Mínimo</small>
                        <span className="fw-bold fs-5 text-dark">{productoSeleccionado.stockCritico} un.</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Unidades a Ingresar al Inventario:</label>
                    <input
                      type="number"
                      min="1"
                      className="form-control"
                      value={cantidadReponer}
                      onChange={(e) => setCantidadReponer(Math.max(1, parseInt(e.target.value, 10) || 1))}
                      required
                    />
                    <small className="text-muted">
                      El nuevo stock será: <strong>{Number(productoSeleccionado.stock) + Number(cantidadReponer)}</strong> unidades.
                    </small>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setProductoSeleccionado(null)}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-success btn-sm fw-semibold">
                    <i className="bi bi-check2-circle me-1"></i> Confirmar Entrada
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

export default AdminProductosCriticos;
