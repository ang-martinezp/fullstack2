import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { obtenerProductosPorCategoria } from '../data/productos';
import ProductoCard from '../components/ProductoCard';

function CategoriaDetalle() {
  const { categoria } = useParams();
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let montado = true;
    setCargando(true);

    obtenerProductosPorCategoria(categoria)
      .then((data) => {
        if (montado) setProductos(data);
      })
      .catch((err) => console.error('Error cargando categoría:', err))
      .finally(() => {
        if (montado) setCargando(false);
      });

    return () => { montado = false; };
  }, [categoria]);

  const label = productos[0]?.categoriaLabel || categoria;

  return (
    <section className="mb-5">
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/categorias">Categorías</Link></li>
          <li className="breadcrumb-item active text-capitalize" aria-current="page">{label}</li>
        </ol>
      </nav>

      <div className="text-center mb-4">
        <h1 className="fw-bold text-navy text-capitalize">{label}</h1>
        <p className="text-muted">{productos.length} producto(s) en esta categoría.</p>
      </div>

      {cargando ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2 text-muted">Cargando productos de la categoría...</p>
        </div>
      ) : productos.length === 0 ? (
        <div className="alert alert-warning text-center">No encontramos productos en esta categoría.</div>
      ) : (
        <div className="row g-4">
          {productos.map((producto) => (
            <ProductoCard producto={producto} key={producto.sku} />
          ))}
        </div>
      )}
    </section>
  );
}

export default CategoriaDetalle;