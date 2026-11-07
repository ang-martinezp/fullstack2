import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ARTICULOS_BLOG } from '../data/blog';

function BlogDetalle() {
    const { id } = useParams();
    const articulo = ARTICULOS_BLOG.find((a) => a.id === id);

    useEffect(() => {
        document.title = articulo
            ? `${articulo.titulo} - LogisTrack Store`
            : 'Artículo no encontrado - LogisTrack Store';
    }, [articulo]);

    if (!articulo) {
        return (
            <div className="text-center py-5">
                <h2 className="text-navy fw-bold">Artículo no encontrado</h2>
                <Link to="/blog" className="btn btn-brand">Volver al blog</Link>
            </div>
        );
    }

    return (
        <article className="mx-auto" style={{ maxWidth: '760px' }}>
            <nav aria-label="breadcrumb" className="mb-3">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/blog">Blog</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">{articulo.titulo}</li>
                </ol>
            </nav>

            <div className="d-flex align-items-center gap-2 mb-2">
                <i className={`bi ${articulo.icono} text-navy fs-3`}></i>
                <small className="text-muted">{articulo.fecha}</small>
            </div>
            <h1 className="fw-bold text-navy mb-4">{articulo.titulo}</h1>
            <p className="text-muted" style={{ whiteSpace: 'pre-line', fontSize: '18px' }}>
                {articulo.contenido}
            </p>
        </article>
    );
}

export default BlogDetalle;