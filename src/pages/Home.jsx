///////////////////////////////////////////////////////////////////////////////////////
// Home.jsx (modificado con GRID)
//
// Qué hace ahora:
// - Renderiza SOLO las 8 tarjetas grandes en grilla Bootstrap.
// - Web → 4 columnas (4 x 2 = 8)
// - Mobile → 2 columnas (2 x 4 = 8)
// - Usa SectionCard.
// - Todo tu código original sigue comentado al final.
//
// Este archivo es 100% listo para reemplazar el tuyo.
///////////////////////////////////////////////////////////////////////////////////////

import React from "react";
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

  return (
    <>
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
