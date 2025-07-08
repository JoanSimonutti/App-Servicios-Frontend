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

const Header = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="app-header">
      <h1 className="app-header-title">
        <Link to="/" className="app-logo-link">
          SERVIPRO
        </Link>
      </h1>

      <nav className="app-header-links">
        {!token ? (
          <>
            <Link to="/login" className="app-header-link">
              Login
            </Link>
            <Link to="/register" className="app-header-link">
              Registro
            </Link>
          </>
        ) : (
          <>
            <Link to="/perfil" className="app-header-link">
              Perfil
            </Link>
            <span
              className="app-header-link app-logout-link"
              onClick={handleLogout}
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
