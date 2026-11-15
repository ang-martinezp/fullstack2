import api, { extraerMensajeError } from './api';
import { normalizarRolBackend } from './authService';

export const ROLES_USUARIO_BACKEND = [
  { value: 'ADMIN', label: 'Administrador' },
  { value: 'VENDEDOR', label: 'Vendedor' },
  { value: 'CLIENTE', label: 'Cliente' }
];

function rolUiABackend(rol) {
  const r = String(rol || '').trim().toUpperCase();
  if (r === 'ADMINISTRADOR' || r === 'ADMIN') return 'ADMIN';
  if (r === 'VENDEDOR') return 'VENDEDOR';
  if (r === 'CLIENTE') return 'CLIENTE';
  return r || 'CLIENTE';
}

function normalizarUsuario(u) {
  const rolBackend = u.rol || 'CLIENTE';
  return {
    id: u.id,
    username: u.username || '',
    nombre: u.nombre || '',
    apellidos: u.apellido || u.apellidos || '',
    apellido: u.apellido || u.apellidos || '',
    correo: u.email || u.correo || '',
    email: u.email || u.correo || '',
    rol: normalizarRolBackend(rolBackend),
    rolBackend,
    estado: u.estado || 'ACTIVO',
    activo: (u.estado || 'ACTIVO') === 'ACTIVO'
  };
}

export async function obtenerUsuarios() {
  try {
    const { data } = await api.get('/api/usuarios');
    return Array.isArray(data) ? data.map(normalizarUsuario) : [];
  } catch (err) {
    throw new Error(extraerMensajeError(err));
  }
}

export async function obtenerUsuarioPorId(id) {
  try {
    const { data } = await api.get(`/api/usuarios/${id}`);
    return normalizarUsuario(data);
  } catch (err) {
    throw new Error(extraerMensajeError(err));
  }
}

export async function obtenerUsuarioPorUsername(username) {
  try {
    const { data } = await api.get(`/api/usuarios/username/${encodeURIComponent(username)}`);
    return normalizarUsuario(data);
  } catch (err) {
    throw new Error(extraerMensajeError(err));
  }
}

export async function crearUsuario(payload) {
  try {
    const body = {
      nombre: String(payload.nombre || '').trim(),
      apellido: String(payload.apellidos || payload.apellido || '').trim(),
      email: String(payload.correo || payload.email || '').trim(),
      username: String(payload.username || '').trim(),
      rol: rolUiABackend(payload.rol)
    };
    const { data } = await api.post('/api/usuarios', body);
    return normalizarUsuario(data);
  } catch (err) {
    throw new Error(extraerMensajeError(err));
  }
}

export async function actualizarUsuario(id, payload) {
  try {
    const body = {
      nombre: String(payload.nombre || '').trim(),
      apellido: String(payload.apellidos || payload.apellido || '').trim(),
      email: String(payload.correo || payload.email || '').trim(),
      username: String(payload.username || '').trim(),
      rol: rolUiABackend(payload.rol)
    };
    const { data } = await api.put(`/api/usuarios/${id}`, body);
    return normalizarUsuario(data);
  } catch (err) {
    throw new Error(extraerMensajeError(err));
  }
}

export async function cambiarEstadoUsuario(id, estado) {
  try {
    const { data } = await api.patch(`/api/usuarios/${id}/estado`, null, {
      params: { estado }
    });
    return normalizarUsuario(data);
  } catch (err) {
    throw new Error(extraerMensajeError(err));
  }
}
