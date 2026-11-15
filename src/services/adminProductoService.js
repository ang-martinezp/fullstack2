import api, { extraerMensajeError } from './api';

function slugify(texto) {
  return String(texto || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-');
}

function combinarProductoConStock(prod, stockItem) {
  const stockActual = stockItem ? Number(stockItem.cantidadActual ?? 0) : 0;
  const stockMinimo = stockItem ? Number(stockItem.cantidadMinima ?? 5) : 5;
  const categoriaLabel = prod.categoriaNombre || 'Sin categoría';
  return {
    id: prod.id,
    sku: prod.sku,
    codigo: prod.sku,
    nombre: prod.nombre,
    descripcion: prod.descripcion || '',
    categoria: slugify(categoriaLabel),
    categoriaLabel,
    unidadMedidaNombre: prod.unidadMedidaNombre || 'Unidad',
    pesoKg: prod.pesoKg ?? 0,
    precio: Number(prod.precio ?? 0),
    activo: prod.activo !== false,
    stock: stockActual,
    stockCritico: stockMinimo,
    stockId: stockItem?.id || null,
    icono: 'bi-box-seam'
  };
}

export async function obtenerProductos() {
  try {
    const [resProductos, resStock] = await Promise.all([
      api.get('/api/productos'),
      api.get('/api/stock').catch(() => ({ data: [] }))
    ]);

    const listaProductos = Array.isArray(resProductos.data) ? resProductos.data : [];
    const listaStock = Array.isArray(resStock.data) ? resStock.data : [];

    const mapaStockPorProductoId = new Map();
    for (const s of listaStock) {
      const prodId = s.producto?.id ?? s.productoId;
      if (prodId != null) {
        mapaStockPorProductoId.set(Number(prodId), s);
      }
    }

    return listaProductos
      .filter((p) => p.activo !== false)
      .map((p) => combinarProductoConStock(p, mapaStockPorProductoId.get(Number(p.id))));
  } catch (err) {
    throw new Error(extraerMensajeError(err));
  }
}

export async function obtenerProductosCriticos() {
  const productos = await obtenerProductos();
  return productos.filter((p) => Number(p.stock) <= Number(p.stockCritico));
}

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
    throw new Error(extraerMensajeError(err));
  }
}

export async function obtenerUnidadesMedida() {
  try {
    const { data } = await api.get('/api/unidades');
    return Array.isArray(data) ? data : [];
  } catch (err) {
    throw new Error(extraerMensajeError(err));
  }
}

export async function crearProducto(payload) {
  try {
    const body = {
      sku: String(payload.sku || '').trim().toUpperCase(),
      nombre: String(payload.nombre || '').trim(),
      descripcion: String(payload.descripcion || '').trim(),
      categoriaId: Number(payload.categoriaId),
      unidadMedidaId: Number(payload.unidadMedidaId),
      pesoKg: payload.pesoKg !== '' && payload.pesoKg != null ? Number(payload.pesoKg) : 0,
      precio: Number(payload.precio || 0)
    };
    const { data: creado } = await api.post('/api/productos', body);

    // Registrar stock mínimo e ingreso inicial en inventory-service si se indicó
    const stockMinimo = Number(payload.stockCritico ?? 5);
    const stockInicial = Number(payload.stock ?? 0);
    if (creado?.id) {
      try {
        await api.post('/api/stock', {
          productoId: creado.id,
          cantidadMinima: stockMinimo
        });
        if (stockInicial > 0) {
          await api.post('/api/movimientos', {
            productoId: creado.id,
            tipo: 'ENTRADA',
            cantidad: stockInicial,
            motivo: 'Stock inicial desde panel administrador'
          });
        }
      } catch {
        // No bloquear creación de producto si inventory-service falla
      }
    }

    return creado;
  } catch (err) {
    throw new Error(extraerMensajeError(err));
  }
}

export async function actualizarProducto(id, payload) {
  try {
    const body = {
      sku: String(payload.sku || '').trim().toUpperCase(),
      nombre: String(payload.nombre || '').trim(),
      descripcion: String(payload.descripcion || '').trim(),
      categoriaId: Number(payload.categoriaId),
      unidadMedidaId: Number(payload.unidadMedidaId),
      pesoKg: payload.pesoKg !== '' && payload.pesoKg != null ? Number(payload.pesoKg) : 0,
      precio: Number(payload.precio || 0)
    };
    const { data } = await api.put(`/api/productos/${id}`, body);

    if (payload.stockId && payload.stockCritico != null) {
      try {
        await api.put(`/api/stock/${payload.stockId}`, {
          productoId: Number(id),
          cantidadMinima: Number(payload.stockCritico)
        });
      } catch {
        // Ignorar si no tiene registro previo
      }
    }

    return data;
  } catch (err) {
    throw new Error(extraerMensajeError(err));
  }
}

export async function reponerStock(productoId, cantidad, motivo = 'Reposición manual desde Stock Crítico') {
  try {
    const { data } = await api.post('/api/movimientos', {
      productoId: Number(productoId),
      tipo: 'ENTRADA',
      cantidad: Number(cantidad),
      motivo
    });
    return data;
  } catch (err) {
    throw new Error(extraerMensajeError(err));
  }
}

export async function eliminarProducto(id) {
  try {
    await api.delete(`/api/productos/${id}`);
  } catch (err) {
    throw new Error(extraerMensajeError(err));
  }
}
