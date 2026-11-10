/**
 * Test Runner Autónomo para LogisTrack (Jasmine-Style BDD + Spies/Mocks)
 * Compatible con ES Modules ("type": "module") y sintaxis estándar de Jasmine/Karma.
 * Uso: npm test  O  node src/tests/runner.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colores para la consola
const RESET = '\x1b[0m';
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const BOLD = '\x1b[1m';

let totalSuites = 0;
let passedSuites = 0;
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
let currentBeforeEach = null;

// Entorno global simulado tipo Jasmine / Karma (describe, it, beforeEach, spyOn, expect)
globalThis.beforeEach = (fn) => {
  currentBeforeEach = fn;
};

globalThis.spyOn = (obj, methodName) => {
  const original = obj[methodName];
  const calls = [];

  const spyFn = function (...args) {
    calls.push(args);
    return typeof original === 'function' ? original.apply(this, args) : undefined;
  };

  spyFn.__isSpy = true;
  spyFn.calls = {
    count: () => calls.length,
    allArgs: () => calls,
    any: () => calls.length > 0
  };
  spyFn.and = {
    returnValue: (val) => {
      obj[methodName] = function (...args) {
        calls.push(args);
        return val;
      };
      obj[methodName].__isSpy = true;
      obj[methodName].calls = spyFn.calls;
      return obj[methodName];
    }
  };

  obj[methodName] = spyFn;
  return spyFn;
};

globalThis.describe = (suiteName, fn) => {
  totalSuites++;
  currentBeforeEach = null;
  let fallosAntes = failedTests;
  console.log(`\n${BOLD}${CYAN}● ${suiteName}${RESET}`);
  try {
    fn();
    if (failedTests === fallosAntes) {
      passedSuites++;
    }
  } catch (err) {
    console.log(`  ${RED}✖ Error en suite: ${err.message}${RESET}`);
  }
};

globalThis.it = (testName, fn) => {
  totalTests++;
  try {
    if (typeof currentBeforeEach === 'function') {
      currentBeforeEach();
    }
    fn();
    passedTests++;
    console.log(`  ${GREEN}✔${RESET} ${testName}`);
  } catch (err) {
    failedTests++;
    console.log(`  ${RED}✖ ${testName}${RESET}`);
    console.log(`    ${YELLOW}Falla: ${err.message}${RESET}`);
  }
};

globalThis.expect = (actual) => ({
  toBe: (expected) => {
    if (actual !== expected) {
      throw new Error(`Se esperaba [${expected}] (${typeof expected}) pero se obtuvo [${actual}] (${typeof actual})`);
    }
  },
  toBeTrue: () => {
    if (actual !== true) {
      throw new Error(`Se esperaba true pero se obtuvo [${actual}]`);
    }
  },
  toBeFalse: () => {
    if (actual !== false) {
      throw new Error(`Se esperaba false pero se obtuvo [${actual}]`);
    }
  },
  toContain: (item) => {
    if (Array.isArray(actual)) {
      if (!actual.includes(item)) {
        throw new Error(`El arreglo no contiene el elemento [${item}]`);
      }
    } else if (typeof actual === 'string') {
      if (!actual.includes(item)) {
        throw new Error(`El texto "${actual}" no contiene "${item}"`);
      }
    } else {
      throw new Error(`toContain no soportado para el tipo ${typeof actual}`);
    }
  },
  toEqual: (expected) => {
    const actStr = JSON.stringify(actual);
    const expStr = JSON.stringify(expected);
    if (actStr !== expStr) {
      throw new Error(`Se esperaba ${expStr} pero se obtuvo ${actStr}`);
    }
  },
  toHaveBeenCalled: () => {
    if (!actual || !actual.__isSpy || !actual.calls.any()) {
      throw new Error('Se esperaba que el spy/mock hubiese sido invocado, pero no fue llamado.');
    }
  },
  toHaveBeenCalledWith: (...expectedArgs) => {
    if (!actual || !actual.__isSpy) {
      throw new Error('El objetivo evaluado no es un spy de Jasmine.');
    }
    const expStr = JSON.stringify(expectedArgs);
    const coincidencias = actual.calls.allArgs().some((args) => JSON.stringify(args) === expStr);
    if (!coincidencias) {
      throw new Error(`Se esperaba llamada con ${expStr} pero se registraron ${JSON.stringify(actual.calls.allArgs())}`);
    }
  }
});

console.log(`${BOLD}======================================================${RESET}`);
console.log(`${BOLD}   LogisTrack Testing Suite - Duoc UC (DSY1104)      ${RESET}`);
console.log(`${BOLD}======================================================${RESET}`);

const testFiles = [
  'StatCard.test.jsx',
  'RutaProtegida.test.jsx',
  'AdminProductos.test.jsx',
  'AdminProductoForm.test.jsx',
  'AdminCategorias.test.jsx',
  'Login.test.jsx',
  'Registro.test.jsx',
  'Carrito.test.jsx',
  'Checkout.test.jsx',
  'Contacto.test.jsx'
];

const start = Date.now();

testFiles.forEach((file) => {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    const code = fs.readFileSync(fullPath, 'utf8');
    try {
      eval(code);
    } catch (e) {
      console.log(`  ${RED}Error evaluando archivo ${file}: ${e.message}${RESET}`);
    }
  } else {
    console.log(`  ${YELLOW}No encontrado: ${file}${RESET}`);
  }
});

const duration = ((Date.now() - start) / 1000).toFixed(2);

console.log(`\n${BOLD}------------------------------------------------------${RESET}`);
console.log(`${BOLD}Resultados del Testing:${RESET}`);
console.log(`Suites:   ${GREEN}${passedSuites} pasadas${RESET}, ${totalSuites} total`);
console.log(`Tests:    ${GREEN}${passedTests} pasados${RESET}, ${failedTests > 0 ? `${RED}${failedTests} fallados${RESET}, ` : ''}${totalTests} total`);
console.log(`Tiempo:   ${duration}s`);
console.log(`${BOLD}------------------------------------------------------${RESET}\n`);

if (failedTests > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
