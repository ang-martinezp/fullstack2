import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { obtenerProductos } from '../data/productos';
import ProductoCard from '../components/ProductoCard';

const SKUS_DESTACADOS = ['SKU-001', 'SKU-002', 'SKU-005'];

function Home() {
    const location = useLocation();
    const alertaAcceso = location.state?.alertaAcceso;

    useEffect(() => {
        document.title = 'LogisTrack Store - Tienda Online';
    }, []);

    const productosDestacados = obtenerProductos().filter(p =>
        SKUS_DESTACADOS.includes(p.sku)
    );

    return (
        <>
            {/* Alerta de Seguridad / Guard Fail-Closed (si viene redirigido sin permiso) */}
            {alertaAcceso && (
                <div className="alert alert-danger alert-dismissible fade show shadow-sm mb-4" role="alert">
                    <div className="d-flex align-items-center">
                        <i className="bi bi-shield-x me-2 fs-4"></i>
                        <div>
                            <strong>Seguridad LogisTrack:</strong> {alertaAcceso}
                        </div>
                    </div>
                </div>
            )}

            {/* SECCIÓN 1: HERO BANNER */}
            <section className="hero-banner p-5 mb-5 rounded-4 text-white shadow">
                <div className="row align-items-center">
                    <div className="col-lg-8">
                        <span className="badge bg-primary px-3 py-2 text-uppercase mb-3 fw-semibold">
                            <i className="bi bi-shield-check me-1"></i> Plataforma Oficial LogisTrack
                        </span>
                        <h2 className="display-5 fw-bold mb-3">
                            Equipamiento Tecnológico y de Oficina para tu Empresa
                        </h2>
                        <p className="lead mb-4 text-light opacity-90">
                            Notebooks, periféricos, insumos de oficina y mantención, con stock sincronizado
                            directamente desde nuestro inventario.
                        </p>
                        <div className="d-flex flex-wrap gap-3">
                            <Link to="/productos" className="btn btn-brand btn-lg shadow">
                                <i className="bi bi-grid-3x3-gap me-1"></i> Explorar Catálogo
                            </Link>
                            <Link to="/registro" className="btn btn-outline-light btn-lg">
                                <i className="bi bi-person-plus me-1"></i> Crear Cuenta
                            </Link>
                        </div>
                    </div>
                    <div className="col-lg-4 text-center mt-4 mt-lg-0 d-none d-lg-block">
                        <i className="bi bi-laptop display-1 text-accent opacity-75"></i>
                    </div>
                </div>
            </section>

            {/* SECCIÓN 2: PRODUCTOS DESTACADOS */}
            <section className="mb-5">
                <div className="text-center mb-4">
                    <h2 className="fw-bold text-navy">Productos Destacados</h2>
                    <p className="text-muted">Una muestra de nuestro catálogo. Iremos sumando más productos.</p>
                </div>

                <div className="row g-4">
                    {productosDestacados.map(producto => (
                        <ProductoCard producto={producto} key={producto.sku} />
                    ))}
                </div>
            </section>

            {/* SECCIÓN 3: VIDEO YOUTUBE */}
            <section className="card shadow-sm p-4 p-md-5 mb-5 rounded-4 border-0">
                <div className="text-center mb-4">
                    <h2 className="fw-bold text-navy">GEFORCE RTX50 SERIES!</h2>
                    <p className="text-muted">Conoce la ultima generación de Nvidia con toda la potencia!</p>
                </div>
                <div className="row justify-content-center">
                    <div className="col-lg-10">
                        <div className="ratio ratio-16x9 rounded-3 shadow overflow-hidden">
                            <iframe
                                src="https://www.youtube.com/embed/QEJQXs9SYzA"
                                title="Nvidia RTX50 SERIES"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            ></iframe>
                        </div>
                        <p className="text-center text-muted mt-3 mb-0">
                            <i className="bi bi-info-circle me-1"></i> Video publicitario de la serie RTX50 de Nvidia.
                        </p>
                    </div>
                </div>
            </section>

            {/* SECCIÓN 4: BENEFICIOS */}
            <section className="mb-4">
                <div className="text-center mb-4">
                    <h2 className="fw-bold text-navy">Ventajas de Comprar con Nosotros</h2>
                    <p className="text-muted">
                        Garantizamos continuidad y abastecimiento oportuno en toda la Región Metropolitana.
                    </p>
                </div>
                <div className="row g-4 text-center">
                    <div className="col-md-4">
                        <div className="card h-100 p-4 border-0 shadow-sm rounded-4">
                            <i className="bi bi-clock-history display-4 text-primary mb-3"></i>
                            <h3 className="h5 fw-bold text-navy">Despacho 24 a 48 Horas</h3>
                            <p className="text-muted mb-0">Entregas programadas en toda la región.</p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card h-100 p-4 border-0 shadow-sm rounded-4">
                            <i className="bi bi-box-seam display-4 text-primary mb-3"></i>
                            <h3 className="h5 fw-bold text-navy">Stock Siempre Disponible</h3>
                            <p className="text-muted mb-0">Control de inventario sincronizado para evitar quiebres de stock.</p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card h-100 p-4 border-0 shadow-sm rounded-4">
                            <i className="bi bi-shield-lock display-4 text-primary mb-3"></i>
                            <h3 className="h5 fw-bold text-navy">Garantía y Soporte</h3>
                            <p className="text-muted mb-0">Productos con garantía y soporte postventa.</p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Home;
