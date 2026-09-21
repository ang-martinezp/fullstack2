document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const runParam = urlParams.get('run');
  const esModoEdicion = Boolean(runParam);

  if (urlParams.get('reset') === 'admin') {
    localStorage.setItem('logistrack_rol_activo', 'Administrador');
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  // Elementos del DOM
  const selectRolSimulado = document.getElementById('select-rol-simulado');
  const form = document.getElementById('form-usuario');
  const alertaFormulario = document.getElementById('alerta-formulario');

  const inputRun = document.getElementById('usr-run');
  const selectUsuarioRol = document.getElementById('usr-rol');
  const inputNombre = document.getElementById('usr-nombre');
  const inputApellidos = document.getElementById('usr-apellidos');
  const inputCorreo = document.getElementById('usr-correo');
  const inputFechaNac = document.getElementById('usr-fecha-nac');
  const inputPassword = document.getElementById('usr-password');
  const inputPasswordConfirm = document.getElementById('usr-password-confirm');
  const lblPassword = document.getElementById('lbl-password');
  const lblPasswordConfirm = document.getElementById('lbl-password-confirm');
  const helpPassword = document.getElementById('help-password');
  const selectRegion = document.getElementById('usr-region');
  const selectComuna = document.getElementById('usr-comuna');
  const inputDireccion = document.getElementById('usr-direccion');
  const contadorDireccion = document.getElementById('contador-direccion');

  const tituloPantalla = document.getElementById('titulo-pantalla');
  const subtituloPantalla = document.getElementById('subtitulo-pantalla');
  const breadcrumbActivo = document.getElementById('breadcrumb-activo');
  const cardHeaderTitulo = document.getElementById('card-header-titulo');

  // Control de Permisos por Rol
  let rolActual = localStorage.getItem('logistrack_rol_activo') || 'Administrador';

  function aplicarPermisos(rol) {
    if (rol === 'Cliente') {
      alert('Acceso Denegado: Los usuarios con perfil "Cliente" no tienen acceso al panel de administración.');
      window.location.href = 'index.html';
      return;
    }
    if (rol === 'Vendedor') {
      alert('Acceso Denegado: Los usuarios con perfil "Vendedor" no tienen acceso a la gestión de usuarios.');
      window.location.href = 'admin-productos.html';
      return;
    }
  }

  if (selectRolSimulado) {
    selectRolSimulado.value = rolActual;
    aplicarPermisos(rolActual);

    selectRolSimulado.addEventListener('change', (e) => {
      rolActual = e.target.value;
      localStorage.setItem('logistrack_rol_activo', rolActual);
      aplicarPermisos(rolActual);
    });
  }

  // Contador de caracteres para la dirección
  inputDireccion.addEventListener('input', () => {
    contadorDireccion.textContent = `${inputDireccion.value.length} / 300 caracteres`;
  });

  // Carga de Regiones usando el arreglo compartido (window.regionesOComunas o fallback)
  const fuenteRegiones = window.REGIONES_Y_COMUNAS || window.regionesYComunas || [];

  fuenteRegiones.forEach(item => {
    const opt = document.createElement('option');
    opt.value = item.region;
    opt.textContent = item.region;
    selectRegion.appendChild(opt);
  });

  selectRegion.addEventListener('change', () => {
    actualizarComunas(selectRegion.value);
  });

  function actualizarComunas(nombreRegion, comunaPreseleccionada = '') {
    selectComuna.innerHTML = '<option value="" selected disabled>Seleccionar comuna...</option>';
    const regionEncontrada = fuenteRegiones.find(r => r.region === nombreRegion);

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

  // Funciones de validación (apoyadas en utils-validaciones.js o nativas)
  function validarRutChileno(runLimpio) {
    if (typeof window.esRunValido === 'function') {
      return window.esRunValido(runLimpio);
    }
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

  function validarDominioCorreo(correo) {
    if (typeof window.esCorreoInstitucionalValido === 'function') {
      return window.esCorreoInstitucionalValido(correo);
    }
    const patron = /^[a-zA-Z0-9._%+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;
    return patron.test((correo || '').trim());
  }

  function leerUsuarios() {
    return JSON.parse(localStorage.getItem('logistrack_usuarios')) || [];
  }

  function guardarUsuarios(usuarios) {
    localStorage.setItem('logistrack_usuarios', JSON.stringify(usuarios));
  }

  // Configuración para Modo Edición
  if (esModoEdicion) {
    tituloPantalla.textContent = 'Editar Usuario';
    subtituloPantalla.textContent = `Actualizando información del RUN ${runParam}`;
    breadcrumbActivo.textContent = 'Editar';
    cardHeaderTitulo.innerHTML = `<i class="bi bi-pencil-square me-1 text-primary"></i> Editando Usuario: ${runParam}`;

    // Al editar, la contraseña no es obligatoria si se desea mantener la actual
    inputPassword.removeAttribute('required');
    inputPasswordConfirm.removeAttribute('required');
    lblPassword.innerHTML = 'Nueva Contraseña <span class="text-muted small">(Opcional)</span>';
    lblPasswordConfirm.innerHTML = 'Confirmar Nueva Contraseña';
    helpPassword.textContent = 'Deja en blanco si deseas conservar la contraseña actual (o ingresa entre 4 y 10 caracteres).';

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
      alert('El usuario solicitado no existe.');
      window.location.href = 'admin-usuarios.html';
    }
  }

  // Envío del Formulario
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
    const password = inputPassword.value;
    const passwordConfirm = inputPasswordConfirm.value;
    const region = selectRegion.value;
    const comuna = selectComuna.value;
    const direccion = inputDireccion.value.trim();

    // 1. Validar formato RUN (sin puntos ni guion)
    if (runRaw.includes('.') || runRaw.includes('-')) {
      mostrarError('El RUN debe ingresarse sin puntos ni guion (Ejemplo: 19011022K).');
      inputRun.focus();
      return;
    }

    // 2. Módulo 11 del RUN
    if (!validarRutChileno(runRaw)) {
      inputRun.classList.add('is-invalid');
      mostrarError('El RUN ingresado es incorrecto o su dígito verificador no coincide.');
      inputRun.focus();
      return;
    } else {
      inputRun.classList.remove('is-invalid');
      inputRun.classList.add('is-valid');
    }

    // 3. Dominio de correo permitido
    if (!validarDominioCorreo(correo)) {
      inputCorreo.classList.add('is-invalid');
      mostrarError('El correo ingresado no es válido. Solo se admiten cuentas con @duoc.cl, @profesor.duoc.cl o @gmail.com.');
      inputCorreo.focus();
      return;
    } else {
      inputCorreo.classList.remove('is-invalid');
      inputCorreo.classList.add('is-valid');
    }

    // 4. Validación de Contraseña (entre 4 y 10 caracteres)
    if (!esModoEdicion || password.length > 0) {
      if (password.length < 4 || password.length > 10) {
        inputPassword.classList.add('is-invalid');
        mostrarError('La contraseña debe tener obligatoriamente entre 4 y 10 caracteres.');
        inputPassword.focus();
        return;
      } else {
        inputPassword.classList.remove('is-invalid');
        inputPassword.classList.add('is-valid');
      }

      if (password !== passwordConfirm) {
        inputPasswordConfirm.classList.add('is-invalid');
        mostrarError('Las contraseñas no coinciden.');
        inputPasswordConfirm.focus();
        return;
      } else {
        inputPasswordConfirm.classList.remove('is-invalid');
        inputPasswordConfirm.classList.add('is-valid');
      }
    }

    // 5. Validación nativa HTML5
    if (!form.checkValidity()) {
      e.stopPropagation();
      form.classList.add('was-validated');
      return;
    }

    let usuarios = leerUsuarios();

    if (esModoEdicion) {
      const indice = usuarios.findIndex(u => u.run.toUpperCase() === runParam.toUpperCase());
      if (indice !== -1) {
        usuarios[indice] = {
          ...usuarios[indice],
          rol,
          nombre,
          apellidos,
          correo,
          fechaNacimiento,
          ...(password ? { password } : {}),
          region,
          comuna,
          direccion
        };
        guardarUsuarios(usuarios);
        alert('¡Usuario actualizado exitosamente!');
        window.location.href = 'admin-usuarios.html';
      }
    } else {
      // Validar duplicados
      if (usuarios.some(u => u.run.toUpperCase() === runRaw)) {
        inputRun.classList.add('is-invalid');
        mostrarError(`El RUN "${runRaw}" ya se encuentra registrado.`);
        inputRun.focus();
        return;
      }

      if (usuarios.some(u => (u.correo || '').toLowerCase() === correo)) {
        inputCorreo.classList.add('is-invalid');
        mostrarError(`El correo "${correo}" ya está en uso.`);
        inputCorreo.focus();
        return;
      }

      const nuevoUsuario = {
        run: runRaw,
        rol,
        nombre,
        apellidos,
        correo,
        fechaNacimiento,
        password,
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