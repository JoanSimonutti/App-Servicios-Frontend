////////////////////////////////////////////////////////////////////////////////////////
// Home.jsx
//
// Qué hace este archivo:
//
// - Muestra el listado de servicios de la app.
// - Permite filtrar por categoría y localidad.
// - Renderiza tarjetas de servicio (ServiceCard).
// - Muestra un botón flotante para volver arriba.
// - Integra modal de detalle (Detalle).
//
// Rediseñado:
// - Integra Bootstrap grid (container, row, col).
// - Elimina clases Bootstrap redundantes en favor de layout limpio.
// - Totalmente responsive.
// - Coherente con el layout dark+gold de la app.
//
// Este componente es el corazón visual del listado de servicios.
////////////////////////////////////////////////////////////////////////////////////////

import React, { useState, useEffect } from "react";
import axios from "axios";

import ServiceCard from "../components/ServiceCard";
import Detalle from "./Detalle";

import "./HomeModules.css";

////////////////////////////////////////////////////////////////////////////////////////
// Declaramos constantes globales
////////////////////////////////////////////////////////////////////////////////////////

const API_BASE_URL = import.meta.env.VITE_API_URL;

////////////////////////////////////////////////////////////////////////////////////////
// Componente funcional Home
////////////////////////////////////////////////////////////////////////////////////////

export default function Home() {
  // Estado que contiene todos los servicios obtenidos del backend
  const [services, setServices] = useState([]);

  // Estado que guarda cuántos servicios totales hay
  const [total, setTotal] = useState(0);

  // Estados para almacenar listas únicas de categorías y localidades
  const [categorias, setCategorias] = useState([]);
  const [localidades, setLocalidades] = useState([]);

  // Estados para los filtros seleccionados
  const [categoriaFiltro, setCategoriaFiltro] = useState("");
  const [localidadFiltro, setLocalidadFiltro] = useState("");

  // Estado para mostrar el modal de detalle
  const [showModal, setShowModal] = useState(false);

  // Servicio actualmente seleccionado para mostrar detalle
  const [selectedService, setSelectedService] = useState(null);

  // Estado que controla la visibilidad del botón flotante ↑
  const [showButton, setShowButton] = useState(false);

  // Hook para cargar servicios al inicio
  useEffect(() => {
    obtenerServicios();
  }, []);

  // Hook que escucha el scroll de la ventana
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Función que trae todos los servicios desde el backend
  const obtenerServicios = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/serv`);
      setServices(res.data);
      setTotal(res.data.length);

      // Extraemos listas únicas de categorías y localidades
      const categoriasUnicas = [...new Set(res.data.map((s) => s.categoria))];
      setCategorias(categoriasUnicas);

      const localidadesUnicas = [...new Set(res.data.map((s) => s.localidad))];
      setLocalidades(localidadesUnicas);
    } catch (err) {
      console.error("Error al traer servicios:", err);
    }
  };

  // Filtramos los servicios según los filtros seleccionados
  const serviciosFiltrados = services.filter((s) => {
    return (
      (categoriaFiltro === "" || s.categoria === categoriaFiltro) &&
      (localidadFiltro === "" || s.localidad === localidadFiltro)
    );
  });

  // Manejador para abrir modal de detalle
  const handleVerMas = (service) => {
    setSelectedService(service);
    setShowModal(true);
  };

  // Manejador para cerrar el modal de detalle
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedService(null);
  };

  // Manejador para detectar si el scroll pasó un límite
  const handleScroll = () => {
    if (window.scrollY > 100) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  };

  // Función para scrollear hacia arriba suavemente
  const handleScrollTop = (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {/* 
        Botón flotante ↑ 
        Está fuera de .container para posicionarse de manera absoluta en la ventana.
      */}
      <a
        href="#"
        className={`home-btn-floating ${showButton ? "visible" : ""}`}
        onClick={handleScrollTop}
      >
        ↑
      </a>

      {/* 
        Contenedor Bootstrap global.
        Todas las páginas están envueltas en un <div className="container">
        gracias a Layout.jsx, pero lo mantenemos aquí por flexibilidad.
      */}
      <div className="home-container">
        {/* Título principal */}
        <h1 className="home-title">Listado de Servicios</h1>

        {/* 
          Filtros en fila.
          Usamos Bootstrap Grid:
          - row → crea una fila.
          - col-12 col-md-6 → en mobile ocupa todo, en desktop mitad de ancho.
        */}
        <div className="row home-filters mb-4">
          <div className="col-12 col-md-6">
            <select
              className="home-select form-select"
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

          <div className="col-12 col-md-6 mt-3 mt-md-0">
            <select
              className="home-select form-select"
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

        {/* Texto de conteo */}
        <p className="home-count-text text-center">
          Se encontraron <strong>{serviciosFiltrados.length}</strong> servicios.
        </p>

        {/* 
          Grilla de servicios.
          Usamos Bootstrap Grid:
          - row → crea filas.
          - col-12 col-md-6 col-lg-4 → en mobile ocupa todo, en desktop divide en 3 columnas.
        */}
        <div className="row">
          {serviciosFiltrados.map((service) => (
            <div key={service._id} className="col-12 col-md-6 col-lg-4 mb-4">
              <ServiceCard service={service} onVerMas={handleVerMas} />
            </div>
          ))}
        </div>
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
    </>
  );
}
