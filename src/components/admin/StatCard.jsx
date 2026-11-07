import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Componente reutilizable para tarjetas de métricas / KPI.
 * 
 * @param {string} titulo - Título descriptivo de la métrica
 * @param {string|number} valor - Valor a mostrar
 * @param {string} icono - Clase de Bootstrap Icon (ej: 'bi-boxes')
 * @param {string} [colorIcono='text-primary'] - Clase de color (ej: 'text-warning')
 * @param {string} [subtexto] - Detalle o variación porcentual
 * @param {string} [enlace] - Ruta a la que redirige al hacer clic
 */
function StatCard({ titulo, valor, icono, colorIcono = 'text-primary', subtexto, enlace }) {
  const contenido = (
    <div className="card shadow-sm border-0 h-100 card-hover">
      <div className="card-body d-flex align-items-center justify-content-between p-3">
        <div>
          <span className="text-muted small text-uppercase fw-semibold">{titulo}</span>
          <h3 className="fw-bold my-1 text-dark">{valor}</h3>
          {subtexto && <small className="text-secondary">{subtexto}</small>}
        </div>
        <div className={`fs-1 ${colorIcono} opacity-75`}>
          <i className={`bi ${icono}`}></i>
        </div>
      </div>
    </div>
  );

  if (enlace) {
    return (
      <Link to={enlace} className="text-decoration-none">
        {contenido}
      </Link>
    );
  }

  return contenido;
}

export default StatCard;
