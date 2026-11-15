import api, { extraerMensajeError } from './api';

const ICONOS_POR_NOMBRE = {
  electronica: 'bi-laptop',
  consumibles: 'bi-box-seam',
  repuestos: 'bi-tools',
  hardware: 'bi-cpu',
  perifericos: 'bi-keyboard'
};

function normalizarCategoria(cat) {
  const nombre = cat.nombre || cat.label || '';
  const slug = nombre
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-');
  return {
    id: cat.id,
    slug,
    nombre,
    label: nombre,
    descripcion: cat.descripcion || '',
    icono: ICONOS_POR_NOMBRE[slug] || 'bi-tag'
  };
}

export async function obtenerCategorias() {
  try {
    const { data } = await api.get('/api/categorias');
    return Array.isArray(data) ? data.map(normalizarCategoria) : [];
  } catch (err) {
    throw new Error(extraerMensajeError(err));
  }
}

export async function crearCategoria({ label, nombre, descripcion }) {
  try {
    const payload = {
      nombre: (nombre || label || '').trim(),
      descripcion: (descripcion || '').trim()
    };
    const { data } = await api.post('/api/categorias', payload);
    return normalizarCategoria(data);
  } catch (err) {
    throw new Error(extraerMensajeError(err));
  }
}

export async function actualizarCategoria(id, { label, nombre, descripcion }) {
  try {
    const payload = {
      nombre: (nombre || label || '').trim(),
      descripcion: (descripcion || '').trim()
    };
    const { data } = await api.put(`/api/categorias/${id}`, payload);
    return normalizarCategoria(data);
  } catch (err) {
    throw new Error(extraerMensajeError(err));
  }
}

export async function eliminarCategoria(id) {
  try {
    await api.delete(`/api/categorias/${id}`);
  } catch (err) {
    throw new Error(extraerMensajeError(err));
  }
}
