import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { obtenerProductoPorSku } from '../data/productos';

const CLAVE_CARRITO = 'logistrack_carrito';

function formatearCLP(numero) {
  return '$' + numero.toLocaleString('es-CL');
}

function agregarAlCarrito(producto, cantidad) {
  const carrito = JSON.parse(localStorage.getItem(CLAVE_CARRITO) || '[]');
  const existente = carrito.find((item) => item.codigo === producto.sku);
  if (existente) {
    existente.cantidad += cantidad;
  } else {
    carrito.push({
      codigo: producto.sku,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad,
    });
  }
  localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
}

function DetalleProducto() {
  const { sku } = useParams();
  const producto = obtenerProductoPorSku(sku);
  const [cantidad, setCantidad] = useState(1);
  const [mensajeVisible, setMensajeVisible] = useState(false);

  useEffect(() => {
    document.title = producto
      ? `${producto.nombre} - LogisTrack Store`
      : 'Producto no encontrado - LogisTrack Store';
  }, [producto]);

  if (!producto) {
    return (
      <div className="text-center py-5">
        <h2 className="text-navy fw-bold">Producto no encontrado</h2>
        <p className="text-muted">El SKU que buscas no existe en el catálogo.</p>
        <Link to="/productos" className="btn btn-brand">Volver a productos</Link>
      </div>
    );
  }

  const restar = () => setCantidad((actual) => Math.max(1, actual - 1));
  const sumar = () => setCantidad((actual) => actual + 1);

  const handleAgregar = () => {
    agregarAlCarrito(producto, cantidad);
    setMensajeVisible(true);
    setTimeout(() => setMensajeVisible(false), 2500);
  };

  return (
    <div className="row g-5 align-items-start">
      <div className="col-md-5">
        <div
          className="card border-0 shadow-sm rounded-4 d-flex align-items-center justify-content-center overflow-hidden"
          style={{ background: '#eef2f6', minHeight: '320px' }}
        >
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
        <p className="text-muted">SKU: {producto.sku}</p>
        <p className="lead">{producto.descripcion}</p>
        <p className="display-6 fw-bold text-navy mb-4">{formatearCLP(producto.precio)}</p>

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
              onChange={(e) => setCantidad(Math.max(1, parseInt(e.target.value, 10) || 1))}
            />
            <button className="btn btn-outline-secondary" type="button" onClick={sumar}>+</button>
          </div>
        </div>

        <button className="btn btn-brand btn-lg" onClick={handleAgregar}>
          <i className="bi bi-cart-plus me-1"></i> Añadir al carrito
        </button>

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
            <i className="bi bi-check-circle me-1"></i> Producto agregado al carrito.
          </div>
        )}
      </div>
    </div>
  );
}

export default DetalleProducto;