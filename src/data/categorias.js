import { slugificarCategoria } from '../utils/categorias';

const CLAVE_STORAGE = 'logistrack_categorias';

const CATEGORIAS_INICIALES = [
  {
    slug: 'tecnologia',
    label: 'Tecnología',
    descripcion: 'Equipos computacionales, periféricos, memorias y unidades de almacenamiento.',
    icono: 'bi-laptop'
  },
  {
    slug: 'mantencion',
    label: 'Mantención',
    descripcion: 'Herramientas especializadas, pastas térmicas, disipadores e insumos de servicio técnico.',
    icono: 'bi-tools'
  },
  {
    slug: 'insumos',
    label: 'Insumos',
    descripcion: 'Resmas de papel, consumibles de oficina y suministros para impresión.',
    icono: 'bi-box-seam'
  }
];

function leerCategorias() {
  const guardado = localStorage.getItem(CLAVE_STORAGE);
  if (guardado) {
    try {
      return JSON.parse(guardado);
    } catch {
      // Si falla JSON, reinicializa
    }
  }
  localStorage.setItem(CLAVE_STORAGE, JSON.stringify(CATEGORIAS_INICIALES));
  return CATEGORIAS_INICIALES;
}

function guardarCategorias(categorias) {
  localStorage.setItem(CLAVE_STORAGE, JSON.stringify(categorias));
}

export function obtenerCategorias() {
  return leerCategorias();
}

export function obtenerCategoriaPorSlug(slug) {
  return (
    leerCategorias().find(
      (c) => c.slug.toLowerCase() === String(slug).toLowerCase()
    ) || null
  );
}

export function crearCategoria(nueva) {
  const categorias = leerCategorias();
  const slug = nueva.slug ? nueva.slug.toLowerCase() : slugificarCategoria(nueva.label || '');

  if (!slug) {
    throw new Error('El nombre de la categoría es requerido.');
  }

  const existe = categorias.some((c) => c.slug === slug);
  if (existe) {
    throw new Error(`La categoría "${nueva.label}" ya existe.`);
  }

  const categoriaAGuardar = {
    slug,
    label: nueva.label.trim(),
    descripcion: nueva.descripcion ? nueva.descripcion.trim() : '',
    icono: nueva.icono || 'bi-tag'
  };

  categorias.push(categoriaAGuardar);
  guardarCategorias(categorias);
  return categoriaAGuardar;
}

export function actualizarCategoria(slugOriginal, cambios) {
  const categorias = leerCategorias();
  const indice = categorias.findIndex((c) => c.slug === slugOriginal);
  if (indice === -1) return null;

  const nuevoLabel = cambios.label !== undefined ? cambios.label.trim() : categorias[indice].label;
  const nuevoSlug = cambios.slug ? cambios.slug.toLowerCase() : (cambios.label ? slugificarCategoria(nuevoLabel) : categorias[indice].slug);

  const actualizado = {
    ...categorias[indice],
    ...cambios,
    slug: nuevoSlug,
    label: nuevoLabel,
    descripcion: cambios.descripcion !== undefined ? cambios.descripcion.trim() : categorias[indice].descripcion,
    icono: cambios.icono || categorias[indice].icono
  };

  categorias[indice] = actualizado;
  guardarCategorias(categorias);
  return actualizado;
}

export function eliminarCategoria(slug) {
  const categorias = leerCategorias().filter((c) => c.slug !== slug);
  guardarCategorias(categorias);
  return true;
}
