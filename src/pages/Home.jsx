///////////////////////////////////////////////////////////////////////////////////////
// Home.jsx
//
// Qué hace:
// - Muestra listado de servicios con filtros.
// - Integra modal de detalle.
// - Incluye botón flotante para volver arriba.
//
// Rediseñado:
// - Elimina Bootstrap.
// - Usa clases propias coherentes con header, login, etc.
// - Diseño dark+gold profesional.
// - Completamente responsive.
///////////////////////////////////////////////////////////////////////////////////////

import React, { useState, useEffect } from "react";
import axios from "axios";

import ServiceCard from "../components/ServiceCard";
import Detalle from "./Detalle";

import "./HomeModules.css";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function Home() {
  const [services, setServices] = useState([]);
  const [total, setTotal] = useState(0);
  const [categorias, setCategorias] = useState([]);
  const [localidades, setLocalidades] = useState([]);

  const [categoriaFiltro, setCategoriaFiltro] = useState("");
  const [localidadFiltro, setLocalidadFiltro] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    obtenerServicios();
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const obtenerServicios = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/serv`);
      setServices(res.data);
      setTotal(res.data.length);

      const categoriasUnicas = [...new Set(res.data.map((s) => s.categoria))];
      setCategorias(categoriasUnicas);

      const localidadesUnicas = [...new Set(res.data.map((s) => s.localidad))];
      setLocalidades(localidadesUnicas);
    } catch (err) {
      console.error("Error al traer servicios:", err);
    }
  };

  const serviciosFiltrados = services.filter((s) => {
    return (
      (categoriaFiltro === "" || s.categoria === categoriaFiltro) &&
      (localidadFiltro === "" || s.localidad === localidadFiltro)
    );
  });

  const handleVerMas = (service) => {
    setSelectedService(service);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedService(null);
  };

  const handleScroll = () => {
    if (window.scrollY > 100) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  };

  const handleScrollTop = (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="home-container">
      {/* Botón flotante */}
      <a
        href="#"
        className={`home-btn-floating ${showButton ? "visible" : ""}`}
        onClick={handleScrollTop}
      >
        ↑
      </a>

      {/* Filtros */}
      <div className="home-filters">
        <div className="home-filter">
          <select
            className="home-select"
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

        <div className="home-filter">
          <select
            className="home-select"
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

      <p className="home-count-text">
        Se encontraron <strong>{serviciosFiltrados.length}</strong> servicios.
      </p>

      <div className="home-cards">
        {serviciosFiltrados.map((service) => (
          <ServiceCard
            key={service._id}
            service={service}
            onVerMas={handleVerMas}
          />
        ))}
      </div>

      {/* Modal para detalle */}
      {showModal && (
        <div className="home-modal-backdrop" onClick={handleCloseModal}>
          <div
            className="home-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="home-modal-close" onClick={handleCloseModal}>
              ×
            </button>
            {selectedService && <Detalle servicio={selectedService} />}
          </div>
        </div>
      )}
    </div>
  );
}
