# Documento de Cobertura de Testing: Propuesta y Análisis de Pruebas Unitarias

**Institución:** Duoc UC - Escuela de Informática y Telecomunicaciones  
**Asignatura:** Desarrollo Fullstack II (DSY1104)  
**Evaluación:** Evaluación Parcial N° 2 (30%) - Migración a React y Suite de Pruebas  
**Proyecto:** Plataforma LogisTrack (Tienda Online, Cuentas/Checkout y Módulo de Administración)  
**Equipo de Desarrollo:** Alfredo De La Hoz, Angel Martinez y Oliver Duncan  
**Fecha:** Noviembre 2026  

---

## 1. Introducción y Objetivos de Calidad

El presente documento detalla la estrategia, cobertura y resultados de la suite de pruebas unitarias implementada para el sistema **LogisTrack**, en conformidad con la pauta y rúbrica de la Evaluación Parcial N° 2 de DSY1104.

El objetivo central del testing es asegurar la estabilidad, predictibilidad y calidad del código en los componentes de React de los tres bloques del proyecto (**Tienda/Catálogo**, **Cuentas/Formularios/Checkout** y **Panel de Administración**), verificando formalmente cinco dimensiones críticas:
1. **Renderizado Correcto:** Comprobar que los componentes de presentación, catálogo, carrito de compras y listados administrativos procesen y proyecten fielmente los conjuntos de datos del modelo.
2. **Renderizado Condicional:** Garantizar que mensajes de alerta, validaciones de formularios, vistas de carrito vacío, resultados de pago (éxito/error), insignias de estado y restricciones de acceso se muestren u oculten únicamente cuando se cumplan las reglas de negocio.
3. **Manejo de Propiedades (*Props*):** Validar que los componentes reutilizables reciban, interpreten y utilicen correctamente los parámetros enviados por sus componentes contenedores.
4. **Gestión de Estado (*State*):** Constatar que los formularios controlados (`Login`, `Registro`, `Checkout`, `Contacto`, `AdminProductoForm`) mantengan el estado local sincronizado en tiempo real ante eventos de entrada de usuario (*Single Source of Truth*), incluyendo selects dinámicos encadenados (Región → Comuna) y autocompletado automático por sesión activa.
5. **Simulación de Eventos y Uso de Mocks (*Spies*):** Verificar que los disparadores de interacción (clics en botones `+`/`-` del carrito, alternancia de visibilidad de contraseña, apertura de modales, eliminación reactiva y procesamiento de pago) alteren el estado de la aplicación de forma reactiva, empleando *Spies/Mocks* (`spyOn`) para aislar servicios de autenticación y persistencia.

---

## 2. Marco Tecnológico del Entorno de Pruebas

Siguiendo las directrices del docente (propuesta **Jasmine y Karma** junto con el ecosistema moderno de React + Vite en ES Modules), la suite de pruebas fue estructurada bajo la sintaxis estándar de aserciones Behavior-Driven Development (BDD):
- **Bloques de Suite:** `describe(nombre, callback)`
- **Casos de Prueba:** `it(descripcion, callback)`
- **Inicializadores de Estado:** `beforeEach(callback)`
- **Mocks y Espías (Jasmine Spies):** `spyOn(objeto, metodo)` con verificadores `toHaveBeenCalled()` y `toHaveBeenCalledWith(...)`
- **Aserciones:** `expect(actual).toBe()`, `toBeTrue()`, `toBeFalse()`, `toContain()`, `toEqual()`, `toHaveBeenCalled()`, `toHaveBeenCalledWith()`
- **Runner de Ejecución Directa (ES Modules):** Script automatizado vía `npm test` (`node src/tests/runner.js`).

---

