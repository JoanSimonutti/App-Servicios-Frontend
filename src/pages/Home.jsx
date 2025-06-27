///////////////////////////////////////////////////////////////////////////////////////
// ¿Qué hace Home.jsx?

// Este archivo es la pantalla principal (Home) de tu app de servicios.
// Su objetivo es:
// - Traer todos los servicios desde el backend.
// - Mostrar esos servicios en forma de tarjetas (ServiceCard).
// - Permitir que el usuario filtre servicios por categoría o localidad.

// ¿Por qué es importante?
// Porque es la primera vista que ve el usuario:
// - Tiene que ser rápida.
// - Debe mostrar resultados reales.
// - Permite filtrar fácilmente sin recargar la página.
// - Es la base para que la app sea útil y profesional.

// Con este archivo ganás:
// - Experiencia de usuario ágil y profesional.
// - Código organizado, mantenible y escalable.
// - Consumo real de datos del backend.
// - Separación clara de responsabilidades (datos vs presentación).
///////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////
// Importaciones necesarias
///////////////////////////////////////////////////////////////////////////////////////

import React, { useEffect, useState } from "react"; 
// React → la librería principal para construir interfaces.
// useEffect → hook para ejecutar código cuando el componente se monta o cambia.
// useState → hook para manejar estados internos.

import axios from "axios"; 
// Axios → librería para hacer llamadas HTTP (GET, POST, etc.)

import ServiceCard from "../components/ServiceCard"; 
// Importamos el componente que renderiza cada tarjeta individual de servicio.

///////////////////////////////////////////////////////////////////////////////////////
// Configuración de la URL base de la API
///////////////////////////////////////////////////////////////////////////////////////

// Obtenemos la URL base del backend desde variables de entorno (.env).
// Esto permite cambiar entre local y producción sin tocar el código.
const API_BASE_URL = import.meta.env.VITE_API_URL;

///////////////////////////////////////////////////////////////////////////////////////
// Componente principal Home
///////////////////////////////////////////////////////////////////////////////////////

export default function Home() {

  //////////////////////////////////////////////////
  // Definición de estados locales
  //////////////////////////////////////////////////

  // Estado que guarda TODOS los servicios que trae el backend.
  const [servicios, setServicios] = useState([]);

  // Estados para los filtros seleccionados por el usuario.
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("todas");
  const [localidadSeleccionada, setLocalidadSeleccionada] = useState("todas");

  // Estado para la lista de servicios que se va a mostrar filtrada.
  const [filtrados, setFiltrados] = useState([]);

  //////////////////////////////////////////////////
  // Función para traer los servicios del backend
  //////////////////////////////////////////////////

  const fetchServices = async () => {
    try {
      // Hacemos la llamada al backend:
      // GET → obtiene datos.
      // URL → /serv (endpoint real).
      const response = await axios.get(`${API_BASE_URL}/serv`);

      // Guardamos el resultado en el estado original.
      setServicios(response.data);

      // Inicialmente, mostramos todos los servicios.
      setFiltrados(response.data);
    } catch (error) {
      // Si ocurre un error, lo mostramos en consola.
      console.error("Error al obtener los servicios:", error);
    }
  };

  //////////////////////////////////////////////////
  // useEffect → Se ejecuta UNA SOLA VEZ
  //////////////////////////////////////////////////

  // Apenas se monta el componente (Home), trae los servicios del backend.
  useEffect(() => {
    fetchServices();
  }, []);

  //////////////////////////////////////////////////
  // useEffect → Ejecuta el filtrado cuando cambian:
  // - La categoría seleccionada
  // - La localidad seleccionada
  // - La lista de servicios original
  //////////////////////////////////////////////////

  useEffect(() => {
    // Hacemos una copia de todos los servicios.
    let resultado = [...servicios];

    // Si la categoría no es "todas", filtramos por la categoría elegida.
    if (categoriaSeleccionada !== "todas") {
      resultado = resultado.filter(
        (s) => s.categoria.toLowerCase() === categoriaSeleccionada.toLowerCase()
      );
    }

    // Si la localidad no es "todas", filtramos por la localidad elegida.
    if (localidadSeleccionada !== "todas") {
      resultado = resultado.filter(
        (s) => s.localidad.toLowerCase() === localidadSeleccionada.toLowerCase()
      );
    }

    // Actualizamos el estado con la lista filtrada.
    setFiltrados(resultado);
  }, [categoriaSeleccionada, localidadSeleccionada, servicios]);

  //////////////////////////////////////////////////
  // Listas únicas de categorías y localidades
  //////////////////////////////////////////////////

  // Extraemos categorías únicas para el filtro, más la opción "todas".
  const categoriasDisponibles = [
    "todas",
    ...new Set(servicios.map((s) => s.categoria.toLowerCase())),
  ];

  // Extraemos localidades únicas para el filtro, más la opción "todas".
  const localidadesDisponibles = [
    "todas",
    ...new Set(servicios.map((s) => s.localidad.toLowerCase())),
  ];

  //////////////////////////////////////////////////
  // Render principal
  //////////////////////////////////////////////////

  return (
    <div className="container py-5">
      {/* Título principal */}
      <h1 className="text-center mb-4">Buscar Servicios</h1>

      {/* Filtros */}
      <div className="row mb-4">
        {/* Filtro por categoría */}
        <div className="col-md-6 mb-2">
          <label className="form-label">Filtrar por categoría:</label>
          <select
            className="form-select"
            value={categoriaSeleccionada}
            onChange={(e) => setCategoriaSeleccionada(e.target.value)}
          >
            {categoriasDisponibles.map((categoria, idx) => (
              <option key={idx} value={categoria}>
                {/* Mostramos la primera letra en mayúscula */}
                {categoria.charAt(0).toUpperCase() + categoria.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por localidad */}
        <div className="col-md-6 mb-2">
          <label className="form-label">Filtrar por localidad:</label>
          <select
            className="form-select"
            value={localidadSeleccionada}
            onChange={(e) => setLocalidadSeleccionada(e.target.value)}
          >
            {localidadesDisponibles.map((localidad, idx) => (
              <option key={idx} value={localidad}>
                {localidad.charAt(0).toUpperCase() + localidad.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista de resultados */}
      {filtrados.length === 0 ? (
        <p className="text-muted text-center">
          No se encontraron servicios.
        </p>
      ) : (
        <div className="row">
          {filtrados.map((servicio) => (
            <div key={servicio._id} className="col-md-4 mb-1">
              {/* Renderizamos la tarjeta individual del servicio */}
              <ServiceCard service={servicio} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

///////////////////////////////////////////////////////////////////////////////////////
// Resultado:
// - Usa el endpoint real del backend (/serv).
// - Está preparado para funcionar tanto en local como en producción.
// - Listo para mantener un código profesional, limpio y entendible por cualquier
//   desarrollador que se sume al proyecto.
///////////////////////////////////////////////////////////////////////////////////////
