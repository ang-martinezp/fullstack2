/**
 * login.js
 * inicio de sesión
 */

document.addEventListener('DOMContentLoaded', () => {
    const formLogin = document.getElementById('formLogin');
    const inputCorreo = document.getElementById('loginCorreo');
    const inputClave = document.getElementById('loginClave');
    const btnToggleClave = document.getElementById('btnToggleClave');
    const iconoToggleClave = document.getElementById('iconoToggleClave');
    const alertaBox = document.getElementById('loginAlerta');

    if (btnToggleClave && inputClave && iconoToggleClave) {
        btnToggleClave.addEventListener('click', () => {
            const esPassword = inputClave.getAttribute('type') === 'password';
            inputClave.setAttribute('type', esPassword ? 'text' : 'password');
            iconoToggleClave.className = esPassword ? 'bi bi-eye-slash' : 'bi bi-eye';
        });
    }

    // validacion de correo en tiempo real
    function validarCampoCorreo() {
        const valor = (inputCorreo.value || '').trim();
        if (!valor) {
            marcarInvalido(inputCorreo, 'El correo electrónico es obligatorio.');
            return false;
        }
        if (!esCorreoInstitucionalValido(valor)) {
            marcarInvalido(inputCorreo, 'Debe ingresar un correo válido con dominio @duoc.cl, @profesor.duoc.cl o @gmail.com');
            return false;
        }
        marcarValido(inputCorreo);
        return true;
    }

    // validacion de contraseña en tiempo real
    function validarCampoClave() {
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
        return true;
    }

    inputCorreo.addEventListener('blur', validarCampoCorreo);
    inputCorreo.addEventListener('input', () => {
        if (inputCorreo.classList.contains('is-invalid')) {
            validarCampoCorreo();
        }
    });

    inputClave.addEventListener('blur', validarCampoClave);
    inputClave.addEventListener('input', () => {
        if (inputClave.classList.contains('is-invalid')) {
            validarCampoClave();
        }
    });

    // envio del formulario
    formLogin.addEventListener('submit', (e) => {
        e.preventDefault();

        const correoValido = validarCampoCorreo();
        const claveValida = validarCampoClave();

        if (!correoValido || !claveValida) {
            mostrarAlerta('Por favor, complete correctamente los campos requeridos.', 'danger');
            return;
        }

        const correo = inputCorreo.value.trim().toLowerCase();
        const clave = inputClave.value;

        // verificar si existe en usuarios registrados en localStorage
        const usuariosGuardados = JSON.parse(localStorage.getItem('logistrack_usuarios') || '[]');
        const usuarioEncontrado = usuariosGuardados.find(u => u.correo.toLowerCase() === correo);

        if (usuarioEncontrado) {
            if (usuarioEncontrado.clave !== clave) {
                marcarInvalido(inputClave, 'Contraseña incorrecta.');
                mostrarAlerta('Contraseña incorrecta para el usuario ingresado.', 'danger');
                return;
            }

            // inicio de sesión exitoso con usuario registrado
            iniciarSesion(usuarioEncontrado);
        } else {
            // usuarios demo 
            const usuariosDemo = [
                { correo: 'admin@duoc.cl', clave: 'admin123', nombre: 'Oliver', apellidos: 'Duncan', rol: 'Administrador' },
                { correo: 'vendedor@duoc.cl', clave: 'vend1234', nombre: 'Angel', apellidos: 'Martinez', rol: 'Vendedor' },
                { correo: 'alfredo@duoc.cl', clave: 'duoc2026', nombre: 'Alfredo', apellidos: 'De La Hoz', rol: 'Cliente' },
                { correo: 'profesor@profesor.duoc.cl', clave: 'duoc2026', nombre: 'Profesor', apellidos: 'Duoc', rol: 'Administrador' },
                { correo: 'cliente@gmail.com', clave: '123456', nombre: 'Cliente', apellidos: 'Prueba', rol: 'Cliente' }
            ];

            const demoEncontrado = usuariosDemo.find(u => u.correo.toLowerCase() === correo);

            if (demoEncontrado) {
                if (demoEncontrado.clave !== clave) {
                    marcarInvalido(inputClave, 'Contraseña incorrecta.');
                    mostrarAlerta('Contraseña incorrecta.', 'danger');
                    return;
                }
                iniciarSesion(demoEncontrado);
            } else {
                // Si es un correo válido con formato institucional/gmail pero no está previamente registrado
                // simulamos el acceso como nuevo cliente
                const nuevoCliente = {
                    correo: correo,
                    nombre: correo.split('@')[0],
                    apellidos: 'Usuario',
                    rol: 'Cliente'
                };
                iniciarSesion(nuevoCliente);
            }
        }
    });

    function iniciarSesion(usuario) {
        localStorage.setItem('logistrack_sesion_activa', JSON.stringify({
            correo: usuario.correo,
            nombre: `${usuario.nombre || ''} ${usuario.apellidos || ''}`.trim() || usuario.correo,
            rol: usuario.rol || 'Cliente',
            fechaLogin: new Date().toISOString()
        }));

        mostrarAlerta(`¡Bienvenido/a, ${usuario.nombre || usuario.correo}! Redirigiendo a la tienda...`, 'success');

        // deshabilita el botón mientras redirige
        const btnSubmit = document.getElementById('btnSubmitLogin');
        if (btnSubmit) {
            btnSubmit.disabled = true;
            btnSubmit.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Iniciando sesión...';
        }

        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1200);
    }

    function mostrarAlerta(mensaje, tipo = 'danger') {
        if (!alertaBox) return;
        alertaBox.className = `alert alert-${tipo} alert-dismissible fade show`;
        alertaBox.innerHTML = `
            <span>${mensaje}</span>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
        `;
        alertaBox.classList.remove('d-none');
    }

    // manejo de recuperación
    const btnEnviarRecuperacion = document.getElementById('btnEnviarRecuperacion');
    const recuperarCorreo = document.getElementById('recuperarCorreo');
    if (btnEnviarRecuperacion && recuperarCorreo) {
        btnEnviarRecuperacion.addEventListener('click', () => {
            const correo = recuperarCorreo.value.trim();
            if (!correo || !esCorreoInstitucionalValido(correo)) {
                alert('Por favor, ingresa un correo válido (@duoc.cl, @profesor.duoc.cl o @gmail.com).');
                return;
            }
            alert(`Se han enviado las instrucciones de recuperación al correo: ${correo}`);
            recuperarCorreo.value = '';
            const modalEl = document.getElementById('modalRecuperar');
            const modal = bootstrap.Modal.getInstance(modalEl);
            if (modal) modal.hide();
        });
    }
});
