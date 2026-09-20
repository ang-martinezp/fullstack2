/**
 * regiones-comunas.js
 * Arreglo JS compartido de regiones y comunas de Chile
 * Evaluación Parcial N° 1 - DSY1104 Desarrollo FullStack II
 * Bloque: Cuentas · Formularios (Alfredo De La Hoz)
 * 
 * Reutilizable tanto en el registro de clientes como en el mantenedor de usuarios del panel administrador.
 */

const REGIONES_Y_COMUNAS = [
    {
        region: "Arica y Parinacota",
        comunas: ["Arica", "Camarones", "Putre", "General Lagos"]
    },
    {
        region: "Tarapacá",
        comunas: ["Iquique", "Alto Hospicio", "Pozo Almonte", "Camiña", "Colchane", "Huara", "Pica"]
    },
    {
        region: "Antofagasta",
        comunas: ["Antofagasta", "Mejillones", "Sierra Gorda", "Taltal", "Calama", "Ollagüe", "San Pedro de Atacama", "Tocopilla", "María Elena"]
    },
    {
        region: "Atacama",
        comunas: ["Copiapó", "Caldera", "Tierra Amarilla", "Chañaral", "Diego de Almagro", "Vallenar", "Alto del Carmen", "Freirina", "Huasco"]
    },
    {
        region: "Coquimbo",
        comunas: ["La Serena", "Coquimbo", "Andacollo", "La Higuera", "Paihuano", "Vicuña", "Illapel", "Canela", "Los Vilos", "Salamanca", "Ovalle", "Combarbalá", "Monte Patria", "Punitaqui", "Río Hurtado"]
    },
    {
        region: "Valparaíso",
        comunas: ["Valparaíso", "Viña del Mar", "Concón", "Quilpué", "Villa Alemana", "Limache", "Olmué", "Quillota", "La Calera", "Hijuelas", "La Cruz", "Nogales", "San Antonio", "Cartagena", "El Quisco", "El Tabo", "Santo Domingo", "Algarrobo", "San Felipe", "Llaillay", "Putaendo", "Santa María", "Catemu", "Panquehue", "Los Andes", "Calle Larga", "Rinconada", "San Esteban", "Isla de Pascua", "Juan Fernández"]
    },
    {
        region: "Metropolitana de Santiago",
        comunas: [
            "Santiago", "Cerrillos", "Cerro Navia", "Conchalí", "El Bosque", "Estación Central",
            "Huechuraba", "Independencia", "La Cisterna", "La Florida", "La Granja", "La Pintana",
            "La Reina", "Las Condes", "Lo Barnechea", "Lo Espejo", "Lo Prado", "Macul", "Maipú",
            "Ñuñoa", "Pedro Aguirre Cerda", "Peñalolén", "Providencia", "Pudahuel", "Quilicura",
            "Quinta Normal", "Recoleta", "Renca", "San Joaquín", "San Miguel", "San Ramón",
            "Vitacura", "Puente Alto", "Pirque", "San José de Maipo", "Colina", "Lampa", "Tiltil",
            "San Bernardo", "Buin", "Calera de Tango", "Paine", "Melipilla", "Alhué", "Curacaví",
            "María Pinto", "San Pedro", "Talagante", "El Monte", "Isla de Maipo", "Padre Hurtado", "Peñaflor"
        ]
    },
    {
        region: "Libertador Gral. Bernardo O'Higgins",
        comunas: ["Rancagua", "Codegua", "Coinco", "Coltauco", "Doñihue", "Graneros", "Las Cabras", "Machalí", "Malloa", "Mostazal", "Olivar", "Peumo", "Pichidegua", "Quinta de Tilcoco", "Rengo", "Requínoa", "San Vicente", "Pichilemu", "La Estrella", "Litueche", "Marchihue", "Navidad", "Paredones", "San Fernando", "Chépica", "Chimbarongo", "Lolol", "Nancagua", "Palmilla", "Peralillo", "Placilla", "Pumanque", "Santa Cruz"]
    },
    {
        region: "Maule",
        comunas: ["Talca", "Constitución", "Curepto", "Empedrado", "Maule", "Pelarco", "Pencahue", "Río Claro", "San Clemente", "San Rafael", "Cauquenes", "Chanco", "Pelluhue", "Curicó", "Hualañé", "Licantén", "Molina", "Rauco", "Romeral", "Sagrada Familia", "Teno", "Vichuquén", "Linares", "Colbún", "Longaví", "Parral", "Retiro", "San Javier", "Villa Alegre", "Yerbas Buenas"]
    },
    {
        region: "Ñuble",
        comunas: ["Chillán", "Bulnes", "Chillán Viejo", "El Carmen", "Pemuco", "Pinto", "Quillón", "San Ignacio", "Yungay", "Quirihue", "Cobquecura", "Coelemu", "Ninhue", "Portezuelo", "Ránquil", "Trehuaco", "San Carlos", "Coihueco", "Ñiquén", "San Fabián", "San Nicolás"]
    },
    {
        region: "Biobío",
        comunas: ["Concepción", "Coronel", "Chiguayante", "Florida", "Hualqui", "Lota", "Penco", "San Pedro de la Paz", "Santa Juana", "Talcahuano", "Tomé", "Hualpén", "Lebu", "Arauco", "Cañete", "Contulmo", "Curanilahue", "Los Álamos", "Tirúa", "Los Ángeles", "Antuco", "Cabrero", "Laja", "Mulchén", "Nacimiento", "Negrete", "Quilaco", "Quilleco", "San Rosendo", "Santa Bárbara", "Tucapel", "Yumbel", "Alto Biobío"]
    },
    {
        region: "La Araucanía",
        comunas: ["Temuco", "Carahue", "Cunco", "Curarrehue", "Freire", "Galvarino", "Gorbea", "Lautaro", "Loncoche", "Melipeuco", "Nueva Imperial", "Padre Las Casas", "Perquenco", "Pitrufquén", "Pucón", "Saavedra", "Teodoro Schmidt", "Toltén", "Vilcún", "Villarrica", "Cholchol", "Angol", "Collipulli", "Curacautín", "Ercilla", "Lonquimay", "Los Sauces", "Lumaco", "Purén", "Renaico", "Traiguén", "Victoria"]
    },
    {
        region: "Los Ríos",
        comunas: ["Valdivia", "Corral", "Lanco", "Los Lagos", "Máfil", "Mariquina", "Paillaco", "Panguipulli", "La Unión", "Futrono", "Lago Ranco", "Río Bueno"]
    },
    {
        region: "Los Lagos",
        comunas: ["Puerto Montt", "Calbuco", "Cochamó", "Fresia", "Frutillar", "Los Muermos", "Llanquihue", "Maullín", "Puerto Varas", "Castro", "Ancud", "Chonchi", "Curaco de Vélez", "Dalcahue", "Puqueldón", "Queilén", "Quellón", "Quemchi", "Quinchao", "Osorno", "Puerto Octay", "Purranque", "Puyehue", "Río Negro", "San Juan de la Costa", "San Pablo", "Chaitén", "Futaleufú", "Hualaihué", "Palena"]
    },
    {
        region: "Aysén del Gral. Carlos Ibáñez del Campo",
        comunas: ["Coyhaique", "Lago Verde", "Aysén", "Cisnes", "Guaitecas", "Cochrane", "O'Higgins", "Tortel", "Chile Chico", "Río Ibáñez"]
    },
    {
        region: "Magallanes y de la Antártica Chilena",
        comunas: ["Punta Arenas", "Laguna Blanca", "Río Verde", "San Gregorio", "Cabo de Hornos", "Antártica", "Porvenir", "Primavera", "Timaukel", "Natales", "Torres del Paine"]
    }
];

