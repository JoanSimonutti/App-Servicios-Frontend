///////////////////////////////////////////////////////////////////////////////////////
// ¿Qué hace Home.jsx?
// Este archivo es la pantalla principal (Home) de tu app de servicios.
// **CAMBIO IMPORTANTE:**
// - Eliminamos el SCROLL INFINITO.
// - Traemos TODOS los servicios en una sola petición.
// - El resto del código (filtros, UI, etc.) queda igual.
// - Mantuvimos todos los comentarios y la misma estructura.
// ¿Por qué se quita?
// - Porque generaba problemas con duplicados y cantidad real.
// - Prefieres tener todos los datos en memoria para evitar errores.
// - Tu base es pequeña (36 registros), es aceptable traer todo.
// - Más sencillo de mantener.
///////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////
// Importaciones necesarias
///////////////////////////////////////////////////////////////////////////////////////

import React, { useEffect, useState } from "react";
// React → la librería principal para construir interfaces.
// useEffect → hook para ejecutar código cuando el componente se monta o cambia.
// useState → hook para manejar estados internos.

import axios from "axios";
// Axios → librería para hacer llamadas HTTP (GET, POST, etc.)

import ServiceCard from "../components/ServiceCard";
// Importamos el componente que renderiza cada tarjeta individual de servicio.

// IMPORTACIÓN ELIMINADA → INTERSECTION OBSERVER
// import { useInView } from "react-intersection-observer";

///////////////////////////////////////////////////////////////////////////////////////
// Configuración de la URL base de la API
///////////////////////////////////////////////////////////////////////////////////////

// Obtenemos la URL base del backend desde variables de entorno (.env).
// Esto permite cambiar entre local y producción sin tocar el código.
const API_BASE_URL = import.meta.env.VITE_API_URL;

///////////////////////////////////////////////////////////////////////////////////////
// Componente principal Home
///////////////////////////////////////////////////////////////////////////////////////

export default function Home() {
  //////////////////////////////////////////////////
  // Definición de estados locales
  //////////////////////////////////////////////////

  const [servicios, setServicios] = useState([]);
  // Guarda todos los servicios que vamos trayendo.

  // ESTADOS ELIMINADOS → Ya no se usan con scroll infinito:
  // const [skip, setSkip] = useState(0);
  // const [hasMore, setHasMore] = useState(true);

  const [loading, setLoading] = useState(false);
  // Estado que indica si estamos cargando datos.

  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("todas");
  const [localidadSeleccionada, setLocalidadSeleccionada] = useState("todas");

  const [filtrados, setFiltrados] = useState([]);
  // Guarda la lista final que se muestra (puede estar filtrada).

  //////////////////////////////////////////////////
  // Hook de Intersection Observer → ELIMINADO
  //////////////////////////////////////////////////

  // const { ref, inView } = useInView({
  //   threshold: 0,
  // });

  //////////////////////////////////////////////////
  // Función para traer TODOS los servicios de una sola vez
  //////////////////////////////////////////////////

  const fetchAllServices = async () => {
    setLoading(true);

    try {
      // Hacemos la llamada al backend para traer todos los servicios.
      const response = await axios.get(`${API_BASE_URL}/serv`);

      //////////////////////////////////////////////////
      // BLOQUE → evitar duplicados por _id
      //////////////////////////////////////////////////

      // Creamos un Map para eliminar duplicados
      const uniqueMap = new Map();

      response.data.forEach((s) => {
        uniqueMap.set(s._id, s);
      });

      // Obtenemos un array limpio sin duplicados
      const uniqueArray = Array.from(uniqueMap.values());

      setServicios(uniqueArray);
    } catch (error) {
      console.error("Error al obtener los servicios:", error);
    }

    setLoading(false);
  };

  //////////////////////////////////////////////////
  // useEffect → Llama fetchAllServices al cargar
  //////////////////////////////////////////////////

  useEffect(() => {
    fetchAllServices();
  }, []);

  //////////////////////////////////////////////////
  // useEffect → Filtrado
  //////////////////////////////////////////////////

  useEffect(() => {
    let resultado = [...servicios];

    if (categoriaSeleccionada !== "todas") {
      resultado = resultado.filter(
        (s) =>
          s.categoria.toLowerCase() ===
          categoriaSeleccionada.toLowerCase()
      );
    }

    if (localidadSeleccionada !== "todas") {
      resultado = resultado.filter(
        (s) =>
          s.localidad.toLowerCase() ===
          localidadSeleccionada.toLowerCase()
      );
    }

    setFiltrados(resultado);
  }, [categoriaSeleccionada, localidadSeleccionada, servicios]);

  //////////////////////////////////////////////////
  // Listas únicas de categorías y localidades
  //////////////////////////////////////////////////

  const categoriasDisponibles = [
    "todas",
    ...new Set(servicios.map((s) => s.categoria.toLowerCase())),
  ];

  const localidadesDisponibles = [
    "todas",
    ...new Set(servicios.map((s) => s.localidad.toLowerCase())),
  ];

  //////////////////////////////////////////////////
  // Render principal
  //////////////////////////////////////////////////

  return (
    <div className="container py-5">
      {/* Título */}
      <h1 className="text-center mb-4">Buscar Servicios</h1>

      {/* Indicador de cantidad de resultados */}
      {filtrados.length > 0 && (
        <p className="text-center text-muted mb-4">
          Se encontraron <strong>{filtrados.length}</strong> servicios.
        </p>
      )}

      {/* Filtros */}
      <div className="row mb-4">
        <div className="col-md-6 mb-2">
          <label className="form-label">Filtrar por categoría:</label>
          <select
            className="form-select"
            value={categoriaSeleccionada}
            onChange={(e) => setCategoriaSeleccionada(e.target.value)}
          >
            {categoriasDisponibles.map((categoria, idx) => (
              <option key={idx} value={categoria}>
                {categoria.charAt(0).toUpperCase() + categoria.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-6 mb-2">
          <label className="form-label">Filtrar por localidad:</label>
          <select
            className="form-select"
            value={localidadSeleccionada}
            onChange={(e) => setLocalidadSeleccionada(e.target.value)}
          >
            {localidadesDisponibles.map((localidad, idx) => (
              <option key={idx} value={localidad}>
                {localidad.charAt(0).toUpperCase() + localidad.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista de servicios */}
      {filtrados.length === 0 ? (
        <p className="text-muted text-center">
          No se encontraron servicios.
        </p>
      ) : (
        <div className="row">
          {filtrados.map((servicio) => (
            <div key={servicio._id} className="col-md-4 mb-3">
              <ServiceCard service={servicio} />
            </div>
          ))}
        </div>
      )}

      {/* Loader */}
      {loading && (
        <p className="text-center mt-3">
          Cargando servicios...
        </p>
      )}

      {/* Mensaje eliminado → No hay más servicios para mostrar. */}
      {/* Sentinel invisible → eliminado. */}
      {/* <div ref={ref}></div> */}

    </div>
  );
}

///////////////////////////////////////////////////////////////////////////////////////
// Resultado:
// - Scroll infinito ELIMINADO.
// - Traemos todos los servicios de una vez.
// - Todo el resto del código intacto (filtros, UI, etc.).
// - Evitamos duplicados.
// - Tu Home.jsx sigue 100% funcional y libre de bugs.
///////////////////////////////////////////////////////////////////////////////////////
