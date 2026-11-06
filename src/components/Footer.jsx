function Footer() {
  return (
    <footer className="bg-navy text-light pt-5 mt-auto">
      <div className="container pb-4">
        <div className="row g-4">
          <div className="col-lg-4 col-md-6">
            <h4 className="h5 fw-bold text-white mb-3">Sobre LogisTrack</h4>
            <p className="text-secondary small">
              Tienda online y panel de gestión conectados conceptualmente con los microservicios de
              LogisTrack (auth-service, product-service, order-service).
            </p>
          </div>
          <div className="col-lg-4 col-md-6">
            <h4 className="h5 fw-bold text-white mb-3">Navegación Rápida</h4>
            <ul className="list-unstyled">
              <li className="mb-2"><a href="/">Home</a></li>
              <li className="mb-2"><a href="/productos">Productos</a></li>
              <li className="mb-2"><a href="/nosotros">Nosotros</a></li>
              <li className="mb-2"><a href="/contacto">Contacto</a></li>
            </ul>
          </div>
          <div className="col-lg-4 col-md-12">
            <h4 className="h5 fw-bold text-white mb-3">Contacto</h4>
            <p className="text-secondary small mb-1"><i className="bi bi-telephone me-2"></i>+56 2 2345 6789</p>
            <p className="text-secondary small mb-1"><i className="bi bi-envelope me-2"></i>contacto@logistrack.cl</p>
          </div>
        </div>
      </div>
      <div className="footer-copy py-3 text-center text-secondary border-top border-secondary border-opacity-25">
        <div className="container">
          <small>
            Evaluación Parcial N° 2 - DSY1104 Desarrollo FullStack II | Equipo: <strong>Alfredo De La Hoz</strong>, <strong>Angel Martinez</strong> y <strong>Oliver Duncan</strong> | Duoc UC 2026
          </small>
        </div>
      </div>
    </footer>
  );
}

export default Footer;