import { Link } from 'react-router-dom';
import { obtenerProductosEnOferta } from '../data/productos';

function formatearCLP(numero) {
    return '$' + numero.toLocaleString('es-CL');
}

function Ofertas() {
    const productos = obtenerProductosEnOferta();

    return (
        <section className="mb-5">
            <div className="text-center mb-4">
                <h1 className="fw-bold text-navy">Ofertas</h1>
                <p className="text-muted">Productos con descuento por tiempo limitado.</p>
            </div>

            {productos.length === 0 ? (
                <div className="alert alert-info text-center">No hay ofertas activas por ahora.</div>
            ) : (
                <div className="row g-4">
                    {productos.map(producto => {
                        const precioFinal = Math.round(producto.precio * (1 - producto.descuento / 100));
                        return (
                            <div className="col-12 col-md-6 col-lg-4" key={producto.sku}>
                                <div className="card h-100 shadow-sm card-hover position-relative">
                                    <span
                                        className="badge bg-danger position-absolute m-2"
                                        style={{ top: 0, right: 0, zIndex: 1 }}
                                    >
                                        -{producto.descuento}%
                                    </span>
                                    <div className="img-card-fit d-flex align-items-center justify-content-center">
                                        {producto.imagen ? (
                                            <img
                                                src={producto.imagen}
                                                alt={producto.nombre}
                                                className="img-fluid"
                                                style={{ maxHeight: '160px', objectFit: 'contain' }}
                                            />
                                        ) : (
                                            <i className={`bi ${producto.icono} display-3 text-navy`}></i>
                                        )}
                                    </div>
                                    <div className="card-body d-flex flex-column">
                                        <span className="badge bg-navy mb-2 align-self-start">
                                            {producto.categoriaLabel}
                                        </span>
                                        <h3 className="card-title h5 fw-bold text-navy">{producto.nombre}</h3>
                                        <p className="card-text text-muted flex-grow-1">{producto.descripcion}</p>
                                        <div className="d-flex justify-content-between align-items-center pt-3 border-top mt-3">
                                            <div>
                                                <span className="text-muted text-decoration-line-through me-2">
                                                    {formatearCLP(producto.precio)}
                                                </span>
                                                <span className="fs-5 fw-bold text-navy">
                                                    {formatearCLP(precioFinal)}
                                                </span>
                                            </div>
                                            <Link to={`/productos/${producto.sku}`} className="btn btn-brand">
                                                Ver detalle <i className="bi bi-arrow-right ms-1"></i>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
}

export default Ofertas;