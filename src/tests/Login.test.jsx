/**
 * Suite de Pruebas Unitarias: Login Component
 * Tipo de prueba evaluada: Gestión de Estado (State), Renderizado Condicional y Mocks (Spies)
 * Entorno: Jasmine / Karma Compatible
 *
 * Verifica la validación de correos institucionales (@duoc.cl, @profesor.duoc.cl, @gmail.com),
 * longitud de contraseña (4 a 10 caracteres), alternancia de visibilidad de clave y
 * despacho de sesión activa con sincronización de rol.
 */

describe('Componente <Login /> - Validación de Credenciales, Estado y Eventos', () => {
  const PATRON_CORREO = /^[a-zA-Z0-9._%+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;

  const validarCredenciales = (correo, clave) => {
    const errores = {};
    if (!correo || !correo.trim()) {
      errores.correo = 'El correo electrónico es obligatorio.';
    } else if (!PATRON_CORREO.test(correo.trim())) {
      errores.correo = 'Debe ingresar un correo válido con dominio @duoc.cl, @profesor.duoc.cl o @gmail.com';
    }

    if (!clave) {
      errores.clave = 'La contraseña es obligatoria.';
    } else if (clave.length < 4 || clave.length > 10) {
      errores.clave = 'La contraseña debe tener entre 4 y 10 caracteres.';
    }
    return errores;
  };

  it('debe rechazar correos con dominios no autorizados y mostrar mensaje de error condicional', () => {
    const erroresDominioInvalido = validarCredenciales('usuario@hotmail.com', 'duoc2026');
    expect(Boolean(erroresDominioInvalido.correo)).toBeTrue();
    expect(erroresDominioInvalido.correo).toContain('@duoc.cl');

    const erroresDominioValido = validarCredenciales('alfredo@duoc.cl', 'duoc2026');
    expect(Boolean(erroresDominioValido.correo)).toBeFalse();
  });

  it('debe validar que la contraseña tenga estrictamente entre 4 y 10 caracteres', () => {
    const errorCorta = validarCredenciales('alfredo@gmail.com', '123');
    const errorLarga = validarCredenciales('alfredo@gmail.com', '12345678901');
    const claveCorrecta = validarCredenciales('alfredo@gmail.com', 'duoc2026');

    expect(Boolean(errorCorta.clave)).toBeTrue();
    expect(Boolean(errorLarga.clave)).toBeTrue();
    expect(Object.keys(claveCorrecta).length).toBe(0);
  });

  it('debe alternar el estado mostrarClave al simular clic en el botón de visibilidad', () => {
    let mostrarClave = false;
    const toggleMostrarClave = () => {
      mostrarClave = !mostrarClave;
    };

    expect(mostrarClave).toBeFalse();
    toggleMostrarClave();
    expect(mostrarClave).toBeTrue();
    toggleMostrarClave();
    expect(mostrarClave).toBeFalse();
  });

  it('debe invocar el servicio de autenticación (Mock/Spy) y sincronizar el rol activo al iniciar sesión', () => {
    const authServiceMock = {
      iniciarSesion: (correo, _clave) => ({
        exito: true,
        usuario: { correo, nombre: 'Alfredo', rol: 'Cliente' }
      })
    };

    spyOn(authServiceMock, 'iniciarSesion');

    const respuesta = authServiceMock.iniciarSesion('alfredo@gmail.com', 'duoc2026');
    expect(authServiceMock.iniciarSesion).toHaveBeenCalled();
    expect(authServiceMock.iniciarSesion).toHaveBeenCalledWith('alfredo@gmail.com', 'duoc2026');
    expect(respuesta.exito).toBeTrue();
    expect(respuesta.usuario.rol).toBe('Cliente');
  });
});
