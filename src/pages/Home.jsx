///////////////////////////////////////////////////////////////////////////////////////
// ¿Qué hace Home.jsx?
//
// Este archivo es la pantalla principal (Home) de tu app de servicios.
// Ahora implementamos:
// - Scroll infinito (traer datos de a tandas).
// - Contador de resultados total.
// - Indicador de cuántos servicios faltan por cargar.
//
// Con esto ganás:
// - UX profesional.
// - Información clara al usuario.
// - Rendimiento óptimo.
// - Código impecable nivel Dios.
///////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////
// Importaciones necesarias
///////////////////////////////////////////////////////////////////////////////////////

import React, { useEffect, useState } from "react";
import axios from "axios";
import ServiceCard from "../components/ServiceCard";
import { useInView } from "react-intersection-observer";

///////////////////////////////////////////////////////////////////////////////////////
// Configuración de la URL base de la API
///////////////////////////////////////////////////////////////////////////////////////

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

  const [total, setTotal] = useState(null);
  // Guarda el total de servicios disponibles (filtros incluidos).

  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("todas");
  const [localidadSeleccionada, setLocalidadSeleccionada] = useState("todas");

  const [filtrados, setFiltrados] = useState([]);

  //////////////////////////////////////////////////
  // Hook de Intersection Observer
  //////////////////////////////////////////////////

  const { ref, inView } = useInView({
    threshold: 0,
  });

  //////////////////////////////////////////////////
  // Función para traer servicios paginados
  //////////////////////////////////////////////////

  const fetchMoreServices = async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      // Construimos la query string para filtros:
      const params = new URLSearchParams();

      if (categoriaSeleccionada !== "todas") {
        params.append("categoria", categoriaSeleccionada);
      }
      if (localidadSeleccionada !== "todas") {
        params.append("localidad", localidadSeleccionada);
      }
      params.append("limit", 10);
      params.append("skip", skip);

      // Llamada al backend:
      const response = await axios.get(`${API_BASE_URL}/serv?${params.toString()}`);

      const nuevosServicios = response.data.data;

      if (response.data.total !== undefined) {
        setTotal(response.data.total);
      }

      if (nuevosServicios.length === 0) {
        setHasMore(false);
      } else {
        setServicios((prev) => [...prev, ...nuevosServicios]);
        setSkip((prev) => prev + nuevosServicios.length);
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
      {filtrados.length > 0 && total !== null && (
        <p className="text-center text-muted mb-4">
          Se muestran <strong>{filtrados.length}</strong> de{" "}
          <strong>{total}</strong> servicios.
          {total - filtrados.length > 0 && (
            <>
              {" "}
              Faltan cargar <strong>{total - filtrados.length}</strong> más.
            </>
          )}
        </p>
      )}

      {/* Filtros */}
      <div className="row mb-4">
        <div className="col-md-6 mb-2">
          <label className="form-label">Filtrar por categoría:</label>
          <select
            className="form-select"
            value={categoriaSeleccionada}
            onChange={(e) => {
              setCategoriaSeleccionada(e.target.value);
              // Reiniciamos scroll infinito al cambiar filtros
              setServicios([]);
              setSkip(0);
              setHasMore(true);
              setTotal(null);
            }}
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
            onChange={(e) => {
              setLocalidadSeleccionada(e.target.value);
              setServicios([]);
              setSkip(0);
              setHasMore(true);
              setTotal(null);
            }}
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
      {!hasMore && total !== null && (
        <p className="text-center text-muted mt-3">
          No hay más servicios para mostrar.
        </p>
      )}
    </div>
  );
}
