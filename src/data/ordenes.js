import { normalizarRun } from './usuarios';

const CLAVE_STORAGE = 'logistrack_ordenes';

export const ESTADOS_ORDEN = ['Pendiente', 'En despacho', 'Entregado', 'Cancelada'];

const ORDENES_INICIALES = [
  {
    id: 'ORD-1001',
    fecha: '2026-09-18',
    cliente: 'Alfredo De La Hoz',
    clienteRun: '201234567',
    correo: 'alfredo@gmail.com',
    telefono: '+56 9 9988 7766',
    direccion: 'Av. Departamental 1234, Cerrillos',
    comuna: 'Cerrillos',
    region: 'Región Metropolitana de Santiago',
    estado: 'Entregado',
    items: [
      { sku: 'SKU-001', producto: 'Laptop DELL Latitude', cantidad: 1, precio: 389990 },
      { sku: 'SKU-003', producto: 'Pasta Térmica Artic MX4', cantidad: 1, precio: 5990 }
    ],
    neto: 332756,
    iva: 63224,
    total: 395980
  },
  {
    id: 'ORD-1002',
    fecha: '2026-09-19',
    cliente: 'Angel Martinez',
    clienteRun: '185421110',
    correo: 'angel@duoc.cl',
    telefono: '+56 9 5555 1234',
    direccion: 'Calle Los Alerces 450',
    comuna: 'Maipú',
    region: 'Región Metropolitana de Santiago',
    estado: 'Pendiente',
    items: [
      { sku: 'SKU-004', producto: 'Papel A4 Resma', cantidad: 3, precio: 3490 }
    ],
    neto: 8798,
    iva: 1672,
    total: 10470
  },
  {
    id: 'ORD-1003',
    fecha: '2026-09-20',
    cliente: 'Oliver Duncan',
    clienteRun: '19011022K',
    correo: 'oliver@duoc.cl',
    telefono: '+56 9 8765 4321',
    direccion: 'Monjitas 843, Depto 603',
    comuna: 'Santiago',
    region: 'Región Metropolitana de Santiago',
    estado: 'En despacho',
    items: [
      { sku: 'SKU-003', producto: 'Pasta Térmica Artic MX4', cantidad: 1, precio: 5990 }
    ],
    neto: 5034,
    iva: 956,
    total: 5990
  }
];

function leerOrdenes() {
  const guardado = localStorage.getItem(CLAVE_STORAGE);
  if (guardado) {
    try {
      return JSON.parse(guardado);
    } catch {
      // Si falla JSON, reinicializa
    }
  }
  localStorage.setItem(CLAVE_STORAGE, JSON.stringify(ORDENES_INICIALES));
  return ORDENES_INICIALES;
}

function guardarOrdenes(ordenes) {
  localStorage.setItem(CLAVE_STORAGE, JSON.stringify(ordenes));
}

export function obtenerOrdenes() {
  return leerOrdenes();
}

export function obtenerOrdenPorId(id) {
  return (
    leerOrdenes().find(
      (o) => String(o.id).toUpperCase() === String(id).toUpperCase()
    ) || null
  );
}

export function obtenerOrdenesPorUsuario(identificador) {
  const termino = String(identificador || '').trim().toLowerCase();
  const runNorm = normalizarRun(identificador);

  return leerOrdenes().filter((o) => {
    if (runNorm && o.clienteRun && normalizarRun(o.clienteRun) === runNorm) {
      return true;
    }
    return (
      (o.cliente && o.cliente.toLowerCase().includes(termino)) ||
      (o.correo && o.correo.toLowerCase() === termino)
    );
  });
}

export function crearOrden(datos) {
  const ordenes = leerOrdenes();
  const nuevoId = datos.id || `ORD-${1000 + ordenes.length + 1}`;

  const items = datos.items || [];
  const total = Number(datos.total || items.reduce((acc, it) => acc + it.cantidad * it.precio, 0));
  const neto = Math.round(total / 1.19);
  const iva = total - neto;

  const ordenAGuardar = {
    ...datos,
    id: nuevoId,
    fecha: datos.fecha || new Date().toISOString().split('T')[0],
    estado: datos.estado || 'Pendiente',
    items,
    neto,
    iva,
    total
  };

  ordenes.unshift(ordenAGuardar); // más recientes primero
  guardarOrdenes(ordenes);
  return ordenAGuardar;
}

export function actualizarEstadoOrden(id, nuevoEstado) {
  const ordenes = leerOrdenes();
  const indice = ordenes.findIndex((o) => String(o.id).toUpperCase() === String(id).toUpperCase());
  if (indice === -1) return null;

  ordenes[indice].estado = nuevoEstado;
  guardarOrdenes(ordenes);
  return ordenes[indice];
}

export function eliminarOrden(id) {
  const ordenes = leerOrdenes().filter((o) => String(o.id).toUpperCase() !== String(id).toUpperCase());
  guardarOrdenes(ordenes);
  return true;
}
