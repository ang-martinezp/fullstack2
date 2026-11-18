import { useState, useEffect } from 'react';
import ProductoCard from '../components/ProductoCard';
import { obtenerProductos, buscarProductosPorNombre } from '../data/productos';
import { obtenerCategorias } from '../data/categorias';

function Productos() {
  const [categoriaActiva, setCategoriaActiva] = useState('todos');
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Cargar categorías oficiales desde el backend (GET /api/categorias)
  useEffect(() => {
    obtenerCategorias()
      .then((cats) => setCategorias(cats))
      .catch((err) => console.error('Error cargando categorías:', err));
  }, []);

  // Cargar productos o buscar por nombre (GET /api/productos o GET /api/productos/buscar?nombre=)
  useEffect(() => {
    let montado = true;
    setCargando(true);

    const tarea = terminoBusqueda.trim()
      ? buscarProductosPorNombre(terminoBusqueda)
      : obtenerProductos();

    tarea
      .then((data) => {
        if (montado) setProductos(data);
      })
      .catch((err) => console.error('Error cargando catálogo:', err))
      .finally(() => {
        if (montado) setCargando(false);
      });

    return () => { montado = false; };
  }, [terminoBusqueda]);

  const productosFiltrados = categoriaActiva === 'todos'
    ? productos
    : productos.filter((p) => p.categoria === categoriaActiva);

  return (
    <section className="mb-5">
      <div className="text-center mb-4">
        <h2 className="fw-bold text-navy">Catálogo de Productos</h2>
        <p className="text-muted">Tecnología, insumos y mantención con stock sincronizado.</p>
      </div>

      {/* Buscador de productos (GET /api/productos/buscar?nombre=) */}
      <div className="row justify-content-center mb-4">
        <div className="col-12 col-md-6">
          <div className="input-group shadow-sm">
            <span className="input-group-text bg-white border-end-0">
              <i className="bi bi-search text-muted"></i>
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Buscar por nombre (ej. Laptop, Teclado, Pasta)..."
              value={terminoBusqueda}
              onChange={(e) => setTerminoBusqueda(e.target.value)}
            />
            {terminoBusqueda && (
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={() => setTerminoBusqueda('')}
              >
                Limpiar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Pestañas de categorías dinámicas */}
      <div className="d-flex justify-content-center flex-wrap gap-2 mb-5">
        <button
          type="button"
          className={`btn btn-sm ${categoriaActiva === 'todos' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setCategoriaActiva('todos')}
        >
          <i className="bi bi-grid-fill me-1"></i> Todos
        </button>
        {categorias.map((cat) => (
          <button
            key={cat.slug}
            type="button"
            className={`btn btn-sm ${categoriaActiva === cat.slug ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setCategoriaActiva(cat.slug)}
          >
            <i className={`bi ${cat.icono} me-1`}></i> {cat.label}
          </button>
        ))}
      </div>

      {cargando ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2 text-muted">Consultando disponibilidad en API Gateway...</p>
        </div>
      ) : productosFiltrados.length === 0 ? (
        <div className="alert alert-info text-center">
          No se encontraron productos disponibles para este filtro o búsqueda.
        </div>
      ) : (
        <div className="row g-4">
          {productosFiltrados.map((producto) => (
            <ProductoCard key={producto.sku} producto={producto} />
          ))}
        </div>
      )}
    </section>
  );
}

export default Productos;