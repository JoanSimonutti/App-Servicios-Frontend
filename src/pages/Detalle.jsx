////////////////////////////////////////////////////////////////////////////////////////
// Detalle.jsx
////////////////////////////////////////////////////////////////////////////////////////

import React from "react";
import axios from "axios";

import "./DetalleModules.css";
// Importamos nuestros estilos externos específicos para Detalle.

////////////////////////////////////////////////////////////////////////////////////////
// Configuración URL backend
////////////////////////////////////////////////////////////////////////////////////////

const API_BASE_URL = import.meta.env.VITE_API_URL;

////////////////////////////////////////////////////////////////////////////////////////
// Función auxiliar para registrar clics
////////////////////////////////////////////////////////////////////////////////////////

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

////////////////////////////////////////////////////////////////////////////////////////
// Componente Detalle
////////////////////////////////////////////////////////////////////////////////////////

export default function Detalle({ servicio }) {

  ////////////////////////////////////////////////////////////////////////////
  // Si NO hay datos de servicio, mostramos mensaje de error amigable.
  ////////////////////////////////////////////////////////////////////////////

  if (!servicio) {
    return (
      <p className="text-center text-muted">
        No se encontró información del servicio.
      </p>
    );
  }

  ////////////////////////////////////////////////////////////////////////////
  // Funciones manejadoras de los botones
  ////////////////////////////////////////////////////////////////////////////

  const llamar = () => {
    registrarClick(servicio._id, "telefono");
    window.open(`tel:${servicio.telefono}`, "_blank");
  };

  const whatsapp = () => {
    registrarClick(servicio._id, "whatsapp");
    window.open(`https://wa.me/${servicio.telefono}`, "_blank");
  };

  ////////////////////////////////////////////////////////////////////////////
  // Render principal
  ////////////////////////////////////////////////////////////////////////////

  return (
    <div className="detalle-card">

      {/* Título principal */}
      <h2 className="detalle-title">
        {servicio.nombre}
      </h2>

      {/* Bloques de texto (sin listas) */}
      <p className="detalle-text-1">
        <strong>{servicio.categoria}</strong> en <strong>{servicio.localidad}</strong>
      </p>
      <p className="detalle-text">
        <strong>{servicio.tipoServicio}</strong>
      </p>
      <p className="detalle-text">
        <strong>Horario:</strong> {servicio.horaDesde}:00 a {servicio.horaHasta}:00 hs.
      </p>
      <p className="detalle-text">
        <strong>Urgencias 24hs:</strong> {servicio.urgencias24hs ? "Sí" : "No"}.
      </p>
      <p className="detalle-text">
        <strong>Localidades cercanas:</strong> {servicio.localidadesCercanas ? "Sí" : "No"}.
      </p>

      {/* Botones de acción */}
      <div className="d-flex flex-wrap gap-2 justify-content-center mt-3">
        <button
          onClick={llamar}
          className="btn btn-telefono btn-lg"
        >
          Teléfono
        </button>

        <button
          onClick={whatsapp}
          className="btn btn-whatsapp btn-lg"
        >
          WhatsApp
        </button>
      </div>
    </div>
  );
}

////////////////////////////////////////////////////////////////////////////////////////
// Resultado:
// - Estética unificada con ServiceCard.

