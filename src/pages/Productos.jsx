import { useState } from 'react';
import ProductoCard from '../components/ProductoCard';
import { obtenerProductosPorCategoria } from '../data/productos';

const CATEGORIAS = [
  { valor: 'todos', etiqueta: 'Todos', icono: 'bi-grid-fill' },
  { valor: 'tecnologia', etiqueta: 'Tecnología', icono: 'bi-cpu' },
  { valor: 'insumos', etiqueta: 'Insumos', icono: 'bi-box' },
  { valor: 'mantencion', etiqueta: 'Mantención', icono: 'bi-tools' },
];

function Productos() {
  const [categoriaActiva, setCategoriaActiva] = useState('todos');
  const productos = obtenerProductosPorCategoria(categoriaActiva);

  return (
    <section className="mb-5">
      <div className="text-center mb-4">
        <h2 className="fw-bold text-navy">Catálogo de Productos</h2>
        <p className="text-muted">Tecnología, insumos y mantención para tu empresa.</p>
      </div>

      <div className="d-flex justify-content-center flex-wrap gap-2 mb-5">
        {CATEGORIAS.map((cat) => (
          <button
            key={cat.valor}
            type="button"
            className={`btn btn-sm ${categoriaActiva === cat.valor ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setCategoriaActiva(cat.valor)}
          >
            <i className={`bi ${cat.icono} me-1`}></i> {cat.etiqueta}
          </button>
        ))}
      </div>

      <div className="row g-4">
        {productos.map((producto) => (
          <ProductoCard key={producto.sku} producto={producto} />
        ))}
      </div>
    </section>
  );
}

export default Productos;