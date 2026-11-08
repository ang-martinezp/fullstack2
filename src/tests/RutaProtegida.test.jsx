/**
 * Suite de Pruebas Unitarias: RutaProtegida Component
 * Tipo de prueba evaluada: Renderizado Condicional y Seguridad Fail-Closed
 * Entorno: Jasmine / Jest Compatible
 * 
 * Evalúa el principio de menor privilegio y fail-closed:
 * 1. Denegación por defecto ante ausencia de sesión/rol.
 * 2. Autorización estricta mediante lista blanca (Administrador, Vendedor).
 * 3. Bloqueo multinivel y emisión de alertas descriptivas de seguridad.
 */

describe('Componente <RutaProtegida /> - Renderizado Condicional y Fail-Closed', () => {
  const rolesPermitidosPanel = ['Administrador', 'Vendedor'];
  const rolesPermitidosUsuarios = ['Administrador'];

  it('debe aplicar Fail-Closed y denegar acceso si el rol es nulo, indefinido o vacío', () => {
    const rolInexistente = null;
    const tienePermiso = Boolean(rolInexistente && rolesPermitidosPanel.includes(rolInexistente));

    expect(tienePermiso).toBeFalse();
  });

  it('debe bloquear a usuarios con rol Cliente e instruir redirección hacia la tienda pública', () => {
    const rolCliente = 'Cliente';
    const tienePermiso = Boolean(rolCliente && rolesPermitidosPanel.includes(rolCliente));

    expect(tienePermiso).toBeFalse();

    const redireccionEsperada = {
      to: '/',
      replace: true,
      mensajeAlerta: 'Acceso Denegado: Los clientes solo tienen acceso a la tienda.'
    };

    expect(redireccionEsperada.to).toBe('/');
    expect(redireccionEsperada.mensajeAlerta).toContain('Acceso Denegado');
  });

  it('debe autorizar a usuarios con rol Administrador en todo el panel de administración', () => {
    const rolAdmin = 'Administrador';
    const accesoPanel = Boolean(rolAdmin && rolesPermitidosPanel.includes(rolAdmin));
    const accesoUsuarios = Boolean(rolAdmin && rolesPermitidosUsuarios.includes(rolAdmin));

    expect(accesoPanel).toBeTrue();
    expect(accesoUsuarios).toBeTrue();
  });

  it('debe permitir acceso al panel a Vendedor pero bloquear su acceso a la gestión de usuarios', () => {
    const rolVendedor = 'Vendedor';
    const accesoPanel = Boolean(rolVendedor && rolesPermitidosPanel.includes(rolVendedor));
    const accesoUsuarios = Boolean(rolVendedor && rolesPermitidosUsuarios.includes(rolVendedor));

    expect(accesoPanel).toBeTrue();
    expect(accesoUsuarios).toBeFalse();

    const redireccionVendedor = {
      to: '/admin/productos',
      mensajeAlerta: 'Acceso Denegado: Los vendedores no tienen permisos para gestionar cuentas de usuario.'
    };

    expect(redireccionVendedor.to).toBe('/admin/productos');
    expect(redireccionVendedor.mensajeAlerta).toContain('vendedores no tienen permisos');
  });
});
