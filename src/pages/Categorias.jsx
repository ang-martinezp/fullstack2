import { Link } from 'react-router-dom';
import { obtenerProductos } from '../data/productos';
import { slugificarCategoria } from '../utils/categorias';

function Categorias() {
    const productos = obtenerProductos();

    const labelsUnicos = [...new Set(productos.map(p => p.categoriaLabel))];
    const categorias = labelsUnicos.map(label => ({
        slug: slugificarCategoria(label),
        label,
        cantidad: productos.filter(p => p.categoriaLabel === label).length
    }));

    return (
        <section className="mb-5">
            <div className="text-center mb-4">
                <h1 className="fw-bold text-navy">Categorías</h1>
                <p className="text-muted">Explora el catálogo por categoría.</p>
            </div>
            <div className="row g-4">
                {categorias.map(cat => (
                    <div className="col-12 col-md-4" key={cat.slug}>
                        <Link to={`/categorias/${cat.slug}`} className="text-decoration-none">
                            <div className="card h-100 p-4 border-0 shadow-sm rounded-4 text-center card-hover">
                                <i className="bi bi-grid display-4 text-navy mb-3"></i>
                                <h2 className="h5 fw-bold text-navy mb-1">{cat.label}</h2>
                                <p className="text-muted mb-0">
                                    {cat.cantidad} producto{cat.cantidad !== 1 ? 's' : ''}
                                </p>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default Categorias;