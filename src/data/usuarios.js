const CLAVE_STORAGE_USUARIOS = 'logistrack_usuarios';
const CLAVE_STORAGE_ROL_ACTIVO = 'logistrack_rol_activo';
const CLAVE_STORAGE_SESION = 'logistrack_sesion_activo';

export const ROLES_DISPONIBLES = ['Administrador', 'Vendedor', 'Cliente'];

const USUARIOS_INICIALES = [
  {
    run: '19011022K',
    nombre: 'Oliver',
    apellidos: 'Duncan',
    correo: 'oliver@duoc.cl',
    clave: 'admin123',
    rol: 'Administrador',
    telefono: '+56 9 8765 4321',
    region: 'Metropolitana de Santiago',
    comuna: 'Santiago',
    direccion: 'Monjitas 843, Depto 603',
    fechaRegistro: '2026-03-01'
  },
  {
    run: '185421110',
    nombre: 'Angel',
    apellidos: 'Martinez',
    correo: 'angel@duoc.cl',
    clave: 'vend1234',
    rol: 'Vendedor',
    telefono: '+56 9 5555 1234',
    region: 'Metropolitana de Santiago',
    comuna: 'Maipú',
    direccion: 'Calle Los Alerces 450',
    fechaRegistro: '2026-03-10'
  },
  {
    run: '201234567',
    nombre: 'Alfredo',
    apellidos: 'De La Hoz',
    correo: 'alfredo@gmail.com',
    clave: 'duoc2026',
    rol: 'Cliente',
    telefono: '+56 9 9988 7766',
    region: 'Metropolitana de Santiago',
    comuna: 'Cerrillos',
    direccion: 'Av. Departamental 1234',
    fechaRegistro: '2026-03-15'
  }
];

export const CUENTAS_DEMO = [
  {
    run: '19011022K',
    correo: 'admin@duoc.cl',
    clave: 'admin123',
    nombre: 'Oliver',
    apellidos: 'Duncan',
    rol: 'Administrador',
    telefono: '+56 9 8765 4321',
    region: 'Metropolitana de Santiago',
    comuna: 'Santiago',
    direccion: 'Monjitas 843, Depto 603'
  },
  {
    run: '185421110',
    correo: 'vendedor@duoc.cl',
    clave: 'vend1234',
    nombre: 'Angel',
    apellidos: 'Martinez',
    rol: 'Vendedor',
    telefono: '+56 9 5555 1234',
    region: 'Metropolitana de Santiago',
    comuna: 'Maipú',
    direccion: 'Calle Los Alerces 450'
  },
  {
    run: '201234567',
    correo: 'alfredo@duoc.cl',
    clave: 'duoc2026',
    nombre: 'Alfredo',
    apellidos: 'De La Hoz',
    rol: 'Cliente',
    telefono: '+56 9 9988 7766',
    region: 'Metropolitana de Santiago',
    comuna: 'Cerrillos',
    direccion: 'Av. Departamental 1234'
  },
  {
    run: '111111111',
    correo: 'profesor@profesor.duoc.cl',
    clave: 'duoc2026',
    nombre: 'Profesor',
    apellidos: 'Duoc UC',
    rol: 'Administrador',
    telefono: '+56 9 2233 4455',
    region: 'Metropolitana de Santiago',
    comuna: 'Santiago',
    direccion: 'Av. España 8'
  },
  {
    run: '222222222',
    correo: 'cliente@gmail.com',
    clave: '123456',
    nombre: 'Cliente',
    apellidos: 'Prueba',
    rol: 'Cliente',
    telefono: '+56 9 6677 8899',
    region: 'Metropolitana de Santiago',
    comuna: 'Cerrillos',
    direccion: 'Av. Pajaritos 3100'
  }
];

