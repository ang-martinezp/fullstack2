/**
 * Suite de Pruebas Unitarias: Carrito Component
 * Tipo de prueba evaluada: Gestión de Estado, Operaciones de Carrito y Cálculos
 * Entorno: Jasmine / Jest Compatible
 * Autor: Angel Martinez (Bloque Tienda Pública)
 */

describe('Componente <Carrito /> - Gestión de Carrito y Totales', () => {
  const agregarOActualizarItem = (carritoActual, producto, cantidadAAgregar) => {
    const nuevoCarrito = carritoActual.map(item => ({ ...item }));
    const existente = nuevoCarrito.find(item => item.codigo === producto.sku);
    if (existente) {
      existente.cantidad += cantidadAAgregar;
    } else {
      nuevoCarrito.push({
        codigo: producto.sku,
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad: cantidadAAgregar
      });
    }
    return nuevoCarrito;
  };

  const modificarCantidad = (carritoActual, sku, delta) => {
    return carritoActual
      .map(item => {
        if (item.codigo === sku) {
          const nuevaCantidad = item.cantidad + delta;
          return { ...item, cantidad: nuevaCantidad };
        }
        return { ...item };
      })
      .filter(item => item.cantidad > 0);
  };

  const calcularTotal = (carrito) => {
    return carrito.reduce((acumulado, item) => acumulado + (item.precio * item.cantidad), 0);
  };

  it('Caso 1: debe agregar un producto al carrito e incrementar su cantidad si ya existe sin duplicar el registro', () => {
    const producto1 = { sku: 'SKU-001', nombre: 'Notebook Lenovo ThinkPad E14', precio: 689990 };
    const producto2 = { sku: 'SKU-002', nombre: 'Mouse Inalámbrico Logitech', precio: 12990 };

    let carrito = [];
    carrito = agregarOActualizarItem(carrito, producto1, 1);
    expect(carrito.length).toBe(1);
    expect(carrito[0].cantidad).toBe(1);

    // Al añadir el mismo producto, incrementa cantidad (1 + 2 = 3) sin duplicar fila
    carrito = agregarOActualizarItem(carrito, producto1, 2);
    expect(carrito.length).toBe(1);
    expect(carrito[0].cantidad).toBe(3);

    // Al añadir un producto diferente, crea una nueva posición
    carrito = agregarOActualizarItem(carrito, producto2, 1);
    expect(carrito.length).toBe(2);
  });

  it('Caso 2: debe calcular correctamente el total a pagar y remover el producto si la cantidad llega a 0', () => {
    let carrito = [
      { codigo: 'SKU-001', nombre: 'Notebook Lenovo', precio: 600000, cantidad: 1 },
      { codigo: 'SKU-002', nombre: 'Mouse Logitech', precio: 10000, cantidad: 2 }
    ];

    // Total inicial esperado: (600.000 * 1) + (10.000 * 2) = 620.000
    const totalInicial = calcularTotal(carrito);
    expect(totalInicial).toBe(620000);

    // Disminuir 1 mouse (-1)
    carrito = modificarCantidad(carrito, 'SKU-002', -1);
    expect(carrito.find(item => item.codigo === 'SKU-002').cantidad).toBe(1);
    expect(calcularTotal(carrito)).toBe(610000);

    // Disminuir nuevamente: cantidad llega a 0 -> se remueve del carrito
    carrito = modificarCantidad(carrito, 'SKU-002', -1);
    expect(carrito.length).toBe(1);
    expect(carrito.some(item => item.codigo === 'SKU-002')).toBeFalse();
    expect(calcularTotal(carrito)).toBe(600000);
  });
});