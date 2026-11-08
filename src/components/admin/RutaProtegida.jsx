import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { obtenerRolActivo } from '../../data/usuarios';

/**
 * Componente Guard de Roles con enfoque Fail-Closed.
 *
 * A diferencia del patrón "Fail-Open" de la Entrega 1 (donde cada script verificaba
 * el rol individualmente una vez cargado el DOM, dejando expuesto el contenido si
 * el script fallaba), este Guard bloquea el montaje del componente antes de renderizar.
 *
 * Si el rol no pertenece a la lista blanca o no está definido, se deniega el acceso
 * inmediatamente y se redirige con advertencia.
 *
 * @param {Array<string>} rolesPermitidos - Lista blanca de roles autorizados (ej: ['Administrador', 'Vendedor'])
 * @param {string} [redirigirA='/'] - Ruta de redirección en caso de acceso denegado
 * @param {string} [mensajeAlerta] - Mensaje explicativo para el usuario
 * @param {React.ReactNode} [children] - Componentes protegidos
 */
function RutaProtegida({
  rolesPermitidos = ['Administrador', 'Vendedor'],
  redirigirA = '/',
  mensajeAlerta = 'Acceso Denegado: No tienes permisos para acceder a esta sección.',
  children
}) {
  const [rolActual, setRolActual] = useState(obtenerRolActivo());

  useEffect(() => {
    // Sincronización en tiempo real ante cambios de rol en sessionStorage/localStorage
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

  // Principio Fail-Closed: Por defecto cerrado a menos que el rol esté explícitamente en la lista blanca
  const tienePermiso = Boolean(rolActual && rolesPermitidos.includes(rolActual));

  if (!tienePermiso) {
    return (
      <Navigate
        to={redirigirA}
        replace
        state={{ alertaAcceso: mensajeAlerta, rolRechazado: rolActual }}
      />
    );
  }

  return children ? children : <Outlet />;
}

export default RutaProtegida;
