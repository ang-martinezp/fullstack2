const CLAVE_STORAGE = 'logistrack_productos';

const CATALOGO_INICIAL = [
  {
    sku: 'SKU-001',
    codigo: 'SKU-001',
    nombre: 'Laptop DELL Latitude',
    descripcion: 'Laptop Office 14 pulgadas.',
    descripcionLarga: 'Laptop empresarial DELL Latitude, ideal para trabajo de oficina y movilidad. Pantalla de 14 pulgadas, procesador Intel Core, memoria RAM suficiente para tareas de productividad diaria, teclado retroiluminado y batería de larga duración. Incluye garantía del fabricante.',
    categoria: 'tecnologia',
    categoriaLabel: 'Tecnología',
    precio: 389990,
    stock: 8,
    stockCritico: 3,
    icono: 'bi-laptop',
    imagen: 'img/productos/sku-001.webp'
  },
  {
    sku: 'SKU-002',
    codigo: 'SKU-002',
    nombre: 'Teclado Kumara USB',
    descripcion: 'Teclado mecánico USB.',
    descripcionLarga: 'Teclado mecánico Kumara con conexión USB, diseñado para digitación intensiva y uso gamer. Switches táctiles que ofrecen una respuesta rápida y precisa, retroiluminación LED y estructura reforzada para mayor durabilidad. Compatible con Windows y pensado para quienes buscan comodidad tanto en oficina como en juegos.',
    categoria: 'tecnologia',
    categoriaLabel: 'Tecnología',
    precio: 14990,
    stock: 12,
    stockCritico: 4,
    icono: 'bi-keyboard',
    oferta: true,
    descuento: 20
  },
  {
    sku: 'SKU-003',
    codigo: 'SKU-003',
    nombre: 'Pasta Térmica Artic MX4',
    descripcion: 'Pasta térmica para repuesto.',
    descripcionLarga: 'Pasta térmica Arctic MX-4, formulada a base de compuestos de carbono de alta conductividad. Ideal para el mantenimiento de procesadores y tarjetas gráficas, mejora la disipación de calor y prolonga la vida útil de los componentes. Fácil aplicación y sin necesidad de curado, con resultados desde el primer uso.',
    categoria: 'mantencion',
    categoriaLabel: 'Mantención',
    precio: 5990,
    stock: 2,
    stockCritico: 5,
    icono: 'bi-cpu-fill'
  },
  {
    sku: 'SKU-004',
    codigo: 'SKU-004',
    nombre: 'Papel A4 Resma',
    descripcion: 'Resma 500 hojas 75g.',
    descripcionLarga: 'Resma de papel tamaño A4 de 500 hojas, gramaje 75g, ideal para impresión de documentos de oficina, contratos e informes. Superficie lisa y blanca que garantiza una impresión nítida tanto en impresoras láser como de tinta. Presentación práctica para el abastecimiento constante de insumos de oficina.',
    categoria: 'insumos',
    categoriaLabel: 'Insumos',
    precio: 3490,
    stock: 25,
    stockCritico: 10,
    icono: 'bi-file-earmark-text'
  },
  {
    sku: 'SKU-005',
    codigo: 'SKU-005',
    nombre: 'Líquido Refrigerante Gamer',
    descripcion: 'Líquido desmineralizado para refrigeraciones líquidas.',
    descripcionLarga: 'Líquido refrigerante desmineralizado especialmente formulado para sistemas de refrigeración líquida en equipos gamer y estaciones de trabajo. Ayuda a mantener temperaturas estables, previene la corrosión interna del circuito y favorece un flujo homogéneo dentro del sistema. Recomendado para mantenciones periódicas.',
    categoria: 'mantencion',
    categoriaLabel: 'Mantención',
    precio: 6990,
    stock: 3,
    stockCritico: 5,
    icono: 'bi-droplet-half',
    oferta: true,
    descuento: 15
  },
  {
    sku: 'SKU-006',
    codigo: 'SKU-006',
    nombre: 'Set destornilladores Bauker 25 en 1',
    descripcion: 'Set de destornilladores 25 en 1 de Cromo Vanadio Acero.',
    descripcionLarga: 'Set de 25 destornilladores Bauker fabricados en acero cromo vanadio, con puntas intercambiables para múltiples formatos (Phillips, plano, Torx, hexagonal, entre otros). Incluye estuche de almacenamiento resistente, ideal para mantenimiento de equipos electrónicos, ensamblaje y reparaciones generales.',
    categoria: 'mantencion',
    categoriaLabel: 'Mantención',
    precio: 5990,
    stock: 14,
    stockCritico: 4,
    icono: 'bi-screwdriver'
  },
  {
    sku: 'SKU-007',
    codigo: 'SKU-007',
    nombre: 'Memoria RAM DDR4 16GB Kingston Fury',
    descripcion: 'Kingston FURY Beast DDR4 de 16GB 3600MHz.',
    descripcionLarga: 'Memoria RAM Kingston FURY Beast DDR4 de 16GB a 3600MHz, diseñada para mejorar el rendimiento en tareas exigentes, multitarea y gaming. Disipador de calor de bajo perfil, compatible con la mayoría de gabinetes y coolers. Alta estabilidad y compatibilidad garantizada con placas madre de última generación.',
    categoria: 'tecnologia',
    categoriaLabel: 'Tecnología',
    precio: 305990,
    stock: 7,
    stockCritico: 3,
    icono: 'bi-memory'
  },
  {
    sku: 'SKU-008',
    codigo: 'SKU-008',
    nombre: 'Unidad SSD Kingston 240GB',
    descripcion: 'Unidad SSD Kingston A400, 240GB, 2.5", SATA3.',
    descripcionLarga: 'Unidad de estado sólido Kingston A400 de 240GB, interfaz SATA3 y formato 2.5 pulgadas. Ofrece tiempos de carga significativamente más rápidos que un disco duro tradicional, mayor resistencia a golpes y menor consumo energético. Ideal para renovar equipos de oficina o darle una segunda vida a notebooks antiguos.',
    categoria: 'tecnologia',
    categoriaLabel: 'Tecnología',
    precio: 64990,
    stock: 9,
    stockCritico: 4,
    icono: 'bi-device-ssd'
  },
  {
    sku: 'SKU-009',
    codigo: 'SKU-009',
    nombre: 'Cable HDMI Xtech 1.8m',
    descripcion: 'Cable HDMI Xtech 1.8mts.',
    descripcionLarga: 'Cable HDMI Xtech de 1.8 metros, compatible con resoluciones Full HD y 4K. Conectores reforzados y blindaje que reduce interferencias, asegurando una transmisión de audio y video estable. Ideal para conectar notebooks, monitores, proyectores y equipos multimedia en entornos de oficina.',
    categoria: 'tecnologia',
    categoriaLabel: 'Tecnología',
    precio: 6990,
    stock: 30,
    stockCritico: 6,
    icono: 'bi-hdmi',
    oferta: true,
    descuento: 30
  }
];

