import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  obtenerRolActual,
  obtenerUsuarioAutenticado,
  estaAutenticado,
  logout
} from '../../services/authService';

const MAPA_TITULOS = {
  '/admin': { titulo: 'Dashboard General', subtitulo: 'Resumen operativo del inventario, ventas y clientes' },
  '/admin/productos': { titulo: 'Catálogo de Productos', subtitulo: 'Gestión de existencias, altas, bajas y modificaciones' },
  '/admin/productos/criticos': { titulo: 'Productos en Stock Crítico', subtitulo: 'Alertas tempranas de reposición de inventario' },
  '/admin/productos/nuevo': { titulo: 'Nuevo Producto', subtitulo: 'Registro de un nuevo producto en el catálogo' },
  '/admin/categorias': { titulo: 'Gestión de Categorías', subtitulo: 'Clasificación de productos de la tienda' },
  '/admin/ordenes': { titulo: 'Órdenes de Compra', subtitulo: 'Histórico de transacciones y estados de despacho' },
  '/admin/usuarios': { titulo: 'Gestión de Usuarios', subtitulo: 'Control de accesos, roles y cuentas registradas' },
  '/admin/usuarios/nuevo': { titulo: 'Nuevo Usuario', subtitulo: 'Creación de credenciales y asignación de roles' },
  '/admin/reportes': { titulo: 'Reportes y Métricas', subtitulo: 'Análisis de ventas, rentabilidad y distribución' },
  '/admin/perfil': { titulo: 'Perfil de Administrador', subtitulo: 'Datos de la cuenta activa en sesión' }
};

function AdminTopbar() {
  const [rolActual, setRolActual] = useState(obtenerRolActual());
  const [usuarioAuth, setUsuarioAuth] = useState(obtenerUsuarioAutenticado());
  const [autenticado, setAutenticado] = useState(estaAutenticado());
  const location = useLocation();

  useEffect(() => {
    const sincronizar = () => {
      setRolActual(obtenerRolActual());
      setUsuarioAuth(obtenerUsuarioAutenticado());
      setAutenticado(estaAutenticado());
    };
    window.addEventListener('logistrack_rol_cambiado', sincronizar);
    window.addEventListener('logistrack_auth_cambiado', sincronizar);
    window.addEventListener('storage', sincronizar);
    return () => {
      window.removeEventListener('logistrack_rol_cambiado', sincronizar);
      window.removeEventListener('logistrack_auth_cambiado', sincronizar);
      window.removeEventListener('storage', sincronizar);
    };
  }, []);

  const infoRuta = Object.entries(MAPA_TITULOS).find(([ruta]) =>
    location.pathname === ruta || location.pathname.startsWith(ruta + '/')
  )?.[1] || { titulo: 'Panel de Administración', subtitulo: 'Módulo de control LogisTrack' };

  return (
    <header className="admin-topbar">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
        <div>
          <h4 className="m-0 fw-bold text-dark">{infoRuta.titulo}</h4>
          <small className="text-muted">{infoRuta.subtitulo}</small>
        </div>

        <div className="d-flex align-items-center gap-2 flex-wrap">
          {autenticado && usuarioAuth ? (
            <>
              <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-2 py-2">
                <i className="bi bi-shield-lock-fill me-1"></i>
                JWT: <strong>{usuarioAuth.username}</strong> ({rolActual})
              </span>
              <button
                type="button"
                className="btn btn-outline-danger btn-sm"
                onClick={logout}
                title="Cerrar sesión JWT"
              >
                <i className="bi bi-box-arrow-right me-1"></i> Cerrar sesión
              </button>
            </>
          ) : (
            <span className="badge bg-warning bg-opacity-10 text-dark border border-warning px-2 py-2">
              <i className="bi bi-exclamation-circle me-1 text-warning"></i>
              Sin sesión JWT activa
            </span>
          )}
        </div>
      </div>

      {autenticado && rolActual === 'Vendedor' && (
        <div className="alert alert-info py-2 px-3 mt-3 mb-0 small d-flex align-items-center gap-2" role="alert">
          <i className="bi bi-info-circle-fill fs-6"></i>
          <div>
            <strong>Modo Vendedor:</strong> Acceso de consulta a catálogo de productos y órdenes. La gestión de usuarios, categorías, reportes y acciones destructivas están restringidas.
          </div>
        </div>
      )}
    </header>
  );
}

export default AdminTopbar;
