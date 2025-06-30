///////////////////////////////////////////////////////////////////////////////////////
// ServiceCard.jsx
///////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////
// Importaciones necesarias
///////////////////////////////////////////////////////////////////////////////////////

import React from "react";
// Importamos React para definir componentes.

import axios from "axios";
// Axios → librería para hacer llamadas HTTP al backend.

import "./ServiceCardModules.css";
// Importamos nuestros estilos externos específicos para ServiceCard.

///////////////////////////////////////////////////////////////////////////////////////
// Configuración de la URL base de la API
///////////////////////////////////////////////////////////////////////////////////////

// Obtenemos la URL base del backend desde variables de entorno (.env).
const API_BASE_URL = import.meta.env.VITE_API_URL;

///////////////////////////////////////////////////////////////////////////////////////
// Función auxiliar registrarClick
///////////////////////////////////////////////////////////////////////////////////////

// Registra un clic en el backend.
//
// Parámetros:
// - serviceId → ID del servicio sobre el cual se hizo clic.
// - tipo → puede ser "telefono" o "whatsapp".
const registrarClick = async (serviceId, tipo) => {
  try {
    await axios.post(`${API_BASE_URL}/clic`, {
      serviceId,
      tipo,
    });
  } catch (err) {
    console.error(`Error al registrar clic (${tipo}):`, err);
  }
};

///////////////////////////////////////////////////////////////////////////////////////
// Componente principal ServiceCard
///////////////////////////////////////////////////////////////////////////////////////

export default function ServiceCard({ service, onVerMas }) {
  //////////////////////////////////////////////////
  // Función handleClick
  //////////////////////////////////////////////////

  // Ejecutada cuando se hace clic en Teléfono o WhatsApp.
  //
  // Registra el clic en backend y abre el enlace.
  const handleClick = (tipo, enlace) => {
    registrarClick(service._id, tipo);
    window.open(enlace, "_blank");
  };

  //////////////////////////////////////////////////
  // Render principal
  //////////////////////////////////////////////////

  return (
    // ✅ Usamos clase personalizada .service-card para la sombra.
    <div className="card mb-4 service-card">
      <div className="card-body">

        {/* Título del servicio */}
        <h5 className="service-card-title">
          {service.nombre}
        </h5>

        {/* Subtítulo → categoría y localidad */}
        <p className="service-card-subtitle">
          {service.categoria} en {service.localidad}
        </p>

        {/* Botones de acción */}
        <div className="d-flex flex-wrap gap-2 justify-content-center">
          {/* Botón Teléfono */}
          <button
            onClick={() => handleClick("telefono", `tel:${service.telefono}`)}
            className="btn btn-telefono"
          >
            Teléfono
          </button>

          {/* Botón WhatsApp */}
          <button
            onClick={() =>
              handleClick("whatsapp", `https://wa.me/${service.telefono}`)
            }
            className="btn btn-whatsapp"
          >
            WhatsApp
          </button>

          {/* Botón Ver más */}
          <button
            onClick={() => onVerMas(service)}
            className="btn btn-info"
          >
            + Info
          </button>
        </div>
      </div>
    </div>
  );
}

