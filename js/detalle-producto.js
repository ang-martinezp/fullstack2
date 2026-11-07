const CATALOGO_PRODUCTOS = [
    {
        sku: 'SKU-001',
        nombre: 'Laptop DELL Latitude',
        descripcion: 'Laptop Office 14 pulgadas.',
        descripcionLarga: 'Laptop empresarial DELL Latitude, ideal para trabajo de oficina y movilidad. Pantalla de 14 pulgadas, procesador Intel Core, memoria RAM suficiente para tareas de productividad diaria, teclado retroiluminado y batería de larga duración. Incluye garantía del fabricante.',
        categoriaLabel: 'Tecnología',
        precio: 389990,
        icono: 'bi-laptop',
        imagen: 'img/productos/sku-001.webp'
    },
    {
        sku: 'SKU-002',
        nombre: 'Teclado Kumara USB',
        descripcion: 'Teclado mecánico USB.',
        descripcionLarga:'Teclado mecánico Kumara con conexión USB, diseñado para digitación intensiva y uso gamer. Switches táctiles que ofrecen una respuesta rápida y precisa, retroiluminación LED y estructura reforzada para mayor durabilidad. Compatible con Windows y pensado para quienes buscan comodidad tanto en oficina como en juegos.',
        categoriaLabel: 'Tecnología',
        precio: 14990,
        icono: 'bi-keyboard'
    },
    {
        sku: 'SKU-003',
        nombre: 'Pasta Térmica Artic MX4',
        descripcion: 'Pasta térmica para repuesto.',
        descripcionLarga:'Pasta térmica Arctic MX-4, formulada a base de compuestos de carbono de alta conductividad. Ideal para el mantenimiento de procesadores y tarjetas gráficas, mejora la disipación de calor y prolonga la vida útil de los componentes. Fácil aplicación y sin necesidad de curado, con resultados desde el primer uso.',
        categoriaLabel: 'Insumos',
        precio: 5990,
        icono: 'bi-cpu-fill'
    },
    {
        sku: 'SKU-004',
        nombre: 'Papel A4 Resma',
        descripcion: 'Resma 500 hojas 75g.',
        descripcionLarga:'Resma de papel tamaño A4 de 500 hojas, gramaje 75g, ideal para impresión de documentos de oficina, contratos e informes. Superficie lisa y blanca que garantiza una impresión nítida tanto en impresoras láser como de tinta. Presentación práctica para el abastecimiento constante de insumos de oficina.',
        categoriaLabel: 'Insumos',
        precio: 3490,
        icono: 'bi-file-earmark-text'
    },
    {
        sku: 'SKU-005',
        nombre: 'Líquido Refrigerante Gamer',
        descripcion: 'Líquido desmineralizado para refrigeraciones líquidas.',
        descripcionLarga:'Líquido refrigerante desmineralizado especialmente formulado para sistemas de refrigeración líquida en equipos gamer y estaciones de trabajo. Ayuda a mantener temperaturas estables, previene la corrosión interna del circuito y favorece un flujo homogéneo dentro del sistema. Recomendado para mantenciones periódicas.',
        categoriaLabel: 'Mantención',
        precio: 6990,
        icono: 'bi-droplet-half'
    },
    {
        sku: 'SKU-006',
        nombre: 'Set destornilladores Bauker 25 en 1',
        descripcion: 'Set de destornilladores 25 en 1 de Cromo Vanadio Acero.',
        descripcionLarga:'Set de 25 destornilladores Bauker fabricados en acero cromo vanadio, con puntas intercambiables para múltiples formatos (Phillips, plano, Torx, hexagonal, entre otros). Incluye estuche de almacenamiento resistente, ideal para mantenimiento de equipos electrónicos, ensamblaje y reparaciones generales.',
        categoriaLabel: 'Mantención',
        precio: 5990,
        icono: 'bi-screwdriver'
    },
    {
        sku: 'SKU-007',
        nombre: 'Memoria RAM DDR4 16GB Kingston Fury',
        descripcion: 'Kingston FURY Beast DDR4 de 16GB 3600MHz.',
        descripcionLarga:'Memoria RAM Kingston FURY Beast DDR4 de 16GB a 3600MHz, diseñada para mejorar el rendimiento en tareas exigentes, multitarea y gaming. Disipador de calor de bajo perfil, compatible con la mayoría de gabinetes y coolers. Alta estabilidad y compatibilidad garantizada con placas madre de última generación.',
        categoriaLabel: 'Tecnología',
        precio: 305990,
        icono: 'bi-memory'
    },
    {
        sku: 'SKU-008',
        nombre: 'Unidad SSD Kingston 240GB',
        descripcion: 'Unidad SSD Kingston A400, 240GB, 2.5", SATA3.',
        descripcionLarga:'Unidad de estado sólido Kingston A400 de 240GB, interfaz SATA3 y formato 2.5 pulgadas. Ofrece tiempos de carga significativamente más rápidos que un disco duro tradicional, mayor resistencia a golpes y menor consumo energético. Ideal para renovar equipos de oficina o darle una segunda vida a notebooks antiguos.',
        categoriaLabel: 'Tecnología',
        precio: 64990,
        icono: 'bi-device-ssd'
    },
    {   
        sku: 'SKU-009',
        nombre: 'Cable HDMI Xtech',
        descripcion: 'Cable HDMI Xtech 1.8mts.',
        descripcionLarga:'Cable HDMI Xtech de 1.8 metros, compatible con resoluciones Full HD y 4K. Conectores reforzados y blindaje que reduce interferencias, asegurando una transmisión de audio y video estable. Ideal para conectar notebooks, monitores, proyectores y equipos multimedia en entornos de oficina.',
        categoriaLabel: 'Tecnología',
        precio: 6990,
        icono: 'bi-hdmi'
    }
];

