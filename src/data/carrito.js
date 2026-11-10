/**
 * Capa de persistencia y operaciones CRUD para el Carrito de Compras (localStorage).
 * Sincroniza en tiempo real el contador del Header, la vista Carrito y el Checkout.
 */

import { obtenerProductoPorSku } from './productos';

export const CLAVE_CARRITO = 'logistrack_carrito';
export const CLAVE_ULTIMA_ORDEN = 'logistrack_ultima_orden';

function emitirEventoCarrito() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('logistrack_carrito_actualizado'));
  }
}

function leerCarritoRaw() {
  const guardado = localStorage.getItem(CLAVE_CARRITO);
  if (!guardado) return [];
  try {
    const parsed = JSON.parse(guardado);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function guardarCarritoRaw(items) {
  localStorage.setItem(CLAVE_CARRITO, JSON.stringify(items));
  emitirEventoCarrito();
}

/**
 * Calcula el precio unitario final considerando descuento si el producto está en oferta.
 */
export function calcularPrecioEfectivo(producto) {
  if (!producto) return 0;
  const precioBase = Number(producto.precio || 0);
  if (producto.oferta && Number(producto.descuento) > 0) {
    return Math.round(precioBase * (1 - Number(producto.descuento) / 100));
  }
  return precioBase;
}

/**
 * Obtiene todos los ítems del carrito enriquecidos con información del catálogo.
 */
export function obtenerCarrito() {
  const items = leerCarritoRaw();
  return items.map((item) => {
    const sku = item.sku || item.codigo;
    const prodCatalogo = obtenerProductoPorSku(sku);
    const precioUnitario = Number(item.precio ?? (prodCatalogo ? calcularPrecioEfectivo(prodCatalogo) : 0));
    const cantidad = Math.max(1, Number(item.cantidad || 1));

    return {
      sku,
      codigo: sku,
      nombre: item.nombre || prodCatalogo?.nombre || sku,
      precio: precioUnitario,
      precioOriginal: prodCatalogo?.precio || precioUnitario,
      oferta: Boolean(prodCatalogo?.oferta),
      descuento: Number(prodCatalogo?.descuento || 0),
      cantidad,
      subtotal: precioUnitario * cantidad,
      imagen: item.imagen || prodCatalogo?.imagen || null,
      icono: item.icono || prodCatalogo?.icono || 'bi-box-seam',
      categoriaLabel: item.categoriaLabel || prodCatalogo?.categoriaLabel || 'General',
      stockDisponible: prodCatalogo ? Number(prodCatalogo.stock) : 99
    };
  });
}

/**
 * Agrega un producto al carrito o incrementa su cantidad si ya existe.
 */
export function agregarAlCarrito(producto, cantidad = 1) {
  if (!producto) return [];
  const sku = String(producto.sku || producto.codigo).toUpperCase();
  const cantAgregar = Math.max(1, Number(cantidad || 1));
  const precioFinal = calcularPrecioEfectivo(producto);

  const carrito = leerCarritoRaw();
  const existente = carrito.find(
    (item) => String(item.codigo || item.sku).toUpperCase() === sku
  );

  if (existente) {
    existente.cantidad = Number(existente.cantidad || 0) + cantAgregar;
    existente.precio = precioFinal;
  } else {
    carrito.push({
      sku,
      codigo: sku,
      nombre: producto.nombre,
      precio: precioFinal,
      cantidad: cantAgregar,
      imagen: producto.imagen || null,
      icono: producto.icono || 'bi-box-seam',
      categoriaLabel: producto.categoriaLabel || 'General'
    });
  }

  guardarCarritoRaw(carrito);
  return obtenerCarrito();
}

/**
 * Actualiza la cantidad exacta de un ítem en el carrito. Si es <= 0, lo elimina.
 */
export function actualizarCantidadCarrito(skuRaw, nuevaCantidad) {
  const sku = String(skuRaw || '').toUpperCase();
  const cant = Number(nuevaCantidad);
  let carrito = leerCarritoRaw();

  if (cant <= 0) {
    carrito = carrito.filter(
      (item) => String(item.codigo || item.sku).toUpperCase() !== sku
    );
  } else {
    const item = carrito.find(
      (it) => String(it.codigo || it.sku).toUpperCase() === sku
    );
    if (item) {
      item.cantidad = cant;
    }
  }

  guardarCarritoRaw(carrito);
  return obtenerCarrito();
}

/**
 * Elimina un producto del carrito por su SKU/código.
 */
export function eliminarDelCarrito(skuRaw) {
  const sku = String(skuRaw || '').toUpperCase();
  const carrito = leerCarritoRaw().filter(
    (item) => String(item.codigo || item.sku).toUpperCase() !== sku
  );
  guardarCarritoRaw(carrito);
  return obtenerCarrito();
}

/**
 * Vacía completamente el carrito de compras.
 */
export function vaciarCarrito() {
  guardarCarritoRaw([]);
  return [];
}

/**
 * Calcula la suma total a pagar del carrito.
 */
export function calcularTotalCarrito(items = null) {
  const lista = items || obtenerCarrito();
  return lista.reduce(
    (acc, item) => acc + Number(item.precio || 0) * Number(item.cantidad || 0),
    0
  );
}

/**
 * Cuenta el total de unidades en el carrito para el badge del Header.
 */
export function contarItemsCarrito(items = null) {
  const lista = items || leerCarritoRaw();
  return lista.reduce((acc, item) => acc + Number(item.cantidad || 0), 0);
}
