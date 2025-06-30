///////////////////////////////////////////////////////////////////////////////////////
// ¿Qué hace ServiceCard.jsx?
// Este archivo define un componente visual que muestra la “tarjeta” de un servicio.

// Cada tarjeta:
// - Muestra el nombre, categoría y localidad del prestador.
// - Tiene botones para:
//    • Llamar al prestador (tel:)
//    • Enviar WhatsApp
//    • Ver más detalles (abre un modal en lugar de navegar a otra página)
// - Registra en el backend cada clic realizado (analítica).

// ¿Por qué es importante?
// - Es la pieza visual que ve el usuario en la grilla de servicios.
// - Permite al usuario interactuar directamente con el prestador.
// - Registra los clics en el backend → fundamental para métricas.
// - Mantiene la navegación SPA sin recargar la página.
// - Ahora se integra perfectamente con la lógica de modales.
///////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////
// Importaciones necesarias
///////////////////////////////////////////////////////////////////////////////////////

import React from "react";
// Importamos React para poder definir componentes.

import axios from "axios";
// Axios → librería para hacer llamadas HTTP al backend.

///////////////////////////////////////////////////////////////////////////////////////
// Configuración de la URL base de la API
///////////////////////////////////////////////////////////////////////////////////////

// Obtenemos la URL base del backend desde variables de entorno (.env).
// Esto permite cambiar entre local y producción sin tener que tocar el código.
const API_BASE_URL = import.meta.env.VITE_API_URL;

///////////////////////////////////////////////////////////////////////////////////////
// Función auxiliar registrarClick
///////////////////////////////////////////////////////////////////////////////////////

// Esta función registra en el backend cuando un usuario hace clic
// en alguno de los botones de contacto (Teléfono o WhatsApp).
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

// Definimos un componente funcional llamado ServiceCard.
// Recibe como props:
// - service → objeto con la info del prestador.
// - onVerMas → función a ejecutar cuando se toca “Ver más” para abrir el modal.
export default function ServiceCard({ service, onVerMas }) {
  //////////////////////////////////////////////////
  // Función handleClick
  //////////////////////////////////////////////////

  // Esta función se ejecuta cuando el usuario hace clic
  // en Teléfono o WhatsApp.
  //
  // - Registra el clic en el backend.
  // - Abre el enlace correspondiente en una nueva pestaña/ventana.
  //
  // Parámetros:
  // - tipo → "telefono" o "whatsapp".
  // - enlace → URL que queremos abrir (tel:... o https://wa.me/...)
  const handleClick = (tipo, enlace) => {
    registrarClick(service._id, tipo);
    window.open(enlace, "_blank");
  };

  //////////////////////////////////////////////////
  // Render principal
  //////////////////////////////////////////////////

  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-body">
        
        {/* Título → nombre del prestador */}
        <h5 className="card-title mb-1 text-center">
          {service.nombre}
        </h5>

        {/* Subtítulo → categoría y localidad */}
        <p className="card-subtitle mb-3 text-center">
          {service.categoria} en {service.localidad}
        </p>

        {/* Botones de acción */}
        <div className="d-flex flex-wrap gap-2 justify-content-center">
          {/* Botón Teléfono */}
          <button
            onClick={() => handleClick("telefono", `tel:${service.telefono}`)}
            className="btn btn-primary btn-sm"
          >
            Teléfono
          </button>

          {/* Botón WhatsApp */}
          <button
            onClick={() =>
              handleClick("whatsapp", `https://wa.me/${service.telefono}`)
            }
            className="btn btn-success btn-sm"
          >
            WhatsApp
          </button>

          {/* Botón Ver más */}
          <button
            onClick={() => onVerMas(service)}
            className="btn btn-dark btn-sm"
          >
            Ver más
          </button>
        </div>
      </div>
    </div>
  );
}

///////////////////////////////////////////////////////////////////////////////////////
// Resultado:
// - ServiceCard.jsx mantiene tu diseño original.
// - “Ver más” ahora abre el modal (no navega).
// - Clicks de Teléfono y WhatsApp siguen registrándose en el backend.
///////////////////////////////////////////////////////////////////////////////////////
