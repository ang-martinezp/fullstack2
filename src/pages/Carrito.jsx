import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  obtenerCarrito,
  agregarAlCarrito,
  actualizarCantidadCarrito,
  eliminarDelCarrito,
  vaciarCarrito,
  calcularTotalCarrito,
  calcularPrecioEfectivo
} from '../data/carrito';
import { obtenerProductos } from '../data/productos';
import { formatearCLP } from '../utils/validaciones';

function Carrito() {
  const navigate = useNavigate();
  const [items, setItems] = useState(() => obtenerCarrito());
  const [productosCatalogo] = useState(() => obtenerProductos());
  const [alertaInfo, setAlertaInfo] = useState(true);

  useEffect(() => {
    document.title = 'Carrito de Compras - LogisTrack Store';

    const sincronizar = () => {
      setItems(obtenerCarrito());
    };
    window.addEventListener('logistrack_carrito_actualizado', sincronizar);
    window.addEventListener('storage', sincronizar);
    return () => {
      window.removeEventListener('logistrack_carrito_actualizado', sincronizar);
      window.removeEventListener('storage', sincronizar);
    };
  }, []);

  const handleAgregarRapido = (producto) => {
    setItems(agregarAlCarrito(producto, 1));
  };

  const handleSumar = (item) => {
    setItems(actualizarCantidadCarrito(item.sku, item.cantidad + 1));
  };

  const handleRestar = (item) => {
    setItems(actualizarCantidadCarrito(item.sku, item.cantidad - 1));
  };

  const handleEliminar = (sku) => {
    setItems(eliminarDelCarrito(sku));
  };

  const handleVaciar = () => {
    setItems(vaciarCarrito());
  };

  const handleIrCheckout = () => {
    if (items.length === 0) return;
    navigate('/checkout');
  };

  const total = calcularTotalCarrito(items);

  return (
    <section className="mb-5">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <div>
          <h1 className="h2 fw-bold text-navy mb-1">
            <i className="bi bi-cart3 me-2"></i>Carrito de Compras
          </h1>
          <p className="text-muted small mb-0">
            Revisa tus productos seleccionados o añade artículos directamente desde el catálogo rápido.
          </p>
        </div>
        <Link to="/productos" className="btn btn-outline-primary btn-sm">
          <i className="bi bi-arrow-left me-1"></i>Ver catálogo completo
        </Link>
      </div>

      {alertaInfo && (
        <div className="alert alert-info alert-dismissible fade show shadow-sm mb-4 small" role="alert">
          <i className="bi bi-info-circle-fill me-2"></i>
          <strong>¡Vista Carrito de Compra Reactiva!</strong> La información del carrito se sincroniza en tiempo real y persiste en <code>localStorage</code>.
          <button
            type="button"
            className="btn-close"
            aria-label="Cerrar"
            onClick={() => setAlertaInfo(false)}
          ></button>
        </div>
      )}

      <div className="row g-4 align-items-start">
        {/* Columna Izquierda: Lista rápida de productos (Figura 5 Anexo 1) */}
        <div className="col-12 col-lg-5">
          <div className="card border-0 shadow-sm rounded-4 p-3 p-md-4 bg-white">
            <h2 className="h5 fw-bold text-navy mb-3">Lista de productos</h2>
            <div className="row g-3">
              {productosCatalogo.slice(0, 6).map((prod) => {
                const precioEfectivo = calcularPrecioEfectivo(prod);
                return (
                  <div className="col-6" key={prod.sku}>
                    <div className="card h-100 border rounded-3 shadow-sm">
                      <div
                        className="d-flex align-items-center justify-content-center p-2 position-relative"
                        style={{ height: '100px', backgroundColor: '#eef2f6' }}
                      >
                        {prod.oferta && prod.descuento > 0 && (
                          <span
                            className="badge bg-danger position-absolute m-1"
                            style={{ top: 0, right: 0, fontSize: '0.65rem' }}
                          >
                            -{prod.descuento}%
                          </span>
                        )}
                        {prod.imagen ? (
                          <img
                            src={prod.imagen}
                            alt={prod.nombre}
                            className="img-fluid"
                            style={{ maxHeight: '84px', objectFit: 'contain' }}
                          />
                        ) : (
                          <i className={`bi ${prod.icono} fs-1 text-navy`}></i>
                        )}
                      </div>
                      <div className="card-body p-2 d-flex flex-column">
                        <Link
                          to={`/productos/${prod.sku}`}
                          className="text-decoration-none text-navy fw-bold small mb-1 text-truncate"
                          title={prod.nombre}
                        >
                          {prod.nombre}
                        </Link>
                        <small className="text-muted" style={{ fontSize: '0.72rem' }}>
                          Stock: {prod.stock}
                        </small>
                        <div className="mt-auto pt-2">
                          <div className="fw-bold text-danger small mb-2">
                            {formatearCLP(precioEfectivo)}
                          </div>
                          <button
                            type="button"
                            className="btn btn-dark btn-sm w-100 py-1"
                            onClick={() => handleAgregarRapido(prod)}
                          >
                            <i className="bi bi-cart-plus me-1"></i>Añadir
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Columna Derecha: Tabla Carrito de Compras (Figura 5 Anexo 1) */}
        <div className="col-12 col-lg-7">
          <div className="card border-0 shadow-sm rounded-4 p-3 p-md-4 bg-white">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="h5 fw-bold text-navy mb-0">Carrito de Compras</h2>
              <span className="badge bg-navy">
                {items.reduce((acc, it) => acc + it.cantidad, 0)} unidad(es)
              </span>
            </div>

            {items.length === 0 ? (
              <div className="text-center py-5" id="carrito-vacio">
                <i className="bi bi-cart-x display-3 text-muted"></i>
                <h3 className="h5 fw-bold text-navy mt-3">Tu carrito está vacío</h3>
                <p className="text-muted small mb-3">
                  Haz clic en &ldquo;Añadir&rdquo; en la lista de productos o explora el catálogo.
                </p>
                <Link to="/productos" className="btn btn-brand btn-sm px-4">
                  Ir al catálogo
                </Link>
              </div>
            ) : (
              <>
                <div className="table-responsive">
                  <table className="table align-middle mb-0">
                    <thead className="table-light small">
                      <tr>
                        <th style={{ width: '60px' }}>Imagen</th>
                        <th>Nombre</th>
                        <th className="text-end">Precio</th>
                        <th className="text-center" style={{ width: '130px' }}>Cantidad</th>
                        <th className="text-end">Subtotal</th>
                        <th className="text-end">Acciones</th>
                      </tr>
                    </thead>
                    <tbody id="carrito-filas">
                      {items.map((item) => (
                        <tr key={item.sku} className="carrito-item">
                          <td>
                            <div
                              className="rounded d-flex align-items-center justify-content-center"
                              style={{ width: '48px', height: '48px', backgroundColor: '#eef2f6' }}
                            >
                              {item.imagen ? (
                                <img
                                  src={item.imagen}
                                  alt={item.nombre}
                                  className="img-fluid"
                                  style={{ maxHeight: '40px', objectFit: 'contain' }}
                                />
                              ) : (
                                <i className={`bi ${item.icono} fs-4 text-navy`}></i>
                              )}
                            </div>
                          </td>
                          <td>
                            <div className="fw-semibold text-navy small">{item.nombre}</div>
                            <small className="text-muted font-monospace" style={{ fontSize: '0.72rem' }}>
                              {item.sku}
                            </small>
                          </td>
                          <td className="text-end small">{formatearCLP(item.precio)}</td>
                          <td className="text-center">
                            <div className="input-group input-group-sm mx-auto" style={{ width: '110px' }}>
                              <button
                                className="btn btn-outline-secondary"
                                type="button"
                                aria-label={`Disminuir cantidad de ${item.nombre}`}
                                onClick={() => handleRestar(item)}
                              >
                                -
                              </button>
                              <input
                                type="text"
                                className="form-control text-center px-1"
                                value={item.cantidad}
                                readOnly
                                aria-label="Cantidad"
                              />
                              <button
                                className="btn btn-outline-secondary"
                                type="button"
                                aria-label={`Aumentar cantidad de ${item.nombre}`}
                                onClick={() => handleSumar(item)}
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="text-end fw-bold small text-navy">
                            {formatearCLP(item.subtotal)}
                          </td>
                          <td className="text-end">
                            <button
                              className="btn btn-danger btn-sm"
                              type="button"
                              title="Eliminar producto"
                              onClick={() => handleEliminar(item.sku)}
                            >
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mt-4 pt-3 border-top">
                  <div className="fs-5 fw-bold text-navy">
                    Total: <span id="carrito-total">{formatearCLP(total)}</span>
                  </div>
                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      id="btn-vaciar-carrito"
                      onClick={handleVaciar}
                    >
                      <i className="bi bi-trash me-1"></i>Limpiar
                    </button>
                    <button
                      type="button"
                      className="btn btn-success fw-semibold px-4"
                      id="btn-comprar-ahora"
                      onClick={handleIrCheckout}
                    >
                      <i className="bi bi-bag-check me-1"></i>Comprar ahora
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Carrito;
