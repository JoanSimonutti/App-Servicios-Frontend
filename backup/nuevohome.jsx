////////////////////////////////////////////////////////////////////////////////////////
// Home.jsx
//
// Qué hace este archivo:
//
// - Muestra el listado de servicios de la app.
// - Permite filtrar por categoría, localidad, urgencias 24hs y texto libre.
// - Renderiza tarjetas de servicio (ServiceCard).
// - Muestra un botón flotante para volver arriba.
// - Integra modal de detalle (Detalle).
//
// Rediseñado:
// - Carrusel arriba del todo.
// - Buscador debajo del carrusel.
// - Buscador real: siempre consulta al backend, nunca filtra en frontend.
// - Localidades dinámicas traídas del backend.
// - Urgencias 24hs es checkbox.
// - Auto-complete real, con debounce, conectado al backend.
// - TODO comentado línea por línea.
//
// Este archivo es 100% listo para reemplazar el tuyo.
//
////////////////////////////////////////////////////////////////////////////////////////

import React, { useState, useEffect } from "react";
import axios from "axios";
import ServiceCard from "../components/ServiceCard";
import Detalle from "./Detalle";
import "./HomeModules.css";
import { FaRegWindowClose, FaRegArrowAltCircleUp } from "react-icons/fa";

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
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("");
  const [localidadFiltro, setLocalidadFiltro] = useState("");
  const [urgenciasFiltro, setUrgenciasFiltro] = useState(false);

  // Estado para sugerencias de auto-complete
  const [sugerencias, setSugerencias] = useState([]);

  // Estado para mostrar el modal de detalle
  const [showModal, setShowModal] = useState(false);

  // Servicio actualmente seleccionado para mostrar detalle
  const [selectedService, setSelectedService] = useState(null);

  // Estado que controla la visibilidad del botón flotante ↑
  const [showButton, setShowButton] = useState(false);

  // Estado del carrusel
  const [activeSlide, setActiveSlide] = useState(0);

  // Slides del carrusel
  const slides = [
    {
      image: "/images/slide1.jpg",
      title: "BIENVENIDO A SERVIPRO",
      subtitle: "Filtrá, explorá y contactá!",
    },
    {
      image: "/images/slide2.jpg",
      title: "SUMATE COMO PRESTADOR",
      subtitle: "Publicá y ganá más clientes!",
    },
    {
      image: "/images/slide3.jpg",
      title: "DISPONIBLE PUBLICIDAD",
      subtitle: "Impulsá tu local hoy mismo!",
    },
  ];

  // Efecto para ir cambiando de slide cada 5 segundos automáticamente.
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  // Al montar, traemos todos los servicios y armamos dinámicamente categorías y localidades
  useEffect(() => {
    obtenerServiciosIniciales();
  }, []);

  const obtenerServiciosIniciales = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/serv`);
      setServices(res.data);
      setTotal(res.data.length);

      // Armamos categorías únicas
      const categoriasUnicas = [
        ...new Set(res.data.map((s) => s.categoria)),
      ].filter(Boolean);
      setCategorias(categoriasUnicas);

      // Armamos localidades únicas
      const localidadesUnicas = [
        ...new Set(res.data.map((s) => s.localidad)),
      ].filter(Boolean);
      setLocalidades(localidadesUnicas);
    } catch (err) {
      console.error("Error al obtener servicios:", err);
    }
  };

  // Debounce para evitar múltiples llamadas al backend mientras se escribe
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (textoBusqueda.trim() !== "") {
        buscarSugerencias(textoBusqueda);
      } else {
        setSugerencias([]);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [textoBusqueda]);

  const buscarSugerencias = async (texto) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/serv`, {
        params: { nombre: texto },
      });
      setSugerencias(res.data);
    } catch (err) {
      console.error("Error al obtener sugerencias:", err);
    }
  };

  // Al hacer clic en Buscar, consultamos el backend
  const handleBuscar = async () => {
    try {
      const params = {};
      if (textoBusqueda) params.nombre = textoBusqueda;
      if (categoriaFiltro) params.categoria = categoriaFiltro;
      if (localidadFiltro) params.localidad = localidadFiltro;
      if (urgenciasFiltro) params.urgencias24hs = true;

      const res = await axios.get(`${API_BASE_URL}/serv`, { params });
      setServices(res.data);
      setTotal(res.data.length);
    } catch (err) {
      console.error("Error al buscar servicios:", err);
    }
  };

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

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      <a
        href="#"
        className={`home-btn-floating ${showButton ? "visible" : ""}`}
        onClick={handleScrollTop}
      >
        <FaRegArrowAltCircleUp />
      </a>

      <div className="home-container">
        {/* Carrusel arriba de todo */}
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

        {/* BARRA DE BÚSQUEDA DEBAJO DEL CARRUSEL */}
        <div className="home-search-bar mb-4">
          <div className="row gx-3 gy-3">
            {/* Campo de texto libre */}
            <div className="col-lg-4">
              <input
                type="text"
                className="form-control home-search-input"
                placeholder="Buscá profesionales, servicios o localidades..."
                value={textoBusqueda}
                onChange={(e) => setTextoBusqueda(e.target.value)}
              />
              {/* Lista de sugerencias dinámicas */}
              {sugerencias.length > 0 && (
                <ul className="list-group mt-1">
                  {sugerencias.map((s) => (
                    <li
                      key={s._id}
                      className="list-group-item list-group-item-action"
                      onClick={() => setTextoBusqueda(s.nombre)}
                      style={{ cursor: "pointer" }}
                    >
                      {s.nombre}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Select de categoría */}
            <div className="col-lg-2">
              <select
                className="form-select home-search-select"
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

            {/* Select de localidad */}
            <div className="col-lg-2">
              <select
                className="form-select home-search-select"
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

            {/* Checkbox de urgencias */}
            <div className="col-lg-2 d-flex align-items-center">
              <input
                type="checkbox"
                className="form-check-input me-2"
                checked={urgenciasFiltro}
                onChange={(e) => setUrgenciasFiltro(e.target.checked)}
              />
              <label className="form-check-label">24 horas</label>
            </div>

            {/* Botón Buscar */}
            <div className="col-lg-2 d-grid">
              <button className="btn home-search-button" onClick={handleBuscar}>
                Buscar
              </button>
            </div>
          </div>
        </div>

        <p className="home-count-text text-center">
          Se encontraron <strong>{total}</strong> servicios
        </p>

        <div className="row row-pricipal-grilla">
          {services.map((service) => (
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
              <FaRegWindowClose />
            </button>
            {selectedService && <Detalle servicio={selectedService} />}
          </div>
        </div>
      )}
    </>
  );
}
