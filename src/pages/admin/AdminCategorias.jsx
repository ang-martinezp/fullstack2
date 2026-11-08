import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  obtenerCategorias,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria
} from '../../data/categorias';
import { obtenerProductos } from '../../data/productos';
import { obtenerRolActivo } from '../../data/usuarios';

const ICONOS_DISPONIBLES = [
  { valor: 'bi-tag', label: 'Etiqueta (Genérico)' },
  { valor: 'bi-laptop', label: 'Laptop / Tecnología' },
  { valor: 'bi-tools', label: 'Herramientas / Mantención' },
  { valor: 'bi-box-seam', label: 'Caja / Insumos' },
  { valor: 'bi-cpu', label: 'Procesador / Hardware' },
  { valor: 'bi-memory', label: 'Memoria' },
  { valor: 'bi-display', label: 'Pantalla / Monitor' },
  { valor: 'bi-keyboard', label: 'Teclado' }
];

function AdminCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [filtroTexto, setFiltroTexto] = useState('');
  const [rolActual, setRolActual] = useState(obtenerRolActivo());

  // Estado del Modal (Crear / Editar)
  const [modalAbierto, setModalAbierto] = useState(false);
  const [categoriaEditando, setCategoriaEditando] = useState(null);
  const [formData, setFormData] = useState({ label: '', descripcion: '', icono: 'bi-tag' });
  const [errorForm, setErrorForm] = useState('');

  // Estado de eliminación
  const [categoriaAEliminar, setCategoriaAEliminar] = useState(null);
  const [alertaExito, setAlertaExito] = useState('');

  const cargarDatos = () => {
    setCategorias(obtenerCategorias());
    setProductos(obtenerProductos());
    setRolActual(obtenerRolActivo());
  };

  useEffect(() => {
    cargarDatos();
    window.addEventListener('logistrack_rol_cambiado', cargarDatos);
    window.addEventListener('storage', cargarDatos);
    return () => {
      window.removeEventListener('logistrack_rol_cambiado', cargarDatos);
      window.removeEventListener('storage', cargarDatos);
    };
  }, []);

  const esAdmin = rolActual === 'Administrador';

  // Contar productos por categoría
  const contarProductosPorCategoria = (slug, label) => {
    return productos.filter(
      (p) =>
        (p.categoria && p.categoria.toLowerCase() === slug.toLowerCase()) ||
        (p.categoriaLabel && p.categoriaLabel.toLowerCase() === label.toLowerCase())
    ).length;
  };

  // Filtrado en vivo
  const categoriasFiltradas = categorias.filter((cat) => {
    const texto = filtroTexto.toLowerCase().trim();
    return (
      !texto ||
      cat.label.toLowerCase().includes(texto) ||
      cat.slug.toLowerCase().includes(texto) ||
      cat.descripcion?.toLowerCase().includes(texto)
    );
  });

  const abrirModalCrear = () => {
    setCategoriaEditando(null);
    setFormData({ label: '', descripcion: '', icono: 'bi-tag' });
    setErrorForm('');
    setModalAbierto(true);
  };

  const abrirModalEditar = (cat) => {
    setCategoriaEditando(cat);
    setFormData({
      label: cat.label || '',
      descripcion: cat.descripcion || '',
      icono: cat.icono || 'bi-tag'
    });
    setErrorForm('');
    setModalAbierto(true);
  };

  const handleGuardarCategoria = (e) => {
    e.preventDefault();
    if (!esAdmin) return;

    if (!formData.label.trim()) {
      setErrorForm('El nombre de la categoría es obligatorio.');
      return;
    }

    try {
      if (categoriaEditando) {
        actualizarCategoria(categoriaEditando.slug, formData);
        setAlertaExito(`Categoría "${formData.label}" actualizada con éxito.`);
      } else {
        crearCategoria(formData);
        setAlertaExito(`Categoría "${formData.label}" creada con éxito.`);
      }

      setModalAbierto(false);
      cargarDatos();
      setTimeout(() => setAlertaExito(''), 4000);
    } catch (err) {
      setErrorForm(err.message || 'Error al guardar la categoría.');
    }
  };

  const handleConfirmarEliminar = () => {
    if (!categoriaAEliminar || !esAdmin) return;

    eliminarCategoria(categoriaAEliminar.slug);
    setAlertaExito(`Categoría "${categoriaAEliminar.label}" eliminada correctamente.`);
    setCategoriaAEliminar(null);
    cargarDatos();
    setTimeout(() => setAlertaExito(''), 4000);
  };

  return (
    <div>
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb small">
          <li className="breadcrumb-item"><Link to="/admin">Dashboard</Link></li>
          <li className="breadcrumb-item active" aria-current="page">Categorías</li>
        </ol>
      </nav>

      {/* Alerta de notificación */}
      {alertaExito && (
        <div className="alert alert-success alert-dismissible fade show shadow-sm" role="alert">
          <i className="bi bi-check-circle-fill me-2"></i>
          {alertaExito}
          <button type="button" className="btn-close" onClick={() => setAlertaExito('')}></button>
        </div>
      )}

      {/* Encabezado y acción nuevo */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h5 className="fw-bold text-dark m-0">Gestión de Categorías</h5>
          <small className="text-muted">
            Total: <strong>{categorias.length}</strong> categorías para clasificación del catálogo
          </small>
        </div>

        {esAdmin && (
          <button
            type="button"
            className="btn btn-primary btn-sm d-flex align-items-center gap-1"
            onClick={abrirModalCrear}
          >
            <i className="bi bi-plus-circle"></i> Nueva Categoría
          </button>
        )}
      </div>

      {/* Barra de Búsqueda */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body p-3">
          <div className="input-group input-group-sm">
            <span className="input-group-text bg-white border-end-0">
              <i className="bi bi-search text-muted"></i>
            </span>
            <input
              type="text"
              className="form-control border-start-0 ps-0"
              placeholder="Buscar categoría por nombre o descripción..."
              value={filtroTexto}
              onChange={(e) => setFiltroTexto(e.target.value)}
            />
            {filtroTexto && (
              <button className="btn btn-outline-secondary" type="button" onClick={() => setFiltroTexto('')}>
                <i className="bi bi-x"></i>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabla de Categorías */}
      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-3" style={{ width: '60px' }}>Icono</th>
                  <th>Categoría</th>
                  <th>Identificador (Slug)</th>
                  <th>Descripción</th>
                  <th className="text-center">Productos Asociados</th>
                  <th className="text-end pe-3" style={{ width: '130px' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {categoriasFiltradas.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-5 text-muted">
                      <i className="bi bi-tags fs-1 d-block text-secondary mb-2"></i>
                      No se encontraron categorías registradas.
                    </td>
                  </tr>
                ) : (
                  categoriasFiltradas.map((cat) => {
                    const cantProductos = contarProductosPorCategoria(cat.slug, cat.label);
                    return (
                      <tr key={cat.slug}>
                        <td className="ps-3 text-center">
                          <div className="bg-primary bg-opacity-10 text-primary p-2 rounded-3 d-inline-block">
                            <i className={`bi ${cat.icono || 'bi-tag'} fs-5`}></i>
                          </div>
                        </td>
                        <td>
                          <span className="fw-semibold text-dark">{cat.label}</span>
                        </td>
                        <td>
                          <code className="text-secondary">{cat.slug}</code>
                        </td>
                        <td className="text-muted small" style={{ maxWidth: '320px' }}>
                          {cat.descripcion || <span className="fst-italic text-secondary">Sin descripción</span>}
                        </td>
                        <td className="text-center">
                          <span className="badge bg-secondary-subtle text-secondary border px-3 py-1">
                            {cantProductos} ítem(s)
                          </span>
                        </td>
                        <td className="text-end pe-3">
                          <div className="btn-group btn-group-sm">
                            {esAdmin ? (
                              <>
                                <button
                                  type="button"
                                  className="btn btn-outline-primary"
                                  title="Editar Categoría"
                                  onClick={() => abrirModalEditar(cat)}
                                >
                                  <i className="bi bi-pencil-square"></i>
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-outline-danger"
                                  title="Eliminar Categoría"
                                  onClick={() => setCategoriaAEliminar({ ...cat, cantProductos })}
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </>
                            ) : (
                              <span className="text-muted small">Solo lectura</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de Crear / Editar Categoría */}
      {modalAbierto && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header bg-primary text-white">
                <h6 className="modal-title fw-bold">
                  <i className={`bi ${categoriaEditando ? 'bi-pencil-square' : 'bi-plus-circle'} me-2`}></i>
                  {categoriaEditando ? 'Editar Categoría' : 'Nueva Categoría'}
                </h6>
                <button type="button" className="btn-close btn-close-white" onClick={() => setModalAbierto(false)}></button>
              </div>

              <form onSubmit={handleGuardarCategoria}>
                <div className="modal-body py-4">
                  {errorForm && (
                    <div className="alert alert-danger py-2 small mb-3">{errorForm}</div>
                  )}

                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Nombre de la Categoría *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Ej: Insumos de Red"
                      value={formData.label}
                      onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Icono Representativo</label>
                    <select
                      className="form-select"
                      value={formData.icono}
                      onChange={(e) => setFormData({ ...formData, icono: e.target.value })}
                    >
                      {ICONOS_DISPONIBLES.map((ico) => (
                        <option key={ico.valor} value={ico.valor}>
                          {ico.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Descripción</label>
                    <textarea
                      rows="3"
                      className="form-control"
                      placeholder="Breve descripción del tipo de productos incluidos..."
                      value={formData.descripcion}
                      onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    ></textarea>
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setModalAbierto(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary btn-sm fw-semibold">
                    <i className="bi bi-save me-1"></i>
                    {categoriaEditando ? 'Actualizar Categoría' : 'Crear Categoría'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmar Eliminación */}
      {categoriaAEliminar && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header bg-danger text-white">
                <h6 className="modal-title fw-bold">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i> Confirmar Eliminación
                </h6>
                <button type="button" className="btn-close btn-close-white" onClick={() => setCategoriaAEliminar(null)}></button>
              </div>

              <div className="modal-body py-4">
                <p className="mb-1">¿Estás seguro de que deseas eliminar la categoría:</p>
                <div className="p-3 bg-light rounded mt-2 border">
                  <strong className="text-dark">{categoriaAEliminar.label}</strong>
                  <div className="small text-muted font-monospace mt-1">Slug: {categoriaAEliminar.slug}</div>
                </div>

                {categoriaAEliminar.cantProductos > 0 && (
                  <div className="alert alert-warning py-2 small mt-3 mb-0">
                    <i className="bi bi-exclamation-circle me-1"></i>
                    <strong>Advertencia:</strong> Esta categoría tiene <strong>{categoriaAEliminar.cantProductos}</strong> producto(s) asignado(s).
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setCategoriaAEliminar(null)}>
                  Cancelar
                </button>
                <button type="button" className="btn btn-danger btn-sm fw-semibold" onClick={handleConfirmarEliminar}>
                  <i className="bi bi-trash me-1"></i> Sí, Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminCategorias;
