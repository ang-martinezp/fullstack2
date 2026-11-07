import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  obtenerProductoPorSku,
  crearProducto,
  actualizarProducto
} from '../../data/productos';
import { obtenerCategorias } from '../../data/categorias';
import { obtenerRolActivo } from '../../data/usuarios';

function AdminProductoForm() {
  const { sku } = useParams();
  const navigate = useNavigate();
  const esEdicion = Boolean(sku);

  const [rolActual] = useState(obtenerRolActivo());
  const esAdmin = rolActual === 'Administrador';

  const [categorias, setCategorias] = useState([]);
  const [formData, setFormData] = useState({
    sku: '',
    nombre: '',
    categoria: '',
    categoriaLabel: '',
    precio: '',
    stock: '',
    stockCritico: '5',
    descripcion: '',
    descripcionLarga: '',
    icono: 'bi-box-seam',
    oferta: false,
    descuento: ''
  });

  const [errores, setErrores] = useState({});
  const [errorGlobal, setErrorGlobal] = useState('');
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    const cats = obtenerCategorias();
    setCategorias(cats);

    if (esEdicion) {
      const prod = obtenerProductoPorSku(sku);
      if (prod) {
        setFormData({
          sku: prod.sku || prod.codigo || '',
          nombre: prod.nombre || '',
          categoria: prod.categoria || (cats[0]?.slug || ''),
          categoriaLabel: prod.categoriaLabel || '',
          precio: String(prod.precio || ''),
          stock: String(prod.stock !== undefined ? prod.stock : ''),
          stockCritico: String(prod.stockCritico !== undefined ? prod.stockCritico : '5'),
          descripcion: prod.descripcion || '',
          descripcionLarga: prod.descripcionLarga || '',
          icono: prod.icono || 'bi-box-seam',
          oferta: Boolean(prod.oferta),
          descuento: prod.descuento ? String(prod.descuento) : ''
        });
      } else {
        setErrorGlobal(`No se encontró ningún producto con el SKU "${sku}".`);
      }
    } else {
      if (cats.length > 0) {
        setFormData((prev) => ({
          ...prev,
          categoria: cats[0].slug,
          categoriaLabel: cats[0].label
        }));
      }
    }
  }, [sku, esEdicion]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => {
      const nuevoValor = type === 'checkbox' ? checked : value;
      let label = prev.categoriaLabel;

      if (name === 'categoria') {
        const catObj = categorias.find((c) => c.slug === value);
        label = catObj ? catObj.label : value;
      }

      return {
        ...prev,
        [name]: nuevoValor,
        ...(name === 'categoria' ? { categoriaLabel: label } : {})
      };
    });

    // Limpiar error específico del campo al escribir
    if (errores[name]) {
      setErrores((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formData.sku.trim()) {
      nuevosErrores.sku = 'El código / SKU es obligatorio.';
    } else if (formData.sku.trim().length < 3) {
      nuevosErrores.sku = 'El SKU debe tener al menos 3 caracteres.';
    }

    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre del producto es obligatorio.';
    } else if (formData.nombre.trim().length < 3) {
      nuevosErrores.nombre = 'El nombre debe tener al menos 3 caracteres.';
    }

    if (!formData.categoria) {
      nuevosErrores.categoria = 'Debes seleccionar una categoría.';
    }

    const precioNum = Number(formData.precio);
    if (!formData.precio || isNaN(precioNum) || precioNum <= 0) {
      nuevosErrores.precio = 'El precio debe ser un número mayor a 0.';
    }

    const stockNum = Number(formData.stock);
    if (formData.stock === '' || isNaN(stockNum) || stockNum < 0) {
      nuevosErrores.stock = 'El stock debe ser un número entero mayor o igual a 0.';
    }

    const stockCriticoNum = Number(formData.stockCritico);
    if (formData.stockCritico === '' || isNaN(stockCriticoNum) || stockCriticoNum < 0) {
      nuevosErrores.stockCritico = 'El stock crítico debe ser mayor o igual a 0.';
    }

    if (formData.oferta) {
      const descNum = Number(formData.descuento);
      if (!formData.descuento || isNaN(descNum) || descNum <= 0 || descNum >= 100) {
        nuevosErrores.descuento = 'El descuento debe ser un porcentaje entre 1 y 99%.';
      }
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!esAdmin) {
      setErrorGlobal('Modo Vendedor: No tienes permisos para crear o modificar productos.');
      return;
    }

    if (!validarFormulario()) {
      setErrorGlobal('Por favor corrige los campos marcados en rojo antes de continuar.');
      return;
    }

    try {
      setGuardando(true);
      setErrorGlobal('');

      const productoPayload = {
        sku: formData.sku.trim().toUpperCase(),
        codigo: formData.sku.trim().toUpperCase(),
        nombre: formData.nombre.trim(),
        categoria: formData.categoria,
        categoriaLabel: formData.categoriaLabel || formData.categoria,
        precio: Number(formData.precio),
        stock: parseInt(formData.stock, 10),
        stockCritico: parseInt(formData.stockCritico, 10),
        descripcion: formData.descripcion.trim(),
        descripcionLarga: formData.descripcionLarga.trim() || formData.descripcion.trim(),
        icono: formData.icono || 'bi-box-seam',
        oferta: formData.oferta,
        descuento: formData.oferta ? Number(formData.descuento) : 0
      };

      if (esEdicion) {
        actualizarProducto(sku, productoPayload);
      } else {
        crearProducto(productoPayload);
      }

      navigate('/admin/productos', { replace: true });
    } catch (err) {
      setErrorGlobal(err.message || 'Ocurrió un error al guardar el producto.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div>
      {/* Breadcrumb de navegación */}
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb small">
          <li className="breadcrumb-item"><Link to="/admin">Dashboard</Link></li>
          <li className="breadcrumb-item"><Link to="/admin/productos">Productos</Link></li>
          <li className="breadcrumb-item active" aria-current="page">
            {esEdicion ? `Editar (${sku})` : 'Nuevo Producto'}
          </li>
        </ol>
      </nav>

      <div className="card shadow-sm border-0">
        <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
          <h6 className="fw-bold text-dark m-0">
            <i className={`bi ${esEdicion ? 'bi-pencil-square' : 'bi-plus-circle'} me-2 text-primary`}></i>
            {esEdicion ? `Ficha de Edición: ${formData.nombre || sku}` : 'Registro de Nuevo Producto'}
          </h6>
          <span className="text-muted small">* Campos obligatorios</span>
        </div>

        <div className="card-body p-4">
          {errorGlobal && (
            <div className="alert alert-danger py-2 px-3 small d-flex align-items-center gap-2 mb-4" role="alert">
              <i className="bi bi-exclamation-triangle-fill fs-5"></i>
              <div>{errorGlobal}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="row g-3">
              {/* Código SKU */}
              <div className="col-12 col-md-4">
                <label className="form-label fw-semibold small">Código / SKU *</label>
                <input
                  type="text"
                  name="sku"
                  className={`form-control font-monospace ${errores.sku ? 'is-invalid' : ''}`}
                  placeholder="Ej: SKU-010"
                  value={formData.sku}
                  onChange={handleChange}
                  disabled={esEdicion || !esAdmin}
                />
                {errores.sku && <div className="invalid-feedback">{errores.sku}</div>}
                {esEdicion && <small className="text-muted">El código es la clave primaria y no se puede modificar.</small>}
              </div>

              {/* Nombre */}
              <div className="col-12 col-md-5">
                <label className="form-label fw-semibold small">Nombre del Producto *</label>
                <input
                  type="text"
                  name="nombre"
                  className={`form-control ${errores.nombre ? 'is-invalid' : ''}`}
                  placeholder="Ej: Teclado Mecánico RGB"
                  value={formData.nombre}
                  onChange={handleChange}
                  disabled={!esAdmin}
                />
                {errores.nombre && <div className="invalid-feedback">{errores.nombre}</div>}
              </div>

              {/* Categoría */}
              <div className="col-12 col-md-3">
                <label className="form-label fw-semibold small">Categoría *</label>
                <select
                  name="categoria"
                  className={`form-select ${errores.categoria ? 'is-invalid' : ''}`}
                  value={formData.categoria}
                  onChange={handleChange}
                  disabled={!esAdmin}
                >
                  <option value="">Selecciona una...</option>
                  {categorias.map((cat) => (
                    <option key={cat.slug} value={cat.slug}>
                      {cat.label}
                    </option>
                  ))}
                </select>
                {errores.categoria && <div className="invalid-feedback">{errores.categoria}</div>}
              </div>

              {/* Precio */}
              <div className="col-12 col-md-4">
                <label className="form-label fw-semibold small">Precio Unitario ($ CLP) *</label>
                <div className="input-group">
                  <span className="input-group-text">$</span>
                  <input
                    type="number"
                    name="precio"
                    min="1"
                    className={`form-control ${errores.precio ? 'is-invalid' : ''}`}
                    placeholder="Ej: 29990"
                    value={formData.precio}
                    onChange={handleChange}
                    disabled={!esAdmin}
                  />
                  {errores.precio && <div className="invalid-feedback">{errores.precio}</div>}
                </div>
              </div>

              {/* Stock Actual */}
              <div className="col-12 col-md-4">
                <label className="form-label fw-semibold small">Stock Actual (Unidades) *</label>
                <input
                  type="number"
                  name="stock"
                  min="0"
                  className={`form-control ${errores.stock ? 'is-invalid' : ''}`}
                  placeholder="Ej: 15"
                  value={formData.stock}
                  onChange={handleChange}
                  disabled={!esAdmin}
                />
                {errores.stock && <div className="invalid-feedback">{errores.stock}</div>}
              </div>

              {/* Stock Crítico */}
              <div className="col-12 col-md-4">
                <label className="form-label fw-semibold small">Umbral Stock Crítico *</label>
                <input
                  type="number"
                  name="stockCritico"
                  min="0"
                  className={`form-control ${errores.stockCritico ? 'is-invalid' : ''}`}
                  placeholder="Ej: 5"
                  value={formData.stockCritico}
                  onChange={handleChange}
                  disabled={!esAdmin}
                />
                {errores.stockCritico && <div className="invalid-feedback">{errores.stockCritico}</div>}
                <small className="text-muted">Alerta visual cuando el stock sea menor o igual a este valor.</small>
              </div>

              {/* Descripción Corta */}
              <div className="col-12">
                <label className="form-label fw-semibold small">Descripción Corta</label>
                <input
                  type="text"
                  name="descripcion"
                  className="form-control"
                  placeholder="Resumen para catálogos y tarjetas..."
                  value={formData.descripcion}
                  onChange={handleChange}
                  disabled={!esAdmin}
                />
              </div>

              {/* Descripción Larga */}
              <div className="col-12">
                <label className="form-label fw-semibold small">Descripción Detallada</label>
                <textarea
                  name="descripcionLarga"
                  rows="3"
                  className="form-control"
                  placeholder="Especificaciones técnicas completas del producto..."
                  value={formData.descripcionLarga}
                  onChange={handleChange}
                  disabled={!esAdmin}
                ></textarea>
              </div>

              {/* Oferta y Descuento */}
              <div className="col-12 col-md-6">
                <div className="form-check form-switch mt-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="ofertaCheck"
                    name="oferta"
                    checked={formData.oferta}
                    onChange={handleChange}
                    disabled={!esAdmin}
                  />
                  <label className="form-check-label fw-semibold small" htmlFor="ofertaCheck">
                    Producto en Oferta Promocional
                  </label>
                </div>
              </div>

              {formData.oferta && (
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold small">% Descuento *</label>
                  <div className="input-group">
                    <input
                      type="number"
                      name="descuento"
                      min="1"
                      max="99"
                      className={`form-control ${errores.descuento ? 'is-invalid' : ''}`}
                      placeholder="Ej: 15"
                      value={formData.descuento}
                      onChange={handleChange}
                      disabled={!esAdmin}
                    />
                    <span className="input-group-text">%</span>
                    {errores.descuento && <div className="invalid-feedback">{errores.descuento}</div>}
                  </div>
                </div>
              )}
            </div>

            {/* Botones de acción */}
            <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
              <Link to="/admin/productos" className="btn btn-outline-secondary btn-sm">
                Cancelar
              </Link>
              {esAdmin && (
                <button
                  type="submit"
                  className="btn btn-primary btn-sm fw-semibold d-flex align-items-center gap-1"
                  disabled={guardando}
                >
                  <i className="bi bi-save"></i>
                  {guardando ? 'Guardando...' : esEdicion ? 'Actualizar Producto' : 'Guardar Producto'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminProductoForm;
