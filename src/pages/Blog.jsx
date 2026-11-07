import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ARTICULOS_BLOG } from '../data/blog';

function Blog() {
    useEffect(() => {
        document.title = 'Blog - LogisTrack Store';
    }, []);

    return (
        <section className="mb-5">
            <div className="text-center mb-4">
                <h1 className="fw-bold text-navy">Blog</h1>
                <p className="text-muted">Consejos y novedades para equipar tu empresa.</p>
            </div>

            <div className="row g-4">
                {ARTICULOS_BLOG.map((articulo) => (
                    <div className="col-12 col-md-6" key={articulo.id}>
                        <div className="card h-100 shadow-sm card-hover">
                            <div className="card-body d-flex flex-column">
                                <div className="d-flex align-items-center gap-2 mb-2">
                                    <i className={`bi ${articulo.icono} text-navy fs-4`}></i>
                                    <small className="text-muted">{articulo.fecha}</small>
                                </div>
                                <h2 className="h5 fw-bold text-navy">{articulo.titulo}</h2>
                                <p className="text-muted flex-grow-1">{articulo.resumen}</p>
                                <Link to={`/blog/${articulo.id}`} className="btn btn-brand align-self-start">
                                    Leer más <i className="bi bi-arrow-right ms-1"></i>
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default Blog;