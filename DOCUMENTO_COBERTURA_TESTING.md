# Documento de Cobertura de Testing: Propuesta y Análisis de Pruebas Unitarias

**Institución:** Duoc UC - Escuela de Informática y Telecomunicaciones  
**Asignatura:** Desarrollo Fullstack II (DSY1104)  
**Evaluación:** Evaluación 2 (30%) - Migración a React y Suite de Pruebas  
**Proyecto:** Plataforma LogisTrack (Módulo de Administración y Tienda)  
**Fecha:** Noviembre 2026  

---

## 1. Introducción y Objetivos de Calidad

El presente documento detalla la estrategia, cobertura y resultados de la suite de pruebas unitarias implementada para el sistema **LogisTrack**, en conformidad con la pauta y rúbrica de la Evaluación 2 de DSY1104.

El objetivo central del testing es asegurar la estabilidad, predictibilidad y calidad del código en los componentes de React, verificando formalmente cinco dimensiones críticas:
1. **Renderizado Correcto:** Comprobar que los componentes de presentación y listados procesen y proyecten fielmente los conjuntos de datos del modelo.
2. **Renderizado Condicional:** Garantizar que mensajes de alerta, insignias de estado y restricciones de acceso se muestren u oculten únicamente cuando se cumplan las reglas de negocio.
3. **Manejo de Propiedades (*Props*):** Validar que los componentes reutilizables reciban, interpreten y utilicen correctamente los parámetros enviados por sus componentes contenedores.
4. **Gestión de Estado (*State*):** Constatar que los formularios controlados mantengan el estado local sincronizado en tiempo real ante eventos de entrada de usuario (*Single Source of Truth*).
5. **Simulación de Eventos:** Verificar que los disparadores de interacción (clics en botones, apertura de modales, acciones de eliminación) alteren el estado de la aplicación de forma reactiva y sin mutaciones no controladas.

---

## 2. Marco Tecnológico del Entorno de Pruebas

Siguiendo las directrices del docente (propuesta Jasmine/Karma y ecosistema moderno de React), la suite de pruebas fue estructurada bajo la sintaxis estándar de aserciones Behavior-Driven Development (BDD):
- **Bloques de Suite:** `describe(nombre, callback)`
- **Casos de Prueba:** `it(descripcion, callback)`
- **Inicializadores:** `beforeEach(callback)`
- **Aserciones:** `expect(actual).toBe()`, `toBeTrue()`, `toBeFalse()`, `toContain()`, `toEqual()`
- **Runner de Ejecución:** Script de ejecución directa automatizado vía `npm test` (`node src/tests/runner.js`).

---

## 3. Matriz de Cobertura de Pruebas Unitarias

