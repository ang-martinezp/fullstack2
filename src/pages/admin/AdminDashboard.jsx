import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import StatCard from '../../components/admin/StatCard';
import { obtenerProductos, obtenerProductosCriticos } from '../../data/productos';
import { obtenerOrdenes } from '../../data/ordenes';
import { obtenerUsuarios, obtenerRolActivo } from '../../data/usuarios';

function AdminDashboard() {
  const [productos, setProductos] = useState([]);
  const [criticos, setCriticos] = useState([]);
  const [ordenes, setOrdenes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [rolActual, setRolActual] = useState(obtenerRolActivo());

  useEffect(() => {
    const cargarDatos = () => {
      setProductos(obtenerProductos());
      setCriticos(obtenerProductosCriticos());
      setOrdenes(obtenerOrdenes());
      setUsuarios(obtenerUsuarios());
      setRolActual(obtenerRolActivo());
    };

    cargarDatos();

    // Sincronizar en tiempo real si hay cambios en storage o cambio de rol
    window.addEventListener('logistrack_rol_cambiado', cargarDatos);
    window.addEventListener('storage', cargarDatos);

    return () => {
      window.removeEventListener('logistrack_rol_cambiado', cargarDatos);
      window.removeEventListener('storage', cargarDatos);
    };
  }, []);

  const totalVentas = ordenes.reduce((acc, ord) => acc + (Number(ord.total) || 0), 0);
  const esAdmin = rolActual === 'Administrador';

  return (
    <div>
      {/* 1. Fila de Tarjetas de Métricas (KPIs) usando StatCard */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            titulo="Total Catálogo"
            valor={productos.length}
            icono="bi-boxes"
            colorIcono="text-primary"
            subtexto="Productos registrados"
            enlace="/admin/productos"
          />
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            titulo="Stock Crítico"
            valor={criticos.length}
            icono="bi-exclamation-triangle-fill"
            colorIcono="text-warning"
            subtexto={`${criticos.length} ítem(s) bajo mínimo`}
            enlace="/admin/productos/criticos"
          />
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            titulo="Órdenes Registradas"
            valor={ordenes.length}
            icono="bi-receipt-cutoff"
            colorIcono="text-success"
            subtexto={`$${totalVentas.toLocaleString('es-CL')} en ventas`}
            enlace="/admin/ordenes"
          />
        </div>

        {esAdmin ? (
          <div className="col-12 col-sm-6 col-xl-3">
            <StatCard
              titulo="Usuarios Registrados"
              valor={usuarios.length}
              icono="bi-people-fill"
              colorIcono="text-info"
              subtexto="Cuentas activas en sistema"
              enlace="/admin/usuarios"
            />
          </div>
        ) : (
          <div className="col-12 col-sm-6 col-xl-3">
            <StatCard
              titulo="Modo Operador"
              valor="Vendedor"
              icono="bi-shield-check"
              colorIcono="text-secondary"
              subtexto="Acceso operativo activo"
            />
          </div>
        )}
      </div>

      {/* 2. Banner de Alerta Temprana si hay productos críticos */}
      {criticos.length > 0 && (
        <div className="alert alert-warning border-warning shadow-sm d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <div className="d-flex align-items-center gap-3">
            <i className="bi bi-bell-fill fs-3 text-warning"></i>
            <div>
              <h6 className="fw-bold mb-0 text-dark">Alerta de Existencias Críticas</h6>
              <small className="text-muted">
                Hay <strong>{criticos.length}</strong> producto(s) con stock igual o inferior a su umbral crítico.
              </small>
            </div>
          </div>
          <Link to="/admin/productos/criticos" className="btn btn-warning btn-sm fw-semibold">
            <i className="bi bi-box-arrow-up-right me-1"></i> Ver Productos Críticos
          </Link>
        </div>
      )}

      {/* 3. Tabla Resumen de Inventario Reciente */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
          <h6 className="fw-bold text-dark m-0">
            <i className="bi bi-box-seam me-2 text-primary"></i> Estado de Inventario Reciente
          </h6>
          <Link to="/admin/productos" className="btn btn-outline-primary btn-sm">
            Ver Todo el Inventario <i className="bi bi-arrow-right ms-1"></i>
          </Link>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-3">Código / SKU</th>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th className="text-end">Precio</th>
                  <th className="text-center">Stock Actual</th>
                  <th className="text-center">Estado</th>
                </tr>
              </thead>
              <tbody>
                {productos.slice(0, 5).map((p) => {
                  const esCritico = Number(p.stock) <= Number(p.stockCritico);
                  return (
                    <tr key={p.sku || p.codigo}>
                      <td className="ps-3 font-monospace fw-semibold text-secondary">{p.sku || p.codigo}</td>
                      <td className="fw-semibold text-dark">{p.nombre}</td>
                      <td>
                        <span className="badge bg-secondary-subtle text-secondary border">
                          {p.categoriaLabel || p.categoria}
                        </span>
                      </td>
                      <td className="text-end fw-bold text-dark">${Number(p.precio).toLocaleString('es-CL')}</td>
                      <td className="text-center fw-bold">{p.stock} un.</td>
                      <td className="text-center">
                        {esCritico ? (
                          <span className="badge bg-danger">
                            <i className="bi bi-exclamation-circle me-1"></i> Crítico
                          </span>
                        ) : (
                          <span className="badge bg-success">Óptimo</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 4. Módulos de Acceso Rápido (Bento Grid) */}
      <h6 className="fw-bold text-dark mb-3">Módulos Administrativos</h6>
      <div className="row g-3">
        <div className="col-12 col-md-4">
          <Link to="/admin/productos" className="text-decoration-none">
            <div className="card p-3 border-0 shadow-sm h-100 card-hover">
              <div className="d-flex align-items-center gap-3">
                <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-3">
                  <i className="bi bi-boxes fs-4"></i>
                </div>
                <div>
                  <h6 className="fw-bold mb-1 text-dark">Gestión de Productos</h6>
                  <small className="text-muted">Crear, actualizar precios, stock y eliminar productos</small>
                </div>
              </div>
            </div>
          </Link>
        </div>

        <div className="col-12 col-md-4">
          <Link to="/admin/ordenes" className="text-decoration-none">
            <div className="card p-3 border-0 shadow-sm h-100 card-hover">
              <div className="d-flex align-items-center gap-3">
                <div className="bg-success bg-opacity-10 text-success p-3 rounded-3">
                  <i className="bi bi-receipt fs-4"></i>
                </div>
                <div>
                  <h6 className="fw-bold mb-1 text-dark">Órdenes y Boletas</h6>
                  <small className="text-muted">Revisar transacciones y emitir comprobantes tributarios</small>
                </div>
              </div>
            </div>
          </Link>
        </div>

        <div className="col-12 col-md-4">
          <Link to="/admin/reportes" className="text-decoration-none">
            <div className="card p-3 border-0 shadow-sm h-100 card-hover">
              <div className="d-flex align-items-center gap-3">
                <div className="bg-warning bg-opacity-10 text-warning p-3 rounded-3">
                  <i className="bi bi-graph-up fs-4"></i>
                </div>
                <div>
                  <h6 className="fw-bold mb-1 text-dark">Reportes del Negocio</h6>
                  <small className="text-muted">Métricas de rentabilidad y estadísticas de compras</small>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
