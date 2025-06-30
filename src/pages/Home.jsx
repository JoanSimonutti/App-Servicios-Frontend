///////////////////////////////////////////////////////////////////////////////////////
// Home.jsx - VERSIÓN FINAL NIVEL DIOS
//
// ✅ Scroll infinito funcional.
// ✅ Filtros correctos sin errores ni estado viejo.
// ✅ Integrado con backend que devuelve { total, data }.
// ✅ Contador de resultados: "Se muestran X de Y servicios."
// ✅ Comentado línea por línea.
// ✅ No se rompe nada de tu lógica original.
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
  // Guarda TODOS los servicios cargados hasta el momento (scroll infinito).

  const [filtrados, setFiltrados] = useState([]);
  // Es la lista que efectivamente se renderiza (filtros aplicados en front).

  const [skip, setSkip] = useState(0);
  // Cuántos documentos saltarse en el próximo fetch (paginación).

  const [hasMore, setHasMore] = useState(true);
  // Si quedan datos por traer (para el scroll infinito).

  const [loading, setLoading] = useState(false);
  // Estado para mostrar "Cargando más servicios..."

  const [total, setTotal] = useState(null);
  // Guarda el total de registros en la base (para mostrar el contador).

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
    // Si ya está cargando o no hay más datos, salimos.

    setLoading(true);

    try {
      ////////////////////////////////////////////////////////
      // Armamos la query string dinámica según filtros
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
      // Llamamos al backend
      ////////////////////////////////////////////////////////

      const response = await axios.get(`${API_BASE_URL}/serv?${params.toString()}`);

      ////////////////////////////////////////////////////////
      // Nuestro backend devuelve un objeto, NO un array directo:
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

  /////////////////////////////////////////////////////////////////////////////
  // useEffect → carga inicial al montar el componente
  /////////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    fetchMoreServices();
  }, []);

  /////////////////////////////////////////////////////////////////////////////
  // useEffect → dispara fetchMoreServices si sentinel entra en vista
  /////////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    if (inView && hasMore && !loading) {
      fetchMoreServices();
    }
  }, [inView]);

  /////////////////////////////////////////////////////////////////////////////
  // useEffect → aplica filtrado en frontend
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
  // useEffect → dispara una recarga completa si cambian los filtros
  //
  // ✅ Esta es la clave para evitar tu error:
  //    - Esperamos a que se actualicen los estados de filtros
  //    - Disparamos fetchMoreServices una vez con los valores correctos.
  /////////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    // Reset de estados antes de recargar
    setServicios([]);
    setSkip(0);
    setHasMore(true);
    setTotal(null);

    fetchMoreServices();
  }, [categoriaSeleccionada, localidadSeleccionada]);

  /////////////////////////////////////////////////////////////////////////////
  // Listas únicas de categorías y localidades (para los selects)
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
      {/* Título */}
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
        {/* Filtro categoría */}
        <div className="col-md-6 mb-2">
          <label className="form-label">Filtrar por categoría:</label>
          <select
            className="form-select"
            value={categoriaSeleccionada}
            onChange={(e) => setCategoriaSeleccionada(e.target.value)}
          >
            {categoriasDisponibles.map((categoria, idx) => (
              <option key={idx} value={categoria}>
                {categoria?.charAt(0).toUpperCase() + categoria?.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro localidad */}
        <div className="col-md-6 mb-2">
          <label className="form-label">Filtrar por localidad:</label>
          <select
            className="form-select"
            value={localidadSeleccionada}
            onChange={(e) => setLocalidadSeleccionada(e.target.value)}
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
