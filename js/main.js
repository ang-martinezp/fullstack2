document.addEventListener('DOMContentLoaded', () => {

    
    // 1. CONTADOR DEL CARRITO EN EL HEADER (todas las páginas)
    
    function actualizarContadorCarrito() {
        const contador = document.getElementById('carrito-contador');
        if (!contador) return;
        const carrito = JSON.parse(localStorage.getItem('logistrack_carrito') || '[]');
        const totalUnidades = carrito.reduce((acc, item) => acc + (item.cantidad || 0), 0);
        contador.textContent = totalUnidades;
    }
    actualizarContadorCarrito();


    // 2. FILTRO DE PRODUCTOS POR CATEGORÍA 
   
    const botonesFiltro = document.querySelectorAll('.btn-filtro');
    const articulosProductos = document.querySelectorAll('.articulo-producto');

    if (botonesFiltro.length > 0 && articulosProductos.length > 0) {
        botonesFiltro.forEach(boton => {
            boton.addEventListener('click', () => {
                botonesFiltro.forEach(b => {
                    b.classList.remove('btn-primary');
                    b.classList.add('btn-outline-primary');
                });
                boton.classList.remove('btn-outline-primary');
                boton.classList.add('btn-primary');

                const categoriaSeleccionada = boton.getAttribute('data-categoria');
                articulosProductos.forEach(articulo => {
                    const categoria = articulo.getAttribute('data-categoria');
                    articulo.style.display = (categoriaSeleccionada === 'todos' || categoria === categoriaSeleccionada) ? 'block' : 'none';
                });
            });
        });
    }

});