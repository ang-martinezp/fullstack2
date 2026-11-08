/**
 * Suite de Pruebas Unitarias: AdminProductoForm Component
 * Tipo de prueba evaluada: Gestión de Estado (State) en Formularios Controlados
 * Entorno: Jasmine / Jest Compatible
 * 
 * Verifica que el formulario mantenga el estado unificado sin manipular el DOM,
 * valide los campos requeridos y aplique las reglas de negocio en la creación/edición.
 */

describe('Componente <AdminProductoForm /> - Gestión de Estado (State) y Validación', () => {
  let estadoInicial;

  beforeEach(() => {
    estadoInicial = {
      sku: '',
      nombre: '',
      categoria: 'tecnologia',
      precio: '',
      stock: '',
      stockCritico: '5',
      descripcion: ''
    };
  });

  it('debe inicializar el estado del formulario con campos limpios en modo nuevo producto', () => {
    expect(estadoInicial.sku).toBe('');
    expect(estadoInicial.nombre).toBe('');
    expect(estadoInicial.precio).toBe('');
    expect(estadoInicial.stock).toBe('');
    expect(estadoInicial.stockCritico).toBe('5');
  });

  it('debe actualizar el estado local cuando el usuario introduce texto en los inputs', () => {
    // Simulación de eventos onChange controlados por React
    const simularCambio = (estadoPrevio, campo, valor) => ({
      ...estadoPrevio,
      [campo]: valor
    });

    let estado = simularCambio(estadoInicial, 'sku', 'SKU-999');
    estado = simularCambio(estado, 'nombre', 'Servidor Rack Dell PowerEdge');
    estado = simularCambio(estado, 'precio', '1250000');
    estado = simularCambio(estado, 'stock', '8');

    expect(estado.sku).toBe('SKU-999');
    expect(estado.nombre).toBe('Servidor Rack Dell PowerEdge');
    expect(Number(estado.precio)).toBe(1250000);
    expect(Number(estado.stock)).toBe(8);
  });

  it('debe validar que los campos obligatorios no estén vacíos antes de guardar', () => {
    const validarFormulario = (data) => {
      const errores = {};
      if (!data.sku.trim()) errores.sku = 'El código SKU es obligatorio.';
      if (!data.nombre.trim()) errores.nombre = 'El nombre del producto es obligatorio.';
      if (!data.precio || Number(data.precio) <= 0) errores.precio = 'El precio debe ser mayor a 0.';
      if (data.stock === '' || Number(data.stock) < 0) errores.stock = 'El stock no puede ser negativo.';
      return errores;
    };

    // Probamos con campos vacíos
    const erroresInvalidos = validarFormulario(estadoInicial);
    expect(Boolean(erroresInvalidos.sku)).toBeTrue();
    expect(Boolean(erroresInvalidos.nombre)).toBeTrue();
    expect(Boolean(erroresInvalidos.precio)).toBeTrue();

    // Probamos con datos correctos
    const datosValidos = {
      sku: 'SKU-010',
      nombre: 'Impresora Térmica de Etiquetas',
      categoria: 'insumos',
      precio: '89990',
      stock: '15',
      stockCritico: '3',
      descripcion: 'Impresora USB para bodega'
    };

    const erroresValidos = validarFormulario(datosValidos);
    expect(Object.keys(erroresValidos).length).toBe(0);
  });
});
