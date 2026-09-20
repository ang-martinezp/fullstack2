/**
 * utils-validaciones.js
 * Funciones de validación obligatorias para LogisTrack Store
 * Evaluación Parcial N° 1 - DSY1104 Desarrollo FullStack II
 * Bloque: Cuentas · Formularios (Alfredo De La Hoz)
 */

/**
 * Valida que el correo pertenezca exclusivamente a los dominios institucionales o gmail permitidos:
 * @duoc.cl, @profesor.duoc.cl o @gmail.com
 * @param {string} valor 
 * @returns {boolean}
 */
function esCorreoInstitucionalValido(valor) {
    const patron = /^[a-zA-Z0-9._%+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;
    return patron.test((valor || '').trim());
}

/**
 * Valida que la contraseña tenga entre 4 y 10 caracteres inclusive.
 * @param {string} valor 
 * @returns {boolean}
 */
function esClaveValida(valor) {
    if (!valor) return false;
    return valor.length >= 4 && valor.length <= 10;
}

/**
 * Valida un RUN chileno incluyendo formato y cálculo matemático del dígito verificador (Módulo 11).
 * Acepta formatos: "12345678-5", "12.345.678-5", "123456785", etc.
 * @param {string} valor 
 * @returns {boolean}
 */
function esRunValido(valor) {
    if (!valor || typeof valor !== 'string') return false;

    // Limpiar puntos, guiones y espacios
    const limpio = valor.replace(/[\.\-\s]/g, '').trim().toUpperCase();

    // Debe tener al menos 8 caracteres (7 de cuerpo + 1 DV) y máximo 9 (8 cuerpo + 1 DV)
    if (limpio.length < 8 || limpio.length > 9) return false;

    const cuerpo = limpio.slice(0, -1);
    const dvIngresado = limpio.slice(-1);

    // El cuerpo debe contener solo dígitos
    if (!/^\d+$/.test(cuerpo)) return false;

    // Cálculo del Dígito Verificador usando Módulo 11
    let suma = 0;
    let multiplicador = 2;

    for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += parseInt(cuerpo.charAt(i), 10) * multiplicador;
        multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }

    const resto = 11 - (suma % 11);
    let dvEsperado = '';

    if (resto === 11) {
        dvEsperado = '0';
    } else if (resto === 10) {
        dvEsperado = 'K';
    } else {
        dvEsperado = resto.toString();
    }

    return dvIngresado === dvEsperado;
}

/**
 * Da formato estándar XX.XXX.XXX-X a un RUN chileno.
 * @param {string} valor 
 * @returns {string}
 */
function formatearRun(valor) {
    if (!valor) return '';
    let limpio = valor.replace(/[^0-9kK]/g, '').toUpperCase();
    if (limpio.length === 0) return '';

    const dv = limpio.slice(-1);
    let cuerpo = limpio.slice(0, -1);

    if (cuerpo.length === 0) return dv;

    // Aplicar puntos de miles al cuerpo
    cuerpo = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${cuerpo}-${dv}`;
}

/**
 * Valida un precio (número decimal o entero mayor o igual a 0).
 * Helper para mantenedor de productos (Oliver Duncan).
 * @param {number|string} valor 
 * @returns {boolean}
 */
function esPrecioValido(valor) {
    if (valor === '' || valor === null || valor === undefined) return false;
    const num = Number(valor);
    return !isNaN(num) && num >= 0;
}

/**
 * Valida un stock (número entero mayor o igual a 0).
 * Helper para mantenedor de productos (Oliver Duncan).
 * @param {number|string} valor 
 * @returns {boolean}
 */
function esStockValido(valor) {
    if (valor === '' || valor === null || valor === undefined) return false;
    const num = Number(valor);
    return Number.isInteger(num) && num >= 0;
}

/**
 * Valida que el stock crítico sea un entero mayor o igual a 0.
 * Helper para mantenedor de productos (Oliver Duncan).
 * @param {number|string} valor 
 * @returns {boolean}
 */
function esStockCriticoValido(valor) {
    if (valor === '' || valor === null || valor === undefined) return false;
    const num = Number(valor);
    return Number.isInteger(num) && num >= 0;
}

/**
 * Marca un elemento de formulario como válido según clases Bootstrap 5.
 * @param {HTMLElement} inputElement 
 * @param {string} [mensajeValido]
 */
function marcarValido(inputElement, mensajeValido = '') {
    if (!inputElement) return;
    inputElement.classList.remove('is-invalid');
    inputElement.classList.add('is-valid');

    const feedbackValido = inputElement.parentElement.querySelector('.valid-feedback');
    if (feedbackValido && mensajeValido) {
        feedbackValido.textContent = mensajeValido;
    }
}

/**
 * Marca un elemento de formulario como inválido según clases Bootstrap 5.
 * @param {HTMLElement} inputElement 
 * @param {string} mensajeError 
 */
function marcarInvalido(inputElement, mensajeError = '') {
    if (!inputElement) return;
    inputElement.classList.remove('is-valid');
    inputElement.classList.add('is-invalid');

    const feedbackInvalido = inputElement.parentElement.querySelector('.invalid-feedback');
    if (feedbackInvalido && mensajeError) {
        feedbackInvalido.textContent = mensajeError;
    }
}

/**
 * Limpia el estado de validación de un elemento de formulario.
 * @param {HTMLElement} inputElement 
 */
function limpiarValidacion(inputElement) {
    if (!inputElement) return;
    inputElement.classList.remove('is-valid', 'is-invalid');
}

// Exponer en objeto window si está en entorno navegador
if (typeof window !== 'undefined') {
    window.esCorreoInstitucionalValido = esCorreoInstitucionalValido;
    window.esClaveValida = esClaveValida;
    window.esRunValido = esRunValido;
    window.formatearRun = formatearRun;
    window.esPrecioValido = esPrecioValido;
    window.esStockValido = esStockValido;
    window.esStockCriticoValido = esStockCriticoValido;
    window.marcarValido = marcarValido;
    window.marcarInvalido = marcarInvalido;
    window.limpiarValidacion = limpiarValidacion;
}
