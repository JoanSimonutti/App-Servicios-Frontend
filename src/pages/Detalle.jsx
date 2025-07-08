////////////////////////////////////////////////////////////////////////////////////////
// Detalle.jsx
//
// Qué hace:
// - Muestra los datos de un servicio en detalle.
// - Incluye botones Teléfono y WhatsApp.
// - Registra clics en backend.
//
// Rediseñado:
// - Elimina Bootstrap.
// - Usa clases propias coherentes con header, login, etc.
// - Diseño dark+gold profesional.
// - Completamente responsive.
////////////////////////////////////////////////////////////////////////////////////////

import React from "react";
import axios from "axios";

import "./DetalleModules.css";

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

export default function Detalle({ servicio }) {
  if (!servicio) {
    return (
      <p className="detalle-empty">No se encontró información del servicio.</p>
    );
  }

  const llamar = () => {
    registrarClick(servicio._id, "telefono");
    window.open(`tel:${servicio.telefono}`, "_blank");
  };

  const whatsapp = () => {
    registrarClick(servicio._id, "whatsapp");
    window.open(`https://wa.me/${servicio.telefono}`, "_blank");
  };

  return (
    <div className="detalle-card">
      <h2 className="detalle-title">{servicio.nombre}</h2>

      <p className="detalle-text-1">
        <strong>{servicio.categoria}</strong> en{" "}
        <strong>{servicio.localidad}</strong>.
      </p>
      <p className="detalle-text">
        <strong>{servicio.tipoServicio}</strong>.
      </p>
      <p className="detalle-text">
        <strong>Horario:</strong> {servicio.horaDesde}:00 a {servicio.horaHasta}
        :00 hs.
      </p>
      <p className="detalle-text">
        <strong>Urgencias 24hs:</strong> {servicio.urgencias24hs ? "Sí" : "No"}.
      </p>
      <p className="detalle-text">
        <strong>Localidades cercanas:</strong>{" "}
        {servicio.localidadesCercanas ? "Sí" : "No"}.
      </p>

      <div className="detalle-buttons">
        <button onClick={llamar} className="detalle-btn detalle-btn-telefono">
          Teléfono
        </button>
        <button onClick={whatsapp} className="detalle-btn detalle-btn-whatsapp">
          WhatsApp
        </button>
      </div>
    </div>
  );
}
