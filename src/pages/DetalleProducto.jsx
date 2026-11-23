import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { obtenerProductoPorSku } from '../data/productos';
import { agregarAlCarrito, calcularPrecioEfectivo } from '../data/carrito';

function formatearCLP(numero) {
  return '$' + Number(numero || 0).toLocaleString('es-CL');
}

function DetalleProducto() {
  const { sku } = useParams();
  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [cantidad, setCantidad] = useState(1);
  const [mensajeVisible, setMensajeVisible] = useState(false);
  const [mensajeErrorStock, setMensajeErrorStock] = useState('');

  useEffect(() => {
    let montado = true;
    setCargando(true);

    obtenerProductoPorSku(sku)
      .then((data) => {
        if (!montado) return;
        setProducto(data);
        document.title = data ? `${data.nombre} - LogisTrack Store` : 'Producto no encontrado';
      })
      .catch((err) => console.error('Error cargando detalle:', err))
      .finally(() => {
        if (montado) setCargando(false);
      });

    return () => { montado = false; };
  }, [sku]);

  if (cargando) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-2 text-muted">Consultando disponibilidad y stock en tiempo real...</p>
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="text-center py-5">
        <h2 className="text-navy fw-bold">Producto no encontrado</h2>
        <p className="text-muted">El SKU que buscas no existe en el catálogo.</p>
        <Link to="/productos" className="btn btn-brand">Volver a productos</Link>
      </div>
    );
  }

  const precioFinal = calcularPrecioEfectivo(producto);
  const stockReal = Number(producto.stock ?? 0);
  const sinStock = stockReal <= 0;

  const restar = () => setCantidad((act) => Math.max(1, act - 1));
  const sumar = () => setCantidad((act) => Math.min(stockReal, act + 1));

  const handleAgregar = () => {
    if (cantidad > stockReal) {
      setMensajeErrorStock(`Solo hay ${stockReal} unidad(es) disponible(s) en bodega.`);
      return;
    }
    setMensajeErrorStock('');
    agregarAlCarrito(producto, cantidad);
    setMensajeVisible(true);
    setTimeout(() => setMensajeVisible(false), 2500);
  };

  return (
    <div className="row g-5 align-items-start">
      <div className="col-md-5">
        <div
          className="card border-0 shadow-sm rounded-4 d-flex align-items-center justify-content-center overflow-hidden position-relative"
          style={{ background: '#eef2f6', minHeight: '320px' }}
        >
          {producto.oferta && producto.descuento > 0 && (
            <span
              className="badge bg-danger position-absolute m-3 fs-6"
              style={{ top: 0, right: 0, zIndex: 1 }}
            >
              -{producto.descuento}%
            </span>
          )}
          {producto.imagen ? (
            <img src={producto.imagen} alt={producto.nombre} className="img-fluid" style={{ maxHeight: '320px', objectFit: 'contain' }} />
          ) : (
            <i className={`bi ${producto.icono} display-1 text-navy p-5`}></i>
          )}
        </div>
      </div>

      <div className="col-md-7">
        <span className="badge bg-navy mb-2">{producto.categoriaLabel}</span>
        <h1 className="h2 fw-bold text-navy">{producto.nombre}</h1>
        
        {/* Disponibilidad real en bodega consultada a inventory-service */}
        <div className="d-flex align-items-center gap-2 mb-3">
          <span className="text-muted">SKU: {producto.sku} ·</span>
          {sinStock ? (
            <span className="badge bg-danger">Agotado (0 unidades)</span>
          ) : (
            <span className={`badge ${stockReal <= (producto.stockCritico || 3) ? 'bg-warning text-dark' : 'bg-success'}`}>
              Stock disponible: {stockReal} unidades
            </span>
          )}
        </div>

        <p className="lead">{producto.descripcion}</p>

        {producto.oferta && producto.descuento > 0 ? (
          <div className="mb-4">
            <span className="text-muted text-decoration-line-through fs-4 me-3">
              {formatearCLP(producto.precio)}
            </span>
            <span className="display-6 fw-bold text-navy">
              {formatearCLP(precioFinal)}
            </span>
          </div>
        ) : (
          <p className="display-6 fw-bold text-navy mb-4">{formatearCLP(producto.precio)}</p>
        )}

        {!sinStock && (
          <div className="d-flex align-items-center gap-3 mb-4">
            <label htmlFor="cantidad" className="form-label mb-0 fw-semibold">Cantidad</label>
            <div className="input-group" style={{ width: '140px' }}>
              <button className="btn btn-outline-secondary" type="button" onClick={restar}>-</button>
              <input
                type="number"
                className="form-control text-center"
                id="cantidad"
                value={cantidad}
                min="1"
                max={stockReal}
                onChange={(e) => setCantidad(Math.max(1, Math.min(stockReal, parseInt(e.target.value, 10) || 1)))}
              />
              <button className="btn btn-outline-secondary" type="button" onClick={sumar}>+</button>
            </div>
          </div>
        )}

        {mensajeErrorStock && (
          <div className="alert alert-danger py-2 small mb-3">
            <i className="bi bi-exclamation-circle me-1"></i> {mensajeErrorStock}
          </div>
        )}

        <div className="d-flex flex-wrap gap-2">
          <button
            className="btn btn-brand btn-lg"
            onClick={handleAgregar}
            disabled={sinStock}
          >
            <i className="bi bi-cart-plus me-1"></i> {sinStock ? 'Sin Stock' : 'Añadir al carrito'}
          </button>
          <Link to="/carrito" className="btn btn-outline-primary btn-lg">
            <i className="bi bi-cart3 me-1"></i> Ver carrito
          </Link>
        </div>

        <div className="row mt-5">
          <div className="col-12">
            <h3 className="h4 fw-bold text-navy border-bottom pb-2 mb-3">Descripción del producto</h3>
            <p className="text-muted" style={{ whiteSpace: 'pre-line', fontSize: '18px' }}>
              {producto.descripcionLarga || producto.descripcion}
            </p>
          </div>
        </div>

        {mensajeVisible && (
          <div className="alert alert-success mt-3" role="alert">
            <i className="bi bi-check-circle me-1"></i> Producto agregado al carrito exitosamente.
          </div>
        )}
      </div>
    </div>
  );
}

export default DetalleProducto;