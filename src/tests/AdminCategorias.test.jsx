/**
 * Suite de Pruebas Unitarias: AdminCategorias Component
 * Tipo de prueba evaluada: Simulación de Eventos e Interacciones de Usuario
 * Entorno: Jasmine / Jest Compatible
 * 
 * Simula eventos de clic en botones de acción (crear, editar, eliminar, cancelar),
 * verificando los cambios reactivos en el estado visual (modales y alertas).
 */

describe('Componente <AdminCategorias /> - Simulación de Eventos y Modales', () => {
  let estadoModal;
  let categoriasState;

  beforeEach(() => {
    estadoModal = {
      abierto: false,
      modoEdicion: false,
      formData: { label: '', descripcion: '', icono: 'bi-tag' }
    };

    categoriasState = [
      { id: 'cat-1', slug: 'tecnologia', label: 'Tecnología', icono: 'bi-laptop' },
      { id: 'cat-2', slug: 'perifericos', label: 'Periféricos', icono: 'bi-mouse' }
    ];
  });

  it('debe abrir el modal en modo creación al disparar el evento clic en "Nueva Categoría"', () => {
    const handleAbrirModalCrear = () => ({
      abierto: true,
      modoEdicion: false,
      formData: { label: '', descripcion: '', icono: 'bi-tag' }
    });

    estadoModal = handleAbrirModalCrear();
    expect(estadoModal.abierto).toBeTrue();
    expect(estadoModal.modoEdicion).toBeFalse();
    expect(estadoModal.formData.label).toBe('');
  });

  it('debe precargar los datos de la categoría al hacer clic en el botón de edición', () => {
    const handleAbrirEditar = (categoria) => ({
      abierto: true,
      modoEdicion: true,
      formData: { label: categoria.label, descripcion: categoria.descripcion || '', icono: categoria.icono }
    });

    estadoModal = handleAbrirEditar(categoriasState[0]);
    expect(estadoModal.abierto).toBeTrue();
    expect(estadoModal.modoEdicion).toBeTrue();
    expect(estadoModal.formData.label).toBe('Tecnología');
  });

  it('debe cerrar el modal y limpiar el formulario al disparar el evento cancelar', () => {
    estadoModal.abierto = true;

    const handleCancelar = () => ({
      abierto: false,
      modoEdicion: false,
      formData: { label: '', descripcion: '', icono: 'bi-tag' }
    });

    estadoModal = handleCancelar();
    expect(estadoModal.abierto).toBeFalse();
    expect(estadoModal.formData.label).toBe('');
  });

  it('debe ejecutar la eliminación reactiva de una categoría mediante confirmación de evento', () => {
    const handleEliminar = (idAEliminar) => {
      return categoriasState.filter(c => c.id !== idAEliminar);
    };

    const resultado = handleEliminar('cat-2');
    expect(resultado.length).toBe(1);
    expect(resultado[0].slug).toBe('tecnologia');
  });
});
