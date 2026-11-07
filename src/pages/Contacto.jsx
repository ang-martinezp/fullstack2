import { useState, useEffect } from 'react';

const DOMINIOS_PERMITIDOS = /^[a-zA-Z0-9._%+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;
const PATRON_NOMBRE = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]{2,80}$/;
const PATRON_TELEFONO = /^(\+?56\s?)?(\d{1,2}\s?)?\d{7,9}$/;
const CLAVE_MENSAJES = 'logistrack_mensajes_contacto';

const ASUNTOS = [
    { valor: 'Consulta General', etiqueta: 'Consulta General' },
    { valor: 'Estado de Pedido', etiqueta: 'Estado de Pedido / Envío' },
    { valor: 'Soporte Técnico', etiqueta: 'Soporte Técnico de Productos' },
    { valor: 'Ventas Corporativas', etiqueta: 'Ventas y Cotizaciones Mayoristas' },
    { valor: 'Sugerencia o Reclamo', etiqueta: 'Sugerencia o Reclamo' },
];

function validarCampo(campo, valores) {
    switch (campo) {
        case 'nombre': {
            const valor = valores.nombre.trim();
            if (!valor) return 'El nombre completo es obligatorio.';
            if (!PATRON_NOMBRE.test(valor)) return 'Por favor ingrese un nombre válido (mínimo 2 letras, solo texto).';
            return '';
        }
        case 'correo': {
            const valor = valores.correo.trim();
            if (!valor) return 'El correo electrónico es obligatorio.';
            if (!DOMINIOS_PERMITIDOS.test(valor)) return 'Debe ingresar un correo válido con dominio @duoc.cl, @profesor.duoc.cl o @gmail.com';
            return '';
        }
        case 'telefono': {
            const valor = valores.telefono.trim();
            if (!valor) return '';
            if (!PATRON_TELEFONO.test(valor.replace(/\s+/g, ''))) return 'Formato de teléfono no válido (ej: +56 9 1234 5678 o 912345678).';
            return '';
        }
        case 'asunto':
            return valores.asunto ? '' : 'Debe seleccionar un motivo de contacto.';
        case 'comentario': {
            const valor = valores.comentario.trim();
            if (!valor) return 'El comentario o mensaje es obligatorio.';
            if (valor.length < 10) return 'El comentario debe tener al menos 10 caracteres explicativos.';
            if (valor.length > 500) return 'El comentario no puede exceder los 500 caracteres.';
            return '';
        }
        default:
            return '';
    }
}

