///////////////////////////////////////////////////////////////////////////////////////
// categoryGroups.js
//
// Qué hace este archivo:
// Define y exporta:
// - CATEGORY_GROUPS → Objeto con las 8 secciones principales de la app,
//   cada una con sus categorías correspondientes.
// - ALL_CATEGORIES → Array plano con todas las categorías únicas,
//   para usar en selects, validaciones o filtros.
//
// Por qué es importante:
// Este archivo se convierte en la "fuente de la verdad" para las categorías.
// Evita inconsistencias entre distintas partes del frontend.
// Facilita mantenimiento, escalabilidad y reduce errores de tipografía.
//
// Uso:
// import { CATEGORY_GROUPS, ALL_CATEGORIES } from "../constants/categoryGroups";
///////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////
// CATEGORY_GROUPS
//
// Es un objeto que agrupa las categorías por las 8 secciones definidas.
// Cada clave es el nombre de la sección.
// Cada valor es un array con las categorías de esa sección.
///////////////////////////////////////////////////////////////////////////////////////

export const CATEGORY_GROUPS = {
    "Hogar": [
        "Plomería",
        "Electricidad",
        "Herrería",
        "Carpintería",
        "Gas",
        "Informática",
        "Limpieza doméstica",
        "Fumigación",
        "Reparaciones generales",
        "Climatización (aires, calefacción)",
        "Colocación de pisos / revestimientos",
        "Vidriería",
        "Impermeabilización",
        "Rejas y estructuras metálicas",
        "Colocación de cortinas",
        "Mantenimiento de piletas",
        "Armado de muebles",
        "Persianas y toldos"
    ],

    "Familia": [
        "Enfermería",
        "Medicina a domicilio",
        "Niñeras",
        "Acompañante terapéutico",
        "Psicólogos",
        "Fonoaudiólogos",
        "Maestras particulares",
        "Kinesiología",
        "Terapias alternativas",
        "Psicopedagogía",
        "Fisioterapia",
        "Cuidadores de adultos mayores",
        "Acompañamiento escolar",
        "Logopedas",
        "Musicoterapia",
        "Asistencia escolar a domicilio"
    ],

    "Profesionales": [
        "Abogados",
        "Contadores",
        "Traductores",
        "Asesores impositivos",
        "Ingenieros",
        "Arquitectos",
        "Desarrolladores de software",
        "Diseñadores gráficos",
        "Marketing digital",
        "Reparadores de electrodomésticos",
        "Técnicos electrónicos",
        "Electricistas matriculados",
        "Gestores administrativos",
        "Técnicos en refrigeración",
        "Técnicos de PC",
        "Diseñadores industriales",
        "Auditores",
        "Consultores empresariales",
        "Gestoría vehicular",
        "Peritos",
        "Agrimensores",
        "Topógrafos",
        "Fotógrafos profesionales"
    ],

    "Estética": [
        "Peluquería hombre, mujer y niños",
        "Barberías",
        "Cosmetología",
        "Manicura / Pedicura",
        "Maquillaje profesional",
        "Depilación",
        "Masajes estéticos",
        "Spa a domicilio",
        "Estética corporal",
        "Tratamientos faciales",
        "Microblading",
        "Diseño de cejas",
        "Peinados para eventos",
        "Uñas esculpidas",
        "Extensiones de pestañas",
        "Micropigmentación",
        "Limpieza facial profunda",
        "Bronceado sin sol",
        "Diseño de sonrisa estética"
    ],

    "Animales": [
        "Paseadores de perros",
        "Peluquería canina / felina",
        "Adiestradores",
        "Veterinarios a domicilio",
        "Guarderías caninas",
        "Venta de alimentos y accesorios",
        "Educación canina",
        "Etología animal",
        "Adopciones responsables",
        "Fotografía de mascotas",
        "Hospedaje para mascotas",
        "Terapias alternativas animales",
        "Spa para mascotas",
        "Adiestramiento felino"
    ],

    "Lavadero": [
        "Lavadero de ropa",
        "Lavadero de coches",
        "Tintorerías",
        "Limpieza de alfombras y tapizados",
        "Limpieza industrial / comercial",
        "Lavado de sillones",
        "Limpieza de cortinas",
        "Servicios de planchado",
        "Lavado de colchones",
        "Limpieza post obra",
        "Limpieza de piletas",
        "Limpieza de vidrios en altura",
        "Lavado de tapizados de autos",
        "Limpieza de tanques de agua"
    ],

    "Eventos": [
        "Fotografía y video de eventos",
        "Música en vivo",
        "Animadores infantiles",
        "Catering",
        "Decoradores",
        "Alquiler de livings y mobiliario",
        "Pastelería para eventos",
        "Organización de fiestas",
        "Sonido e iluminación",
        "Magos / shows",
        "Carpas y gazebos para eventos",
        "Bartenders",
        "Alquiler de vajilla",
        "Wedding planners",
        "Food trucks",
        "Animación para adultos",
        "Cotillón personalizado",
        "Escenografía para eventos"
    ],

    "Transporte": [
        "Fletes",
        "Mudanzas",
        "Moto mensajería",
        "Chofer particular",
        "Transportes especiales",
        "Delivery de productos voluminosos",
        "Transporte de personas",
        "Transporte de mascotas",
        "Cargas refrigeradas",
        "Transporte escolar",
        "Courier internacional",
        "Alquiler de camionetas",
        "Chofer profesional para empresas",
        "Distribución de correspondencia",
        "Traslados corporativos",
        "Camiones con hidrogrúa"
    ],


};

///////////////////////////////////////////////////////////////////////////////////////
// ALL_CATEGORIES
//
// Generamos un array plano con todas las categorías únicas,
// extrayéndolas del objeto CATEGORY_GROUPS.
//
// Esto es muy útil para:
// - renders de <select> en formularios
// - validaciones globales
// - filtros rápidos
///////////////////////////////////////////////////////////////////////////////////////

// Convertimos CATEGORY_GROUPS en un array plano y único
export const ALL_CATEGORIES = [
    ...new Set(
        Object.values(CATEGORY_GROUPS).flat()
    )
];

///////////////////////////////////////////////////////////////////////////////////////
// Resultado
//
// Con este archivo:
// → Home.jsx podrá importar CATEGORY_GROUPS para renderizar las secciones.
// → Perfil.jsx podrá importar ALL_CATEGORIES para crear selects validados.
// → Evitamos inconsistencias y duplicaciones en toda la app.
///////////////////////////////////////////////////////////////////////////////////////
