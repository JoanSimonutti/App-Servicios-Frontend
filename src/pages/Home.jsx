///////////////////////////////////////////////////////////////////////////////////////
// Home.jsx (modificado - ahora obtiene categorías y localidades del backend)
//
// Qué hace ahora:
// - Trae categorías y localidades dinámicamente desde /serv.
// - Elimina los valores hardcodeados de los select.
// - Aplica estilos únicamente desde HomeModules.css.
// - Mantiene tu lógica original intacta.
// - Código limpio, profesional y escalable.
///////////////////////////////////////////////////////////////////////////////////////

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

// Importamos SectionCard
import SectionCard from "../components/SectionCard";

// Importamos los datos de las secciones
import { CATEGORY_GROUPS } from "../constants/categoryGroups";

// Importamos CSS de Home
import "./HomeModules.css";

const Home = () => {
  const navigate = useNavigate();

  /////////////////////////////////////////////////////////////////////////////
  // Estados locales para Búsqueda Rápida:
  /////////////////////////////////////////////////////////////////////////////

  // Guarda la categoría seleccionada por el usuario
  const [categoria, setCategoria] = useState("");

  // Guarda la localidad seleccionada por el usuario
  const [localidad, setLocalidad] = useState("");

  // Guarda el valor del checkbox urgencias
  const [urgencias, setUrgencias] = useState(false);

  // Listado dinámico de categorías
  const [categorias, setCategorias] = useState([]);

  // Listado dinámico de localidades
  const [localidades, setLocalidades] = useState([]);

  /////////////////////////////////////////////////////////////////////////////
  // useEffect → Ejecuta al montar el componente
  /////////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    // Llamamos al backend para obtener todos los servicios
    const fetchData = async () => {
      try {
        const res = await api.get("/serv");

        // Obtenemos categorías únicas
        const categoriasUnicas = [...new Set(res.data.map((s) => s.categoria))];
        setCategorias(categoriasUnicas);

        // Obtenemos localidades únicas
        const localidadesUnicas = [
          ...new Set(res.data.map((s) => s.localidad)),
        ];
        setLocalidades(localidadesUnicas);
      } catch (err) {
        console.error("Error al traer servicios:", err);
      }
    };

    fetchData();
  }, []);

  /////////////////////////////////////////////////////////////////////////////
  // Handler para el submit del formulario de búsqueda
  /////////////////////////////////////////////////////////////////////////////

  const handleBuscar = (e) => {
    e.preventDefault();

    // Construimos query params dinámicamente
    const params = new URLSearchParams();

    if (categoria) params.append("categoria", categoria);
    if (localidad) params.append("localidad", localidad);
    if (urgencias) params.append("urgencias24hs", true);

    // Navegamos a la página de resultados
    navigate(`/services?${params.toString()}`);
  };

  /////////////////////////////////////////////////////////////////////////////
  // Convierte texto de sección en slug para URL
  /////////////////////////////////////////////////////////////////////////////

  const handleSeccionClick = (seccion) => {
    const slug = seccion
      .toLowerCase()
      .replace(/\s+/g, "-")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    navigate(`/services/${slug}`);
  };

  /////////////////////////////////////////////////////////////////////////////
  // Render
  /////////////////////////////////////////////////////////////////////////////

  return (
    <>
      <div className="container container-principal">
        {/* ============================================================
         SECCIÓN: BÚSQUEDA RÁPIDA
         ============================================================ */}
        <section className="container home-search-bar">
          <p className="home-search-titulo">BÚSQUEDA RÁPIDA</p>
          <form onSubmit={handleBuscar} className="home-search-form">
            {/* SELECT - Categoría */}
            <select
              className="home-search-select"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            >
              <option value="">Seleccionar Categoría</option>
              {categorias.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* SELECT - Localidad */}
            <select
              className="home-search-select"
              value={localidad}
              onChange={(e) => setLocalidad(e.target.value)}
            >
              <option value="">Seleccionar Localidad</option>
              {localidades.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>

            {/* CHECKBOX - Urgencias 24hs */}
            <label className="home-search-checkbox">
              <input
                type="checkbox"
                checked={urgencias}
                onChange={(e) => setUrgencias(e.target.checked)}
              />
              URGENCIAS 24HS
            </label>

            {/* BOTÓN - Buscar ahora */}
            <button type="submit" className="home-search-button">
              BUSCAR
            </button>
          </form>
        </section>

        {/* ============================================================
         SECCIÓN: SECCIONES DE SERVICIOS
         ============================================================ */}
        <div className="row row-pricipal-grilla">
          {Object.entries(CATEGORY_GROUPS).map(([seccion, categorias]) => (
            <div
              key={seccion}
              className="col-6 col-sm-6 col-lg-3 d-flex justify-content-center"
            >
              <SectionCard
                title={seccion}
                categoryCount={categorias.length}
                onClick={() => handleSeccionClick(seccion)}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
