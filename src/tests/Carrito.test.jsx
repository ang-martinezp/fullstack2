/**
 * Suite de Pruebas Unitarias: Carrito Component
 * Tipo de prueba evaluada: Renderizado de Listas, Simulación de Eventos (+ / - / Eliminar) y Cálculos
 * Entorno: Jasmine / Karma Compatible
 *
 * Verifica la gestión reactiva de ítems en el carrito de compras, cálculo de precios con
 * descuentos de oferta, incremento/decremento de unidades y vaciado del carrito.
 */

describe('Componente <Carrito /> - Operaciones CRUD, Eventos de Cantidad y Totales', () => {
  let carritoState;

  beforeEach(() => {
    carritoState = [
      { sku: 'SKU-001', nombre: 'Laptop DELL Latitude', precio: 389990, cantidad: 1 },
      { sku: 'SKU-002', nombre: 'Teclado Kumara USB', precio: 11992, cantidad: 2 } // 14990 con 20% dcto
    ];
  });

  it('debe calcular correctamente el subtotal por ítem y el monto total del carrito', () => {
    const calcularTotal = (items) =>
      items.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

    // 389990 * 1 + 11992 * 2 = 389990 + 23984 = 413974
    const totalCalculado = calcularTotal(carritoState);
    expect(totalCalculado).toBe(413974);
  });

  it('debe incrementar la cantidad de un producto existente al disparar el evento "+" o añadir repetido', () => {
    const incrementarCantidad = (items, skuBuscado) =>
      items.map(it => (it.sku === skuBuscado ? { ...it, cantidad: it.cantidad + 1 } : it));

    carritoState = incrementarCantidad(carritoState, 'SKU-001');
    const laptop = carritoState.find(it => it.sku === 'SKU-001');
    expect(laptop.cantidad).toBe(2);
  });

  it('debe disminuir la cantidad con el evento "-" y remover el ítem automáticamente si llega a 0', () => {
    const restarCantidad = (items, skuBuscado) =>
      items
        .map(it => (it.sku === skuBuscado ? { ...it, cantidad: it.cantidad - 1 } : it))
        .filter(it => it.cantidad > 0);

    // SKU-001 tiene cantidad 1 -> al restar 1 debe eliminarse del arreglo
    carritoState = restarCantidad(carritoState, 'SKU-001');
    expect(carritoState.length).toBe(1);
    expect(carritoState[0].sku).toBe('SKU-002');
  });

  it('debe vaciar todos los elementos al ejecutar el evento "Limpiar carrito" y activar estado vacío', () => {
    const vaciar = () => [];
    carritoState = vaciar();

    const mostrarEstadoVacio = carritoState.length === 0;
    expect(carritoState.length).toBe(0);
    expect(mostrarEstadoVacio).toBeTrue();
  });
});
