import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { obtenerCategorias } from '../data/categorias';
import { obtenerProductos } from '../data/productos';

function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    Promise.all([obtenerCategorias(), obtenerProductos()])
      .then(([cats, prods]) => {
        const conCantidad = cats.map((cat) => ({
          ...cat,
          cantidad: prods.filter((p) => p.categoria === cat.slug).length
        }));
        setCategorias(conCantidad);
      })
      .catch((err) => console.error('Error cargando categorías:', err))
      .finally(() => setCargando(false));
  }, []);

  return (
    <section className="mb-5">
      <div className="text-center mb-4">
        <h1 className="fw-bold text-navy">Categorías</h1>
        <p className="text-muted">Explora el catálogo por categoría oficial.</p>
      </div>

      {cargando ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2 text-muted">Cargando categorías...</p>
        </div>
      ) : (
        <div className="row g-4">
          {categorias.map((cat) => (
            <div className="col-12 col-md-4" key={cat.slug}>
              <Link to={`/categorias/${cat.slug}`} className="text-decoration-none">
                <div className="card h-100 p-4 border-0 shadow-sm rounded-4 text-center card-hover">
                  <i className={`bi ${cat.icono} display-4 text-navy mb-3`}></i>
                  <h2 className="h5 fw-bold text-navy mb-1">{cat.label}</h2>
                  <p className="text-muted mb-0">
                    {cat.cantidad} producto{cat.cantidad !== 1 ? 's' : ''}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Categorias;