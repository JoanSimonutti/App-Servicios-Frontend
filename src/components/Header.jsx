////////////////////////////////////////////////////////////////////////////////////////
// Header.jsx
//
// Qué hace:
// - Renderiza el header superior con enlaces.
// - Cambia dinámicamente si el usuario está logueado.
// - Permite logout eliminando el token.
////////////////////////////////////////////////////////////////////////////////////////

import React from "react";
import { Link, useNavigate } from "react-router-dom";
//import "./HeaderModules.css";

const Header = () => {
  // Obtenemos el token del localStorage
  const token = localStorage.getItem("token");

  const navigate = useNavigate();

  // Función para hacer logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="app-header d-flex justify-content-between align-items-center p-3">
      <h1 className="app-header-title">
        <a
          href="https://github.com/JoanSimonutti"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "inherit", textDecoration: "none" }}
        >
          SERVIPRO
        </a>
      </h1>

      <nav className="app-header-links d-flex gap-3">
        {!token ? (
          <>
            {/* Links si NO hay token */}
            <Link to="/login" className="btn btn-outline-primary">
              Login
            </Link>
            <Link to="/register" className="btn btn-outline-primary">
              Register
            </Link>
          </>
        ) : (
          <>
            {/* Links si hay token */}
            <Link to="/perfil" className="btn btn-primary">
              Perfil
            </Link>
            <button onClick={handleLogout} className="btn btn-outline-danger">
              Logout
            </button>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
