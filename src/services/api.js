import axios from 'axios';

export const CLAVE_TOKEN = 'logistrack_token';
export const CLAVE_AUTH_USER = 'logistrack_auth_user';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor Request: adjunta JWT si existe en localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(CLAVE_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Extrae mensaje legible desde respuestas de error Spring Boot
export function extraerMensajeError(error) {
  if (!error) return 'Error desconocido de comunicación con el servidor.';
  if (error.response) {
    const { status, data } = error.response;
    if (typeof data === 'string' && data.trim()) return data;
    if (data && typeof data === 'object') {
      if (data.message) return data.message;
      if (data.error) return data.error;
      // Validaciones campo -> mensaje de Spring Boot
      const valores = Object.values(data).filter((v) => typeof v === 'string');
      if (valores.length > 0) return valores.join(' | ');
    }
    if (status === 401) return 'Sesión expirada o no autenticada. Inicia sesión nuevamente.';
    if (status === 403) return 'Acceso denegado: tu rol no tiene permisos para esta operación.';
    if (status === 404) return 'Recurso no encontrado en el servidor.';
    return `Error del servidor (HTTP ${status}).`;
  }
  if (error.request) {
    return 'No se pudo conectar con el API Gateway (http://localhost:8080). Verifica que los microservicios estén activos.';
  }
  return error.message || 'Error inesperado.';
}

// Interceptor Response: notifica 401 si el token caducó
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const hadToken = Boolean(localStorage.getItem(CLAVE_TOKEN));
      if (hadToken && !error.config?.url?.includes('/api/auth/login')) {
        localStorage.removeItem(CLAVE_TOKEN);
        localStorage.removeItem(CLAVE_AUTH_USER);
        window.dispatchEvent(new Event('logistrack_auth_cambiado'));
      }
    }
    return Promise.reject(error);
  }
);

export default api;
