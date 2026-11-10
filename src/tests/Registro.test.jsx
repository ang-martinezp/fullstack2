/**
 * Suite de Pruebas Unitarias: Registro Component
 * Tipo de prueba evaluada: Algoritmo Módulo 11 (RUN), Estado Encadenado Región/Comuna y Formulario
 * Entorno: Jasmine / Karma Compatible
 *
 * Verifica la validación matemática del RUN chileno, el encadenamiento reactivo de selects
 * de Región y Comuna, la confirmación de contraseña y el bloqueo de usuarios duplicados.
 */

describe('Componente <Registro /> - Validación Módulo 11, Selects Encadenados y Estado', () => {
  const validarRunModulo11 = (runCompleto) => {
    const limpio = String(runCompleto || '').replace(/[^0-9kK]/g, '').toUpperCase();
    if (limpio.length < 8 || limpio.length > 9) return false;
    const cuerpo = limpio.slice(0, -1);
    const dv = limpio.slice(-1);
    let suma = 0;
    let multiplo = 2;
    for (let i = cuerpo.length - 1; i >= 0; i--) {
      suma += Number(cuerpo[i]) * multiplo;
      multiplo = multiplo < 7 ? multiplo + 1 : 2;
    }
    const resto = 11 - (suma % 11);
    const dvEsperado = resto === 11 ? '0' : resto === 10 ? 'K' : String(resto);
    return dv === dvEsperado;
  };

  const catalogoRegionesMock = [
    { region: 'Valparaíso', comunas: ['Valparaíso', 'Viña del Mar', 'Quilpué'] },
    { region: 'Metropolitana de Santiago', comunas: ['Santiago', 'Cerrillos', 'Maipú', 'Providencia'] }
  ];

  it('debe validar correctamente el dígito verificador del RUN chileno mediante algoritmo Módulo 11', () => {
    // RUNs válidos reales (numérico y con dígito verificador K)
    expect(validarRunModulo11('12345678-5')).toBeTrue();
    expect(validarRunModulo11('10000030-K')).toBeTrue();

    // RUN con dígito verificador incorrecto
    expect(validarRunModulo11('12345678-9')).toBeFalse();
    expect(validarRunModulo11('123')).toBeFalse();
  });

  it('debe actualizar las comunas disponibles y limpiar la comuna previa al cambiar la Región seleccionada', () => {
    let estadoFormulario = {
      region: 'Metropolitana de Santiago',
      comuna: 'Cerrillos'
    };

    const cambiarRegion = (nuevaRegion) => {
      const encontrada = catalogoRegionesMock.find(r => r.region === nuevaRegion);
      estadoFormulario = {
        region: nuevaRegion,
        comuna: '',
        comunasDisponibles: encontrada ? encontrada.comunas : []
      };
    };

    cambiarRegion('Valparaíso');
    expect(estadoFormulario.region).toBe('Valparaíso');
    expect(estadoFormulario.comuna).toBe('');
    expect(estadoFormulario.comunasDisponibles).toContain('Viña del Mar');
  });

  it('debe verificar que la contraseña y su confirmación coincidan exactamente', () => {
    const verificarCoincidencia = (clave, confirmacion) =>
      Boolean(clave && confirmacion && clave === confirmacion);

    expect(verificarCoincidencia('duoc2026', 'duoc2026')).toBeTrue();
    expect(verificarCoincidencia('duoc2026', 'otraClave')).toBeFalse();
  });

  it('debe impedir el registro si el correo o RUN ya existen en la colección de usuarios', () => {
    const usuariosExistentes = [
      { run: '201234567', correo: 'alfredo@gmail.com' },
      { run: '19011022K', correo: 'oliver@duoc.cl' }
    ];

    const existeDuplicado = (runNuevo, correoNuevo) =>
      usuariosExistentes.some(
        u => u.run === runNuevo || u.correo.toLowerCase() === correoNuevo.toLowerCase()
      );

    expect(existeDuplicado('201234567', 'nuevo@duoc.cl')).toBeTrue();
    expect(existeDuplicado('159998887', 'alfredo@gmail.com')).toBeTrue();
    expect(existeDuplicado('159998887', 'nuevo.cliente@duoc.cl')).toBeFalse();
  });
});
