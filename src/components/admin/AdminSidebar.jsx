import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { obtenerRolActivo } from '../../data/usuarios';

function AdminSidebar() {
  const [rolActual, setRolActual] = useState(obtenerRolActivo());

  useEffect(() => {
    const actualizarRol = () => setRolActual(obtenerRolActivo());
    window.addEventListener('logistrack_rol_cambiado', actualizarRol);
    window.addEventListener('storage', actualizarRol);
    return () => {
      window.removeEventListener('logistrack_rol_cambiado', actualizarRol);
      window.removeEventListener('storage', actualizarRol);
    };
  }, []);

  const esAdmin = rolActual === 'Administrador';

  return (
    <aside className="admin-sidebar shadow-sm">
      {/* Brand Header */}
      <div className="p-3 border-bottom border-secondary border-opacity-25 d-flex align-items-center gap-2">
        <i className="bi bi-box-seam-fill fs-3 text-warning"></i>
        <div>
          <h5 className="m-0 fw-bold lh-1 text-white">LogisTrack</h5>
          <small className="text-white-50">Panel de Control</small>
        </div>
      </div>

      {/* Navegación Principal */}
      <nav className="nav flex-column mt-3 flex-grow-1">
        <NavLink
          end
          to="/admin"
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <i className="bi bi-speedometer2 me-2"></i> Dashboard
        </NavLink>

        <NavLink
          to="/admin/productos"
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <i className="bi bi-boxes me-2"></i> Productos
        </NavLink>

        <NavLink
          to="/admin/productos/criticos"
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <i className="bi bi-exclamation-triangle me-2 text-warning"></i> Stock Crítico
        </NavLink>

        <NavLink
          to="/admin/categorias"
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <i className="bi bi-tags me-2"></i> Categorías
        </NavLink>

        <NavLink
          to="/admin/ordenes"
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <i className="bi bi-receipt me-2"></i> Órdenes
        </NavLink>

        {/* Módulo de Usuarios solo visible para Administrador */}
        {esAdmin && (
          <NavLink
            to="/admin/usuarios"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <i className="bi bi-people me-2"></i> Usuarios
          </NavLink>
        )}

        <NavLink
          to="/admin/reportes"
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <i className="bi bi-graph-up-arrow me-2"></i> Reportes
        </NavLink>

        <NavLink
          to="/admin/perfil"
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <i className="bi bi-person-badge me-2"></i> Mi Perfil
        </NavLink>
      </nav>

      {/* Botón Inferior para volver a la tienda */}
      <div className="p-3 border-top border-secondary border-opacity-25">
        <Link
          to="/"
          className="btn btn-outline-light w-100 btn-sm d-flex align-items-center justify-content-center gap-2"
        >
          <i className="bi bi-shop"></i> Ir a la Tienda
        </Link>
      </div>
    </aside>
  );
}

export default AdminSidebar;
