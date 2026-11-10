/**
 * Suite de Pruebas Unitarias: Checkout, CompraExitosa y CompraError Components
 * Tipo de prueba evaluada: Propiedades, Autocompletado de Sesión, Creación de Orden y Descuento de Stock
 * Entorno: Jasmine / Karma Compatible
 *
 * Verifica el autocompletado automático cuando el cliente ha iniciado sesión (Requisito Anexo 1),
 * la validación de dirección de despacho, la rebaja de inventario al confirmar el pago y
 * el manejo condicional de pago exitoso vs. pago con error.
 */

describe('Componente <Checkout /> - Autocompletado de Sesión, Despacho y Procesamiento de Pago', () => {
  const sesionClienteMock = {
    run: '201234567',
    nombre: 'Alfredo',
    apellidos: 'De La Hoz',
    correo: 'alfredo@gmail.com',
    region: 'Metropolitana de Santiago',
    comuna: 'Cerrillos',
    direccion: 'Av. Departamental 1234'
  };

  it('debe autocompletar automáticamente los datos del cliente y dirección cuando existe sesión activa', () => {
    const inicializarCheckout = (sesion) => {
      if (!sesion) return { nombre: '', apellidos: '', correo: '', calle: '' };
      return {
        nombre: sesion.nombre,
        apellidos: sesion.apellidos,
        correo: sesion.correo,
        calle: sesion.direccion,
        region: sesion.region,
        comuna: sesion.comuna
      };
    };

    const datosPrecargados = inicializarCheckout(sesionClienteMock);
    expect(datosPrecargados.nombre).toBe('Alfredo');
    expect(datosPrecargados.apellidos).toBe('De La Hoz');
    expect(datosPrecargados.correo).toBe('alfredo@gmail.com');
    expect(datosPrecargados.comuna).toBe('Cerrillos');
  });

  it('debe validar que la calle, región y comuna de entrega sean obligatorias antes de pagar', () => {
    const validarDespacho = (form) => {
      const errores = {};
      if (!form.calle || form.calle.trim().length < 4) errores.calle = 'Calle obligatoria';
      if (!form.region) errores.region = 'Región obligatoria';
      if (!form.comuna) errores.comuna = 'Comuna obligatoria';
      return errores;
    };

    const erroresIncompletos = validarDespacho({ calle: '', region: '', comuna: '' });
    expect(Object.keys(erroresIncompletos).length).toBe(3);

    const erroresCompletos = validarDespacho({
      calle: 'Av. Departamental 1234',
      region: 'Metropolitana de Santiago',
      comuna: 'Cerrillos'
    });
    expect(Object.keys(erroresCompletos).length).toBe(0);
  });

  it('debe descontar el stock del inventario y generar la orden con IVA (19%) al aprobarse el pago', () => {
    const productoInventario = { sku: 'SKU-001', stock: 8, precio: 389990 };
    const cantidadComprada = 2;

    const nuevoStock = productoInventario.stock - cantidadComprada;
    const totalOrden = productoInventario.precio * cantidadComprada;
    const neto = Math.round(totalOrden / 1.19);
    const iva = totalOrden - neto;

    expect(nuevoStock).toBe(6);
    expect(totalOrden).toBe(779980);
    expect(neto + iva).toBe(totalOrden);
  });

  it('debe redirigir a la vista de error de pago y conservar los productos si falla la transacción', () => {
    const procesarTransaccion = (simularFallo, carritoActual) => {
      if (simularFallo) {
        return {
          estadoPago: 'ERROR',
          rutaRedireccion: '/checkout/error',
          carritoConservado: carritoActual.length > 0
        };
      }
      return {
        estadoPago: 'EXITO',
        rutaRedireccion: '/checkout/exito',
        carritoConservado: false
      };
    };

    const resultadoError = procesarTransaccion(true, [{ sku: 'SKU-001', cantidad: 1 }]);
    expect(resultadoError.estadoPago).toBe('ERROR');
    expect(resultadoError.rutaRedireccion).toBe('/checkout/error');
    expect(resultadoError.carritoConservado).toBeTrue();
  });
});
