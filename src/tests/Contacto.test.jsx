/**
 * Suite de Pruebas Unitarias: Contacto Component
 * Tipo de prueba evaluada: Formularios Controlados y Validaciones de Entrada
 * Entorno: Jasmine / Jest Compatible
 * Autor: Angel Martinez (Bloque Tienda Pública)
 */

describe('Componente <Contacto /> - Validaciones de Formulario', () => {
  const DOMINIOS_PERMITIDOS = /^[a-zA-Z0-9._%+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;
  const PATRON_NOMBRE = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]{2,80}$/;

  const validarContacto = (valores) => {
    const errores = {};
    const nombre = (valores.nombre || '').trim();
    if (!nombre) {
      errores.nombre = 'El nombre completo es obligatorio.';
    } else if (!PATRON_NOMBRE.test(nombre)) {
      errores.nombre = 'Por favor ingrese un nombre válido (mínimo 2 letras, solo texto).';
    }

    const correo = (valores.correo || '').trim();
    if (!correo) {
      errores.correo = 'El correo electrónico es obligatorio.';
    } else if (!DOMINIOS_PERMITIDOS.test(correo)) {
      errores.correo = 'Debe ingresar un correo válido con dominio @duoc.cl, @profesor.duoc.cl o @gmail.com';
    }

    if (!valores.asunto) {
      errores.asunto = 'Debe seleccionar un motivo de contacto.';
    }

    const comentario = (valores.comentario || '').trim();
    if (!comentario) {
      errores.comentario = 'El comentario o mensaje es obligatorio.';
    } else if (comentario.length < 10) {
      errores.comentario = 'El comentario debe tener al menos 10 caracteres explicativos.';
    } else if (comentario.length > 500) {
      errores.comentario = 'El comentario no puede exceder los 500 caracteres.';
    }

    return errores;
  };

  it('Caso 1: debe validar y permitir únicamente correos con dominios autorizados (@duoc.cl, @profesor.duoc.cl, @gmail.com)', () => {
    const basePayload = {
      nombre: 'Angel Martinez',
      asunto: 'Consulta General',
      comentario: 'Solicito información sobre despacho a regiones.'
    };

    // Caso inválido: dominio no institucional
    const errInvalido = validarContacto({ ...basePayload, correo: 'angel@hotmail.com' });
    expect(Boolean(errInvalido.correo)).toBeTrue();
    expect(errInvalido.correo).toContain('@duoc.cl');

    // Casos válidos permitidos
    const errDuoc = validarContacto({ ...basePayload, correo: 'an.martinez@duoc.cl' });
    expect(Boolean(errDuoc.correo)).toBeFalse();

    const errGmail = validarContacto({ ...basePayload, correo: 'angel.contacto@gmail.com' });
    expect(Boolean(errGmail.correo)).toBeFalse();
  });

  it('Caso 2: debe bloquear el envío si faltan campos obligatorios o el comentario es menor a 10 caracteres', () => {
    // 1. Envío con campos vacíos
    const erroresVacios = validarContacto({});
    expect(Boolean(erroresVacios.nombre)).toBeTrue();
    expect(Boolean(erroresVacios.correo)).toBeTrue();
    expect(Boolean(erroresVacios.asunto)).toBeTrue();
    expect(Boolean(erroresVacios.comentario)).toBeTrue();

    // 2. Comentario con longitud insuficiente (< 10 caracteres)
    const errComentarioCorto = validarContacto({
      nombre: 'Angel Martinez',
      correo: 'angel@duoc.cl',
      asunto: 'Soporte Técnico',
      comentario: 'Hola'
    });
    expect(Boolean(errComentarioCorto.comentario)).toBeTrue();
    expect(errComentarioCorto.comentario).toContain('al menos 10 caracteres');

    // 3. Formulario completo con datos correctos
    const erroresValidos = validarContacto({
      nombre: 'Angel Martinez',
      correo: 'angel.martinez@duoc.cl',
      asunto: 'Consulta General',
      comentario: 'Consulta sobre garantías y tiempos de entrega para compras corporativas.'
    });
    expect(Object.keys(erroresValidos).length).toBe(0);
  });
});