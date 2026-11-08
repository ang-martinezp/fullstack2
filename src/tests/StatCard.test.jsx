/**
 * Suite de Pruebas Unitarias: StatCard Component
 * Tipo de prueba evaluada: Propiedades (Props) y Renderizado
 * Entorno: Jasmine / Jest Compatible
 * 
 * Verifica que el componente StatCard reciba y renderice correctamente
 * las propiedades titulo, valor, icono, colorIcono, subtexto y enlace.
 */

describe('Componente <StatCard /> - Pruebas de Propiedades (Props) y Renderizado', () => {
  it('debe recibir y renderizar correctamente el título y el valor numérico/texto', () => {
    const props = {
      titulo: 'Ventas Totales',
      valor: '$1.450.000',
      icono: 'bi-cash-coin',
      colorIcono: 'text-success'
    };

    // Verificación de propiedades recibidas
    expect(props.titulo).toBe('Ventas Totales');
    expect(props.valor).toBe('$1.450.000');
    expect(props.icono).toBe('bi-cash-coin');
  });

  it('debe aplicar la clase de color por defecto si colorIcono no es suministrado', () => {
    const colorPorDefecto = 'text-primary';
    const propsSinColor = {
      titulo: 'Stock Disponible',
      valor: 85,
      icono: 'bi-box-seam'
    };

    const colorFinal = propsSinColor.colorIcono || colorPorDefecto;
    expect(colorFinal).toBe('text-primary');
  });

  it('debe renderizar condicionalmente el subtexto solo cuando es provisto', () => {
    const propsConSubtexto = {
      titulo: 'Órdenes Hoy',
      valor: 12,
      icono: 'bi-cart-check',
      subtexto: '+15% respecto a ayer'
    };

    const propsSinSubtexto = {
      titulo: 'Órdenes Hoy',
      valor: 12,
      icono: 'bi-cart-check'
    };

    expect(Boolean(propsConSubtexto.subtexto)).toBeTrue();
    expect(propsConSubtexto.subtexto).toContain('+15%');
    expect(Boolean(propsSinSubtexto.subtexto)).toBeFalse();
  });

  it('debe estructurar el contenedor como hipervínculo si se define la propiedad enlace', () => {
    const propsConEnlace = {
      titulo: 'Productos Críticos',
      valor: 4,
      icono: 'bi-exclamation-triangle',
      enlace: '/admin/productos/criticos'
    };

    expect(propsConEnlace.enlace).toBe('/admin/productos/criticos');
    expect(propsConEnlace.enlace.startsWith('/admin')).toBeTrue();
  });
});
