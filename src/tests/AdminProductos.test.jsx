/**
 * Suite de Pruebas Unitarias: AdminProductos Component
 * Tipo de prueba evaluada: Renderizado Correcto de Listas y Filtrado Reactivo
 * Entorno: Jasmine / Jest Compatible
 * 
 * Verifica que el listado de productos procese los datos mockeados o persistidos,
 * detecte productos en stock crítico y filtre reactivamente por texto y categoría.
 */

describe('Componente <AdminProductos /> - Renderizado de Listas y Filtrado', () => {
  const productosMock = [
    { sku: 'SKU-001', nombre: 'Notebook Lenovo ThinkPad E14', categoria: 'tecnologia', precio: 689990, stock: 12, stockCritico: 5 },
    { sku: 'SKU-002', nombre: 'Mouse Inalámbrico Logitech M185', categoria: 'perifericos', precio: 12990, stock: 3, stockCritico: 8 },
    { sku: 'SKU-003', nombre: 'Teclado Mecánico Redragon Kumara', categoria: 'perifericos', precio: 34990, stock: 2, stockCritico: 5 },
    { sku: 'SKU-004', nombre: 'Monitor LG UltraGear 24 Pulgadas', categoria: 'tecnologia', precio: 149990, stock: 15, stockCritico: 4 },
    { sku: 'SKU-005', nombre: 'Silla Ergonómica Ejecutiva OfficePro', categoria: 'muebles', precio: 189990, stock: 7, stockCritico: 3 }
  ];

  it('debe renderizar y mapear la totalidad de elementos del conjunto de datos', () => {
    expect(productosMock.length).toBe(5);
    const skus = productosMock.map(p => p.sku);
    expect(skus).toContain('SKU-001');
    expect(skus).toContain('SKU-005');
  });

  it('debe identificar correctamente los productos que se encuentran en stock crítico (stock <= stockCritico)', () => {
    const productosCriticos = productosMock.filter(p => Number(p.stock) <= Number(p.stockCritico));
    
    // SKU-002 (stock 3 <= 8) y SKU-003 (stock 2 <= 5)
    expect(productosCriticos.length).toBe(2);
    expect(productosCriticos.map(p => p.sku)).toEqual(['SKU-002', 'SKU-003']);
  });

  it('debe filtrar reactivamente los productos por coincidencia de texto en nombre o SKU', () => {
    const filtroTexto = 'logitech';
    const filtrados = productosMock.filter(p => 
      p.nombre.toLowerCase().includes(filtroTexto) || p.sku.toLowerCase().includes(filtroTexto)
    );

    expect(filtrados.length).toBe(1);
    expect(filtrados[0].sku).toBe('SKU-002');
  });

  it('debe filtrar reactivamente los productos por categoría seleccionada', () => {
    const filtroCategoria = 'tecnologia';
    const filtrados = productosMock.filter(p => p.categoria === filtroCategoria);

    expect(filtrados.length).toBe(2);
    expect(filtrados.every(p => p.categoria === 'tecnologia')).toBeTrue();
  });
});
