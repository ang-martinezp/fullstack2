import { useEffect } from 'react';

function Nosotros() {
    useEffect(() => {
        document.title = 'Nosotros - LogisTrack Store';
    }, []);

    return (
        <>
            <section className="mb-5 text-center">
                <span className="badge bg-primary px-3 py-2 text-uppercase mb-3 fw-semibold">
                    <i className="bi bi-info-circle me-1"></i> Sobre el proyecto
                </span>
                <h1 className="fw-bold text-navy">¿Qué es LogisTrack Store?</h1>
                <p className="lead text-muted mx-auto" style={{ maxWidth: '720px' }}>
                    LogisTrack Store es la tienda online que estamos construyendo para la asignatura Desarrollo
                    FullStack II (DSY1104). Su diseño está pensado para integrarse, en evaluaciones futuras, con
                    los microservicios del backend LogisTrack (autenticación, productos, inventario y órdenes).
                </p>
            </section>

            <section className="mb-5">
                <div className="row g-4 text-center">
                    <div className="col-md-4">
                        <div className="card h-100 p-4 border-0 shadow-sm rounded-4">
                            <i className="bi bi-code-slash display-4 text-primary mb-3"></i>
                            <h3 className="h5 fw-bold text-navy">HTML5 + CSS3</h3>
                            <p className="text-muted mb-0">Estructura semántica y hoja de estilos externa compartida por todo el sitio.</p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card h-100 p-4 border-0 shadow-sm rounded-4">
                            <i className="bi bi-braces display-4 text-primary mb-3"></i>
                            <h3 className="h5 fw-bold text-navy">React + Vite</h3>
                            <p className="text-muted mb-0">Componentes, estado y props para el catálogo, carrito y formularios.</p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card h-100 p-4 border-0 shadow-sm rounded-4">
                            <i className="bi bi-diagram-3 display-4 text-primary mb-3"></i>
                            <h3 className="h5 fw-bold text-navy">Bootstrap 5.3</h3>
                            <p className="text-muted mb-0">Framework de diseño responsivo, con plan de integrarlo a futuro con el backend LogisTrack.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mb-4">
                <div className="text-center mb-4">
                    <h2 className="fw-bold text-navy">Nuestro Equipo</h2>
                    <p className="text-muted">3 estudiantes, 3 bloques de trabajo.</p>
                </div>

                <div className="row g-4">
                    <div className="col-md-4">
                        <div className="card h-100 shadow-sm card-hover text-center p-4">
                            <i className="bi bi-person-circle display-3 text-navy mb-3"></i>
                            <h3 className="h5 fw-bold text-navy mb-1">Angel Martinez</h3>
                            <span className="badge bg-navy mb-2 align-self-center">Bloque Tienda · Catálogo</span>
                            <p className="text-muted small mb-0">Home, catálogo, detalle de producto, categorías, ofertas y carrito.</p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card h-100 shadow-sm card-hover text-center p-4">
                            <i className="bi bi-person-circle display-3 text-navy mb-3"></i>
                            <h3 className="h5 fw-bold text-navy mb-1">Alfredo De La Hoz</h3>
                            <span className="badge bg-navy mb-2 align-self-center">Bloque Cuentas · Formularios</span>
                            <p className="text-muted small mb-0">Inicio de sesión, registro de usuario y checkout.</p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card h-100 shadow-sm card-hover text-center p-4">
                            <i className="bi bi-person-circle display-3 text-navy mb-3"></i>
                            <h3 className="h5 fw-bold text-navy mb-1">Oliver Duncan</h3>
                            <span className="badge bg-navy mb-2 align-self-center">Bloque Administrador</span>
                            <p className="text-muted small mb-0">Panel administrador: productos, usuarios y control de acceso por rol.</p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Nosotros;