/**
 * Obtiene la lista con los nombres de todas las regiones disponibles.
 * @returns {string[]}
 */
function obtenerNombresRegiones() {
    return REGIONES_Y_COMUNAS.map(item => item.region);
}

/**
 * Retorna las comunas pertenecientes a la región dada.
 * @param {string} nombreRegion 
 * @returns {string[]}
 */
function obtenerComunasPorRegion(nombreRegion) {
    const encontrada = REGIONES_Y_COMUNAS.find(
        item => item.region.toLowerCase() === (nombreRegion || '').trim().toLowerCase()
    );
    return encontrada ? encontrada.comunas : [];
}

/**
 * Configura y vincula dinámicamente dos elementos select (Región y Comuna).
 * Al cambiar de región, se vacía y repuebla automáticamente el select de comunas.
 * 
 * @param {HTMLSelectElement|string} selectRegion - Elemento select o su ID
 * @param {HTMLSelectElement|string} selectComuna - Elemento select o su ID
 * @param {string} [regionInicial=""] - Región preseleccionada (opcional)
 * @param {string} [comunaInicial=""] - Comuna preseleccionada (opcional)
 */
function configurarSelectsRegionComuna(selectRegion, selectComuna, regionInicial = "", comunaInicial = "") {
    const elRegion = typeof selectRegion === 'string' ? document.getElementById(selectRegion) : selectRegion;
    const elComuna = typeof selectComuna === 'string' ? document.getElementById(selectComuna) : selectComuna;

    if (!elRegion || !elComuna) return;

    // Poblar regiones
    elRegion.innerHTML = '<option value="">-- Seleccione una región --</option>';
    REGIONES_Y_COMUNAS.forEach(item => {
        const option = document.createElement('option');
        option.value = item.region;
        option.textContent = item.region;
        if (regionInicial && item.region.toLowerCase() === regionInicial.toLowerCase()) {
            option.selected = true;
        }
        elRegion.appendChild(option);
    });

    // Función interna para actualizar las comunas
    const actualizarComunas = (regionSeleccionada, seleccionPrevia = "") => {
        elComuna.innerHTML = '<option value="">-- Seleccione una comuna --</option>';
        if (!regionSeleccionada) {
            elComuna.disabled = true;
            return;
        }

        const comunas = obtenerComunasPorRegion(regionSeleccionada);
        if (comunas.length > 0) {
            elComuna.disabled = false;
            comunas.forEach(comuna => {
                const option = document.createElement('option');
                option.value = comuna;
                option.textContent = comuna;
                if (seleccionPrevia && comuna.toLowerCase() === seleccionPrevia.toLowerCase()) {
                    option.selected = true;
                }
                elComuna.appendChild(option);
            });
        } else {
            elComuna.disabled = true;
        }
    };

    // Si ya había una región inicial seleccionada, poblar sus comunas
    if (regionInicial) {
        actualizarComunas(regionInicial, comunaInicial);
    } else {
        elComuna.disabled = true;
    }

    // Escuchar cambios en la región
    elRegion.addEventListener('change', () => {
        actualizarComunas(elRegion.value);
        // Limpiar validaciones si existen
        if (typeof limpiarValidacion === 'function') {
            limpiarValidacion(elComuna);
        }
    });
}

// Exponer en objeto window si está en entorno navegador
if (typeof window !== 'undefined') {
    window.REGIONES_Y_COMUNAS = REGIONES_Y_COMUNAS;
    window.obtenerNombresRegiones = obtenerNombresRegiones;
    window.obtenerComunasPorRegion = obtenerComunasPorRegion;
    window.configurarSelectsRegionComuna = configurarSelectsRegionComuna;
}
