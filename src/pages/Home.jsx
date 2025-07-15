///////////////////////////////////////////////////////////////////////////////////////
// Home.jsx (modificado con bloque de BÚSQUEDA + GRID)
//
// Qué hace ahora:
// - Muestra una barra de búsqueda arriba de la grilla.
// - Renderiza SOLO las 8 tarjetas grandes en grilla Bootstrap.
// - Web → 4 columnas (4 x 2 = 8)
// - Mobile → 2 columnas (2 x 4 = 8)
// - Usa SectionCard.
///////////////////////////////////////////////////////////////////////////////////////

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Importamos SectionCard
import SectionCard from "../components/SectionCard";

// Importamos los datos de las secciones
import { CATEGORY_GROUPS } from "../constants/categoryGroups";

// Importamos tu CSS global
import "./HomeModules.css";

const Home = () => {
  const navigate = useNavigate();

  // Convierte texto de sección en slug para URL
  const handleSeccionClick = (seccion) => {
    const slug = seccion
      .toLowerCase()
      .replace(/\s+/g, "-")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    navigate(`/services/${slug}`);
  };

  // ---------------------------------------------------------------------------
  // AGREGADO JOAN - BLOQUE DE BÚSQUEDA
  // Declaramos estados locales para los filtros:
  // - categoria → almacena categoría seleccionada
  // - localidad → almacena localidad seleccionada
  // - urgencias → true/false según el checkbox
  // ---------------------------------------------------------------------------

  const [categoria, setCategoria] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [urgencias, setUrgencias] = useState(false);

  // Handler que se dispara al hacer submit en el formulario:
  const handleBuscar = (e) => {
    e.preventDefault();

    // Construimos los parámetros de búsqueda como query params:
    const params = new URLSearchParams();

    if (categoria) params.append("categoria", categoria);
    if (localidad) params.append("localidad", localidad);
    if (urgencias) params.append("urgencias24hs", true);

    // Navegamos a la página de resultados con esos filtros:
    navigate(`/services?${params.toString()}`);
  };

  return (
    <>
      {/* ---------------------------------------------------------------------
          AGREGADO JOAN - BLOQUE DE BÚSQUEDA
          Este bloque se ubica arriba de tu grilla original.
      --------------------------------------------------------------------- */}
      <section className="container home-search-bar">
        <form
          onSubmit={handleBuscar}
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            justifyContent: "center",
          }}
        >
          {/* SELECT - Categoría */}
          <select
            className="home-search-select"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          >
            <option value="">Seleccionar Categoría</option>
            <option value="Electricidad">Electricidad</option>
            <option value="Plomería">Plomería</option>
            <option value="Gasista">Gasista</option>
            <option value="Carpintería">Carpintería</option>
            {/* Agregar más categorías aquí si lo deseas */}
          </select>

          {/* SELECT - Localidad */}
          <select
            className="home-search-select"
            value={localidad}
            onChange={(e) => setLocalidad(e.target.value)}
          >
            <option value="">Seleccionar Localidad</option>
            <option value="Valencia">Valencia</option>
            <option value="Madrid">Madrid</option>
            <option value="Barcelona">Barcelona</option>
            {/* Agregar más localidades aquí si lo deseas */}
          </select>

          {/* CHECKBOX - Urgencias 24hs */}
          <label
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <input
              type="checkbox"
              checked={urgencias}
              onChange={(e) => setUrgencias(e.target.checked)}
            />
            Urgencias 24hs
          </label>

          {/* BOTÓN - Buscar ahora */}
          <button type="submit" className="home-search-button">
            Buscar ahora
          </button>
        </form>
      </section>

      {/* ---------------------------------------------------------------------
          TU CÓDIGO ORIGINAL DE HOME → NO SE TOCA
      --------------------------------------------------------------------- */}

      {/* Contenedor Bootstrap */}
      <div className="container container-principal">
        {/* Título grande 
        <h1 className="text-center mb-4 home-title">
          Nuestras Secciones de Servicios
        </h1>*/}

        {/* Grilla Bootstrap */}
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
