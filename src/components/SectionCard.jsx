///////////////////////////////////////////////////////////////////////////////////////
// SectionCard.jsx
//
// Qué hace este componente:
// - Renderiza solo una imagen.
// - Debajo muestra el título corto.
// - Compatible con Bootstrap grid.
// - Hover suave.
// - Usa clases CSS planas (NO CSS Modules).
///////////////////////////////////////////////////////////////////////////////////////

import React from "react";
import "./SectionCardModules.css";
// Importamos el CSS plano (no module).

const SectionCard = ({ title, image, onClick }) => {
  return (
    <div className="cardWrapper" onClick={onClick}>
      {/* Contenedor de la imagen */}
      <div className="imageContainer">
        <img src={"/images/imagen1.jpg"} alt={title} className="image" />
      </div>

      {/* Título debajo de la imagen */}
      <p className="title">{title}</p>
    </div>
  );
};

export default SectionCard;