## 3. Matriz de Cobertura de Pruebas Unitarias (35 Casos de Prueba en 9 Suites)

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
| **TC-20** | `<Login />` | Render Condicional | Rechazo de dominios de correo no válidos | Correo `'usuario@hotmail.com'` | Emite error exigiendo `@duoc.cl`, `@profesor.duoc.cl` o `@gmail.com` | **APROBADO** |
| **TC-21** | `<Login />` | Validación de Estado | Validación de longitud de contraseña | Clave de 3 caracteres o 11 caracteres | Bloquea envío si no tiene entre 4 y 10 caracteres | **APROBADO** |
| **TC-22** | `<Login />` | Simulación de Eventos | Alternar visibilidad de contraseña | Clic en botón ojo (`#btnToggleClave`) | Cambia `mostrarClave` entre `false` y `true` | **APROBADO** |
| **TC-23** | `<Login />` | Uso de Mocks (`spyOn`) | Invocación de servicio de autenticación | `spyOn(authServiceMock, 'iniciarSesion')` | Verifica llamada con argumentos exactos y retorno de rol `'Cliente'` | **APROBADO** |
| **TC-24** | `<Registro />` | Algoritmo Módulo 11 | Validación matemática de RUN chileno | `'12345678-5'`, `'10000030-K'` vs `'12345678-9'` | Aprueba RUNs válidos (numérico y K) y rechaza dígitos inválidos | **APROBADO** |
| **TC-25** | `<Registro />` | Gestión de Estado | Selects encadenados Región → Comuna | Cambio de región a `'Valparaíso'` | Limpia comuna previa y carga comunas de Valparaíso | **APROBADO** |
| **TC-26** | `<Registro />` | Validación de Estado | Coincidencia de contraseña y confirmación | `'duoc2026'` vs `'otraClave'` | Detecta discrepancia antes de enviar el registro | **APROBADO** |
| **TC-27** | `<Registro />` | Integridad de Datos | Prevención de usuarios duplicados | RUN `'201234567'` o correo `'alfredo@gmail.com'` | Bloquea creación si el RUN o correo ya existen en `localStorage` | **APROBADO** |
| **TC-28** | `<Carrito />` | Renderizado y Cálculo | Cálculo de subtotales y total acumulado | Productos con precio normal y con descuento oferta | Calcula exactamente la suma de `precio * cantidad` (`$413.974`) | **APROBADO** |
| **TC-29** | `<Carrito />` | Simulación de Eventos | Incremento de unidades (`+`) | Clic en botón `+` sobre `'SKU-001'` | Incrementa `cantidad` de 1 a 2 y recalcula subtotal | **APROBADO** |
| **TC-30** | `<Carrito />` | Simulación de Eventos | Decremento (`-`) y auto-eliminación en 0 | Clic en botón `-` cuando `cantidad === 1` | Remueve automáticamente el ítem de la lista del carrito | **APROBADO** |
| **TC-31** | `<Carrito />` | Render Condicional | Vaciado completo del carrito (`Limpiar`) | Clic en botón `'Limpiar'` | Vacía el arreglo y activa el renderizado condicional de carrito vacío | **APROBADO** |
| **TC-32** | `<Checkout />` | Estado y Sesión Activa | Autocompletado automático de cliente | Usuario logueado (`alfredo@gmail.com`) | Precarga automáticamente nombre, apellidos, correo, calle, región y comuna | **APROBADO** |
| **TC-33** | `<Checkout />` | Validación de Estado | Validación de dirección de entrega | Campos `calle`, `region` o `comuna` vacíos | Retiene el pago y muestra errores por cada campo faltante | **APROBADO** |
| **TC-34** | `<Checkout />` | Integración de Datos | Descuento de stock y cálculo de IVA (19%) | Compra aprobada de 2 unidades de `'SKU-001'` | Rebaja stock de 8 a 6 y desglosa monto Neto + IVA = Total | **APROBADO** |
| **TC-35** | `<Checkout />` | Render Condicional | Manejo de error de pago y reintento | Transacción rechazada (`simularFallo = true`) | Redirige a `/checkout/error` conservando intacto el carrito para reintentar | **APROBADO** |

---

## 4. Análisis Arquitectónico de las Pruebas

### 4.1 Principio de Responsabilidad Única (*Single Responsibility*)
Cada componente probado fue diseñado para resolver una única responsabilidad dentro de la arquitectura React:
- `<StatCard />` y `<ProductoCard />` son componentes presentacionales puros que dependen exclusivamente de sus `props`.
- `<RutaProtegida />` centraliza el control de acceso por roles (*Fail-Closed*).
- `<Login />`, `<Registro />` y `<Checkout />` delegan la persistencia y validaciones a módulos especializados (`src/data/usuarios.js`, `src/data/carrito.js`, `src/data/ordenes.js`, `src/utils/validaciones.js`).

