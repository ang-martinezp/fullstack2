/**
 * contacto.js
 * Controlador para la pantalla de contacto
 * Evaluación Parcial N° 1 - DSY1104 Desarrollo FullStack II
 * Bloque: Cuentas · Formularios (Alfredo De La Hoz)
 */

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formContacto');
    const inputNombre = document.getElementById('contactoNombre');
    const inputCorreo = document.getElementById('contactoCorreo');
    const inputTelefono = document.getElementById('contactoTelefono');
    const selectAsunto = document.getElementById('contactoAsunto');
    const textComentario = document.getElementById('contactoComentario');
    const contadorComentario = document.getElementById('contadorComentario');
    const alertaBox = document.getElementById('contactoAlerta');

    // 1. Contador dinámico de caracteres en tiempo real (hasta 500 caracteres)
    if (textComentario && contadorComentario) {
        textComentario.addEventListener('input', () => {
            const largo = textComentario.value.length;
            contadorComentario.textContent = `${largo} / 500 caracteres`;

            if (largo >= 500) {
                contadorComentario.className = 'small fw-bold text-danger';
            } else if (largo >= 450) {
                contadorComentario.className = 'small fw-bold text-warning';
            } else {
                contadorComentario.className = 'small fw-semibold text-muted';
            }

            if (textComentario.classList.contains('is-invalid')) {
                validarComentario();
            }
        });
    }

    // 2. Validaciones individuales
    function validarNombre() {
        const valor = (inputNombre.value || '').trim();
        if (!valor) {
            marcarInvalido(inputNombre, 'El nombre completo es obligatorio.');
            return false;
        }
        const patronTexto = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]{2,80}$/;
        if (!patronTexto.test(valor) || valor.length < 2) {
            marcarInvalido(inputNombre, 'Por favor ingrese un nombre válido (mínimo 2 letras, solo texto).');
            return false;
        }
        marcarValido(inputNombre);
        return true;
    }

    function validarCorreo() {
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

    function validarTelefono() {
        const valor = (inputTelefono.value || '').trim();
        // Teléfono es opcional
        if (!valor) {
            limpiarValidacion(inputTelefono);
            return true;
        }
        // Validar formato chileno si se ingresa: ej. +56 9 1234 5678, +56912345678 o 912345678
        const patronTelefono = /^(\+?56\s?)?(\d{1,2}\s?)?\d{7,9}$/;
        if (!patronTelefono.test(valor.replace(/\s+/g, ''))) {
            marcarInvalido(inputTelefono, 'Formato telefónico inválido (ej: +56 9 1234 5678 o 912345678).');
            return false;
        }
        marcarValido(inputTelefono);
        return true;
    }

    function validarAsunto() {
        const valor = selectAsunto.value;
        if (!valor) {
            marcarInvalido(selectAsunto, 'Debe seleccionar un motivo de contacto.');
            return false;
        }
        marcarValido(selectAsunto);
        return true;
    }

    function validarComentario() {
        const valor = (textComentario.value || '').trim();
        if (!valor) {
            marcarInvalido(textComentario, 'El comentario o mensaje es obligatorio.');
            return false;
        }
        if (valor.length < 10) {
            marcarInvalido(textComentario, 'El comentario debe tener al menos 10 caracteres explicativos.');
            return false;
        }
        if (valor.length > 500) {
            marcarInvalido(textComentario, 'El comentario no puede exceder los 500 caracteres.');
            return false;
        }
        marcarValido(textComentario);
        return true;
    }

    // 3. Listeners en blur / input
    inputNombre.addEventListener('blur', validarNombre);
    inputCorreo.addEventListener('blur', validarCorreo);
    inputTelefono.addEventListener('blur', validarTelefono);
    selectAsunto.addEventListener('change', validarAsunto);
    textComentario.addEventListener('blur', validarComentario);

    // 4. Envío del formulario
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const vNombre = validarNombre();
        const vCorreo = validarCorreo();
        const vTelefono = validarTelefono();
        const vAsunto = validarAsunto();
        const vComentario = validarComentario();

        const esValido = vNombre && vCorreo && vTelefono && vAsunto && vComentario;

        if (!esValido) {
            mostrarAlerta('Por favor revisa los campos señalados con error antes de enviar.', 'danger');
            return;
        }

        // Guardar mensaje de contacto simulado en localStorage
        const mensajesGuardados = JSON.parse(localStorage.getItem('logistrack_mensajes_contacto') || '[]');
        const nuevoMensaje = {
            id: 'MSG-' + Date.now(),
            nombre: inputNombre.value.trim(),
            correo: inputCorreo.value.trim().toLowerCase(),
            telefono: inputTelefono.value.trim() || 'No especificado',
            asunto: selectAsunto.value,
            comentario: textComentario.value.trim(),
            fecha: new Date().toLocaleString('es-CL')
        };
        mensajesGuardados.push(nuevoMensaje);
        localStorage.setItem('logistrack_mensajes_contacto', JSON.stringify(mensajesGuardados));

        // Feedback positivo y limpieza
        mostrarAlerta(`¡Gracias por contactarnos, ${nuevoMensaje.nombre}! Tu mensaje ha sido recibido con el folio <strong>${nuevoMensaje.id}</strong>. Responderemos a <em>${nuevoMensaje.correo}</em> a la brevedad.`, 'success');
        
        form.reset();
        limpiarValidacion(inputNombre);
        limpiarValidacion(inputCorreo);
        limpiarValidacion(inputTelefono);
        limpiarValidacion(selectAsunto);
        limpiarValidacion(textComentario);

        if (contadorComentario) {
            contadorComentario.textContent = '0 / 500 caracteres';
            contadorComentario.className = 'small fw-semibold text-muted';
        }
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
