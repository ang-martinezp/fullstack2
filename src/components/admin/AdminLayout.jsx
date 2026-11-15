import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminTopbar from './AdminTopbar';
import { estaAutenticado, login } from '../../services/authService';

function AdminLayout() {
  const [autenticado, setAutenticado] = useState(estaAutenticado());
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [cargando, setCargando] = useState(false);
  const [errorLogin, setErrorLogin] = useState('');

  useEffect(() => {
    const sync = () => setAutenticado(estaAutenticado());
    window.addEventListener('logistrack_auth_cambiado', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('logistrack_auth_cambiado', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorLogin('');
    setCargando(true);
    try {
      await login(username.trim(), password);
      setPassword('');
      setAutenticado(true);
    } catch (err) {
      setErrorLogin(err.message || 'Credenciales inválidas.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="admin-wrapper">
      <AdminSidebar />
      <main className="admin-content d-flex flex-column justify-content-between">
        <div>
          <AdminTopbar />
          <div className="container-fluid p-4">
            {autenticado ? (
              <Outlet />
            ) : (
              <div className="row justify-content-center py-5">
                <div className="col-12 col-md-6 col-lg-4">
                  <div className="card shadow-sm border-0">
                    <div className="card-header bg-dark text-white py-3">
                      <h5 className="m-0 fw-bold d-flex align-items-center gap-2">
                        <i className="bi bi-shield-lock-fill text-warning"></i>
                        Acceso al Panel Admin (JWT)
                      </h5>
                    </div>
                    <form onSubmit={handleLogin} className="card-body p-4">
                      <p className="small text-muted mb-3">
                        Inicia sesión contra <code>/api/auth/login</code> para operar con los microservicios de LogisTrack.
                      </p>

                      {errorLogin && (
                        <div className="alert alert-danger py-2 small" role="alert">
                          <i className="bi bi-exclamation-triangle-fill me-1"></i>
                          {errorLogin}
                        </div>
                      )}

                      <div className="mb-3">
                        <label className="form-label fw-semibold small">Usuario</label>
                        <input
                          type="text"
                          className="form-control"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="admin o vendedor"
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-semibold small">Contraseña</label>
                        <input
                          type="password"
                          className="form-control"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        className="btn btn-primary w-100 fw-semibold"
                        disabled={cargando}
                      >
                        {cargando ? 'Autenticando...' : 'Iniciar Sesión'}
                      </button>

                      <div className="mt-3 pt-3 border-top small text-muted">
                        <div className="fw-semibold mb-1">Cuentas de prueba backend:</div>
                        <div>• Admin: <code>admin</code> / <code>admin123</code></div>
                        <div>• Vendedor: <code>vendedor</code> / <code>vendedor123</code></div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <footer className="py-3 px-4 text-center text-muted border-top bg-white small">
          LogisTrack &copy; {new Date().getFullYear()} — Panel Administrativo Duoc UC
        </footer>
      </main>
    </div>
  );
}

export default AdminLayout;
