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

  // NUEVO:
  // Estado para saber qué slide está activo en el carrusel.
  const [activeSlide, setActiveSlide] = useState(0);

  // NUEVO:
  // Array con los datos de cada slide:
  // - image → nombre del archivo (deberá estar en /public/images o donde lo definas)
  // - title → título grande.
  // - subtitle → texto secundario.
  const slides = [
    {
      image: "/images/slide1.jpg",
      title: "ENCONTRÁ TU SERVICIO",
      subtitle: "Filtrá, explorá y contactá profesionales",
    },
    {
      image: "/images/slide2.jpg",
      title: "SUMATE COMO PRESTADOR",
      subtitle: "Publicá y llegá a más clientes",
    },
    {
      image: "/images/slide3.jpg",
      title: "DISPONIBLE PARA PUBLICIDAD",
      subtitle: "Impulsá tu local hoy mismo",
    },
  ];

  // NUEVO:
  // Efecto para ir cambiando de slide cada 5 segundos automáticamente.
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

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

      <div className="home-container">
        {/* NUEVO:
            Carrusel de imágenes.
            Se coloca antes del título principal para ocupar la parte superior de la página.
        */}
        <div
          className="home-carousel"
          style={{
            backgroundImage: `url(${slides[activeSlide].image})`,
          }}
        >
          <div className="home-carousel-overlay">
            <h2 className="home-carousel-title">{slides[activeSlide].title}</h2>
            <p className="home-carousel-subtitle">
              {slides[activeSlide].subtitle}
            </p>
          </div>
        </div>

        {/* Título principal
        <h1 className="home-title">Listado de Servicios</h1> */}

        {/* Resto de tu código original */}
        <div className="row home-filters">
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

        <p className="home-count-text text-center">
          Se encontraron <strong>{serviciosFiltrados.length}</strong> servicios
        </p>

        <div className="row">
          {serviciosFiltrados.map((service) => (
            <div key={service._id} className="col-12 col-md-6 col-lg-4 mb-4">
              <ServiceCard service={service} onVerMas={handleVerMas} />
            </div>
          ))}
        </div>
      </div>

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
