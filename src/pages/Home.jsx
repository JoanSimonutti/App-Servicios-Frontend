///////////////////////////////////////////////////////////////////////////////////////
// Home.jsx
///////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////
// Importaciones
///////////////////////////////////////////////////////////////////////////////////////

import React, { useState, useEffect } from "react";
import axios from "axios";
import ServiceCard from "../components/ServiceCard";
import Detalle from "./Detalle";
import { Modal, Button } from "react-bootstrap";

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

  const [services, setServices] = useState([]);      // Servicios traídos del backend
  const [total, setTotal] = useState(0);             // Total de servicios
  const [categorias, setCategorias] = useState([]);  // Categorías únicas
  const [localidades, setLocalidades] = useState([]);// Localidades únicas
  const [categoriaFiltro, setCategoriaFiltro] = useState(""); // Filtro categoría
  const [localidadFiltro, setLocalidadFiltro] = useState(""); // Filtro localidad

  const [showModal, setShowModal] = useState(false);      // Modal abierto/cerrado
  const [selectedService, setSelectedService] = useState(null); // Servicio para mostrar en modal

  ////////////////////////////////////////////////////////////////////////////
  // useEffect inicial → trae todos los servicios
  ////////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    obtenerServicios();
  }, []);

  ////////////////////////////////////////////////////////////////////////////
  // Función obtenerServicios → trae datos del backend
  ////////////////////////////////////////////////////////////////////////////

  const obtenerServicios = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/serv`);
      setServices(res.data);
      setTotal(res.data.length);

      // Armamos listas únicas de categorías y localidades
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

  // Abre el modal con el servicio seleccionado
  const handleVerMas = (service) => {
    setSelectedService(service);
    setShowModal(true);
  };

  // Cierra el modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedService(null);
  };

  ////////////////////////////////////////////////////////////////////////////
  // Render
  ////////////////////////////////////////////////////////////////////////////

  return (
    <div className="container mt-4">

      {/* Título */}
      <h1 className="mb-4 text-center">Seleccionar Servicios</h1>

      {/* Filtros */}
      <div className="row mb-3">
        {/* Filtro categoría */}
        <div className="col-md-6 mb-2">
          <select
            className="form-select text-center"
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

        {/* Filtro localidad */}
        <div className="col-md-6">
          <select
            className="form-select text-center"
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

        {/* Info de cantidad */}
      <p className="mb-2 text-center">
        Se encontraron <strong>{serviciosFiltrados.length}</strong> servicios.
      </p>

      {/* Listado de tarjetas */}
      <div className="row">
        {serviciosFiltrados.map((service) => (
          <div key={service._id} className="col-md-4">
            <ServiceCard
              service={service}
              onVerMas={handleVerMas}
            />
          </div>
        ))}
      </div>

      {/* Modal de detalle */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Detalle del Servicio</Modal.Title>
        </Modal.Header>
      <Modal.Body className="p-0">
       {/* Renderizamos el componente Detalle solo si hay servicio seleccionado */}
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
// Resultado:
// - Home.jsx mantiene exactamente la lógica original.
// - Modal funcionando para ver detalles.
///////////////////////////////////////////////////////////////////////////////////////
