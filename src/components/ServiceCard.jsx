///////////////////////////////////////////////////////////////////////////////////////
// ¿Qué hace ServiceCard.jsx?
// Este archivo define un componente visual que muestra la “tarjeta” de un servicio.

// Cada tarjeta:
// - Muestra el nombre, categoría y localidad del prestador.
// - Tiene botones para:
//    • Llamar al prestador (tel:)
//    • Enviar WhatsApp
//    • Ver más detalles (redirige a la ruta /detalle/:id)
// - Registra en el backend cada clic realizado (analítica).

// ¿Por qué es importante?
// - Es la pieza visual que ve el usuario en la grilla de servicios.
// - Permite al usuario interactuar directamente con el prestador.
// - Registra los clics en el backend → fundamental para métricas.
// - Mantiene la navegación SPA sin recargar la página.

// Con este archivo ganás:
// - Interfaz atractiva y funcional.
// - Integración directa con el backend.
// - Métricas reales de interacción de usuarios.
// - Código profesional, ordenado y mantenible.
///////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////
// Importaciones necesarias
///////////////////////////////////////////////////////////////////////////////////////

import React from "react";
// Importamos React para poder definir componentes.

import axios from "axios";
// Axios → librería para hacer llamadas HTTP al backend.

import { useNavigate } from "react-router-dom";
// useNavigate → hook que permite navegar programáticamente en apps SPA.

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
// Recibe como prop un objeto "service" que contiene toda la info del prestador.
export default function ServiceCard({ service }) {
  // Hook de React Router que nos permite redireccionar a otras rutas.
  const navigate = useNavigate();

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
  // Función irADetalle
  //////////////////////////////////////////////////

  // Esta función redirige a la página de detalle del servicio.
  // Construye la ruta dinámica: /detalle/:id
  const irADetalle = () => {
    navigate(`/detalle/${service._id}`);
  };

  //////////////////////////////////////////////////
  // Render principal
  //////////////////////////////////////////////////

  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-body">
        
        {/* Título → nombre del prestador */}
        <h5 className="card-title mb-1">
          {service.nombre}
        </h5>

        {/* Subtítulo → categoría y localidad */}
        <p className="card-subtitle mb-3">
          {service.categoria} en {service.localidad}
        </p>

        {/* Botones de acción */}
        <div className="d-flex flex-wrap gap-2">
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
            onClick={irADetalle}
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
// - ServiceCard.jsx ahora está completamente documentado.
// - Endpoints corregidos → usa /clic.
// - Usa variable de entorno API_BASE_URL.
// - Código limpio, profesional y listo para producción.
///////////////////////////////////////////////////////////////////////////////////////
