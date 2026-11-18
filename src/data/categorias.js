import api, { extraerMensajeError } from '../services/api';

const ICONOS_POR_SLUG = {
  tecnologia: 'bi-laptop',
  mantencion: 'bi-tools',
  insumos: 'bi-box-seam',
  electronica: 'bi-laptop',
  repuestos: 'bi-tools',
  consumibles: 'bi-box-seam'
};

function slugificar(texto) {
  return String(texto || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-');
}

function normalizarCategoria(cat) {
  const nombre = cat.nombre || cat.label || '';
  const slug = slugificar(nombre);
  return {
    id: cat.id,
    slug,
    label: nombre,
    nombre,
    descripcion: cat.descripcion || '',
    icono: ICONOS_POR_SLUG[slug] || 'bi-tag'
  };
}

// GET /api/categorias
export async function obtenerCategorias() {
  try {
    const { data } = await api.get('/api/categorias');
    return Array.isArray(data) ? data.map(normalizarCategoria) : [];
  } catch (err) {
    console.error('Error al obtener categorías:', err);
    throw new Error(extraerMensajeError(err));
  }
}

export async function obtenerCategoriaPorSlug(slug) {
  const categorias = await obtenerCategorias();
  return categorias.find((c) => c.slug.toLowerCase() === String(slug).toLowerCase()) || null;
}