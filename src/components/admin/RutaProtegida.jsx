import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { obtenerRolActivo } from '../../data/usuarios';

/**
 * Componente Guard de Roles con enfoque Fail-Closed.
 * Por defecto bloquea el acceso si no se cumplen estrictamente los roles permitidos.
 * 
 * @param {Array<string>} rolesPermitidos - Lista blanca de roles con autorización (ej: ['Administrador', 'Vendedor'])
 */
function RutaProtegida({ rolesPermitidos = ['Administrador', 'Vendedor'], children }) {
  const [rolActual, setRolActual] = useState(obtenerRolActivo());

  useEffect(() => {
    // Sincronizar en tiempo real cuando el rol cambie en cualquier parte de la app
    const sincronizarRol = () => {
      setRolActual(obtenerRolActivo());
    };

    window.addEventListener('logistrack_rol_cambiado', sincronizarRol);
    window.addEventListener('storage', sincronizarRol);

    return () => {
      window.removeEventListener('logistrack_rol_cambiado', sincronizarRol);
      window.removeEventListener('storage', sincronizarRol);
    };
  }, []);

  // Enfoque Fail-Closed: si no hay rol o el rol no está en la lista blanca, acceso denegado
  const tienePermiso = Boolean(rolActual && rolesPermitidos.includes(rolActual));

  if (!tienePermiso) {
    // Si es Cliente o rol no autorizado, redirigir a la tienda pública con advertencia
    return <Navigate to="/" replace state={{ alertaAcceso: 'Acceso Denegado: Los clientes solo tienen acceso a la tienda.' }} />;
  }

  // Si está autorizado, renderizar la subruta o componentes hijos
  return children ? children : <Outlet />;
}

export default RutaProtegida;
