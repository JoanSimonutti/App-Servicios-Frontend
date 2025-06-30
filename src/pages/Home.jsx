///////////////////////////////////////////////////////////////////////////////////////
// Home.jsx
///////////////////////////////////////////////////////////////////////////////////////

import React, { useState, useEffect } from "react";
import axios from "axios";

import ServiceCard from "../components/ServiceCard";
import Detalle from "./Detalle";

import { Modal, Button } from "react-bootstrap";

import "./HomeModules.css";
// Importamos los estilos externos exclusivos de Home.

///////////////////////////////////////////////////////////////////////////////////////
// Configuración URL backend
///////////////////////////////////////////////////////////////////////////////////////

const API_BASE_URL = import.meta.env.VITE_API_URL;

///////////////////////////////////////////////////////////////////////////////////////
// Componente Home
///////////////////////////////////////////////////////////////////////////////////////

export default function Home() {
  ////////////////////////////////////////////////////////////////////////////
  // Estados
  ////////////////////////////////////////////////////////////////////////////

  const [services, setServices] = useState([]); // Todos los servicios desde backend
  const [total, setTotal] = useState(0); // Total de servicios
  const [categorias, setCategorias] = useState([]); // Categorías únicas
  const [localidades, setLocalidades] = useState([]); // Localidades únicas

  const [categoriaFiltro, setCategoriaFiltro] = useState(""); // Filtro por categoría
  const [localidadFiltro, setLocalidadFiltro] = useState(""); // Filtro por localidad

  const [showModal, setShowModal] = useState(false); // Estado de apertura del modal
  const [selectedService, setSelectedService] = useState(null); // Servicio a mostrar

  ////////////////////////////////////////////////////////////////////////////
  // Efecto inicial → trae los servicios del backend
  ////////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    obtenerServicios();
  }, []);

  ////////////////////////////////////////////////////////////////////////////
  // Función para obtener servicios del backend
  ////////////////////////////////////////////////////////////////////////////

  const obtenerServicios = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/serv`);
      setServices(res.data);
      setTotal(res.data.length);

      // Creamos listas únicas para filtros
      const categoriasUnicas = [...new Set(res.data.map((s) => s.categoria))];
      setCategorias(categoriasUnicas);

      const localidadesUnicas = [...new Set(res.data.map((s) => s.localidad))];
      setLocalidades(localidadesUnicas);

    } catch (err) {
      console.error("Error al traer servicios:", err);
    }
  };

  ////////////////////////////////////////////////////////////////////////////
  // Lógica de filtrado
  ////////////////////////////////////////////////////////////////////////////

  const serviciosFiltrados = services.filter((s) => {
    return (
      (categoriaFiltro === "" || s.categoria === categoriaFiltro) &&
      (localidadFiltro === "" || s.localidad === localidadFiltro)
    );
  });

  ////////////////////////////////////////////////////////////////////////////
  // Funciones para el modal
  ////////////////////////////////////////////////////////////////////////////

  const handleVerMas = (service) => {
    setSelectedService(service);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedService(null);
  };

  ////////////////////////////////////////////////////////////////////////////
  // Render principal
  ////////////////////////////////////////////////////////////////////////////

  return (
    <div className="container mt-4">

      {/* Título principal */}
      <h1 className="home-title">Seleccionar Servicios</h1>

      {/* Filtros */}
      <div className="row mb-4">
        {/* Filtro de categoría */}
        <div className="col-md-6 mb-3">
          <select
            className="form-select home-select"
            value={categoriaFiltro}
            onChange={(e) => setCategoriaFiltro(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {categorias.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro de localidad */}
        <div className="col-md-6">
          <select
            className="form-select home-select"
            value={localidadFiltro}
            onChange={(e) => setLocalidadFiltro(e.target.value)}
          >
            <option value="">Todas las localidades</option>
            {localidades.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Texto de cantidad de resultados */}
      <p className="home-count-text">
        Se encontraron <strong>{serviciosFiltrados.length}</strong> servicios.
      </p>

      {/* Grilla de tarjetas */}
      <div className="home-row">
        {serviciosFiltrados.map((service) => (
          <div key={service._id} className="col-md-4">
            <ServiceCard
              service={service}
              onVerMas={handleVerMas}
            />
          </div>
        ))}
      </div>

      {/* Modal para detalle */}
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Detalles del Servicio</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          {selectedService && (
            <Detalle servicio={selectedService} />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="dark" onClick={handleCloseModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

///////////////////////////////////////////////////////////////////////////////////////
// - Estética unificada con ServiceCard y Detalle.
