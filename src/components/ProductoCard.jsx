import { Link } from 'react-router-dom';

function formatearCLP(numero) {
  return '$' + numero.toLocaleString('es-CL');
}

function ProductoCard({ producto }) {
  return (
    <article className="col-12 col-md-6 col-lg-4">
      <div className="card h-100 shadow-sm card-hover">
        <div className="img-card-fit d-flex align-items-center justify-content-center overflow-hidden">
          {producto.imagen ? (
            <img src={producto.imagen} alt={producto.nombre} className="img-fluid" style={{ maxHeight: '100%', objectFit: 'cover' }} />
          ) : (
            <i className={`bi ${producto.icono} display-3 text-navy`}></i>
          )}
        </div>
        <div className="card-body d-flex flex-column">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="badge bg-navy">{producto.categoriaLabel}</span>
            <small className="text-muted">{producto.sku}</small>
          </div>
          <h3 className="card-title h5 fw-bold text-navy">{producto.nombre}</h3>
          <p className="card-text text-muted small flex-grow-1">{producto.descripcion}</p>
          <div className="d-flex justify-content-between align-items-center pt-3 border-top mt-3">
            <span className="fs-4 fw-bold text-navy">{formatearCLP(producto.precio)}</span>
            <Link to={`/productos/${producto.sku}`} className="btn btn-brand btn-sm px-3">
              Ver detalle <i className="bi bi-arrow-right ms-1"></i>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

export default ProductoCard;