import api, { extraerMensajeError } from '../services/api';

export function slugify(texto) {
  return String(texto || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-');
}

const ICONOS_DEFAULT = {
  tecnologia: 'bi-laptop',
  mantencion: 'bi-tools',
  insumos: 'bi-box-seam'
};

// Combina el producto con su disponibilidad real de stock (inventory-service)
export function combinarProductoConStock(prod, stockItem) {
  const stockActual = stockItem ? Number(stockItem.cantidadActual ?? 0) : 0;
  const stockMinimo = stockItem ? Number(stockItem.cantidadMinima ?? 5) : 5;
  const categoriaLabel = prod.categoriaNombre || 'General';
  const categoriaSlug = slugify(categoriaLabel);

  const esOferta = ['SKU-002', 'SKU-005', 'SKU-009'].includes(prod.sku);
  const descuento = esOferta ? (prod.sku === 'SKU-009' ? 30 : 20) : 0;

  return {
    id: prod.id,
    sku: prod.sku,
    codigo: prod.sku,
    nombre: prod.nombre,
    descripcion: prod.descripcion || '',
    descripcionLarga: prod.descripcion || 'Sin descripción detallada.',
    categoria: categoriaSlug,
    categoriaLabel,
    precio: Number(prod.precio ?? 0),
    stock: stockActual,
    stockCritico: stockMinimo,
    stockId: stockItem?.id || null,
    activo: prod.activo !== false,
    icono: ICONOS_DEFAULT[categoriaSlug] || 'bi-box-seam',
    imagen: prod.sku === 'SKU-001' ? '/img/productos/sku-001.webp' : null,
    oferta: esOferta,
    descuento
  };
}

// GET /api/productos + GET /api/stock
export async function obtenerProductos() {
  try {
    const [resProductos, resStock] = await Promise.all([
      api.get('/api/productos'),
      api.get('/api/stock').catch(() => ({ data: [] }))
    ]);

    const listaProductos = Array.isArray(resProductos.data) ? resProductos.data : [];
    const listaStock = Array.isArray(resStock.data) ? resStock.data : [];

    const mapaStock = new Map();
    for (const s of listaStock) {
      const prodId = s.producto?.id ?? s.productoId;
      if (prodId != null) {
        mapaStock.set(Number(prodId), s);
      }
    }

    return listaProductos
      .filter((p) => p.activo !== false)
      .map((p) => combinarProductoConStock(p, mapaStock.get(Number(p.id))));
  } catch (err) {
    console.error('Error al obtener productos:', err);
    throw new Error(extraerMensajeError(err));
  }
}

// GET /api/productos/sku/{sku} + GET /api/stock/producto/{productoId}
export async function obtenerProductoPorSku(sku) {
  try {
    const { data: prod } = await api.get(`/api/productos/sku/${encodeURIComponent(sku)}`);
    let stockItem = null;
    try {
      const resStock = await api.get(`/api/stock/producto/${prod.id}`);
      stockItem = resStock.data;
    } catch {
      stockItem = null;
    }
    return combinarProductoConStock(prod, stockItem);
  } catch (err) {
    console.error(`Error al obtener producto ${sku}:`, err);
    return null;
  }
}

// GET /api/productos/buscar?nombre=
export async function buscarProductosPorNombre(nombre) {
  if (!nombre || !nombre.trim()) return obtenerProductos();
  try {
    const [resBusqueda, resStock] = await Promise.all([
      api.get('/api/productos/buscar', { params: { nombre: nombre.trim() } }),
      api.get('/api/stock').catch(() => ({ data: [] }))
    ]);

    const lista = Array.isArray(resBusqueda.data) ? resBusqueda.data : [];
    const listaStock = Array.isArray(resStock.data) ? resStock.data : [];

    const mapaStock = new Map();
    for (const s of listaStock) {
      const prodId = s.producto?.id ?? s.productoId;
      if (prodId != null) mapaStock.set(Number(prodId), s);
    }

    return lista
      .filter((p) => p.activo !== false)
      .map((p) => combinarProductoConStock(p, mapaStock.get(Number(p.id))));
  } catch (err) {
    console.error('Error en búsqueda de productos:', err);
    throw new Error(extraerMensajeError(err));
  }
}

export async function obtenerProductosPorCategoria(categoriaSlug) {
  const productos = await obtenerProductos();
  if (!categoriaSlug || categoriaSlug === 'todos') return productos;
  return productos.filter((p) => p.categoria === categoriaSlug);
}

export async function obtenerProductosEnOferta() {
  const productos = await obtenerProductos();
  return productos.filter((p) => p.oferta);
}

export async function actualizarProducto(sku, cambios) {
  try {
    const prod = await obtenerProductoPorSku(sku);
    return prod ? { ...prod, ...cambios } : null;
  } catch {
    return null;
  }
}