| ID Test | Componente Evaluado | Dimensión Evaluada | Caso de Prueba | Condición de Entrada | Resultado Esperado | Estado |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| **TC-01** | `<StatCard />` | Props y Renderizado | Renderizado de métricas y textos | `titulo='Ventas Totales'`, `valor='$1.450.000'` | Renderiza los valores exactos pasados por props | **APROBADO** |
| **TC-02** | `<StatCard />` | Props (Fallback) | Asignación de color por defecto | `colorIcono` omitido | Aplica clase por defecto `'text-primary'` | **APROBADO** |
| **TC-03** | `<StatCard />` | Render Condicional | Despliegue de subtexto comparativo | `subtexto='+15% respecto a ayer'` | Renderiza elemento cuando existe; oculta cuando no | **APROBADO** |
| **TC-04** | `<StatCard />` | Props y Enrutamiento | Estructuración interactiva como link | `enlace='/admin/productos/criticos'` | Envuelve el card en `<Link to="...">` | **APROBADO** |
| **TC-05** | `<RutaProtegida />` | Seguridad Fail-Closed | Bloqueo por ausencia de rol/sesión | `rolActual = null` o vacío | Deniega acceso de forma preventiva (*Fail-Closed*) | **APROBADO** |
| **TC-06** | `<RutaProtegida />` | Render Condicional | Restricción de acceso para rol Cliente | `rolActual = 'Cliente'` intentando entrar a `/admin` | Redirige a `/` con alerta de seguridad en estado | **APROBADO** |
| **TC-07** | `<RutaProtegida />` | Render Condicional | Autorización completa para Administrador | `rolActual = 'Administrador'` | Permite acceso tanto al panel como a usuarios | **APROBADO** |
| **TC-08** | `<RutaProtegida />` | Autorización Multinivel | Restricción de Vendedor en Usuarios | `rolActual = 'Vendedor'` intentando entrar a `/admin/usuarios` | Permite acceso a productos pero bloquea gestión de cuentas | **APROBADO** |
| **TC-09** | `<AdminProductos />` | Renderizado Correcto | Mapeo integral de lista de inventario | Colección mock de 5 productos | Renderiza los 5 registros sin omisiones | **APROBADO** |
| **TC-10** | `<AdminProductos />` | Render Condicional | Detección de productos en Stock Crítico | Productos con `stock <= stockCritico` | Identifica exactamente los ítems críticos (SKU-002, SKU-003) | **APROBADO** |
| **TC-11** | `<AdminProductos />` | Filtrado Reactivo | Búsqueda por coincidencia de texto | Búsqueda `'logitech'` | Filtra el catálogo retornando únicamente el producto correspondiente | **APROBADO** |
| **TC-12** | `<AdminProductos />` | Filtrado Reactivo | Filtrado por categoría seleccionada | Categoría `'tecnologia'` | Retorna únicamente los productos de dicha categoría | **APROBADO** |
| **TC-13** | `<AdminProductoForm />` | Estado Inicial | Inicialización limpia de formulario | Modo "Nuevo Producto" | Inicia con inputs vacíos y valores por defecto | **APROBADO** |
| **TC-14** | `<AdminProductoForm />` | Gestión de Estado | Actualización en vivo de inputs | Evento `onChange` en SKU, nombre, precio y stock | Actualiza el estado local (`useState`) sin mutar el DOM | **APROBADO** |
| **TC-15** | `<AdminProductoForm />` | Validación de Estado | Bloqueo de envío ante campos requeridos | Campos vacíos o precio `<= 0` | Emite objeto de errores y previene guardado | **APROBADO** |
| **TC-16** | `<AdminCategorias />` | Simulación de Eventos | Apertura reactiva de modal de creación | Clic en botón "Nueva Categoría" | `modalAbierto = true`, inicializa `formData` limpio | **APROBADO** |
| **TC-17** | `<AdminCategorias />` | Simulación de Eventos | Precarga de datos al editar | Clic en botón "Editar" de una categoría | `modalAbierto = true`, precarga campos existentes | **APROBADO** |
| **TC-18** | `<AdminCategorias />` | Simulación de Eventos | Cancelación y cierre de modal | Clic en botón "Cancelar" | Cierra el modal y resetea el estado | **APROBADO** |
| **TC-19** | `<AdminCategorias />` | Simulación de Eventos | Eliminación reactiva de categoría | Confirmación de evento de eliminación | Filtra y remueve la categoría sin recargar la página | **APROBADO** |

---

## 4. Análisis Arquitectónico de las Pruebas

### 4.1 Principio de Responsabilidad Única (*Single Responsibility*)
Cada componente probado fue diseñado para resolver una única tarea:
- `<StatCard />` es un componente puramente presentacional; sus pruebas comprueban que no maneje lógica de negocio externa sino que dependa enteramente de sus props.
- `<RutaProtegida />` aísla toda la lógica de control de acceso del resto de la aplicación, evitando duplicar comprobaciones de sesión en cada vista.

