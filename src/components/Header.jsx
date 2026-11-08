import { Link } from 'react-router-dom';

function Header({ cantidadCarrito = 0 }) {
  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-dark bg-navy shadow-sm sticky-top">
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
            <span className="fs-4">📦</span>
            <div>
              <span className="fw-bold d-block lh-1">LogisTrack</span>
              <small className="text-secondary" style={{ fontSize: '0.72rem', letterSpacing: '0.5px' }}>
                TIENDA ONLINE
              </small>
            </div>
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menuPrincipal">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="menuPrincipal">
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0 align-items-lg-center gap-lg-1">
              <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/productos">Productos</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/categorias">Categorías</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/ofertas">Ofertas</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/blog">Blog</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/nosotros">Nosotros</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/contacto">Contacto</Link></li>
            </ul>
            <ul className="navbar-nav ms-lg-auto mb-2 mb-lg-0 align-items-lg-center gap-lg-2">
              <li className="nav-item">
                <Link className="nav-link text-warning fw-semibold" to="/admin">
                  <i className="bi bi-shield-lock me-1"></i>Panel Admin
                </Link>
              </li>
              <li className="nav-item"><Link className="nav-link" to="/login"><i className="bi bi-box-arrow-in-right me-1"></i>Iniciar sesión</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/registro">Registrar usuario</Link></li>
              <li className="nav-item ms-lg-1">
                <Link to="/carrito" className="btn btn-outline-light btn-sm d-flex align-items-center gap-2 px-3">
                  <i className="bi bi-cart3"></i>
                  <span>Cart ({cantidadCarrito})</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
