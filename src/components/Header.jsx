////////////////////////////////////////////////////////////////////////////////////////
// Header.jsx
//
// Qué hace:
// - Renderiza el header superior fijo.
// - Logo SERVIPRO en dorado, clickeable a home.
// - Todos los links son texto plano, no botones.
// - Links en blanco, se subrayan y cambian a dorado al hover.
// - Incluye Logout como link para coherencia visual.
// - Diseño limpio y profesional.
////////////////////////////////////////////////////////////////////////////////////////

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./HeaderModules.css";

// NUEVO:
// Importo useState porque vamos a manejar el estado de si el menú hamburguesa está abierto o no.
import { useState } from "react";

const Header = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // NUEVO:
  // Estado para saber si el menú hamburguesa está abierto (true) o cerrado (false).
  // Por defecto está cerrado (false).
  const [menuOpen, setMenuOpen] = useState(false);

  // NUEVO:
  // Función para alternar el estado del menú. Si está abierto lo cierra, y viceversa.
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // NUEVO:
  // Esta función se ejecuta cada vez que hacés click en un link del menú.
  // Su propósito es:
  // - Cerrar el menú hamburguesa si está abierto.
  // - Permitir que el Link funcione normalmente.
  // Es importante porque si no, el menú queda abierto en mobile después de navegar.
  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  return (
    <header className="app-header">
      <h1 className="app-header-title">
        <Link to="/" className="app-logo-link">
          SERVIPRO
        </Link>
      </h1>

      {/* NUEVO:
          Botón hamburguesa que aparece en mobile.
          Está fuera del nav para posicionarlo en el header.
          Le agrego clases condicionales:
          - "app-hamburger" siempre.
          - "open" si el menú está abierto (para animar las barras a X).
      */}
      <button
        className={`app-hamburger ${menuOpen ? "open" : ""}`}
        onClick={toggleMenu}
        aria-label="Toggle menu"
        aria-expanded={menuOpen}
      >
        {/* NUEVO:
            Dos barras horizontales para formar la hamburguesa.
            Las transformaremos con CSS en una X cuando open = true.
        */}
        <span className="bar"></span>
        <span className="bar"></span>
      </button>

      {/* NUEVO:
          Le agrego una clase condicional:
          - Si menuOpen está true, agrego "is-active".
          Eso nos servirá en CSS para mostrar u ocultar el menú en mobile.
      */}
      <nav className={`app-header-links ${menuOpen ? "is-active" : ""}`}>
        {/* NUEVO:
            Agrego un link "Inicio" al principio del nav.
            - Lleva a "/" (página principal).
            - Tiene la misma clase que tus otros links: "app-header-link".
            - Le agrego onClick={handleLinkClick} para que al hacer click
              se cierre la hamburguesa en mobile.
        */}
        <Link to="/" className="app-header-link" onClick={handleLinkClick}>
          SERVICIOS
        </Link>

        {!token ? (
          <>
            <Link
              to="/login"
              className="app-header-link"
              onClick={handleLinkClick}
            >
              INICIAR SESIÓN
            </Link>
            <Link
              to="/register"
              className="app-header-link"
              onClick={handleLinkClick}
            >
              REGISTRO
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/perfil"
              className="app-header-link"
              onClick={handleLinkClick}
            >
              MI CUENTA
            </Link>
            <span
              className="app-header-link app-logout-link"
              onClick={() => {
                handleLogout();
                handleLinkClick();
              }}
            >
              Logout
            </span>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
