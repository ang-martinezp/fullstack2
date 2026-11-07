export function slugificarCategoria(categoriaLabel) {
    return categoriaLabel
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // quita tildes
        .replace(/\s+/g, '-');
}