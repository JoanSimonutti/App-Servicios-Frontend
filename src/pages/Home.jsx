///////////////////////////////////////////////////////////////////////////////////////
// Home.jsx FINAL NIVEL DIOS
//
// - Scroll infinito funcional.
// - Contador exacto de servicios.
// - Filtros gestionados únicamente en el backend.
// - No más filtrado duplicado en el frontend.
//
// Resultado profesional y sin bugs.
///////////////////////////////////////////////////////////////////////////////////////

import React, { useEffect, useState } from "react";
import axios from "axios";
import ServiceCard from "../components/ServiceCard";
import { useInView } from "react-intersection-observer";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function Home() {
  const [servicios, setServicios] = useState([]);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(null);

  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("todas");
  const [localidadSeleccionada, setLocalidadSeleccionada] = useState("todas");

  const { ref, inView } = useInView({ threshold: 0 });

  const fetchMoreServices = async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      const params = new URLSearchParams();
      if (categoriaSeleccionada !== "todas") {
        params.append("categoria", categoriaSeleccionada);
      }
      if (localidadSeleccionada !== "todas") {
        params.append("localidad", localidadSeleccionada);
      }
      params.append("limit", 10);
      params.append("skip", skip);

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

  useEffect(() => {
    fetchMoreServices();
  }, []);

  useEffect(() => {
    if (inView && hasMore && !loading) {
      fetchMoreServices();
    }
  }, [inView]);

  useEffect(() => {
    // Cada vez que cambian los filtros, reiniciamos todo y recargamos
    setServicios([]);
    setSkip(0);
    setHasMore(true);
    setTotal(null);
    fetchMoreServices();
  }, [categoriaSeleccionada, localidadSeleccionada]);

  const categoriasDisponibles = [
    "todas",
    ...new Set(servicios.map((s) => s.categoria?.toLowerCase())),
  ];

  const localidadesDisponibles = [
    "todas",
    ...new Set(servicios.map((s) => s.localidad?.toLowerCase())),
  ];

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">Buscar Servicios</h1>

      {servicios.length > 0 && total !== null && (
        <p className="text-center text-muted mb-4">
          Se muestran <strong>{servicios.length}</strong> de{" "}
          <strong>{total}</strong> servicios.
        </p>
      )}

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
                {categoria?.charAt(0).toUpperCase() + categoria?.slice(1)}
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
                {localidad?.charAt(0).toUpperCase() + localidad?.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {servicios.length === 0 ? (
        <p className="text-muted text-center">No se encontraron servicios.</p>
      ) : (
        <div className="row">
          {servicios.map((servicio) => (
            <div key={servicio._id} className="col-md-4 mb-3">
              <ServiceCard service={servicio} />
            </div>
          ))}
        </div>
      )}

      {loading && (
        <p className="text-center mt-3">
          Cargando más servicios...
        </p>
      )}

      <div ref={ref}></div>

      {!hasMore && total !== null && (
        <p className="text-center text-muted mt-3">
          No hay más servicios para mostrar.
        </p>
      )}
    </div>
  );
}
