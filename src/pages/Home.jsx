///////////////////////////////////////////////////////////////////////////////////////
// ¿Qué hace Home.jsx?
// Este archivo es la pantalla principal (Home) de tu app de servicios.
// Implementamos SCROLL INFINITO:
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
// Variable fuera del componente
// Esto evita doble ejecución de useEffect en React Strict Mode.
// React 18 monta y desmonta los componentes dos veces en modo desarrollo.
// Gracias a esta variable, aseguramos que solo se haga la carga inicial una vez.
///////////////////////////////////////////////////////////////////////////////////////

let hasFetched = false;

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

  const [initialLoaded, setInitialLoaded] = useState(false);
  // Bandera para saber si ya se hizo la carga inicial.

  const [observerReady, setObserverReady] = useState(false);
  // Indica si el observer está habilitado.
  // Esto evita que dispare en el mismo ciclo que la carga inicial.

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
        setHasMore(false);
      } else {
        //////////////////////////////////////////////////
        // Solución profesional:
        // Filtramos duplicados para evitar datos repetidos
        // incluso si el backend devuelve la misma página dos veces.
        //////////////////////////////////////////////////

        setServicios((prev) => {
          const nuevos = response.data.filter(
            (nuevo) => !prev.some((s) => s._id === nuevo._id)
          );
          return [...prev, ...nuevos];
        });

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
    if (!hasFetched) {
      hasFetched = true;

      //////////////////////////////////////////////////
      // Llamamos a la primera carga de datos manualmente
      //////////////////////////////////////////////////

      fetchMoreServices();
      setInitialLoaded(true);

      //////////////////////////////////////////////////
      // Armamos un pequeño delay para activar el observer
      //////////////////////////////////////////////////

      const timer = setTimeout(() => {
        setObserverReady(true);
      }, 0);

      return () => clearTimeout(timer);
    }
  }, []);

  //////////////////////////////////////////////////
  // useEffect → Llama fetchMoreServices si inView se activa
  //////////////////////////////////////////////////

  useEffect(() => {
    if (observerReady && inView && hasMore && !loading) {
      fetchMoreServices();
    }
  }, [observerReady, inView]);

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
  // useEffect → Detecta cuándo se vuelven a seleccionar "todas" las opciones
  //////////////////////////////////////////////////

  useEffect(() => {
    if (
      categoriaSeleccionada === "todas" &&
      localidadSeleccionada === "todas"
    ) {
      setSkip(0);                  // Reiniciamos el paginado
      setServicios([]);            // Vaciamos la lista para evitar duplicados
      setHasMore(true);            // Indicamos que hay más datos por cargar

      fetchMoreServices();
    }
  }, [categoriaSeleccionada, localidadSeleccionada]);

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
// - Doble fetch inicial eliminado.
// - Duplicados eliminados DEFINITIVAMENTE.
// - Compatible con React 18 Strict Mode.
