import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { obtenerProductos } from '../../data/productos';
import { obtenerOrdenes } from '../../data/ordenes';
import { obtenerCategorias } from '../../data/categorias';
import { obtenerUsuarios } from '../../data/usuarios';

function AdminReportes() {
  const [productos, setProductos] = useState([]);
  const [ordenes, setOrdenes] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [filtroPeriodo, setFiltroPeriodo] = useState('todos');

  useEffect(() => {
    setProductos(obtenerProductos());
    setOrdenes(obtenerOrdenes());
    setCategorias(obtenerCategorias());
    setUsuarios(obtenerUsuarios());
  }, []);

  // 1. Cálculos de Negocio
  const totalFacturado = ordenes.reduce((acc, o) => acc + (Number(o.total) || 0), 0);
  const promedioOrden = ordenes.length > 0 ? Math.round(totalFacturado / ordenes.length) : 0;
  const valorInventario = productos.reduce((acc, p) => acc + (Number(p.precio) * Number(p.stock || 0)), 0);
  const totalUnidadesStock = productos.reduce((acc, p) => acc + Number(p.stock || 0), 0);

  // Unidades vendidas estimadas a partir de ítems de órdenes
  const unidadesVendidas = ordenes.reduce((acc, o) => {
    const items = o.items || [];
    return acc + items.reduce((sub, it) => sub + (Number(it.cantidad) || 1), 0);
  }, 0);

  // 2. Reporte por Categoría
  const reporteCategorias = categorias.map((cat) => {
    const prodsCat = productos.filter(
      (p) =>
        (p.categoria && p.categoria.toLowerCase() === cat.slug.toLowerCase()) ||
        (p.categoriaLabel && p.categoriaLabel.toLowerCase() === cat.label.toLowerCase())
    );

    const stockTotal = prodsCat.reduce((acc, p) => acc + Number(p.stock || 0), 0);
    const valorCat = prodsCat.reduce((acc, p) => acc + (Number(p.precio) * Number(p.stock || 0)), 0);
    const porcentajeInventario = valorInventario > 0 ? ((valorCat / valorInventario) * 100).toFixed(1) : 0;

    return {
      slug: cat.slug,
      label: cat.label,
      icono: cat.icono || 'bi-tag',
      cantidadProductos: prodsCat.length,
      stockTotal,
      valorizacion: valorCat,
      porcentajeInventario
    };
  });

  // 3. Reporte por Estado de Orden
  const estadosOrdenes = ['Entregado', 'Pendiente', 'En despacho', 'Cancelada'];
  const reporteEstados = estadosOrdenes.map((est) => {
    const ords = ordenes.filter((o) => o.estado === est);
    const monto = ords.reduce((acc, o) => acc + (Number(o.total) || 0), 0);
    const porcentaje = totalFacturado > 0 ? ((monto / totalFacturado) * 100).toFixed(1) : 0;
    return {
      estado: est,
      cantidad: ords.length,
      monto,
      porcentaje
    };
  });

  const handleImprimir = () => {
    window.print();
  };

  return (
    <div>
      {/* Breadcrumb & Acciones */}
      <div className="d-print-none mb-3">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb small mb-2">
            <li className="breadcrumb-item"><Link to="/admin">Dashboard</Link></li>
            <li className="breadcrumb-item active" aria-current="page">Reportes y Métricas</li>
          </ol>
        </nav>

        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 pb-3 border-bottom">
          <div>
            <h5 className="fw-bold text-dark m-0">Reporte Analítico del Negocio</h5>
            <small className="text-muted">Métricas consolidadas de ventas, inventario y rendimiento por categoría</small>
          </div>

          <div className="d-flex align-items-center gap-2">
            <select
              className="form-select form-select-sm"
              style={{ width: '180px' }}
              value={filtroPeriodo}
              onChange={(e) => setFiltroPeriodo(e.target.value)}
            >
              <option value="todos">Todo el Histórico</option>
              <option value="mes">Mes en Curso (2026)</option>
              <option value="trimestre">Tercer Trimestre 2026</option>
            </select>
            <button type="button" className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1" onClick={handleImprimir}>
              <i className="bi bi-printer"></i> Imprimir Informe
            </button>
          </div>
        </div>
      </div>

      {/* 4 KPIs Clave */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card shadow-sm border-0 p-3 h-100 bg-white">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted text-uppercase fw-semibold">Ingresos Totales</small>
                <h3 className="fw-bold my-1 text-success">${totalFacturado.toLocaleString('es-CL')}</h3>
                <small className="text-secondary">{ordenes.length} órdenes facturadas</small>
              </div>
              <div className="bg-success bg-opacity-10 text-success p-3 rounded-3 fs-3">
                <i className="bi bi-cash-stack"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card shadow-sm border-0 p-3 h-100 bg-white">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted text-uppercase fw-semibold">Ticket Promedio</small>
                <h3 className="fw-bold my-1 text-primary">${promedioOrden.toLocaleString('es-CL')}</h3>
                <small className="text-secondary">Por transacción de cliente</small>
              </div>
              <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-3 fs-3">
                <i className="bi bi-cart-check"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card shadow-sm border-0 p-3 h-100 bg-white">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted text-uppercase fw-semibold">Valor Inventario</small>
                <h3 className="fw-bold my-1 text-dark">${valorInventario.toLocaleString('es-CL')}</h3>
                <small className="text-secondary">{totalUnidadesStock} unidades en stock</small>
              </div>
              <div className="bg-warning bg-opacity-10 text-warning p-3 rounded-3 fs-3">
                <i className="bi bi-box-seam"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card shadow-sm border-0 p-3 h-100 bg-white">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted text-uppercase fw-semibold">Unidades Vendidas</small>
                <h3 className="fw-bold my-1 text-info">{unidadesVendidas}</h3>
                <small className="text-secondary">{usuarios.length} clientes registrados</small>
              </div>
              <div className="bg-info bg-opacity-10 text-info p-3 rounded-3 fs-3">
                <i className="bi bi-bag-check"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla 1: Desglose por Categoría */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
          <h6 className="fw-bold text-dark m-0">
            <i className="bi bi-tags me-2 text-primary"></i> Rendimiento e Inventario por Categoría
          </h6>
          <span className="badge bg-light text-dark border">{categorias.length} categorías</span>
        </div>

        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-3">Categoría</th>
                  <th className="text-center">Productos</th>
                  <th className="text-center">Stock Disponible</th>
                  <th className="text-end">Valorización en Bodega</th>
                  <th className="text-center" style={{ width: '220px' }}>% Participación</th>
                </tr>
              </thead>
              <tbody>
                {reporteCategorias.map((c) => (
                  <tr key={c.slug}>
                    <td className="ps-3">
                      <div className="d-flex align-items-center gap-2">
                        <i className={`bi ${c.icono} text-primary fs-5`}></i>
                        <div>
                          <strong className="text-dark">{c.label}</strong>
                          <small className="text-muted d-block font-monospace">{c.slug}</small>
                        </div>
                      </div>
                    </td>
                    <td className="text-center fw-semibold">{c.cantidadProductos} ítems</td>
                    <td className="text-center">{c.stockTotal} un.</td>
                    <td className="text-end fw-bold text-dark">${c.valorizacion.toLocaleString('es-CL')}</td>
                    <td className="text-center">
                      <div className="d-flex align-items-center gap-2">
                        <div className="progress flex-grow-1" style={{ height: '8px' }}>
                          <div
                            className="progress-bar bg-primary"
                            role="progressbar"
                            style={{ width: `${c.porcentajeInventario}%` }}
                            aria-valuenow={c.porcentajeInventario}
                            aria-valuemin="0"
                            aria-valuemax="100"
                          ></div>
                        </div>
                        <span className="small text-muted fw-bold" style={{ width: '42px' }}>
                          {c.porcentajeInventario}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Tabla 2: Estado de las Transacciones */}
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
          <h6 className="fw-bold text-dark m-0">
            <i className="bi bi-pie-chart me-2 text-success"></i> Estado del Flujo de Órdenes y Entregas
          </h6>
          <span className="text-muted small">Total: {ordenes.length} órdenes</span>
        </div>

        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-3">Estado de la Orden</th>
                  <th className="text-center">Cantidad</th>
                  <th className="text-end">Monto Total</th>
                  <th className="text-center">% del Monto Total</th>
                </tr>
              </thead>
              <tbody>
                {reporteEstados.map((e) => {
                  let badge = 'bg-secondary';
                  if (e.estado === 'Entregado') badge = 'bg-success';
                  if (e.estado === 'Pendiente') badge = 'bg-warning text-dark';
                  if (e.estado === 'En despacho') badge = 'bg-info text-dark';
                  if (e.estado === 'Cancelada') badge = 'bg-danger';

                  return (
                    <tr key={e.estado}>
                      <td className="ps-3">
                        <span className={`badge ${badge} px-3 py-1`}>{e.estado}</span>
                      </td>
                      <td className="text-center fw-bold">{e.cantidad}</td>
                      <td className="text-end fw-bold text-dark">${e.monto.toLocaleString('es-CL')}</td>
                      <td className="text-center text-muted fw-semibold">{e.porcentaje}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminReportes;
