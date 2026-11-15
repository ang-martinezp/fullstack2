import api, { CLAVE_TOKEN, CLAVE_AUTH_USER, extraerMensajeError } from './api';

const CLAVE_STORAGE_ROL_ACTIVO = 'logistrack_rol_activo';

/**
 * Normaliza el rol proveniente del backend (ADMIN, VENDEDOR, CLIENTE, etc.)
 * a los nombres usados por las vistas y guardas del panel Admin.
 */
export function normalizarRolBackend(rolBackend) {
  if (!rolBackend) return '';
  const r = String(rolBackend).trim().toUpperCase();
  if (r === 'ADMIN' || r === 'ADMINISTRADOR' || r === 'SUPERVISOR') return 'Administrador';
  if (r === 'VENDEDOR' || r === 'OPERADOR' || r === 'BODEGUERO' || r === 'TRANSPORTISTA') return 'Vendedor';
  if (r === 'CLIENTE') return 'Cliente';
  return rolBackend;
}

export function obtenerToken() {
  return localStorage.getItem(CLAVE_TOKEN) || null;
}

export function obtenerUsuarioAutenticado() {
  const raw = localStorage.getItem(CLAVE_AUTH_USER);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function estaAutenticado() {
  return Boolean(obtenerToken());
}

/**
 * Retorna el rol activo para los guards del panel Admin.
 * Prioriza el rol real del usuario autenticado via JWT; si no hay sesión JWT,
 * permite usar el rol en localStorage solo para compatibilidad de pruebas UI.
 */
export function obtenerRolActual() {
  const user = obtenerUsuarioAutenticado();
  if (user?.rol) {
    return normalizarRolBackend(user.rol);
  }
  const rolStorage = localStorage.getItem(CLAVE_STORAGE_ROL_ACTIVO);
  return rolStorage ? normalizarRolBackend(rolStorage) : 'Administrador';
}

export async function login(username, password) {
  try {
    const { data } = await api.post('/api/auth/login', { username, password });
    const { token, usuario } = data;
    if (!token || !usuario) {
      throw new Error('Respuesta de autenticación incompleta.');
    }

    const rolNormalizado = normalizarRolBackend(usuario.rol);
    const usuarioGuardado = {
      ...usuario,
      rolNormalizado
    };

    localStorage.setItem(CLAVE_TOKEN, token);
    localStorage.setItem(CLAVE_AUTH_USER, JSON.stringify(usuarioGuardado));
    localStorage.setItem(CLAVE_STORAGE_ROL_ACTIVO, rolNormalizado);

    window.dispatchEvent(new Event('logistrack_rol_cambiado'));
    window.dispatchEvent(new Event('logistrack_auth_cambiado'));

    return { token, usuario: usuarioGuardado, rol: rolNormalizado };
  } catch (err) {
    throw new Error(extraerMensajeError(err));
  }
}

export function logout() {
  localStorage.removeItem(CLAVE_TOKEN);
  localStorage.removeItem(CLAVE_AUTH_USER);
  window.dispatchEvent(new Event('logistrack_rol_cambiado'));
  window.dispatchEvent(new Event('logistrack_auth_cambiado'));
}
