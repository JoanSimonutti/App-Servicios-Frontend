////////////////////////////////////////////////////////////////////////////////////////
// Header.jsx
//
// Qué hace:
// - Renderiza el header superior fijo.
// - Todos los links son texto plano, no botones.
// - Links en blanco y se subrayan.
// - Incluye Logout como link para coherencia visual.
// - Diseño limpio y profesional.
//
// MODIFICADO:
// - Se agregó div .app-header-container para centrar contenido en desktop.
// - SE AGREGA:
//     • overlay negro polarizado debajo del header cuando se abre el menú mobile.
//     • bloqueo del scroll de la página mientras el menú está abierto.
//
////////////////////////////////////////////////////////////////////////////////////////

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./HeaderModules.css";
import { useState } from "react";

const Header = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);

    // NUEVO:
    // Si el menú se abre, bloqueamos el scroll del body
    // para evitar que se desplace el contenido detrás del overlay.
    if (!menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  };

  const handleLinkClick = () => {
    setMenuOpen(false);
    // NUEVO:
    // Al cerrar el menú, habilitamos nuevamente el scroll
    document.body.style.overflow = "";
  };

  return (
    <>
      <header className="app-header">
        {/* NUEVO:
            Contenedor para centrar el contenido en desktop
            sin afectar mobile. Limita ancho y aplica paddings laterales.
        */}
        <div className="app-header-container">
          <h1 className="app-header-title">
            <Link to="/" className="app-logo-link">
              SERVIPRO
            </Link>
          </h1>

          <button
            className={`app-hamburger ${menuOpen ? "open" : ""}`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span className="bar"></span>
            <span className="bar"></span>
          </button>

          <nav className={`app-header-links ${menuOpen ? "is-active" : ""}`}>
            <Link to="/" className="app-header-link" onClick={handleLinkClick}>
              INICIO
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
                  SOBRE NOSOTROS
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
                  CERRAR SESIÓN
                </span>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* NUEVO:
          Overlay negro polarizado que cubre solo la parte
          debajo del header. Se muestra solo cuando el menú está abierto.
          Al hacer click, cierra el menú.
      */}
      <div
        className={`app-header-overlay ${menuOpen ? "visible" : ""}`}
        onClick={toggleMenu}
      ></div>
    </>
  );
};

export default Header;