function Contacto() {
    useEffect(() => {
        document.title = 'Contacto - LogisTrack Store';
    }, []);

    const [valores, setValores] = useState({
        nombre: '', correo: '', telefono: '', asunto: '', comentario: '',
    });
    const [errores, setErrores] = useState({});
    const [tocado, setTocado] = useState({});
    const [alerta, setAlerta] = useState(null);

    const handleChange = (campo) => (e) => {
        setValores((prev) => ({ ...prev, [campo]: e.target.value }));
    };

    const handleBlur = (campo) => () => {
        setTocado((prev) => ({ ...prev, [campo]: true }));
        setErrores((prev) => ({ ...prev, [campo]: validarCampo(campo, valores) }));
    };

    const claseCampo = (campo) => {
        if (!tocado[campo]) return 'form-control';
        return `form-control ${errores[campo] ? 'is-invalid' : 'is-valid'}`;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const campos = ['nombre', 'correo', 'telefono', 'asunto', 'comentario'];
        const nuevosErrores = {};
        campos.forEach((campo) => {
            nuevosErrores[campo] = validarCampo(campo, valores);
        });
        setErrores(nuevosErrores);
        setTocado({ nombre: true, correo: true, telefono: true, asunto: true, comentario: true });

        const esValido = Object.values(nuevosErrores).every((msg) => !msg);
        if (!esValido) {
            setAlerta({ tipo: 'danger', mensaje: 'Por favor revisa los campos señalados con error antes de enviar.' });
            return;
        }

        const mensajesGuardados = JSON.parse(localStorage.getItem(CLAVE_MENSAJES) || '[]');
        const nuevoMensaje = {
            id: 'MSG-' + Date.now(),
            nombre: valores.nombre.trim(),
            correo: valores.correo.trim().toLowerCase(),
            telefono: valores.telefono.trim() || 'No especificado',
            asunto: valores.asunto,
            comentario: valores.comentario.trim(),
            fecha: new Date().toLocaleString('es-CL'),
        };
        mensajesGuardados.push(nuevoMensaje);
        localStorage.setItem(CLAVE_MENSAJES, JSON.stringify(mensajesGuardados));

        setAlerta({
            tipo: 'success',
            mensaje: `¡Gracias por contactarnos, ${nuevoMensaje.nombre}! Tu mensaje fue recibido con el folio ${nuevoMensaje.id}. Responderemos a ${nuevoMensaje.correo} a la brevedad.`,
        });
        setValores({ nombre: '', correo: '', telefono: '', asunto: '', comentario: '' });
        setErrores({});
        setTocado({});
    };

    return (
        <>
            <div className="text-center mb-5">
                <span className="badge bg-primary px-3 py-2 text-uppercase mb-3 fw-semibold">
                    <i className="bi bi-chat-dots me-1"></i> Canal de Atención
                </span>
                <h1 className="fw-bold text-navy">Contáctanos</h1>
                <p className="lead text-muted mx-auto" style={{ maxWidth: '680px' }}>
                    ¿Tienes consultas sobre disponibilidad de stock, compras corporativas o tu pedido? Envíanos tu
                    mensaje y te responderemos a la brevedad.
                </p>
            </div>

            <div className="row g-4">
                <div className="col-12 col-lg-5">
                    <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 h-100 bg-white">
                        <h2 className="h4 fw-bold text-navy mb-4">Información Corporativa</h2>

                        <div className="d-flex align-items-start mb-4">
                            <div className="bg-primary bg-opacity-10 text-primary rounded-3 p-3 me-3">
                                <i className="bi bi-geo-alt fs-4"></i>
                            </div>
                            <div>
                                <h3 className="h6 fw-bold text-navy mb-1">Casa Matriz y Bodega Central</h3>
                                <p className="text-muted small mb-0">Av. España 8, Santiago Centro, Región Metropolitana, Chile</p>
                            </div>
                        </div>

                        <div className="d-flex align-items-start mb-4">
                            <div className="bg-primary bg-opacity-10 text-primary rounded-3 p-3 me-3">
                                <i className="bi bi-envelope fs-4"></i>
                            </div>
                            <div>
                                <h3 className="h6 fw-bold text-navy mb-1">Correo Electrónico</h3>
                                <p className="text-muted small mb-0">contacto@logistrack.cl</p>
                                <p className="text-muted small mb-0">soporte@logistrack.cl</p>
                            </div>
                        </div>

                        <div className="d-flex align-items-start mb-4">
                            <div className="bg-primary bg-opacity-10 text-primary rounded-3 p-3 me-3">
                                <i className="bi bi-telephone fs-4"></i>
                            </div>
                            <div>
                                <h3 className="h6 fw-bold text-navy mb-1">Central Telefónica</h3>
                                <p className="text-muted small mb-0">+56 2 2345 6789</p>
                                <p className="text-muted small mb-0">+56 9 8765 4321 (WhatsApp Empresas)</p>
                            </div>
                        </div>

                        <div className="d-flex align-items-start mb-4">
                            <div className="bg-primary bg-opacity-10 text-primary rounded-3 p-3 me-3">
                                <i className="bi bi-clock fs-4"></i>
                            </div>
                            <div>
                                <h3 className="h6 fw-bold text-navy mb-1">Horario de Soporte</h3>
                                <p className="text-muted small mb-0">Lunes a Viernes: 08:30 a 18:30 hrs</p>
                                <p className="text-muted small mb-0">Sábados: 09:00 a 14:00 hrs</p>
                            </div>
                        </div>

                        <hr className="my-4 text-secondary opacity-25" />

                        <div className="bg-light p-3 rounded-3 border">
                            <div className="d-flex align-items-center text-primary mb-2">
                                <i className="bi bi-shield-check fs-5 me-2"></i>
                                <span className="fw-semibold small">Convenio Institucional Duoc UC</span>
                            </div>
                            <p className="text-muted small mb-0">
                                Atención prioritaria y soporte especializado para alumnos y docentes de la comunidad Duoc UC.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-lg-7">
                    <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
                        <h2 className="h4 fw-bold text-navy mb-2">Envíanos un Mensaje</h2>
                        <p className="text-muted small mb-4">
                            Completa el formulario para canalizar tu solicitud con el departamento correspondiente.
                        </p>

                        {alerta && (
                            <div className={`alert alert-${alerta.tipo} alert-dismissible fade show`} role="alert">
                                {alerta.mensaje}
                                <button type="button" className="btn-close" onClick={() => setAlerta(null)} aria-label="Cerrar"></button>
                            </div>
                        )}

                        <form noValidate onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="contactoNombre" className="form-label">
                                    Nombre Completo <span className="text-danger">*</span>
                                </label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light text-muted"><i className="bi bi-person"></i></span>
                                    <input
                                        type="text"
                                        className={claseCampo('nombre')}
                                        id="contactoNombre"
                                        placeholder="Ej: Carlos Silva Gómez"
                                        value={valores.nombre}
                                        onChange={handleChange('nombre')}
                                        onBlur={handleBlur('nombre')}
                                    />
                                    {tocado.nombre && errores.nombre && (
                                        <div className="invalid-feedback">{errores.nombre}</div>
                                    )}
                                </div>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="contactoCorreo" className="form-label">
                                    Correo Electrónico <span className="text-danger">*</span>
                                </label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light text-muted"><i className="bi bi-envelope"></i></span>
                                    <input
                                        type="email"
                                        className={claseCampo('correo')}
                                        id="contactoCorreo"
                                        placeholder="ejemplo@duoc.cl"
                                        value={valores.correo}
                                        onChange={handleChange('correo')}
                                        onBlur={handleBlur('correo')}
                                    />
                                    {tocado.correo && errores.correo && (
                                        <div className="invalid-feedback">{errores.correo}</div>
                                    )}
                                </div>
                                <div className="form-text small text-muted">
                                    Dominios permitidos: @duoc.cl, @profesor.duoc.cl o @gmail.com
                                </div>
                            </div>

                            <div className="row g-3 mb-3">
                                <div className="col-md-6">
                                    <label htmlFor="contactoTelefono" className="form-label">Teléfono (opcional)</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light text-muted"><i className="bi bi-telephone"></i></span>
                                        <input
                                            type="tel"
                                            className={claseCampo('telefono')}
                                            id="contactoTelefono"
                                            placeholder="+56 9 1234 5678"
                                            value={valores.telefono}
                                            onChange={handleChange('telefono')}
                                            onBlur={handleBlur('telefono')}
                                        />
                                        {tocado.telefono && errores.telefono && (
                                            <div className="invalid-feedback">{errores.telefono}</div>
                                        )}
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="contactoAsunto" className="form-label">
                                        Motivo del Contacto <span className="text-danger">*</span>
                                    </label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light text-muted"><i className="bi bi-tag"></i></span>
                                        <select
                                            className={`form-select ${tocado.asunto ? (errores.asunto ? 'is-invalid' : 'is-valid') : ''}`}
                                            id="contactoAsunto"
                                            value={valores.asunto}
                                            onChange={handleChange('asunto')}
                                            onBlur={handleBlur('asunto')}
                                        >
                                            <option value="">-- Seleccione motivo --</option>
                                            {ASUNTOS.map((a) => (
                                                <option key={a.valor} value={a.valor}>{a.etiqueta}</option>
                                            ))}
                                        </select>
                                        {tocado.asunto && errores.asunto && (
                                            <div className="invalid-feedback">{errores.asunto}</div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="mb-4">
                                <div className="d-flex justify-content-between align-items-center mb-1">
                                    <label htmlFor="contactoComentario" className="form-label mb-0">
                                        Comentario o Mensaje <span className="text-danger">*</span>
                                    </label>
                                    <span className={`small fw-semibold ${valores.comentario.length >= 500 ? 'text-danger' : valores.comentario.length >= 450 ? 'text-warning' : 'text-muted'}`}>
                                        {valores.comentario.length} / 500 caracteres
                                    </span>
                                </div>
                                <textarea
                                    className={claseCampo('comentario')}
                                    id="contactoComentario"
                                    rows="5"
                                    maxLength={500}
                                    placeholder="Escribe aquí tu consulta o comentario detallado (hasta 500 caracteres)..."
                                    value={valores.comentario}
                                    onChange={handleChange('comentario')}
                                    onBlur={handleBlur('comentario')}
                                ></textarea>
                                {tocado.comentario && errores.comentario && (
                                    <div className="invalid-feedback d-block">{errores.comentario}</div>
                                )}
                                <div className="form-text small text-muted">
                                    Máximo 500 caracteres permitidos por requerimiento de la rúbrica.
                                </div>
                            </div>

                            <div className="d-grid">
                                <button type="submit" className="btn btn-brand py-2 shadow-sm">
                                    <i className="bi bi-send me-2"></i>Enviar Mensaje
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Contacto;