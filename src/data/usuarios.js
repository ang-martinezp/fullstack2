const CLAVE_STORAGE_USUARIOS = 'logistrack_usuarios';
const CLAVE_STORAGE_ROL_ACTIVO = 'logistrack_rol_activo';

export const ROLES_DISPONIBLES = ['Administrador', 'Vendedor', 'Cliente'];

const USUARIOS_INICIALES = [
  {
    run: '19011022K',
    nombre: 'Oliver',
    apellidos: 'Duncan',
    correo: 'oliver@duoc.cl',
    rol: 'Administrador',
    telefono: '+56 9 8765 4321',
    fechaRegistro: '2026-03-01'
  },
  {
    run: '185421110',
    nombre: 'Angel',
    apellidos: 'Martinez',
    correo: 'angel@duoc.cl',
    rol: 'Vendedor',
    telefono: '+56 9 5555 1234',
    fechaRegistro: '2026-03-10'
  },
  {
    run: '201234567',
    nombre: 'Alfredo',
    apellidos: 'De La Hoz',
    correo: 'alfredo@gmail.com',
    rol: 'Cliente',
    telefono: '+56 9 9988 7766',
    fechaRegistro: '2026-03-15'
  }
];

function leerUsuarios() {
  const guardado = localStorage.getItem(CLAVE_STORAGE_USUARIOS);
  if (guardado) {
    try {
      return JSON.parse(guardado);
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

export function crearUsuario(nuevo) {
  const usuarios = leerUsuarios();
  const runNorm = normalizarRun(nuevo.run);

  if (!runNorm) {
    throw new Error('El RUN del usuario es obligatorio.');
  }

  const existe = usuarios.some((u) => normalizarRun(u.run) === runNorm);
  if (existe) {
    throw new Error(`Ya existe un usuario registrado con el RUN ${formatearRunVisual(runNorm)}`);
  }

  const usuarioAGuardar = {
    ...nuevo,
    run: runNorm,
    nombre: (nuevo.nombre || '').trim(),
    apellidos: (nuevo.apellidos || '').trim(),
    correo: (nuevo.correo || '').trim().toLowerCase(),
    rol: nuevo.rol || 'Cliente',
    telefono: (nuevo.telefono || '').trim(),
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
    // Disparar evento para que componentes reactivos sincronicen de inmediato
    window.dispatchEvent(new Event('logistrack_rol_cambiado'));
    return true;
  }
  return false;
}

export function obtenerUsuarioActivo() {
  const rol = obtenerRolActivo();
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
