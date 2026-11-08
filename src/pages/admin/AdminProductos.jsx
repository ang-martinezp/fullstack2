import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  obtenerProductos,
  eliminarProducto,
  obtenerProductosCriticos
} from '../../data/productos';
import { obtenerCategorias } from '../../data/categorias';
import { obtenerRolActivo } from '../../data/usuarios';

function AdminProductos() {
  const location = useLocation();
  const alertaAcceso = location.state?.alertaAcceso;

  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [filtroTexto, setFiltroTexto] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('todas');
  const [rolActual, setRolActual] = useState(obtenerRolActivo());
  const [productoAEliminar, setProductoAEliminar] = useState(null);
  const [alertaExito, setAlertaExito] = useState('');

  const cargarDatos = () => {
    setProductos(obtenerProductos());
    setCategorias(obtenerCategorias());
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
  const criticos = obtenerProductosCriticos();

  // Filtrado reactivo en vivo
  const productosFiltrados = productos.filter((p) => {
    const texto = filtroTexto.toLowerCase().trim();
    const coincideTexto =
      !texto ||
      (p.nombre && p.nombre.toLowerCase().includes(texto)) ||
      (p.sku && p.sku.toLowerCase().includes(texto)) ||
      (p.codigo && p.codigo.toLowerCase().includes(texto));

    const coincideCategoria =
      filtroCategoria === 'todas' ||
      p.categoria === filtroCategoria ||
      p.categoriaLabel?.toLowerCase() === filtroCategoria.toLowerCase();

    return coincideTexto && coincideCategoria;
  });

  const handleConfirmarEliminar = () => {
    if (!productoAEliminar) return;
    const sku = productoAEliminar.sku || productoAEliminar.codigo;
    eliminarProducto(sku);
    setAlertaExito(`Producto "${productoAEliminar.nombre}" eliminado correctamente.`);
    setProductoAEliminar(null);
    cargarDatos();
    setTimeout(() => setAlertaExito(''), 4000);
  };

  return (
    <div>
      {/* Alerta de Seguridad / Guard Fail-Closed (si viene redirigido sin permiso) */}
      {alertaAcceso && (
        <div className="alert alert-danger alert-dismissible fade show shadow-sm mb-4" role="alert">
          <div className="d-flex align-items-center">
            <i className="bi bi-shield-x me-2 fs-5"></i>
            <div>
              <strong>Seguridad LogisTrack:</strong> {alertaAcceso}
            </div>
          </div>
        </div>
      )}

      {/* Alerta de acción exitosa */}
      {alertaExito && (
        <div className="alert alert-success alert-dismissible fade show shadow-sm" role="alert">
          <i className="bi bi-check-circle-fill me-2"></i>
          {alertaExito}
          <button type="button" className="btn-close" onClick={() => setAlertaExito('')}></button>
        </div>
      )}

      {/* Banner de resumen y stock crítico */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h5 className="fw-bold text-dark m-0">Inventario de Productos</h5>
          <small className="text-muted">
            Mostrando <strong>{productosFiltrados.length}</strong> de <strong>{productos.length}</strong> productos registrados
          </small>
        </div>

        <div className="d-flex align-items-center gap-2 flex-wrap">
          <Link to="/admin/productos/criticos" className="btn btn-outline-warning btn-sm d-flex align-items-center gap-2">
            <i className="bi bi-exclamation-triangle-fill text-warning"></i>
            <span>Stock Crítico ({criticos.length})</span>
          </Link>

          {esAdmin && (
            <Link to="/admin/productos/nuevo" className="btn btn-primary btn-sm d-flex align-items-center gap-1">
              <i className="bi bi-plus-circle"></i> Nuevo Producto
            </Link>
          )}
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
                  placeholder="Buscar por código SKU o nombre de producto..."
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
                value={filtroCategoria}
                onChange={(e) => setFiltroCategoria(e.target.value)}
              >
                <option value="todas">Todas las categorías</option>
                {categorias.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de Productos */}
      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-3" style={{ width: '130px' }}>Código / SKU</th>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th className="text-end">Precio Unit.</th>
                  <th className="text-center">Stock</th>
                  <th className="text-center">Estado</th>
                  <th className="text-end pe-3" style={{ width: '140px' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-5 text-muted">
                      <i className="bi bi-inbox fs-1 d-block text-secondary mb-2"></i>
                      No se encontraron productos que coincidan con la búsqueda.
                    </td>
                  </tr>
                ) : (
                  productosFiltrados.map((prod) => {
                    const sku = prod.sku || prod.codigo;
                    const esCritico = Number(prod.stock) <= Number(prod.stockCritico);

                    return (
                      <tr key={sku}>
                        <td className="ps-3 font-monospace fw-semibold text-secondary">{sku}</td>
                        <td>
                          <div className="fw-semibold text-dark">{prod.nombre}</div>
                          <small className="text-muted text-truncate d-inline-block" style={{ maxWidth: '280px' }}>
                            {prod.descripcion}
                          </small>
                        </td>
                        <td>
                          <span className="badge bg-secondary-subtle text-secondary border">
                            {prod.categoriaLabel || prod.categoria}
                          </span>
                        </td>
                        <td className="text-end fw-bold text-dark">
                          ${Number(prod.precio).toLocaleString('es-CL')}
                        </td>
                        <td className="text-center fw-semibold">
                          <span className={esCritico ? 'text-danger fw-bold' : 'text-dark'}>
                            {prod.stock} un.
                          </span>
                          <small className="d-block text-muted" style={{ fontSize: '0.75rem' }}>
                            Mín: {prod.stockCritico}
                          </small>
                        </td>
                        <td className="text-center">
                          {esCritico ? (
                            <span className="badge bg-danger">
                              <i className="bi bi-exclamation-triangle-fill me-1"></i> Crítico
                            </span>
                          ) : (
                            <span className="badge bg-success">Normal</span>
                          )}
                        </td>
                        <td className="text-end pe-3">
                          <div className="btn-group btn-group-sm">
                            <Link
                              to={`/admin/productos/editar/${sku}`}
                              className="btn btn-outline-primary"
                              title={esAdmin ? 'Editar Producto' : 'Ver Detalle'}
                            >
                              <i className={`bi ${esAdmin ? 'bi-pencil-square' : 'bi-eye'}`}></i>
                            </Link>

                            {esAdmin && (
                              <button
                                type="button"
                                className="btn btn-outline-danger"
                                title="Eliminar Producto"
                                onClick={() => setProductoAEliminar(prod)}
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

      {/* Modal de Confirmación para Eliminar */}
      {productoAEliminar && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header bg-danger text-white">
                <h6 className="modal-title fw-bold">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i> Confirmar Eliminación
                </h6>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setProductoAEliminar(null)}
                ></button>
              </div>
              <div className="modal-body py-4">
                <p className="mb-1">¿Estás seguro de que deseas eliminar permanentemente el producto:</p>
                <div className="p-3 bg-light rounded mt-2 border">
                  <strong>{productoAEliminar.nombre}</strong>
                  <div className="small text-muted font-monospace mt-1">
                    Código: {productoAEliminar.sku || productoAEliminar.codigo}
                  </div>
                </div>
                <small className="text-danger mt-2 d-block">
                  Esta acción no se puede deshacer y modificará el inventario en localStorage.
                </small>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setProductoAEliminar(null)}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-danger btn-sm fw-semibold"
                  onClick={handleConfirmarEliminar}
                >
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

export default AdminProductos;
