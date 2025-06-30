///////////////////////////////////////////////////////////////////////////////////////
// Home.jsx
// Integrado con backend que devuelve { total, data }.
// Scroll infinito funcional.
// Filtros por categoría y localidad.
// Contador de resultados preciso: "Se muestran X de Y servicios."
///////////////////////////////////////////////////////////////////////////////////////

import React, { useEffect, useState } from "react";
import axios from "axios";
import ServiceCard from "../components/ServiceCard";
import { useInView } from "react-intersection-observer";

///////////////////////////////////////////////////////////////////////////////////////
// URL base del backend, definida en tu archivo .env
///////////////////////////////////////////////////////////////////////////////////////

const API_BASE_URL = import.meta.env.VITE_API_URL;

///////////////////////////////////////////////////////////////////////////////////////
// Componente principal Home
///////////////////////////////////////////////////////////////////////////////////////

export default function Home() {
  /////////////////////////////////////////////////////////////////////////////
  // Estados locales
  /////////////////////////////////////////////////////////////////////////////

  const [servicios, setServicios] = useState([]);
  // Acumula TODOS los servicios cargados (scroll infinito).

  const [filtrados, setFiltrados] = useState([]);
  // Es la lista que realmente se renderiza. Puede estar filtrada en el front.

  const [skip, setSkip] = useState(0);
  // Indica cuántos documentos saltarse en la próxima búsqueda (paginación).

  const [hasMore, setHasMore] = useState(true);
  // Indica si todavía quedan datos por traer (para el scroll infinito).

  const [loading, setLoading] = useState(false);
  // Para mostrar el texto de "Cargando más servicios..."

  const [total, setTotal] = useState(null);
  // Guarda el total de servicios que cumplen los filtros, sin paginar.

  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("todas");
  const [localidadSeleccionada, setLocalidadSeleccionada] = useState("todas");
  // Estados de los filtros seleccionados.

  /////////////////////////////////////////////////////////////////////////////
  // Configuramos Intersection Observer
  /////////////////////////////////////////////////////////////////////////////

  const { ref, inView } = useInView({
    threshold: 0,
  });

  /////////////////////////////////////////////////////////////////////////////
  // Función principal para traer más servicios del backend
  /////////////////////////////////////////////////////////////////////////////

  const fetchMoreServices = async () => {
    if (loading || !hasMore) return;
    // Si ya estamos cargando o no hay más, no hacemos nada.

    setLoading(true);

    try {
      ////////////////////////////////////////////////////////
      // Armamos query string dinámico con filtros
      ////////////////////////////////////////////////////////

      const params = new URLSearchParams();

      if (categoriaSeleccionada !== "todas") {
        params.append("categoria", categoriaSeleccionada);
      }

      if (localidadSeleccionada !== "todas") {
        params.append("localidad", localidadSeleccionada);
      }

      params.append("limit", 10);
      params.append("skip", skip);

      ////////////////////////////////////////////////////////
      // Hacemos la llamada a nuestro backend
      ////////////////////////////////////////////////////////

      const response = await axios.get(`${API_BASE_URL}/serv?${params.toString()}`);

      ////////////////////////////////////////////////////////
      // Nuevo backend devuelve un objeto, NO un array directo:
      //
      // {
      //    total: <number>,
      //    data: [ {...}, {...} ]
      // }
      ////////////////////////////////////////////////////////

      if (response.data.total !== undefined) {
        setTotal(response.data.total);
      }

      const nuevosServicios = response.data.data;

      if (nuevosServicios.length === 0) {
        // No hay más datos para traer.
        setHasMore(false);
      } else {
        // Sumamos los nuevos datos a los que ya teníamos.
        setServicios((prev) => [...prev, ...nuevosServicios]);
        setSkip((prev) => prev + nuevosServicios.length);
      }

    } catch (error) {
      console.error("Error al obtener los servicios:", error);
    }

    setLoading(false);
  };

  /////////////////////////////////////////////////////////////////////////////
  // useEffect → dispara la primera carga de datos al montar el componente
  /////////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    fetchMoreServices();
  }, []);

  /////////////////////////////////////////////////////////////////////////////
  // useEffect → dispara fetchMoreServices si se ve el sentinel (scroll infinito)
  /////////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    if (inView && hasMore && !loading) {
      fetchMoreServices();
    }
  }, [inView]);

  /////////////////////////////////////////////////////////////////////////////
  // useEffect → Filtrado en frontend
  //
  // Esto permite que los filtros se apliquen sin necesidad de
  // llamar al backend cada vez. Mantiene la UX instantánea.
  /////////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    let resultado = [...servicios];

    if (categoriaSeleccionada !== "todas") {
      resultado = resultado.filter(
        (s) =>
          s.categoria &&
          s.categoria.toLowerCase() === categoriaSeleccionada.toLowerCase()
      );
    }

    if (localidadSeleccionada !== "todas") {
      resultado = resultado.filter(
        (s) =>
          s.localidad &&
          s.localidad.toLowerCase() === localidadSeleccionada.toLowerCase()
      );
    }

    setFiltrados(resultado);
  }, [categoriaSeleccionada, localidadSeleccionada, servicios]);

  /////////////////////////////////////////////////////////////////////////////
  // Listas únicas de categorías y localidades (para tus selects)
  /////////////////////////////////////////////////////////////////////////////

  const categoriasDisponibles = [
    "todas",
    ...new Set(servicios.map((s) => s.categoria?.toLowerCase())),
  ];

  const localidadesDisponibles = [
    "todas",
    ...new Set(servicios.map((s) => s.localidad?.toLowerCase())),
  ];

  /////////////////////////////////////////////////////////////////////////////
  // Render principal
  /////////////////////////////////////////////////////////////////////////////

  return (
    <div className="container py-5">
      {/* Título principal */}
      <h1 className="text-center mb-4">Buscar Servicios</h1>

      {/* Indicador de resultados */}
      {filtrados.length > 0 && total !== null && (
        <p className="text-center text-muted mb-4">
          Se muestran <strong>{filtrados.length}</strong> de{" "}
          <strong>{total}</strong> servicios.
        </p>
      )}

      {/* Filtros */}
      <div className="row mb-4">
        {/* Filtro por categoría */}
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
              fetchMoreServices();
            }}
          >
            {categoriasDisponibles.map((categoria, idx) => (
              <option key={idx} value={categoria}>
                {categoria?.charAt(0).toUpperCase() + categoria?.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por localidad */}
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
              fetchMoreServices();
            }}
          >
            {localidadesDisponibles.map((localidad, idx) => (
              <option key={idx} value={localidad}>
                {localidad?.charAt(0).toUpperCase() + localidad?.slice(1)}
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

      {/* Mensaje si no quedan más servicios */}
      {!hasMore && total !== null && (
        <p className="text-center text-muted mt-3">
          No hay más servicios para mostrar.
        </p>
      )}
    </div>
  );
}