### 4.2 Uso de Mocks y Espías (*Jasmine Spies*)
En cumplimiento con el indicador **IE2.3.1 / IE2.3.2**, la suite implementa `spyOn(objeto, metodo)` para interceptar llamadas a funciones críticas (como el servicio de inicio de sesión en **TC-23**) sin depender de efectos secundarios externos, comprobando con `toHaveBeenCalled()` y `toHaveBeenCalledWith()` que los componentes envían los parámetros exactos esperados.

### 4.3 Sincronización Reactiva entre Tienda, Checkout y Administración
Las pruebas **TC-28 a TC-35** validan el flujo transaccional de extremo a extremo:
1. El usuario inicia sesión en `/login` o se registra en `/registro`.
2. Añade productos al carrito (`/carrito`), donde se aplican descuentos de oferta automáticamente.
3. Al ingresar a `/checkout`, si existe sesión activa, el formulario se autocompleta automáticamente (*Requisito Anexo 1, pág. 6*).
4. Al confirmar el pago, se rebaja el stock real en `logistrack_productos`, se emite la orden en `logistrack_ordenes` (visible en `/admin/ordenes` y `/admin/ordenes/:id/boleta`) y se despliega el comprobante en `/checkout/exito` (o `/checkout/error` si ocurre un fallo).

---

## 5. Instrucciones de Ejecución de la Suite

Para ejecutar la suite de pruebas en cualquier terminal del entorno:

```bash
# Opción 1: Mediante npm script
npm test

# Opción 2: Mediante Node directo
node src/tests/runner.js
```

### Salida verificada en consola:
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

● Componente <Login /> - Validación de Credenciales, Estado y Eventos
  ✔ debe rechazar correos con dominios no autorizados y mostrar mensaje de error condicional
  ✔ debe validar que la contraseña tenga estrictamente entre 4 y 10 caracteres
  ✔ debe alternar el estado mostrarClave al simular clic en el botón de visibilidad
  ✔ debe invocar el servicio de autenticación (Mock/Spy) y sincronizar el rol activo al iniciar sesión

● Componente <Registro /> - Validación Módulo 11, Selects Encadenados y Estado
  ✔ debe validar correctamente el dígito verificador del RUN chileno mediante algoritmo Módulo 11
  ✔ debe actualizar las comunas disponibles y limpiar la comuna previa al cambiar la Región seleccionada
  ✔ debe verificar que la contraseña y su confirmación coincidan exactamente
  ✔ debe impedir el registro si el correo o RUN ya existen en la colección de usuarios

● Componente <Carrito /> - Operaciones CRUD, Eventos de Cantidad y Totales
  ✔ debe calcular correctamente el subtotal por ítem y el monto total del carrito
  ✔ debe incrementar la cantidad de un producto existente al disparar el evento "+" o añadir repetido
  ✔ debe disminuir la cantidad con el evento "-" y remover el ítem automáticamente si llega a 0
  ✔ debe vaciar todos los elementos al ejecutar el evento "Limpiar carrito" y activar estado vacío

● Componente <Checkout /> - Autocompletado de Sesión, Despacho y Procesamiento de Pago
  ✔ debe autocompletar automáticamente los datos del cliente y dirección cuando existe sesión activa
  ✔ debe validar que la calle, región y comuna de entrega sean obligatorias antes de pagar
  ✔ debe descontar el stock del inventario y generar la orden con IVA (19%) al aprobarse el pago
  ✔ debe redirigir a la vista de error de pago y conservar los productos si falla la transacción

------------------------------------------------------
Resultados del Testing:
Suites:   9 pasadas, 9 total
Tests:    35 pasados, 35 total
Tiempo:   0.02s
------------------------------------------------------
```

---

## 6. Conclusión

La suite desarrollada cubre el **100% de los requerimientos técnicos y pedagógicos** planteados para la Evaluación Parcial N° 2, superando el umbral de 10 pruebas por integrante (35 pruebas unitarias aprobadas en total). Proporciona evidencia verificable de calidad de software, validación de estado predecible, uso de mocks/spies, seguridad en navegación y desacoplamiento de componentes, cumpliendo cabalmente con la rúbrica de Duoc UC.
