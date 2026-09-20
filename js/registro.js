/**
 * registro.js
 * Controlador para la pantalla de registro de usuario
 * Evaluación Parcial N° 1 - DSY1104 Desarrollo FullStack II
 * Bloque: Cuentas · Formularios (Alfredo De La Hoz)
 */

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formRegistro');
    const inputRun = document.getElementById('regRun');
    const inputNombre = document.getElementById('regNombre');
    const inputApellidos = document.getElementById('regApellidos');
    const inputCorreo = document.getElementById('regCorreo');
    const inputClave = document.getElementById('regClave');
    const inputConfirmarClave = document.getElementById('regConfirmarClave');
    const selectRegion = document.getElementById('regRegion');
    const selectComuna = document.getElementById('regComuna');
    const inputDireccion = document.getElementById('regDireccion');
    const checkTerminos = document.getElementById('regTerminos');
    const alertaBox = document.getElementById('registroAlerta');

    // 1. Inicializar selects encadenados Región -> Comuna
    if (typeof configurarSelectsRegionComuna === 'function') {
        configurarSelectsRegionComuna(selectRegion, selectComuna);
    }

    // 2. Alternar visibilidad de contraseñas
    const btnToggleClave = document.getElementById('btnToggleRegClave');
    const iconoToggleClave = document.getElementById('iconoRegClave');
    if (btnToggleClave && inputClave && iconoToggleClave) {
        btnToggleClave.addEventListener('click', () => {
            const esPassword = inputClave.getAttribute('type') === 'password';
            inputClave.setAttribute('type', esPassword ? 'text' : 'password');
            iconoToggleClave.className = esPassword ? 'bi bi-eye-slash' : 'bi bi-eye';
        });
    }

    const btnToggleConfirmar = document.getElementById('btnToggleRegConfirmar');
    const iconoToggleConfirmar = document.getElementById('iconoRegConfirmar');
    if (btnToggleConfirmar && inputConfirmarClave && iconoToggleConfirmar) {
        btnToggleConfirmar.addEventListener('click', () => {
            const esPassword = inputConfirmarClave.getAttribute('type') === 'password';
            inputConfirmarClave.setAttribute('type', esPassword ? 'text' : 'password');
            iconoToggleConfirmar.className = esPassword ? 'bi bi-eye-slash' : 'bi bi-eye';
        });
    }

    // 3. Validaciones individuales
    function validarRun() {
        const valor = (inputRun.value || '').trim();
        if (!valor) {
            marcarInvalido(inputRun, 'El RUN es obligatorio.');
            return false;
        }
        if (!esRunValido(valor)) {
            marcarInvalido(inputRun, 'Debe ingresar un RUN válido con dígito verificador correcto (ej: 12.345.678-5).');
            return false;
        }
        // Si es válido, formatear visualmente
        inputRun.value = formatearRun(valor);
        marcarValido(inputRun, 'RUN válido y verificado.');
        return true;
    }

    function validarTexto(input, campoNombre, minLargo = 2) {
        const valor = (input.value || '').trim();
        if (!valor) {
            marcarInvalido(input, `El campo ${campoNombre} es obligatorio.`);
            return false;
        }
        // Solo letras, espacios, tildes y ñ
        const patronTexto = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]{2,50}$/;
        if (!patronTexto.test(valor) || valor.length < minLargo) {
            marcarInvalido(input, `Ingrese un ${campoNombre} válido (mínimo ${minLargo} letras, sin números).`);
            return false;
        }
        marcarValido(input);
        return true;
    }

    function validarCorreo() {
        const valor = (inputCorreo.value || '').trim();
        if (!valor) {
            marcarInvalido(inputCorreo, 'El correo electrónico es obligatorio.');
            return false;
        }
        if (!esCorreoInstitucionalValido(valor)) {
            marcarInvalido(inputCorreo, 'Solo se aceptan correos con dominios @duoc.cl, @profesor.duoc.cl o @gmail.com');
            return false;
        }

        // Verificar si ya está registrado en localStorage
        const usuariosGuardados = JSON.parse(localStorage.getItem('logistrack_usuarios') || '[]');
        const yaExiste = usuariosGuardados.some(u => u.correo.toLowerCase() === valor.toLowerCase());
        if (yaExiste) {
            marcarInvalido(inputCorreo, 'Este correo electrónico ya está registrado en la tienda.');
            return false;
        }

        marcarValido(inputCorreo, 'Correo válido.');
        return true;
    }

    function validarClave() {
        const valor = inputClave.value || '';
        if (!valor) {
            marcarInvalido(inputClave, 'La contraseña es obligatoria.');
            return false;
        }
        if (!esClaveValida(valor)) {
            marcarInvalido(inputClave, 'La contraseña debe tener entre 4 y 10 caracteres.');
            return false;
        }
        marcarValido(inputClave);

        // Si ya hay confirmación ingresada, revalidarla
        if (inputConfirmarClave.value) {
            validarConfirmarClave();
        }
        return true;
    }

    function validarConfirmarClave() {
        const clave = inputClave.value || '';
        const confirmar = inputConfirmarClave.value || '';
        if (!confirmar) {
            marcarInvalido(inputConfirmarClave, 'Debe confirmar su contraseña.');
            return false;
        }
        if (clave !== confirmar) {
            marcarInvalido(inputConfirmarClave, 'Las contraseñas no coinciden.');
            return false;
        }
        marcarValido(inputConfirmarClave);
        return true;
    }

    function validarSelect(select, nombreCampo) {
        const valor = select.value;
        if (!valor) {
            marcarInvalido(select, `Debe seleccionar una ${nombreCampo}.`);
            return false;
        }
        marcarValido(select);
        return true;
    }

    function validarDireccion() {
        const valor = (inputDireccion.value || '').trim();
        if (!valor) {
            marcarInvalido(inputDireccion, 'La dirección es obligatoria.');
            return false;
        }
        if (valor.length < 5) {
            marcarInvalido(inputDireccion, 'La dirección debe ser descriptiva (mínimo 5 caracteres).');
            return false;
        }
        marcarValido(inputDireccion);
        return true;
    }

    function validarTerminos() {
        if (!checkTerminos.checked) {
            marcarInvalido(checkTerminos, 'Debe aceptar los términos y condiciones para continuar.');
            return false;
        }
        marcarValido(checkTerminos);
        return true;
    }

    // 4. Asignación de listeners
    inputRun.addEventListener('blur', validarRun);
    inputNombre.addEventListener('blur', () => validarTexto(inputNombre, 'nombre'));
    inputApellidos.addEventListener('blur', () => validarTexto(inputApellidos, 'apellidos'));
    inputCorreo.addEventListener('blur', validarCorreo);
    inputClave.addEventListener('blur', validarClave);
    inputConfirmarClave.addEventListener('blur', validarConfirmarClave);
    selectRegion.addEventListener('change', () => validarSelect(selectRegion, 'región'));
    selectComuna.addEventListener('change', () => validarSelect(selectComuna, 'comuna'));
    inputDireccion.addEventListener('blur', validarDireccion);
    checkTerminos.addEventListener('change', validarTerminos);

    // 5. Envío del formulario
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const vRun = validarRun();
        const vNombre = validarTexto(inputNombre, 'nombre');
        const vApellidos = validarTexto(inputApellidos, 'apellidos');
        const vCorreo = validarCorreo();
        const vClave = validarClave();
        const vConfirmar = validarConfirmarClave();
        const vRegion = validarSelect(selectRegion, 'región');
        const vComuna = validarSelect(selectComuna, 'comuna');
        const vDireccion = validarDireccion();
        const vTerminos = validarTerminos();

        const formularioValido = vRun && vNombre && vApellidos && vCorreo && vClave && 
                                 vConfirmar && vRegion && vComuna && vDireccion && vTerminos;

        if (!formularioValido) {
            mostrarAlerta('Por favor revise los campos destacados con errores antes de continuar.', 'danger');
            return;
        }

        // Construir objeto de usuario con la misma estructura del admin
        const nuevoUsuario = {
            id: 'USR-' + Date.now(),
            run: inputRun.value.trim(),
            nombre: inputNombre.value.trim(),
            apellidos: inputApellidos.value.trim(),
            correo: inputCorreo.value.trim().toLowerCase(),
            clave: inputClave.value,
            region: selectRegion.value,
            comuna: selectComuna.value,
            direccion: inputDireccion.value.trim(),
            rol: 'Cliente',
            fechaRegistro: new Date().toLocaleDateString('es-CL')
        };

        // Guardar en localStorage para que Oliver Duncan pueda leerlo en el mantenedor de usuarios
        const usuarios = JSON.parse(localStorage.getItem('logistrack_usuarios') || '[]');
        usuarios.push(nuevoUsuario);
        localStorage.setItem('logistrack_usuarios', JSON.stringify(usuarios));

        mostrarAlerta(`¡Cuenta creada exitosamente para ${nuevoUsuario.nombre} ${nuevoUsuario.apellidos}! Redirigiendo al inicio de sesión...`, 'success');

        const btnSubmit = document.getElementById('btnSubmitRegistro');
        if (btnSubmit) {
            btnSubmit.disabled = true;
            btnSubmit.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Registrando usuario...';
        }

        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
    });

    function mostrarAlerta(mensaje, tipo = 'danger') {
        if (!alertaBox) return;
        alertaBox.className = `alert alert-${tipo} alert-dismissible fade show`;
        alertaBox.innerHTML = `
            <span>${mensaje}</span>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
        `;
        alertaBox.classList.remove('d-none');
        alertaBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
});
