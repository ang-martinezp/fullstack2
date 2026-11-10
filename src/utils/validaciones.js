/**
 * Utilidades de validación transversal para formularios de Tienda (Login, Registro, Checkout).
 * Basado en las reglas de negocio de LogisTrack (DSY1104).
 */

import { normalizarRun, validarRunChileno } from '../data/usuarios';

const PATRON_CORREO_PERMITIDO = /^[a-zA-Z0-9._%+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;
const PATRON_SOLO_LETRAS = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]{2,50}$/;

/**
 * Valida que el correo pertenezca a los dominios permitidos (@duoc.cl, @profesor.duoc.cl, @gmail.com).
 */
export function esCorreoInstitucionalValido(valor) {
  if (!valor || typeof valor !== 'string') return false;
  return PATRON_CORREO_PERMITIDO.test(valor.trim());
}

/**
 * Valida que la contraseña tenga entre 4 y 10 caracteres inclusive.
 */
export function esClaveValida(valor) {
  if (!valor || typeof valor !== 'string') return false;
  return valor.length >= 4 && valor.length <= 10;
}

/**
 * Valida que el RUN chileno sea válido mediante algoritmo Módulo 11.
 * Acepta tanto formato con guión (ej: 12345678-5) como limpio (123456785).
 */
export function esRunValido(valor) {
  if (!valor || typeof valor !== 'string') return false;
  const texto = valor.trim();
  if (texto.includes('.')) return false;
  return validarRunChileno(texto);
}

/**
 * Formatea un RUN al estilo xxxxxxxx-x (sin puntos y con guión) o limpio en mayúsculas.
 */
export function formatearRunGuion(valor) {
  const limpio = normalizarRun(valor);
  if (limpio.length < 2) return limpio;
  return `${limpio.slice(0, -1)}-${limpio.slice(-1)}`;
}

/**
 * Valida nombres o apellidos (solo letras y espacios, mínimo 2 caracteres).
 */
export function esTextoAlfabeticoValido(valor, minLargo = 2) {
  if (!valor || typeof valor !== 'string') return false;
  const limpio = valor.trim();
  return limpio.length >= minLargo && PATRON_SOLO_LETRAS.test(limpio);
}

/**
 * Formatea un monto numérico como pesos chilenos (CLP).
 */
export function formatearCLP(numero) {
  const valor = Number(numero || 0);
  return '$' + valor.toLocaleString('es-CL');
}
