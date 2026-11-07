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

function renderizarCarrito() {
    const carrito = leerCarrito();
    const conItems = document.getElementById('carrito-con-items');
    const vacio = document.getElementById('carrito-vacio');
    const filas = document.getElementById('carrito-filas');
    const totalEl = document.getElementById('carrito-total');

    if (carrito.length === 0) {
        conItems.classList.add('d-none');
        vacio.classList.remove('d-none');
        return;
    }

    conItems.classList.remove('d-none');
    vacio.classList.add('d-none');

    let total = 0;
    filas.innerHTML = carrito.map(item => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;
        return `
            <tr class="carrito-item" data-sku="${item.codigo}">
                <td>${item.nombre}</td>
                <td class="text-center">${formatearCLP(item.precio)}</td>
                <td class="text-center">
                    <div class="input-group input-group-sm">
                        <button class="btn btn-outline-secondary btn-restar" type="button">-</button>
                        <input type="text" class="form-control text-center" value="${item.cantidad}" readonly>
                        <button class="btn btn-outline-secondary btn-sumar" type="button">+</button>
                    </div>
                </td>
                <td class="text-end fw-bold">${formatearCLP(subtotal)}</td>
                <td class="text-end">
                    <button class="btn btn-sm btn-outline-danger btn-quitar" type="button" title="Quitar">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');

    totalEl.textContent = formatearCLP(total);
}

document.addEventListener('DOMContentLoaded', () => {
    const filas = document.getElementById('carrito-filas');
    if (!filas) return; 

    renderizarCarrito();

    // Delegacion de eventos: los botones se crean dinamicamente en cada render
    filas.addEventListener('click', (evento) => {
        const fila = evento.target.closest('tr[data-sku]');
        if (!fila) return;
        const sku = fila.getAttribute('data-sku');
        const carrito = leerCarrito();
        const item = carrito.find(p => p.codigo === sku);
        if (!item) return;

        if (evento.target.closest('.btn-sumar')) {
            item.cantidad += 1;
        } else if (evento.target.closest('.btn-restar')) {
            item.cantidad -= 1;
            if (item.cantidad <= 0) {
                const indice = carrito.indexOf(item);
                carrito.splice(indice, 1);
            }
        } else if (evento.target.closest('.btn-quitar')) {
            const indice = carrito.indexOf(item);
            carrito.splice(indice, 1);
        } else {
            return;
        }

        guardarCarrito(carrito);
        renderizarCarrito();
    });

    document.getElementById('btn-vaciar-carrito').addEventListener('click', () => {
        guardarCarrito([]);
        renderizarCarrito();
    });

    document.getElementById('btn-finalizar-compra').addEventListener('click', () => {
        guardarCarrito([]);
        renderizarCarrito();
        const mensaje = document.getElementById('carrito-finalizado');
        mensaje.classList.remove('d-none');
        setTimeout(() => mensaje.classList.add('d-none'), 4000);
    });
});