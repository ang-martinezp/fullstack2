const CATALOGO_PRODUCTOS = [
    {
        sku: 'SKU-001',
        nombre: 'Laptop DELL Latitude',
        descripcion: 'Laptop Office 14 pulgadas.',
        categoriaLabel: 'Tecnología',
        precio: 389990,
        icono: 'bi-laptop'
    },
    {
        sku: 'SKU-002',
        nombre: 'Teclado Kumara USB',
        descripcion: 'Teclado mecánico USB.',
        categoriaLabel: 'Tecnología',
        precio: 14990,
        icono: 'bi-keyboard'
    },
    {
        sku: 'SKU-003',
        nombre: 'Pasta Térmica Artic MX4',
        descripcion: 'Pasta térmica para repuesto.',
        categoriaLabel: 'Insumos',
        precio: 5990,
        icono: 'bi-cpu-fill'
    },
    {
        sku: 'SKU-004',
        nombre: 'Papel A4 Resma',
        descripcion: 'Resma 500 hojas 75g.',
        categoriaLabel: 'Insumos',
        precio: 3490,
        icono: 'bi-file-earmark-text'
    },
    {
        sku: 'SKU-005',
        nombre: 'Líquido Refrigerante Gamer',
        descripcion: 'Líquido desmineralizado para refrigeraciones líquidas.',
        categoriaLabel: 'Mantención',
        precio: 6990,
        icono: 'bi-droplet-half'
    },
    {
        sku: 'SKU-006',
        nombre: 'Set destornilladores Bauker 25 en 1',
        descripcion: 'Set de destornilladores 25 en 1 de Cromo Vanadio Acero.',
        categoriaLabel: 'Mantención',
        precio: 5990,
        icono: 'bi-screwdriver'
    },
    {
        sku: 'SKU-007',
        nombre: 'Memoria RAM DDR4 16GB Kingston Fury',
        descripcion: 'Kingston FURY Beast DDR4 de 16GB 3600MHz.',
        categoriaLabel: 'Tecnología',
        precio: 305990,
        icono: 'bi-memory'
    },
    {
        sku: 'SKU-008',
        nombre: 'Unidad SSD Kingston 240GB',
        descripcion: 'Unidad SSD Kingston A400, 240GB, 2.5", SATA3.',
        categoriaLabel: 'Tecnología',
        precio: 64990,
        icono: 'bi-device-ssd'
    },
    {   
        sku: 'SKU-009',
        nombre: 'Cable HDMI Xtech',
        descripcion: 'Cable HDMI Xtech 1.8mts.',
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
                <div class="card border-0 shadow-sm rounded-4 p-5 d-flex align-items-center justify-content-center" style="background:#eef2f6; min-height:320px;">
                    <i class="bi ${producto.icono} display-1 text-navy"></i>
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