### 4.2 Enfoque de Seguridad *Fail-Closed*
A diferencia de la Entrega 1 donde los archivos HTML verificaban el rol una vez que la página ya se encontraba en el navegador (*Fail-Open*), los tests **TC-05**, **TC-06** y **TC-08** certifican que:
- Ante la ausencia o corrupción de la sesión (`null` o `undefined`), el componente **asume el rechazo por defecto**.
- El componente no renderiza el contenido protegido ni temporalmente en el Virtual DOM, redirigiendo al usuario inmediatamente con el historial de navegación protegido (`replace: true`).

### 4.3 Formularios Controlados y Previsibilidad de Estado
Las pruebas de `<AdminProductoForm />` y `<AdminCategorias />` demuestran que:
- No se utiliza manipulación directa del DOM (`document.getElementById`).
- Todo cambio se canaliza a través de despachadores de estado de React (`setFormData`), lo cual previene estados inconsistentes, carreras de datos y vulnerabilidades de inyección en tiempo de renderizado.

---

## 5. Instrucciones de Ejecución de la Suite

Para ejecutar la suite de pruebas en cualquier terminal del entorno:

```bash
# Opción 1: Mediante npm script
npm test

# Opción 2: Mediante Node directo
node src/tests/runner.js
```

### Salida esperada en consola:
```text
======================================================
   LogisTrack Testing Suite - Duoc UC (DSY1104)      
======================================================

● Componente <StatCard /> - Pruebas de Propiedades (Props) y Renderizado
  ✔ debe recibir y renderizar correctamente el título y el valor numérico/texto
  ✔ debe aplicar la clase de color por defecto si colorIcono no es suministrado
  ✔ debe renderizar condicionalmente el subtexto solo cuando es provisto
  ✔ debe estructurar el contenedor como hipervínculo si se define la propiedad enlace

● Componente <RutaProtegida /> - Renderizado Condicional y Fail-Closed
  ✔ debe aplicar Fail-Closed y denegar acceso si el rol es nulo, indefinido o vacío
  ✔ debe bloquear a usuarios con rol Cliente e instruir redirección hacia la tienda pública
  ✔ debe autorizar a usuarios con rol Administrador en todo el panel de administración
  ✔ debe permitir acceso al panel a Vendedor pero bloquear su acceso a la gestión de usuarios

● Componente <AdminProductos /> - Renderizado de Listas y Filtrado
  ✔ debe renderizar y mapear la totalidad de elementos del conjunto de datos
  ✔ debe identificar correctamente los productos que se encuentran en stock crítico (stock <= stockCritico)
  ✔ debe filtrar reactivamente los productos por coincidencia de texto en nombre o SKU
  ✔ debe filtrar reactivamente los productos por categoría seleccionada

● Componente <AdminProductoForm /> - Gestión de Estado (State) y Validación
  ✔ debe inicializar el estado del formulario con campos limpios en modo nuevo producto
  ✔ debe actualizar el estado local cuando el usuario introduce texto en los inputs
  ✔ debe validar que los campos obligatorios no estén vacíos antes de guardar

● Componente <AdminCategorias /> - Simulación de Eventos y Modales
  ✔ debe abrir el modal en modo creación al disparar el evento clic en "Nueva Categoría"
  ✔ debe precargar los datos de la categoría al hacer clic en el botón de edición
  ✔ debe cerrar el modal y limpiar el formulario al disparar el evento cancelar
  ✔ debe ejecutar la eliminación reactiva de una categoría mediante confirmación de evento

------------------------------------------------------
Resultados del Testing:
Suites:   5 pasadas, 5 total
Tests:    19 pasados, 19 total
Tiempo:   0.04s
------------------------------------------------------
```

---

## 6. Conclusión

La suite desarrollada cubre el 100% de los requerimientos técnicos y pedagógicos planteados para la Evaluación 2. Proporciona evidencia verificable de calidad de software, validación de estado predecible, seguridad en navegación y desacoplamiento de componentes, cumpliendo con los estándares de la industria y la rúbrica formativa de Duoc UC.
