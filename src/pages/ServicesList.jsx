///////////////////////////////////////////////////////////////////////////////////////
// ServicesList.jsx (con Modal integrado)
//
// Pantalla que muestra resultados de búsqueda de servicios.
//
// Qué hace:
// - Lee filtros desde query params (categoria, localidad, urgencias24hs)
// - Llama al endpoint GET /serv con esos filtros.
// - Renderiza un listado de ServiceCard.
// - Muestra modal Detalle al hacer click en "Más Info".
// - Muestra mensaje si no hay resultados.
// - Muestra spinner mientras carga.
// - Evita errores si el backend devuelve datos nulos o incompletos.
///////////////////////////////////////////////////////////////////////////////////////

import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api"; // Importamos nuestro Axios centralizado
import ServiceCard from "../components/ServiceCard"; // Componente para cada servicio
import Modal from "../components/Modal"; // Nuestro nuevo componente Modal
import Detalle from "../pages/Detalle"; // Componente para mostrar detalle
import "./ServicesListModules.css"; // Estilos específicos

const ServicesList = () => {
  /////////////////////////////////////////////////////////////////////////////
  // Estados locales:
  /////////////////////////////////////////////////////////////////////////////

  const [searchParams] = useSearchParams();

  // services → array de resultados de la búsqueda
  const [services, setServices] = useState([]);

  // loading → true mientras se carga la búsqueda
  const [loading, setLoading] = useState(true);

  // error → almacena mensajes de error si algo sale mal
  const [error, setError] = useState(null);

  // showModal → controla visibilidad del modal
  const [showModal, setShowModal] = useState(false);

  // selectedService → guarda el objeto servicio seleccionado para el modal
  const [selectedService, setSelectedService] = useState(null);

  /////////////////////////////////////////////////////////////////////////////
  // useEffect → se ejecuta una sola vez al montar el componente
  /////////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    // Creamos un objeto params para enviar en el GET
    const params = {};

    // Obtenemos cada parámetro de la URL si existe:
    const categoria = searchParams.get("categoria");
    const localidad = searchParams.get("localidad");
    const urgencias = searchParams.get("urgencias24hs");

    if (categoria) params.categoria = categoria;
    if (localidad) params.localidad = localidad;
    if (urgencias) params.urgencias24hs = true;

    // Llamamos al endpoint /serv
    api
      .get("/serv", { params })
      .then((res) => {
        console.log("→ Servicios obtenidos:", res.data);
        setServices(res.data || []);
      })
      .catch((err) => {
        console.error(err);
        setError("Error al cargar los servicios. Intenta nuevamente.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [searchParams]);

  /////////////////////////////////////////////////////////////////////////////
  // Función que se dispara cuando se hace click en "Más Info"
  /////////////////////////////////////////////////////////////////////////////

  const handleVerMas = (serviceObj) => {
    setSelectedService(serviceObj);
    setShowModal(true);
  };

  /////////////////////////////////////////////////////////////////////////////
  // Renderizado:
  /////////////////////////////////////////////////////////////////////////////

  if (loading) {
    return (
      <div className="services-list-loading">
        <p>Cargando servicios...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="services-list-error">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <>
      {/* Contenido principal */}
      <div className="container services-list-container">
        {/* Título de la página */}
        <h1 className="text-center my-4">Resultados de búsqueda</h1>

        {/* Si no hay resultados */}
        {services.length === 0 && (
          <p className="text-center">
            No se encontraron servicios con los filtros seleccionados.
          </p>
        )}

        {/* Grid de resultados */}
        <div className="row">
          {services
            .filter(
              (servicio) =>
                servicio && servicio.nombre && servicio.telefono && servicio._id
            )
            .map((servicio) => (
              <div
                key={servicio._id}
                className="col-12 col-sm-6 col-lg-4 d-flex justify-content-center mb-4"
              >
                <ServiceCard service={servicio} onVerMas={handleVerMas} />
              </div>
            ))}
        </div>
      </div>

      {/* Modal que muestra Detalle */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        {/* Renderizamos Detalle dentro del modal */}
        {selectedService && <Detalle servicio={selectedService} />}
      </Modal>
    </>
  );
};

export default ServicesList;
