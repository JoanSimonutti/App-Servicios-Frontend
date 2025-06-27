///////////////////////////////////////////////////////////////////////////////////////
// ¿Qué hace Detalle.jsx?

// Este archivo define la vista de detalle de un prestador de servicios.
// Su objetivo es:
// - Mostrar toda la información de un servicio individual.
// - Permitir volver a la página anterior.
// - Permitir contactar al prestador (Teléfono o WhatsApp).
// - Registrar clics en el backend para métricas.

// ¿Por qué es importante?
// - Permite al usuario ver información ampliada antes de decidir contactarse.
// - Registra métricas de contacto → fundamental para la app.
// - Mantiene una navegación SPA (sin recargar la página).

// Con este archivo ganás:
// - UX fluida y profesional.
// - Información completa de cada prestador.
// - Analíticas reales de interacción.
// - Código mantenible y escalable.
///////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////
// Importaciones necesarias
///////////////////////////////////////////////////////////////////////////////////////

import React, { useEffect, useState } from "react";
// React → librería principal.
// useEffect → hook para ejecutar lógica al montar o actualizar.
// useState → hook para manejar estados internos.

import { useParams, useNavigate } from "react-router-dom";
// useParams → hook para leer parámetros dinámicos de la URL.
// useNavigate → hook para redireccionar programáticamente.

import axios from "axios";
// Axios → librería para realizar requests HTTP al backend.

///////////////////////////////////////////////////////////////////////////////////////
// Configuración de la URL base de la API
///////////////////////////////////////////////////////////////////////////////////////

// Obtenemos la URL base desde variables de entorno.
// Esto permite trabajar localmente o en producción sin cambiar el código.
const API_BASE_URL = import.meta.env.VITE_API_URL;

///////////////////////////////////////////////////////////////////////////////////////
// Componente principal Detalle
///////////////////////////////////////////////////////////////////////////////////////

export default function Detalle() {
  //////////////////////////////////////////////////
  // ESTADOS Y HOOKS BASE
  //////////////////////////////////////////////////

  // Extraemos el ID dinámico de la URL → /detalle/:id
  const { id } = useParams();

  // Hook para redirigir de vuelta a la página anterior.
  const navigate = useNavigate();

  // Estado que guarda el objeto completo del servicio.
  const [servicio, setServicio] = useState(null);

  // Estados para manejar estados de carga y errores.
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  //////////////////////////////////////////////////
  // Función fetchDetalle
  //////////////////////////////////////////////////

  // Esta función trae del backend los datos de UN servicio
  // según el ID obtenido de la URL.
  const fetchDetalle = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/serv/${id}`);
      setServicio(response.data);
    } catch (err) {
      console.error("Error al cargar los detalles:", err);
      setError("No se pudo cargar el servicio");
    } finally {
      setCargando(false);
    }
  };

  //////////////////////////////////////////////////
  // useEffect → Ejecuta fetchDetalle al montar el componente
  //////////////////////////////////////////////////

  useEffect(() => {
    fetchDetalle();
  }, [id]);

  //////////////////////////////////////////////////
  // Función registrarClick
  //////////////////////////////////////////////////

  // Esta función registra en el backend cuando el usuario
  // hace clic en Teléfono o WhatsApp.
  //
  // Parámetro:
  // - tipo → "telefono" o "whatsapp"
  const registrarClick = async (tipo) => {
    try {
      await axios.post(`${API_BASE_URL}/clic`, {
        serviceId: servicio._id,
        tipo,
      });
    } catch (err) {
      console.error(`Error al registrar clic (${tipo}):`, err);
    }
  };

  //////////////////////////////////////////////////
  // Función volver
  //////////////////////////////////////////////////

  // Esta función navega hacia atrás (mantiene el historial).
  const volver = () => navigate(-1);

  //////////////////////////////////////////////////
  // Render principal
  //////////////////////////////////////////////////

  // Si está cargando, mostramos un texto de carga.
  if (cargando) return <p className="text-center">Cargando...</p>;

  // Si ocurrió un error, mostramos mensaje de error.
  if (error) return <p className="text-danger text-center">{error}</p>;

  return (
    <div className="container py-5">
      <div className="card shadow-lg">
        <div className="card-body">
          
          {/* Título principal */}
          <h2 className="card-title">
            {servicio.nombre}
          </h2>

          {/* Categoría y localidad */}
          <p className="card-subtitle mb-3">
            {servicio.categoria} en {servicio.localidad}
          </p>

          {/* Tipo de servicio */}
          <p><strong>{servicio.tipoServicio}</strong></p>

          {/* Horarios de atención */}
          <p>
            <strong>Horario:</strong> {servicio.horaDesde}:00 a {servicio.horaHasta}:00 hs.
          </p>

          {/* Urgencias 24hs */}
          <p>
            <strong>Urgencias 24hs:</strong> {servicio.urgencias24hs ? "Sí" : "No"}.
          </p>

          {/* Atiende localidades cercanas */}
          <p>
            <strong>Atiende localidades cercanas:</strong> {servicio.localidadesCercanas ? "Sí" : "No"}.
          </p>

          {/* Botones de acción */}
          <div className="d-flex flex-wrap gap-2 mt-4">
            {/* Botón para llamar */}
            <button
              onClick={() => {
                registrarClick("telefono");
                window.open(`tel:${servicio.telefono}`, "_blank");
              }}
              className="btn btn-primary"
            >
              Llamar
            </button>

            {/* Botón para WhatsApp */}
            <button
              onClick={() => {
                registrarClick("whatsapp");
                window.open(`https://wa.me/${servicio.telefono}`, "_blank");
              }}
              className="btn btn-success"
            >
              WhatsApp
            </button>

            {/* Botón para volver */}
            <button
              onClick={volver}
              className="btn btn-dark"
            >
              Volver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

///////////////////////////////////////////////////////////////////////////////////////
// Resultado:
// - Detalle.jsx corregido para usar endpoints reales (/serv y /clic).
// - Preparado para local y producción usando variables de entorno.
// - Código totalmente documentado y claro.
// - Perfecto para métricas y navegación SPA profesional.
///////////////////////////////////////////////////////////////////////////////////////
