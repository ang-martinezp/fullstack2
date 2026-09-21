document.addEventListener('DOMContentLoaded', () => {
  // Parámetros URL para detección de modo Edición y Backdoor
  const urlParams = new URLSearchParams(window.location.search);
  const runParam = urlParams.get('run');
  const esModoEdicion = Boolean(runParam);

  if (urlParams.get('reset') === 'admin') {
    localStorage.setItem('logistrack_rol_activo', 'Administrador');
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  // 1. Arreglo estructurado de Regiones y Comunas de Chile
  const regionesYComunas = [
    {
      region: "Arica y Parinacota",
      comunas: ["Arica", "Camarones", "Putre", "General Lagos"]
    },
    {
      region: "Tarapacá",
      comunas: ["Iquique", "Alto Hospicio", "Pozo Almonte", "Camiña", "Colchane", "Huara", "Pica"]
    },
    {
      region: "Antofagasta",
      comunas: ["Antofagasta", "Mejillones", "Sierra Gorda", "Taltal", "Calama", "Ollagüe", "San Pedro de Atacama", "Tocopilla", "María Elena"]
    },
    {
      region: "Atacama",
      comunas: ["Copiapó", "Caldera", "Tierra Amarilla", "Chañaral", "Diego de Almagro", "Vallenar", "Alto del Carmen", "Freirina", "Huasco"]
    },
    {
      region: "Coquimbo",
      comunas: ["La Serena", "Coquimbo", "Andacollo", "La Higuera", "Paiguano", "Vicuña", "Illapel", "Canela", "Los Vilos", "Salamanca", "Ovalle", "Combarbalá", "Monte Patria", "Punitaqui", "Río Hurtado"]
    },
    {
      region: "Valparaíso",
      comunas: ["Valparaíso", "Viña del Mar", "Concón", "Quilpué", "Villa Alemana", "Quillota", "La Calera", "San Antonio", "Los Andes", "San Felipe"]
    },
    {
      region: "Metropolitana de Santiago",
      comunas: [
        "Santiago", "Cerrillos", "Cerro Navia", "Conchalí", "El Bosque", "Estación Central", 
        "Huechuraba", "Independencia", "La Cisterna", "La Florida", "La Granja", "La Pintana", 
        "La Reina", "Las Condes", "Lo Barnechea", "Lo Espejo", "Lo Prado", "Macul", "Maipú", 
        "Ñuñoa", "Pedro Aguirre Cerda", "Peñalolén", "Providencia", "Pudahuel", "Quilicura", 
        "Quinta Normal", "Recoleta", "Renca", "San Joaquín", "San Miguel", "San Ramón", 
        "Vitacura", "Puente Alto", "Pirque", "San José de Maipo", "San Bernardo", "Buin", 
        "Calera de Tango", "Paine", "Melipilla", "Talagante"
      ]
    },
    {
      region: "Libertador General Bernardo O'Higgins",
      comunas: ["Rancagua", "Machalí", "Graneros", "Rengo", "San Fernando", "Santa Cruz", "Pichilemu"]
    },
    {
      region: "Maule",
      comunas: ["Talca", "Constitución", "Curicó", "Linares", "Cauquenes", "Parral", "Molina"]
    },
    {
      region: "Ñuble",
      comunas: ["Chillán", "Chillán Viejo", "Bulnes", "San Carlos", "Coihueco", "Yungay"]
    },
    {
      region: "Biobío",
      comunas: ["Concepción", "Talcahuano", "San Pedro de la Paz", "Coronel", "Chiguayante", "Hualpén", "Los Ángeles"]
    },
    {
      region: "La Araucanía",
      comunas: ["Temuco", "Padre Las Casas", "Villarrica", "Pucón", "Angol", "Victoria"]
    },
    {
      region: "Los Ríos",
      comunas: ["Valdivia", "Corral", "Lanco", "Los Lagos", "Máfil", "Mariquina", "Paillaco", "Panguipulli", "La Unión", "Futrono", "Lago Ranco", "Río Bueno"]
    },
    {
      region: "Los Lagos",
      comunas: ["Puerto Montt", "Puerto Varas", "Osorno", "Castro", "Ancud", "Frutillar"]
    },
    {
      region: "Aysén del General Carlos Ibáñez del Campo",
      comunas: ["Coyhaique", "Aysén", "Chile Chico", "Cochrane"]
    },
    {
      region: "Magallanes y de la Antártica Chilena",
      comunas: ["Punta Arenas", "Puerto Natales", "Porvenir", "Cabo de Hornos"]
    }
  ];

  // Elementos del DOM
  const selectRol = document.getElementById('select-rol-simulado');
  const navUsuarios = document.getElementById('nav-usuarios');
  const alertaRol = document.getElementById('alerta-rol');
  const form = document.getElementById('form-usuario');
  const alertaFormulario = document.getElementById('alerta-formulario');

  const inputRun = document.getElementById('usr-run');
  const selectUsuarioRol = document.getElementById('usr-rol');
  const inputNombre = document.getElementById('usr-nombre');
  const inputApellidos = document.getElementById('usr-apellidos');
  const inputCorreo = document.getElementById('usr-correo');
  const inputFechaNac = document.getElementById('usr-fecha-nac');
  const selectRegion = document.getElementById('usr-region');
  const selectComuna = document.getElementById('usr-comuna');
  const inputDireccion = document.getElementById('usr-direccion');
  const contadorDireccion = document.getElementById('contador-direccion');

  const tituloPantalla = document.getElementById('titulo-pantalla');
  const subtituloPantalla = document.getElementById('subtitulo-pantalla');
  const breadcrumbActivo = document.getElementById('breadcrumb-activo');
  const cardHeaderTitulo = document.getElementById('card-header-titulo');

  // Control de Roles y Acceso exclusivo Administrador
  let rolActual = localStorage.getItem('logistrack_rol_activo') || 'Administrador';

  function aplicarPermisos(rol) {
    if (rol === 'Cliente') {
      alert('Acceso Denegado: Los usuarios con perfil "Cliente" no tienen acceso al panel administrativo.');
      window.location.href = 'index.html';
      return;
    }
    if (rol === 'Vendedor') {
      alert('Acceso Denegado: Los usuarios con perfil "Vendedor" no tienen permisos para gestionar usuarios.');
      window.location.href = 'admin-productos.html';
      return;
    }
  }

  if (selectRol) {
    selectRol.value = rolActual;
    aplicarPermisos(rolActual);

    selectRol.addEventListener('change', (e) => {
      rolActual = e.target.value;
      localStorage.setItem('logistrack_rol_activo', rolActual);
      aplicarPermisos(rolActual);
    });
  }

  // Contador de caracteres en tiempo real (Dirección: Máx 300)
  inputDireccion.addEventListener('input', () => {
    contadorDireccion.textContent = `${inputDireccion.value.length} / 300 caracteres`;
  });

  // 2. Cargar opciones del selector de Regiones
  regionesYComunas.forEach(item => {
    const opt = document.createElement('option');
    opt.value = item.region;
    opt.textContent = item.region;
    selectRegion.appendChild(opt);
  });

  // Selector dependiente: Cambiar comunas al seleccionar región
  selectRegion.addEventListener('change', () => {
    actualizarComunas(selectRegion.value);
  });

  function actualizarComunas(nombreRegion, comunaPreseleccionada = '') {
    selectComuna.innerHTML = '<option value="" selected disabled>Seleccionar comuna...</option>';
    const regionEncontrada = regionesYComunas.find(r => r.region === nombreRegion);

    if (regionEncontrada && regionEncontrada.comunas.length > 0) {
      regionEncontrada.comunas.forEach(comuna => {
        const opt = document.createElement('option');
        opt.value = comuna;
        opt.textContent = comuna;
        selectComuna.appendChild(opt);
      });
      selectComuna.disabled = false;
      if (comunaPreseleccionada) {
        selectComuna.value = comunaPreseleccionada;
      }
    } else {
      selectComuna.disabled = true;
    }
  }

  // 3. Algoritmo de validación de RUN chileno (Módulo 11, sin puntos ni guión)
  function validarRutChileno(runLimpio) {
    if (!runLimpio || runLimpio.length < 7 || runLimpio.length > 9) return false;
    if (!/^[0-9]{6,8}[0-9kK]$/.test(runLimpio)) return false;

    const cuerpo = runLimpio.slice(0, -1);
    const dv = runLimpio.slice(-1).toUpperCase();

    let suma = 0;
    let multiplo = 2;

    for (let i = cuerpo.length - 1; i >= 0; i--) {
      suma += multiplo * parseInt(cuerpo.charAt(i), 10);
      multiplo = multiplo < 7 ? multiplo + 1 : 2;
    }

    const dvCalculado = 11 - (suma % 11);
    let dvEsperado = '';

    if (dvCalculado === 11) dvEsperado = '0';
    else if (dvCalculado === 10) dvEsperado = 'K';
    else dvEsperado = dvCalculado.toString();

    return dv === dvEsperado;
  }

  // 4. Validación de Dominios de Correo Permitidos
  function validarDominioCorreo(correo) {
    const dominiosValidos = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com'];
    const email = correo.trim().toLowerCase();
    return dominiosValidos.some(dom => email.endsWith(dom)) && email.indexOf('@') > 0;
  }

  // Persistencia en LocalStorage
  function leerUsuarios() {
    return JSON.parse(localStorage.getItem('logistrack_usuarios')) || [];
  }

  function guardarUsuarios(usuarios) {
    localStorage.setItem('logistrack_usuarios', JSON.stringify(usuarios));
  }

  // 5. Precarga de datos en Modo Edición
  if (esModoEdicion) {
    tituloPantalla.textContent = 'Editar Usuario';
    subtituloPantalla.textContent = `Actualizando información del RUN ${runParam}`;
    breadcrumbActivo.textContent = 'Editar';
    cardHeaderTitulo.innerHTML = `<i class="bi bi-pencil-square me-1 text-primary"></i> Editando Usuario: ${runParam}`;

    const usuarios = leerUsuarios();
    const usuarioAEditar = usuarios.find(u => u.run.toUpperCase() === runParam.toUpperCase());

    if (usuarioAEditar) {
      inputRun.value = usuarioAEditar.run;
      inputRun.setAttribute('readonly', 'true');
      inputRun.classList.add('bg-light');

      selectUsuarioRol.value = usuarioAEditar.rol || '';
      inputNombre.value = usuarioAEditar.nombre || '';
      inputApellidos.value = usuarioAEditar.apellidos || '';
      inputCorreo.value = usuarioAEditar.correo || '';
      inputFechaNac.value = usuarioAEditar.fechaNacimiento || '';
      inputDireccion.value = usuarioAEditar.direccion || '';
      contadorDireccion.textContent = `${inputDireccion.value.length} / 300 caracteres`;

      if (usuarioAEditar.region) {
        selectRegion.value = usuarioAEditar.region;
        actualizarComunas(usuarioAEditar.region, usuarioAEditar.comuna || '');
      }
    } else {
      alert('El usuario solicitado no existe o fue eliminado.');
      window.location.href = 'admin-usuarios.html';
    }
  }

  // 6. Validación y Envío del Formulario
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    alertaFormulario.classList.add('d-none');
    alertaFormulario.textContent = '';

    const runRaw = inputRun.value.trim().toUpperCase();
    const rol = selectUsuarioRol.value;
    const nombre = inputNombre.value.trim();
    const apellidos = inputApellidos.value.trim();
    const correo = inputCorreo.value.trim().toLowerCase();
    const fechaNacimiento = inputFechaNac.value;
    const region = selectRegion.value;
    const comuna = selectComuna.value;
    const direccion = inputDireccion.value.trim();

    // Comprobación de formato RUN (sin puntos ni guion, largo 7 a 9)
    if (runRaw.includes('.') || runRaw.includes('-')) {
      mostrarError('El RUN debe ingresarse sin puntos ni guion (Ejemplo: 19011022K).');
      inputRun.focus();
      return;
    }

    // Validación Módulo 11 del RUN
    if (!validarRutChileno(runRaw)) {
      inputRun.classList.add('is-invalid');
      mostrarError('El RUN ingresado es incorrecto o su dígito verificador no coincide.');
      inputRun.focus();
      return;
    } else {
      inputRun.classList.remove('is-invalid');
      inputRun.classList.add('is-valid');
    }

    // Validación de Dominios de Correo
    if (!validarDominioCorreo(correo)) {
      inputCorreo.classList.add('is-invalid');
      mostrarError('El correo ingresado no es válido. Solo se permiten cuentas con @duoc.cl, @profesor.duoc.cl o @gmail.com.');
      inputCorreo.focus();
      return;
    } else {
      inputCorreo.classList.remove('is-invalid');
      inputCorreo.classList.add('is-valid');
    }

    // Validación nativa HTML5
    if (!form.checkValidity()) {
      e.stopPropagation();
      form.classList.add('was-validated');
      return;
    }

    let usuarios = leerUsuarios();

    if (esModoEdicion) {
      // Actualizar usuario existente
      const indice = usuarios.findIndex(u => u.run.toUpperCase() === runParam.toUpperCase());
      if (indice !== -1) {
        usuarios[indice] = {
          ...usuarios[indice],
          rol,
          nombre,
          apellidos,
          correo,
          fechaNacimiento,
          region,
          comuna,
          direccion
        };
        guardarUsuarios(usuarios);
        alert('¡Usuario actualizado exitosamente!');
        window.location.href = 'admin-usuarios.html';
      }
    } else {
      // Validar RUN no duplicado
      const runDuplicado = usuarios.some(u => u.run.toUpperCase() === runRaw);
      if (runDuplicado) {
        inputRun.classList.add('is-invalid');
        mostrarError(`El RUN "${runRaw}" ya se encuentra registrado en el sistema.`);
        inputRun.focus();
        return;
      }

      // Validar Correo no duplicado
      const correoDuplicado = usuarios.some(u => (u.correo || '').toLowerCase() === correo);
      if (correoDuplicado) {
        inputCorreo.classList.add('is-invalid');
        mostrarError(`El correo electrónico "${correo}" ya está registrado con otra cuenta.`);
        inputCorreo.focus();
        return;
      }

      // Crear nuevo usuario
      const nuevoUsuario = {
        run: runRaw,
        rol,
        nombre,
        apellidos,
        correo,
        fechaNacimiento,
        region,
        comuna,
        direccion
      };

      usuarios.push(nuevoUsuario);
      guardarUsuarios(usuarios);
      alert('¡Usuario registrado con éxito!');
      window.location.href = 'admin-usuarios.html';
    }
  });

  function mostrarError(mensaje) {
    alertaFormulario.textContent = mensaje;
    alertaFormulario.classList.remove('d-none');
  }
});