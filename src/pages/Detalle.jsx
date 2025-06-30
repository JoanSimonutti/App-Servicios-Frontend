////////////////////////////////////////////////////////////////////////////////////////
// Detalle.jsx (Versión Modal)
////////////////////////////////////////////////////////////////////////////////////////

import React from "react";
import axios from "axios";

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
  if (!servicio) {
    return (
      <p className="text-center text-muted">
        No se encontró información del servicio.
      </p>
    );
  }

  //////////////////////////////////////////////////
  // Funciones de los botones
  //////////////////////////////////////////////////

  const llamar = () => {
    registrarClick(servicio._id, "telefono");
    window.open(`tel:${servicio.telefono}`, "_blank");
  };

  const whatsapp = () => {
    registrarClick(servicio._id, "whatsapp");
    window.open(`https://wa.me/${servicio.telefono}`, "_blank");
  };

  //////////////////////////////////////////////////
  // Render principal
  //////////////////////////////////////////////////

  return (
    <div className="container py-3">
      <div className="card shadow-lg">
        <div className="card-body">
          {/* Título principal */}
          <h2 className="card-title text-center mb-3">
            {servicio.nombre}
          </h2>

          <div className="row">
            {/* Datos */}
            <div className="col-md-8">
              <ul className="list-group mb-3">
                <li className="list-group-item">
                  <strong>{servicio.categoria}</strong> en <strong>{servicio.localidad}</strong>
                </li>
                <li className="list-group-item">
                  <strong>{servicio.tipoServicio}</strong>
                </li>
                <li className="list-group-item">
                  <strong>Horario:</strong>{" "}
                  {servicio.horaDesde}:00 a {servicio.horaHasta}:00 hs
                </li>
                <li className="list-group-item">
                  <strong>Urgencias 24hs:</strong>{" "}
                  {servicio.urgencias24hs ? "Sí" : "No"}
                </li>
                <li className="list-group-item">
                  <strong>Atiende localidades cercanas:</strong>{" "}
                  {servicio.localidadesCercanas ? "Sí" : "No"}
                </li>
              </ul>

              {/* Botones de acción */}
              <div className="d-flex flex-wrap gap-2 justify-content-center">
                <button
                  onClick={llamar}
                  className="btn btn-primary"
                >
                  Llamar
                </button>

                <button
                  onClick={whatsapp}
                  className="btn btn-success"
                >
                  WhatsApp
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
