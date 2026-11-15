import api, { extraerMensajeError } from './api';

export async function obtenerReportes() {
  try {
    const { data } = await api.get('/api/reportes');
    return Array.isArray(data) ? data : [];
  } catch (err) {
    throw new Error(extraerMensajeError(err));
  }
}

export async function crearReporte(payload) {
  try {
    const { data } = await api.post('/api/reportes', payload);
    return data;
  } catch (err) {
    throw new Error(extraerMensajeError(err));
  }
}