function leerUsuarios() {
  const guardado = localStorage.getItem(CLAVE_STORAGE_USUARIOS);
  if (guardado) {
    try {
      const parsed = JSON.parse(guardado);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch {
      // Ignorar error y recrear
    }
  }
  localStorage.setItem(CLAVE_STORAGE_USUARIOS, JSON.stringify(USUARIOS_INICIALES));
  return USUARIOS_INICIALES;
}

function guardarUsuarios(usuarios) {
  localStorage.setItem(CLAVE_STORAGE_USUARIOS, JSON.stringify(usuarios));
}

// Limpiar RUN a solo dígitos y K mayúscula (ej: 19.011.022-K -> 19011022K)
export function normalizarRun(runRaw) {
  if (!runRaw) return '';
  return String(runRaw).replace(/[^0-9kK]/g, '').toUpperCase();
}

// Formatear RUN visualmente (ej: 19011022K -> 19.011.022-K)
export function formatearRunVisual(runRaw) {
  const limpio = normalizarRun(runRaw);
  if (limpio.length < 2) return limpio;
  const cuerpo = limpio.slice(0, -1);
  const dv = limpio.slice(-1);
  return `${Number(cuerpo).toLocaleString('es-CL')}-${dv}`;
}

// Validación de dígito verificador módulo 11
export function validarRunChileno(runCompleto) {
  const limpio = normalizarRun(runCompleto);
  if (limpio.length < 8 || limpio.length > 9) return false;

  const cuerpo = limpio.slice(0, -1);
  if (!/^\d+$/.test(cuerpo)) return false;
  const dv = limpio.slice(-1);

  let suma = 0;
  let multiplo = 2;

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += Number(cuerpo[i]) * multiplo;
    multiplo = multiplo < 7 ? multiplo + 1 : 2;
  }

  const dvEsperadoCalculado = 11 - (suma % 11);
  let dvEsperado = '';
  if (dvEsperadoCalculado === 11) dvEsperado = '0';
  else if (dvEsperadoCalculado === 10) dvEsperado = 'K';
  else dvEsperado = String(dvEsperadoCalculado);

  return dv === dvEsperado;
}

export function obtenerUsuarios() {
  return leerUsuarios();
}

export function obtenerUsuarioPorRun(run) {
  const runBuscado = normalizarRun(run);
  return (
    leerUsuarios().find((u) => normalizarRun(u.run) === runBuscado) || null
  );
}

export function obtenerUsuarioPorCorreo(correo) {
  if (!correo) return null;
  const correoBuscado = String(correo).trim().toLowerCase();
  return (
    leerUsuarios().find((u) => (u.correo || '').toLowerCase() === correoBuscado) || null
  );
}

export function crearUsuario(nuevo) {
  const usuarios = leerUsuarios();
  const runNorm = normalizarRun(nuevo.run);

  if (!runNorm) {
    throw new Error('El RUN del usuario es obligatorio.');
  }

  const existeRun = usuarios.some((u) => normalizarRun(u.run) === runNorm);
  if (existeRun) {
    throw new Error(`Ya existe un usuario registrado con el RUN ${formatearRunVisual(runNorm)}`);
  }

  const correoNorm = (nuevo.correo || '').trim().toLowerCase();
  if (correoNorm) {
    const existeCorreo = usuarios.some((u) => (u.correo || '').toLowerCase() === correoNorm);
    if (existeCorreo) {
      throw new Error(`El correo electrónico ${correoNorm} ya está registrado en la tienda.`);
    }
  }

  const usuarioAGuardar = {
    ...nuevo,
    run: runNorm,
    nombre: (nuevo.nombre || '').trim(),
    apellidos: (nuevo.apellidos || '').trim(),
    correo: correoNorm,
    clave: nuevo.clave || '123456',
    rol: nuevo.rol || 'Cliente',
    telefono: (nuevo.telefono || '').trim(),
    region: nuevo.region || 'Metropolitana de Santiago',
    comuna: nuevo.comuna || 'Santiago',
    direccion: (nuevo.direccion || '').trim(),
    fechaRegistro: nuevo.fechaRegistro || new Date().toISOString().split('T')[0]
  };

  usuarios.push(usuarioAGuardar);
  guardarUsuarios(usuarios);
  return usuarioAGuardar;
}

export function actualizarUsuario(runOriginal, cambios) {
  const usuarios = leerUsuarios();
  const runNorm = normalizarRun(runOriginal);
  const indice = usuarios.findIndex((u) => normalizarRun(u.run) === runNorm);

  if (indice === -1) return null;

  const actualizado = {
    ...usuarios[indice],
    ...cambios,
    run: usuarios[indice].run, // No mutar la clave primaria
    nombre: cambios.nombre !== undefined ? cambios.nombre.trim() : usuarios[indice].nombre,
    apellidos: cambios.apellidos !== undefined ? cambios.apellidos.trim() : usuarios[indice].apellidos,
    correo: cambios.correo !== undefined ? cambios.correo.trim().toLowerCase() : usuarios[indice].correo,
    rol: cambios.rol || usuarios[indice].rol,
    telefono: cambios.telefono !== undefined ? cambios.telefono.trim() : usuarios[indice].telefono
  };

  usuarios[indice] = actualizado;
  guardarUsuarios(usuarios);
  return actualizado;
}

export function eliminarUsuario(run) {
  const runNorm = normalizarRun(run);
  const usuarios = leerUsuarios().filter((u) => normalizarRun(u.run) !== runNorm);
  guardarUsuarios(usuarios);
  return true;
}

