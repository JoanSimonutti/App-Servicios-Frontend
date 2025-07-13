///////////////////////////////////////////////////////////////////////////////////////
// Footer.jsx
//
// Qué hace este componente:
// - Footer simple y profesional.
// - No incluye logo.
// - 3 columnas:
//     • Marca
//     • Contacto
//     • Redes sociales
// - Íconos sociales coherentes con el header.
// - Responsive.
// - Usa CSS PLANO (no CSS Modules).
///////////////////////////////////////////////////////////////////////////////////////

import React from "react";
import { SiLinkedin } from "react-icons/si";
import { FaGithub } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import "./FooterModules.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footerContainer">
        {/* Columna 1 - Redes Sociales */}
        <div className="column-redes-sociales">
          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="iconLink"
          >
            <FaInstagram />
          </a>
          <a
            href="https://x.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="iconLink"
          >
            <FaXTwitter />
          </a>
          <a
            href="https://www.linkedin.com/in/joansimonutti/"
            target="_blank"
            rel="noopener noreferrer"
            className="iconLink"
          >
            <SiLinkedin />
          </a>
          <a
            href="https://github.com/JoanSimonutti"
            target="_blank"
            rel="noopener noreferrer"
            className="iconLink"
          >
            <FaGithub />
          </a>
        </div>
        {/* Columna 2 - Contacto */}
        <div className="column">
          <span className="item">Política de privacidad</span>
          <span className="item">Condiciones de uso</span>
          <span className="item">Trabaja con nosotros</span>
        </div>
        {/* Columna 3 - Marca */}
        <div className="column">
          <span className="brand">SERVIPRO © 2025</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
