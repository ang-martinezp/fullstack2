import api, { extraerMensajeError } from './api';

export const ESTADOS_ORDEN_BACKEND = [
  { value: 'PENDIENTE', label: 'Pendiente' },
  { value: 'CONFIRMADO', label: 'Confirmado' },
  { value: 'ENTREGADO', label: 'Entregado' },
  { value: 'CANCELADO', label: 'Cancelado' }
];

const ETIQUETA_ESTADO = {
  PENDIENTE: 'Pendiente',
  CONFIRMADO: 'Confirmado',
  ENTREGADO: 'Entregado',
  CANCELADO: 'Cancelado'
};

function normalizarPedido(p) {
  const detalles = Array.isArray(p.detalles) ? p.detalles : [];
  const items = detalles.map((d) => {
    const cantidad = Number(d.cantidad || 1);
    const precioUnitario = Number(d.precioUnitario ?? d.producto?.precio ?? 0);
    const subtotal = Number(d.subtotal ?? cantidad * precioUnitario);
    return {
      id: d.id,
      sku: d.producto?.sku || `PROD-${d.producto?.id || ''}`,
      nombre: d.producto?.nombre || 'Producto',
      cantidad,
      precioUnitario,
      subtotal
    };
  });

  const totalCalculado = items.reduce((acc, it) => acc + it.subtotal, 0);
  const estadoBackend = p.estado || 'PENDIENTE';

  return {
    id: String(p.id),
    codigo: `ORD-${String(p.id).padStart(4, '0')}`,
    cliente: p.proveedor?.nombre || 'Proveedor LogisTrack',
    clienteRut: p.proveedor?.rut || 'N/A',
    correo: p.proveedor?.email || '',
    telefono: p.proveedor?.telefono || '',
    fecha: p.fechaPedido ? String(p.fechaPedido).slice(0, 10) : '',
    fechaEntregaEsperada: p.fechaEntregaEsperada ? String(p.fechaEntregaEsperada).slice(0, 10) : '',
    observaciones: p.observaciones || '',
    estado: ETIQUETA_ESTADO[estadoBackend] || estadoBackend,
    estadoBackend,
    items,
    total: totalCalculado
  };
}

export async function obtenerOrdenes() {
  try {
    const { data } = await api.get('/api/pedidos');
    return Array.isArray(data) ? data.map(normalizarPedido) : [];
  } catch (err) {
    throw new Error(extraerMensajeError(err));
  }
}

export async function obtenerOrdenPorId(id) {
  try {
    const { data } = await api.get(`/api/pedidos/${id}`);
    return normalizarPedido(data);
  } catch (err) {
    throw new Error(extraerMensajeError(err));
  }
}

export async function actualizarEstadoOrden(id, estadoBackend) {
  try {
    const { data } = await api.put(`/api/pedidos/${id}/estado`, null, {
      params: { estado: estadoBackend }
    });
    return normalizarPedido(data);
  } catch (err) {
    throw new Error(extraerMensajeError(err));
  }
}

export async function cancelarOrden(id) {
  try {
    await api.delete(`/api/pedidos/${id}/cancelar`);
  } catch (err) {
    throw new Error(extraerMensajeError(err));
  }
}