// Gestión del rol activo en sesión
export function obtenerRolActivo() {
  const rol = localStorage.getItem(CLAVE_STORAGE_ROL_ACTIVO);
  if (!rol || !ROLES_DISPONIBLES.includes(rol.trim())) {
    localStorage.setItem(CLAVE_STORAGE_ROL_ACTIVO, 'Administrador');
    return 'Administrador';
  }
  return rol.trim();
}

export function establecerRolActivo(nuevoRol) {
  if (ROLES_DISPONIBLES.includes(nuevoRol)) {
    localStorage.setItem(CLAVE_STORAGE_ROL_ACTIVO, nuevoRol);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('logistrack_rol_cambiado'));
    }
    return true;
  }
  return false;
}

// Gestión de sesión activa de usuario (Login / Tienda / Checkout)
export function obtenerSesionActiva() {
  const guardado = localStorage.getItem(CLAVE_STORAGE_SESION);
  if (!guardado) return null;
  try {
    return JSON.parse(guardado);
  } catch {
    return null;
  }
}

export function iniciarSesionUsuario(usuario) {
  const rolUsuario = ROLES_DISPONIBLES.includes(usuario.rol) ? usuario.rol : 'Cliente';
  const sesion = {
    run: usuario.run || '201234567',
    correo: (usuario.correo || '').toLowerCase(),
    nombre: usuario.nombre || (usuario.correo ? usuario.correo.split('@')[0] : 'Cliente'),
    apellidos: usuario.apellidos || '',
    nombreCompleto: `${usuario.nombre || ''} ${usuario.apellidos || ''}`.trim() || usuario.correo,
    rol: rolUsuario,
    telefono: usuario.telefono || '',
    region: usuario.region || 'Metropolitana de Santiago',
    comuna: usuario.comuna || 'Cerrillos',
    direccion: usuario.direccion || '',
    fechaLogin: new Date().toISOString()
  };

  localStorage.setItem(CLAVE_STORAGE_SESION, JSON.stringify(sesion));
  localStorage.setItem(CLAVE_STORAGE_ROL_ACTIVO, rolUsuario);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('logistrack_sesion_cambiada'));
    window.dispatchEvent(new Event('logistrack_rol_cambiado'));
  }

  return sesion;
}

export function cerrarSesionUsuario() {
  localStorage.removeItem(CLAVE_STORAGE_SESION);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('logistrack_sesion_cambiada'));
  }
}

export function autenticarUsuario(correoRaw, claveRaw) {
  const correo = String(correoRaw || '').trim().toLowerCase();
  const clave = String(claveRaw || '');

  const usuarios = leerUsuarios();
  const encontrado = usuarios.find((u) => (u.correo || '').toLowerCase() === correo);

  if (encontrado) {
    // Si el usuario tiene clave definida, verificarla; si fue creado desde Admin sin clave, aceptar clave por defecto o cualquiera válida
    if (encontrado.clave && encontrado.clave !== clave) {
      return { exito: false, error: 'Contraseña incorrecta para el usuario ingresado.' };
    }
    const sesion = iniciarSesionUsuario(encontrado);
    return { exito: true, usuario: sesion };
  }

  const demo = CUENTAS_DEMO.find((u) => u.correo.toLowerCase() === correo);
  if (demo) {
    if (demo.clave !== clave) {
      return { exito: false, error: 'Contraseña incorrecta.' };
    }
    const sesion = iniciarSesionUsuario(demo);
    return { exito: true, usuario: sesion };
  }

  // Si es un correo válido con formato institucional/gmail pero no está registrado previamente,
  // se permite acceso simulado como Cliente (mismo comportamiento que login.js de Entrega 1)
  const nombreDerivado = correo.split('@')[0];
  const nuevoCliente = {
    run: '20999888K',
    correo,
    nombre: nombreDerivado.charAt(0).toUpperCase() + nombreDerivado.slice(1),
    apellidos: 'Usuario',
    rol: 'Cliente',
    region: 'Metropolitana de Santiago',
    comuna: 'Cerrillos',
    direccion: ''
  };
  const sesion = iniciarSesionUsuario(nuevoCliente);
  return { exito: true, usuario: sesion };
}

export function obtenerUsuarioActivo() {
  const sesion = obtenerSesionActiva();
  const rol = obtenerRolActivo();
  if (sesion && sesion.rol === rol) {
    return sesion;
  }
  const usuarios = leerUsuarios();
  return (
    usuarios.find((u) => u.rol === rol) || {
      run: '19011022K',
      nombre: 'Usuario',
      apellidos: rol,
      correo: `${rol.toLowerCase()}@logistrack.cl`,
      rol: rol
    }
  );
}
