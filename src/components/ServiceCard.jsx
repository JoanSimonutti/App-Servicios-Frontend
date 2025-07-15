///////////////////////////////////////////////////////////////////////////////////////
// ServiceCard.jsx
//
// Qué hace:
// - Muestra información resumida de un servicio.
// - Permite acceder a:
//   - Teléfono (abre enlace + registra clic)
//   - WhatsApp (abre enlace + registra clic)
//   - Ver más detalles
///////////////////////////////////////////////////////////////////////////////////////

import React from "react";
import axios from "axios";
import "./ServiceCardModules.css";

const API_BASE_URL = import.meta.env.VITE_API_URL;

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

export default function ServiceCard({ service, onVerMas }) {
  const handleClick = (tipo, enlace) => {
    registrarClick(service._id, tipo);
    window.open(enlace, "_blank");
  };

  return (
    <div className="service-card">
      <h5 className="service-card-title">{service.nombre}</h5>
      <p className="service-card-subtitle">
        {service.categoria} en {service.localidad}
      </p>

      <div className="service-card-buttons">
        <button
          onClick={() => handleClick("telefono", `tel:${service.telefono}`)}
          className="service-card-btn service-card-btn-telefono"
        >
          Teléfono
        </button>

        <button
          onClick={() =>
            handleClick("whatsapp", `https://wa.me/${service.telefono}`)
          }
          className="service-card-btn service-card-btn-whatsapp"
        >
          WhatsApp
        </button>

        <button
          onClick={() => onVerMas(service)}
          className="service-card-btn service-card-btn-info"
        >
          + Info
        </button>
      </div>
    </div>
  );
}
