import { useParams, Link } from 'react-router-dom';
import { obtenerProductos } from '../data/productos';
import { slugificarCategoria } from '../utils/categorias';
import ProductoCard from '../components/ProductoCard';

function CategoriaDetalle() {
    const { categoria } = useParams();
    const productos = obtenerProductos().filter(
        p => slugificarCategoria(p.categoriaLabel) === categoria
    );
    const label = productos[0]?.categoriaLabel;

    return (
        <section className="mb-5">
            <nav aria-label="breadcrumb" className="mb-3">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/categorias">Categorías</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">{label || categoria}</li>
                </ol>
            </nav>

            <div className="text-center mb-4">
                <h1 className="fw-bold text-navy">{label || 'Categoría'}</h1>
                <p className="text-muted">
                    {productos.length} producto{productos.length !== 1 ? 's' : ''} en esta categoría.
                </p>
            </div>

            {productos.length === 0 ? (
                <div className="alert alert-warning text-center">No encontramos productos en esta categoría.</div>
            ) : (
                <div className="row g-4">
                    {productos.map(producto => (
                        <ProductoCard producto={producto} key={producto.sku} />
                    ))}
                </div>
            )}
        </section>
    );
}

export default CategoriaDetalle;