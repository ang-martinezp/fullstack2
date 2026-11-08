import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { obtenerRolActivo, establecerRolActivo, ROLES_DISPONIBLES } from '../../data/usuarios';

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
  const [rolActual, setRolActual] = useState(obtenerRolActivo());
  const location = useLocation();

  useEffect(() => {
    const sincronizarRol = () => setRolActual(obtenerRolActivo());
    window.addEventListener('logistrack_rol_cambiado', sincronizarRol);
    window.addEventListener('storage', sincronizarRol);
    return () => {
      window.removeEventListener('logistrack_rol_cambiado', sincronizarRol);
      window.removeEventListener('storage', sincronizarRol);
    };
  }, []);

  const handleCambioRol = (e) => {
    const nuevoRol = e.target.value;
    establecerRolActivo(nuevoRol);
    setRolActual(nuevoRol);
  };

  // Buscar título según la ruta actual
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

        {/* Simulador de Rol Activo */}
        <div className="d-flex align-items-center gap-2">
          <span className="badge bg-light text-dark border d-flex align-items-center gap-1">
            <i className="bi bi-person-gear"></i> Rol activo:
          </span>
          <select
            id="select-rol-simulado"
            className="form-select form-select-sm fw-semibold"
            style={{ width: '160px' }}
            value={rolActual}
            onChange={handleCambioRol}
            aria-label="Seleccionar rol simulado"
          >
            {ROLES_DISPONIBLES.map((rol) => (
              <option key={rol} value={rol}>
                {rol}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Banner de alerta informativo según el rol */}
      {rolActual === 'Vendedor' && (
        <div className="alert alert-info py-2 px-3 mt-3 mb-0 small d-flex align-items-center gap-2" role="alert">
          <i className="bi bi-info-circle-fill fs-6"></i>
          <div>
            <strong>Modo Vendedor:</strong> Acceso de consulta a catálogo y órdenes. La gestión de usuarios y acciones destructivas están restringidas.
          </div>
        </div>
      )}
    </header>
  );
}

export default AdminTopbar;
