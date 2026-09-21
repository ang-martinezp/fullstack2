/**
 * utils-validaciones.js
 * funciones de validacion
 */

/**
 * valida que el correo sea institucional
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
 * valida que el run se ingrese en formato obligatorio "xxxxxxxx-x" 
 * @param {string} valor 
 * @returns {boolean}
 */
function esRunValido(valor) {
    if (!valor || typeof valor !== 'string') return false;

    const run = valor.trim();

    if (run.includes('.')) {
        return false;
    }

    if (!run.includes('-')) {
        return false;
    }

    const patron = /^\d{7,8}-[\dkK]$/;
    if (!patron.test(run)) {
        return false;
    }
    const partes = run.toUpperCase().split('-');
    const cuerpo = partes[0];
    const dvIngresado = partes[1];

    // calculo del digito verificador mediante formula 11
    let suma = 0;
    let multiplo = 2;

    for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += parseInt(cuerpo[i], 10) * multiplo;
        multiplo = multiplo < 7 ? multiplo + 1 : 2;
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
 * @param {string} valor 
 * @returns {string}
 */
function formatearRun(valor) {
    if (!valor) return '';
    return valor.trim().toUpperCase();
}

/**
 * Valida un precio, tiene q ser numero entero
 * @param {number|string} valor 
 * @returns {boolean}
 */
function esPrecioValido(valor) {
    if (valor === '' || valor === null || valor === undefined) return false;
    const num = Number(valor);
    return !isNaN(num) && num >= 0;
}

/**
 * valida que el stock sea un numero entero 
 * @param {number|string} valor 
 * @returns {boolean}
 */
function esStockValido(valor) {
    if (valor === '' || valor === null || valor === undefined) return false;
    const num = Number(valor);
    return Number.isInteger(num) && num >= 0;
}

/**
 * valida que el stock sea un numero entero 
 * @param {number|string} valor 
 * @returns {boolean}
 */
function esStockCriticoValido(valor) {
    if (valor === '' || valor === null || valor === undefined) return false;
    const num = Number(valor);
    return Number.isInteger(num) && num >= 0;
}

/**
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
 * @param {HTMLElement} inputElement 
 */
function limpiarValidacion(inputElement) {
    if (!inputElement) return;
    inputElement.classList.remove('is-valid', 'is-invalid');
}

// expongo en objeto window si esta en entorno navegador
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
