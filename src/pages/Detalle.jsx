////////////////////////////////////////////////////////////////////////////////////////
// Detalle.jsx
////////////////////////////////////////////////////////////////////////////////////////
//
// Este componente muestra el detalle de un servicio específico.
//
// ⚠️ MODIFICACIONES CLAVE EN ESTA VERSIÓN:
//
// → Eliminamos por completo la estructura de “card” y “container”
//    para lograr que el contenido ocupe el 100% del espacio disponible
//    dentro del modal.
//
// → Todo el espacio se aprovecha para el texto y los datos del servicio,
//    eliminando márgenes y bordes innecesarios.
//
// → Todos los estilos mantienen Bootstrap para coherencia visual.
//
// → Código ultra comentado para entendimiento profesional.
//
////////////////////////////////////////////////////////////////////////////////////////

import React from "react";
import axios from "axios";

////////////////////////////////////////////////////////////////////////////////////////
// Configuración URL backend
////////////////////////////////////////////////////////////////////////////////////////

// Obtenemos la URL base de la API desde variables de entorno.
// Esto permite que el backend pueda cambiar de servidor sin tocar el código.
const API_BASE_URL = import.meta.env.VITE_API_URL;

////////////////////////////////////////////////////////////////////////////////////////
// Función auxiliar para registrar clics
////////////////////////////////////////////////////////////////////////////////////////

// Esta función registra en el backend un clic del usuario en los botones
// de teléfono o WhatsApp. Se hace mediante una petición POST.
//
// Parámetros:
// - serviceId → ID del servicio que se está visualizando
// - tipo      → tipo de clic: "telefono" o "whatsapp"
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

// Componente principal que muestra el detalle de un servicio.
//
// Props:
// - servicio → objeto con toda la información de un servicio
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

  // Cuando el usuario hace clic en “Llamar”:
  const llamar = () => {
    registrarClick(servicio._id, "telefono");
    window.open(`tel:${servicio.telefono}`, "_blank");
  };

  // Cuando el usuario hace clic en “WhatsApp”:
  const whatsapp = () => {
    registrarClick(servicio._id, "whatsapp");
    window.open(`https://wa.me/${servicio.telefono}`, "_blank");
  };

  ////////////////////////////////////////////////////////////////////////////
  // Render principal del componente
  ////////////////////////////////////////////////////////////////////////////

  return (
    // Usamos un div de padding moderado para no dejar el texto pegado al borde.
    <div className="p-3">

      {/* Título principal del servicio */}
      <h2 className="text-center mb-3">
        {servicio.nombre}
      </h2>

      {/* Lista de datos detallados del servicio */}
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
  );
}