function leerProductos() {
  const guardado = localStorage.getItem(CLAVE_STORAGE);
  if (guardado) {
    try {
      const parsed = JSON.parse(guardado);
      // Asegurar que cada producto tenga tanto 'sku' como 'codigo' y campos de stock
      return parsed.map((p) => ({
        ...p,
        sku: p.sku || p.codigo,
        codigo: p.codigo || p.sku,
        stock: Number(p.stock !== undefined ? p.stock : 10),
        stockCritico: Number(p.stockCritico !== undefined ? p.stockCritico : 5)
      }));
    } catch {
      // Si hay error en el parse, reinicializar
    }
  }
  localStorage.setItem(CLAVE_STORAGE, JSON.stringify(CATALOGO_INICIAL));
  return CATALOGO_INICIAL;
}

function guardarProductos(productos) {
  localStorage.setItem(CLAVE_STORAGE, JSON.stringify(productos));
}

export function obtenerProductos() {
  return leerProductos();
}

export function obtenerProductosPorCategoria(categoria) {
  const productos = leerProductos();
  if (!categoria || categoria === 'todos') return productos;
  return productos.filter((p) => p.categoria === categoria);
}

export function obtenerProductoPorSku(sku) {
  return (
    leerProductos().find(
      (p) => String(p.sku || p.codigo).toUpperCase() === String(sku).toUpperCase()
    ) || null
  );
}

export function crearProducto(nuevo) {
  const productos = leerProductos();
  const skuNormalizado = String(nuevo.sku || nuevo.codigo || `SKU-${Date.now()}`).toUpperCase();
  
  const existe = productos.some((p) => (p.sku || p.codigo).toUpperCase() === skuNormalizado);
  if (existe) {
    throw new Error(`Ya existe un producto con el código/SKU ${skuNormalizado}`);
  }

  const productoAGuardar = {
    ...nuevo,
    sku: skuNormalizado,
    codigo: skuNormalizado,
    precio: Number(nuevo.precio || 0),
    stock: Number(nuevo.stock || 0),
    stockCritico: Number(nuevo.stockCritico || 0)
  };

  productos.push(productoAGuardar);
  guardarProductos(productos);
  return productoAGuardar;
}

export function actualizarProducto(sku, cambios) {
  const productos = leerProductos();
  const indice = productos.findIndex(
    (p) => String(p.sku || p.codigo).toUpperCase() === String(sku).toUpperCase()
  );
  if (indice === -1) return null;

  const actualizado = {
    ...productos[indice],
    ...cambios,
    sku: productos[indice].sku, // mantener identidad
    codigo: productos[indice].codigo || productos[indice].sku,
    precio: cambios.precio !== undefined ? Number(cambios.precio) : productos[indice].precio,
    stock: cambios.stock !== undefined ? Number(cambios.stock) : productos[indice].stock,
    stockCritico: cambios.stockCritico !== undefined ? Number(cambios.stockCritico) : productos[indice].stockCritico
  };

  productos[indice] = actualizado;
  guardarProductos(productos);
  return actualizado;
}

export function eliminarProducto(sku) {
  const productos = leerProductos().filter(
    (p) => String(p.sku || p.codigo).toUpperCase() !== String(sku).toUpperCase()
  );
  guardarProductos(productos);
  return true;
}

export function obtenerProductosEnOferta() {
  return leerProductos().filter((p) => p.oferta);
}

export function obtenerProductosCriticos() {
  return leerProductos().filter((p) => Number(p.stock) <= Number(p.stockCritico));
}
