document.addEventListener('DOMContentLoaded', () => {
  // Parámetros URL para detección de modo Edición y Backdoor
  const urlParams = new URLSearchParams(window.location.search);
  const codigoParam = urlParams.get('codigo');
  const esModoEdicion = Boolean(codigoParam);

  if (urlParams.get('reset') === 'admin') {
    localStorage.setItem('logistrack_rol_activo', 'Administrador');
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  // Referencias del DOM
  const selectRol = document.getElementById('select-rol-simulado');
  const navUsuarios = document.getElementById('nav-usuarios');
  const alertaRol = document.getElementById('alerta-rol');
  const form = document.getElementById('form-producto');
  const alertaFormulario = document.getElementById('alerta-formulario');

  const inputCodigo = document.getElementById('prod-codigo');
  const selectCategoria = document.getElementById('prod-categoria');
  const inputPrecio = document.getElementById('prod-precio');
  const inputNombre = document.getElementById('prod-nombre');
  const inputStock = document.getElementById('prod-stock');
  const inputStockCritico = document.getElementById('prod-stock-critico');
  const inputImagen = document.getElementById('prod-imagen');
  const inputDescripcion = document.getElementById('prod-descripcion');
  const contadorDescripcion = document.getElementById('contador-descripcion');

  const tituloPantalla = document.getElementById('titulo-pantalla');
  const subtituloPantalla = document.getElementById('subtitulo-pantalla');
  const breadcrumbActivo = document.getElementById('breadcrumb-activo');
  const cardHeaderTitulo = document.getElementById('card-header-titulo');

  // Contador de caracteres reactivo (Descripción: Máx 500)
  inputDescripcion.addEventListener('input', () => {
    contadorDescripcion.textContent = `${inputDescripcion.value.length} / 500 caracteres`;
  });

  // Control de Roles y Accesos
  let rolActual = localStorage.getItem('logistrack_rol_activo') || 'Administrador';
  if (selectRol) {
    selectRol.value = rolActual;
    aplicarPermisos(rolActual);

    selectRol.addEventListener('change', (e) => {
      rolActual = e.target.value;
      localStorage.setItem('logistrack_rol_activo', rolActual);
      aplicarPermisos(rolActual);
    });
  }

  function aplicarPermisos(rol) {
    if (rol === 'Cliente') {
      alert('Acceso Denegado: Los usuarios con perfil "Cliente" no tienen acceso al panel de administración.');
      window.location.href = 'index.html';
      return;
    }
    if (rol === 'Vendedor') {
      if (navUsuarios) navUsuarios.classList.add('d-none');
      if (alertaRol) {
        alertaRol.textContent = 'Modo Vendedor: Tienes permisos para registrar y editar existencias de productos.';
        alertaRol.classList.remove('d-none');
      }
    } else {
      if (navUsuarios) navUsuarios.classList.remove('d-none');
      if (alertaRol) alertaRol.classList.add('d-none');
    }
  }

  // Métodos de persistencia en localStorage
  function leerProductos() {
    return JSON.parse(localStorage.getItem('logistrack_productos')) || [];
  }

  function guardarProductos(productos) {
    localStorage.setItem('logistrack_productos', JSON.stringify(productos));
  }

  // Cargar datos si estamos en modo Edición
  if (esModoEdicion) {
    tituloPantalla.textContent = 'Editar Producto';
    subtituloPantalla.textContent = `Actualizando especificaciones de ${codigoParam}`;
    breadcrumbActivo.textContent = 'Editar';
    cardHeaderTitulo.innerHTML = `<i class="bi bi-pencil-square me-1 text-primary"></i> Editando Producto: ${codigoParam}`;

    const productos = leerProductos();
    const productoAEditar = productos.find(p => p.codigo.toLowerCase() === codigoParam.toLowerCase());

    if (productoAEditar) {
      inputCodigo.value = productoAEditar.codigo;
      inputCodigo.setAttribute('readonly', 'true');
      inputCodigo.classList.add('bg-light');

      selectCategoria.value = productoAEditar.categoria;
      inputPrecio.value = productoAEditar.precio;
      inputNombre.value = productoAEditar.nombre;
      inputStock.value = productoAEditar.stock;
      inputStockCritico.value = productoAEditar.stockCritico !== undefined ? productoAEditar.stockCritico : '';
      inputImagen.value = productoAEditar.imagen || '';
      inputDescripcion.value = productoAEditar.descripcion || '';
      contadorDescripcion.textContent = `${inputDescripcion.value.length} / 500 caracteres`;
    } else {
      alert('El producto no existe o fue eliminado.');
      window.location.href = 'admin-productos.html';
    }
  }

  // Manejador del envío y validaciones según rúbrica
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    alertaFormulario.classList.add('d-none');
    alertaFormulario.textContent = '';

    // Validación HTML5
    if (!form.checkValidity()) {
      e.stopPropagation();
      form.classList.add('was-validated');
      return;
    }

    const codigo = inputCodigo.value.trim();
    const categoria = selectCategoria.value;
    const precio = parseFloat(inputPrecio.value);
    const nombre = inputNombre.value.trim();
    const stock = Number(inputStock.value);
    const stockCritico = inputStockCritico.value !== '' ? Number(inputStockCritico.value) : null;
    const imagen = inputImagen.value.trim();
    const descripcion = inputDescripcion.value.trim();

    // 1. Validación de Precio (Minimo: 0, decimales válidos)
    if (isNaN(precio) || precio < 0) {
      mostrarError('El precio es requerido y debe ser mayor o igual a 0 (ingresa 0 si es FREE).');
      return;
    }

    // 2. Validación de Stock (Requerido, entero >= 0)
    if (!Number.isInteger(stock) || stock < 0) {
      mostrarError('El stock es requerido y debe ser un número entero mayor o igual a 0.');
      return;
    }

    // 3. Validación de Stock Crítico (Opcional, si existe debe ser entero >= 0)
    if (stockCritico !== null && (!Number.isInteger(stockCritico) || stockCritico < 0)) {
      mostrarError('El stock crítico debe ser un número entero mayor o igual a 0.');
      return;
    }

    let productos = leerProductos();

    if (esModoEdicion) {
      // Actualizar producto existente
      const indice = productos.findIndex(p => p.codigo.toLowerCase() === codigoParam.toLowerCase());
      if (indice !== -1) {
        productos[indice] = {
          ...productos[indice],
          nombre,
          categoria,
          precio,
          stock,
          stockCritico: stockCritico !== null ? stockCritico : 0,
          imagen,
          descripcion
        };
        guardarProductos(productos);
        alert('¡Producto actualizado con éxito!');
        window.location.href = 'admin-productos.html';
      }
    } else {
      // Validar que el código no exista previamente en modo Creación
      const duplicado = productos.some(p => p.codigo.toLowerCase() === codigo.toLowerCase());
      if (duplicado) {
        mostrarError(`El código "${codigo}" ya está asignado a otro artículo. Ingresa un código único.`);
        inputCodigo.focus();
        return;
      }

      // Crear nuevo producto en inventario
      const nuevoProducto = {
        codigo,
        nombre,
        categoria,
        precio,
        stock,
        stockCritico: stockCritico !== null ? stockCritico : 0,
        imagen,
        descripcion
      };

      productos.push(nuevoProducto);
      guardarProductos(productos);
      alert('¡Producto registrado con éxito en el catálogo!');
      window.location.href = 'admin-productos.html';
    }
  });

  function mostrarError(mensaje) {
    alertaFormulario.textContent = mensaje;
    alertaFormulario.classList.remove('d-none');
  }
});