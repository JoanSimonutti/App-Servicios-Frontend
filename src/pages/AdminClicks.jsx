///////////////////////////////////////////////////////////////////////////////////////
// ¿Qué hace AdminClicks.jsx?
// Este archivo define la vista de administración que muestra estadísticas de clics.

// Su objetivo es:
// - Traer todos los clics registrados en el backend.
// - Agruparlos por prestador.
// - Mostrar un cuadro resumen con:
//    • Nombre del servicio
//    • Categoría
//    • Teléfono
//    • Cantidad de clics en WhatsApp
//    • Cantidad de clics en Teléfono
//    • Total de clics.

// ¿Por qué es importante?
// - Permite al administrador saber qué prestadores tienen más interacción.
// - Es una herramienta de analítica y toma de decisiones.
// - Refleja el éxito de la plataforma.

// Con este archivo ganás:
// - Visibilidad sobre el comportamiento de los usuarios.
// - Información estratégica para monetizar la app.
// - Código profesional, limpio y mantenible.
///////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////
// Importaciones necesarias
///////////////////////////////////////////////////////////////////////////////////////

import React, { useEffect, useState } from "react";
// React → librería principal para construir interfaces.
// useEffect → hook para lógica tras montaje o cambios.
// useState → hook para manejar estados internos.

import axios from "axios";
// Axios → librería para hacer requests HTTP al backend.

///////////////////////////////////////////////////////////////////////////////////////
// Configuración de la URL base de la API
///////////////////////////////////////////////////////////////////////////////////////

// Obtenemos la URL base del backend desde variables de entorno (.env).
// Esto nos permite trabajar local o en producción sin cambiar el código.
const API_BASE_URL = import.meta.env.VITE_API_URL;

///////////////////////////////////////////////////////////////////////////////////////
// Componente principal AdminClicks
///////////////////////////////////////////////////////////////////////////////////////

export default function AdminClicks() {
  //////////////////////////////////////////////////
  // ESTADOS
  //////////////////////////////////////////////////

  // Guardamos todos los clics tal como vienen del backend.
  const [clicks, setClicks] = useState([]);

  // Guardamos los datos agrupados para mostrarlos en la tabla.
  const [agrupado, setAgrupado] = useState({});

  //////////////////////////////////////////////////
  // Función fetchClicks
  //////////////////////////////////////////////////

  // Esta función trae TODOS los clics desde el backend.
  const fetchClicks = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/clic`);
      setClicks(res.data);
    } catch (err) {
      console.error("Error al cargar clics:", err);
    }
  };

  //////////////////////////////////////////////////
  // Función agruparClics
  //////////////////////////////////////////////////

  // Esta función agrupa todos los clics por serviceId.
  //
  // Para cada servicio:
  // - Sumamos cuántos clics fueron de WhatsApp.
  // - Sumamos cuántos clics fueron de Teléfono.
  // - Guardamos nombre, categoría y teléfono del servicio.
  const agruparClics = () => {
    const resultado = {};

    clicks.forEach((click) => {
      const id = click.serviceId._id;

      // Si todavía no está creado, lo inicializamos.
      if (!resultado[id]) {
        resultado[id] = {
          nombre: click.serviceId.nombre,
          categoria: click.serviceId.categoria,
          telefono: click.serviceId.telefono,
          whatsapp: 0,
          telefonoCount: 0,
        };
      }

      // Sumamos el clic en el tipo correspondiente.
      if (click.tipo === "whatsapp") resultado[id].whatsapp += 1;
      if (click.tipo === "telefono") resultado[id].telefonoCount += 1;
    });

    // Guardamos el objeto agrupado en el estado.
    setAgrupado(resultado);
  };

  //////////////////////////////////////////////////
  // useEffect → Ejecuta fetchClicks al montar
  //////////////////////////////////////////////////

  useEffect(() => {
    fetchClicks();
  }, []);

  //////////////////////////////////////////////////
  // useEffect → Agrupa cada vez que cambian los clics
  //////////////////////////////////////////////////

  useEffect(() => {
    if (clicks.length > 0) agruparClics();
  }, [clicks]);

  //////////////////////////////////////////////////
  // Render principal
  //////////////////////////////////////////////////

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-center">Estadísticas de Contactos</h2>

      {Object.values(agrupado).length === 0 ? (
        <p className="text-muted text-center">
          Todavía no hay clics registrados.
        </p>
      ) : (
        <table className="table table-striped table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Teléfono</th>
              <th>WhatsApp</th>
              <th>Teléfono</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {Object.values(agrupado).map((servicio, idx) => (
              <tr key={idx}>
                <td>{servicio.nombre}</td>
                <td>{servicio.categoria}</td>
                <td>{servicio.telefono}</td>
                <td>{servicio.whatsapp}</td>
                <td>{servicio.telefonoCount}</td>
                <td>{servicio.whatsapp + servicio.telefonoCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

///////////////////////////////////////////////////////////////////////////////////////
// Resultado:
// - AdminClicks.jsx corregido con endpoint real (/clic).
// - Preparado para funcionar en local o producción.
// - Código limpio, profesional y perfecto para analítica.
///////////////////////////////////////////////////////////////////////////////////////
