import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { contarItemsCarrito } from '../data/carrito';
import { obtenerSesionActiva, cerrarSesionUsuario } from '../data/usuarios';

function Header({ cantidadCarrito }) {
  const navigate = useNavigate();
  const [contador, setContador] = useState(() =>
    cantidadCarrito !== undefined ? cantidadCarrito : contarItemsCarrito()
  );
  const [sesion, setSesion] = useState(() => obtenerSesionActiva());

  useEffect(() => {
    const sincronizarCarrito = () => {
      setContador(contarItemsCarrito());
    };
    const sincronizarSesion = () => {
      setSesion(obtenerSesionActiva());
    };
    const sincronizarTodo = () => {
      sincronizarCarrito();
      sincronizarSesion();
    };

    window.addEventListener('logistrack_carrito_actualizado', sincronizarCarrito);
    window.addEventListener('logistrack_sesion_cambiada', sincronizarSesion);
    window.addEventListener('logistrack_rol_cambiado', sincronizarSesion);
    window.addEventListener('storage', sincronizarTodo);

    return () => {
      window.removeEventListener('logistrack_carrito_actualizado', sincronizarCarrito);
      window.removeEventListener('logistrack_sesion_cambiada', sincronizarSesion);
      window.removeEventListener('logistrack_rol_cambiado', sincronizarSesion);
      window.removeEventListener('storage', sincronizarTodo);
    };
  }, []);

  const handleCerrarSesion = () => {
    cerrarSesionUsuario();
    setSesion(null);
    navigate('/');
  };

  const totalItems = cantidadCarrito !== undefined ? cantidadCarrito : contador;

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-dark bg-navy shadow-sm sticky-top" aria-label="Navegación principal">
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
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#menuPrincipal"
            aria-controls="menuPrincipal"
            aria-expanded="false"
            aria-label="Alternar navegación"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="menuPrincipal">
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0 align-items-lg-center gap-lg-1">
              <li className="nav-item"><NavLink className="nav-link" to="/" end>Home</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" to="/productos">Productos</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" to="/categorias">Categorías</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" to="/ofertas">Ofertas</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" to="/blog">Blog</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" to="/nosotros">Nosotros</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" to="/contacto">Contacto</NavLink></li>
            </ul>
            <ul className="navbar-nav ms-lg-auto mb-2 mb-lg-0 align-items-lg-center gap-lg-2">
              <li className="nav-item">
                <Link className="nav-link text-warning fw-semibold" to="/admin">
                  <i className="bi bi-shield-lock me-1"></i>Panel Admin
                </Link>
              </li>

              {sesion ? (
                <>
                  <li className="nav-item d-flex align-items-center">
                    <span className="nav-link text-light small py-1 px-2 d-flex align-items-center gap-1">
                      <i className="bi bi-person-check-fill text-info"></i>
                      <span>{sesion.nombre}</span>
                      <span className="badge bg-primary ms-1" style={{ fontSize: '0.68rem' }}>
                        {sesion.rol}
                      </span>
                    </span>
                  </li>
                  <li className="nav-item">
                    <button
                      type="button"
                      className="btn btn-outline-warning btn-sm px-2 py-1"
                      onClick={handleCerrarSesion}
                      title="Cerrar sesión activa"
                    >
                      <i className="bi bi-box-arrow-right me-1"></i>Salir
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/login">
                      <i className="bi bi-box-arrow-in-right me-1"></i>Iniciar sesión
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/registro">Registrar usuario</NavLink>
                  </li>
                </>
              )}

              <li className="nav-item ms-lg-1">
                <Link to="/carrito" className="btn btn-outline-light btn-sm d-flex align-items-center gap-2 px-3">
                  <i className="bi bi-cart3"></i>
                  <span>Cart ({totalItems})</span>
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
