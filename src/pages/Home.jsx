///////////////////////////////////////////////////////////////////////////////////////
// ¿Qué hace Home.jsx?
// Este archivo es la pantalla principal (Home) de tu app de servicios.
// Ahora implementamos SCROLL INFINITO:
// - Trae servicios de a tandas (limit + skip).
// - Carga más servicios automáticamente cuando el usuario llega al final.
// - Permite seguir filtrando por categoría y localidad.
// - Muestra la cantidad de servicios encontrados (nueva feature).
// ¿Por qué es importante?
// - Mejora la UX → más rápido y liviano.
// - No sobrecarga la memoria trayendo todos los servicios de una sola vez.
// - Profesional y moderno.

// Con esto ganás:
// - Performance.
// - UX de apps modernas.
// - Información clara para el usuario.
// - Código limpio y escalable.
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

import { useInView } from "react-intersection-observer";
// Importamos el hook de Intersection Observer.
// Nos dice si un elemento está visible en el viewport.

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

  const [skip, setSkip] = useState(0);
  // Cuántos registros nos estamos saltando. Sirve para paginación.

  const [hasMore, setHasMore] = useState(true);
  // Indica si todavía hay más datos para traer.

  const [loading, setLoading] = useState(false);
  // Estado que indica si estamos cargando datos.

  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("todas");
  const [localidadSeleccionada, setLocalidadSeleccionada] = useState("todas");

  const [filtrados, setFiltrados] = useState([]);
  // Guarda la lista final que se muestra (puede estar filtrada).

  //////////////////////////////////////////////////
  // Hook de Intersection Observer
  //////////////////////////////////////////////////

  const { ref, inView } = useInView({
    threshold: 0,
  });
  // ref → se asocia a un div invisible al final de la página.
  // inView → true si ese div es visible en pantalla.

  //////////////////////////////////////////////////
  // Función para traer servicios paginados
  //////////////////////////////////////////////////

  const fetchMoreServices = async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      // Hacemos la llamada al backend con paginación.
      const response = await axios.get(
        `${API_BASE_URL}/serv?limit=10&skip=${skip}`
      );

      if (response.data.length === 0) {
        // Si no hay más datos, seteamos hasMore en false.
        setHasMore(false);
      } else {
        // Agregamos los nuevos servicios al array existente.
        setServicios((prev) => [...prev, ...response.data]);
        setSkip((prev) => prev + response.data.length);
      }
    } catch (error) {
      console.error("Error al obtener los servicios:", error);
    }

    setLoading(false);
  };

  //////////////////////////////////////////////////
  // useEffect → Llama fetchMoreServices al cargar
  //////////////////////////////////////////////////

  useEffect(() => {
    fetchMoreServices();
  }, []);

  //////////////////////////////////////////////////
  // useEffect → Llama fetchMoreServices si inView se activa
  //////////////////////////////////////////////////

  useEffect(() => {
    if (inView && hasMore && !loading) {
      fetchMoreServices();
    }
  }, [inView]);

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
          Cargando más servicios...
        </p>
      )}

      {/* Sentinel invisible para Intersection Observer */}
      <div ref={ref}></div>

      {/* Mensaje si ya no hay más servicios */}
      {!hasMore && (
        <p className="text-center text-muted mt-3">
          No hay más servicios para mostrar.
        </p>
      )}
    </div>
  );
}

///////////////////////////////////////////////////////////////////////////////////////
// Resultado:
// - Home.jsx ahora muestra la cantidad de servicios encontrados.
// - Perfectamente integrado con scroll infinito.
// - Profesional y con comentarios nivel Dios.

//ESTOY VOLVIENDO A DEJAR TODO COMO ESTABA ANTES DE TOCAR EL BACK
///////////////////////////////////////////////////////////////////////////////////////