function formatearCLP(numero) {
    return '$' + numero.toLocaleString('es-CL');
}

function leerCarrito() {
    return JSON.parse(localStorage.getItem('logistrack_carrito') || '[]');
}

function guardarCarrito(carrito) {
    localStorage.setItem('logistrack_carrito', JSON.stringify(carrito));
    const contador = document.getElementById('carrito-contador');
    if (contador) {
        contador.textContent = carrito.reduce((acc, item) => acc + (item.cantidad || 0), 0);
    }
}

function agregarAlCarrito(producto, cantidad) {
    const carrito = leerCarrito();
    const existente = carrito.find(item => item.codigo === producto.sku);
    if (existente) {
        existente.cantidad += cantidad;
    } else {
        carrito.push({
            codigo: producto.sku,
            nombre: producto.nombre,
            precio: producto.precio,
            cantidad: cantidad
        });
    }
    guardarCarrito(carrito);
}

document.addEventListener('DOMContentLoaded', () => {
    const contenedor = document.getElementById('detalle-contenido');
    const seccionNoEncontrado = document.getElementById('detalle-no-encontrado');
    if (!contenedor) return; 

    const params = new URLSearchParams(window.location.search);
    const sku = params.get('sku');
    const producto = CATALOGO_PRODUCTOS.find(p => p.sku === sku);

    if (!producto) {
        contenedor.classList.add('d-none');
        seccionNoEncontrado.classList.remove('d-none');
        return;
    }

    document.title = producto.nombre + ' - LogisTrack Store';
    const breadcrumb = document.getElementById('breadcrumb-producto');
    if (breadcrumb) breadcrumb.textContent = producto.nombre;

    contenedor.innerHTML = `
        <div class="row g-5 align-items-start">
            <div class="col-md-5">
    <div class="card border-0 shadow-sm rounded-4 d-flex align-items-center justify-content-center overflow-hidden" style="background:#eef2f6; min-height:320px;">
        ${producto.imagen
            ? `<img src="${producto.imagen}" alt="${producto.nombre}" class="img-fluid" style="max-height:320px; object-fit:contain;">`
            : `<i class="bi ${producto.icono} display-1 text-navy p-5"></i>`}
    </div>
</div>

            <div class="col-md-7">
                <span class="badge bg-navy mb-2">${producto.categoriaLabel}</span>
                <h1 class="h2 fw-bold text-navy">${producto.nombre}</h1>
                <p class="text-muted">SKU: ${producto.sku}</p>
                <p class="lead">${producto.descripcion}</p>
                <p class="display-6 fw-bold text-navy mb-4">${formatearCLP(producto.precio)}</p>

                <div class="d-flex align-items-center gap-3 mb-4">
                    <label for="cantidad" class="form-label mb-0 fw-semibold">Cantidad</label>
                    <div class="input-group" style="width: 140px;">
                        <button class="btn btn-outline-secondary" type="button" id="btn-restar">-</button>
                        <input type="number" class="form-control text-center" id="cantidad" value="1" min="1">
                        <button class="btn btn-outline-secondary" type="button" id="btn-sumar">+</button>
                    </div>
                </div>

                <button class="btn btn-brand btn-lg" id="btn-agregar-carrito">
                    <i class="bi bi-cart-plus me-1"></i> Añadir al carrito
                </button>

                <div class="row mt-5">
                <div class="col-12">
                    <h3 class="h4 fw-bold text-navy border-bottom pb-2 mb-3">Descripción del producto</h3>
                    <p class="text-muted" style="white-space: pre-line; font-size: 18px;">${producto.descripcionLarga || producto.descripcion}</p>
                </div>
            </div>

                <div class="alert alert-success mt-3 d-none" id="mensaje-agregado" role="alert">
                    <i class="bi bi-check-circle me-1"></i> Producto agregado al carrito.
                </div>
            </div>
        </div>
    `;

    const inputCantidad = document.getElementById('cantidad');
    document.getElementById('btn-restar').addEventListener('click', () => {
        const actual = parseInt(inputCantidad.value, 10) || 1;
        inputCantidad.value = Math.max(1, actual - 1);
    });
    document.getElementById('btn-sumar').addEventListener('click', () => {
        const actual = parseInt(inputCantidad.value, 10) || 1;
        inputCantidad.value = actual + 1;
    });

    document.getElementById('btn-agregar-carrito').addEventListener('click', () => {
        const cantidad = Math.max(1, parseInt(inputCantidad.value, 10) || 1);
        agregarAlCarrito(producto, cantidad);
        const mensaje = document.getElementById('mensaje-agregado');
        mensaje.classList.remove('d-none');
        setTimeout(() => mensaje.classList.add('d-none'), 2500);
    });
});