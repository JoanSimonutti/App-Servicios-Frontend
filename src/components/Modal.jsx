////////////////////////////////////////////////////////////////////////////////////////
// Modal.jsx
//
// Qué hace:
// - Renderiza un modal centrado en pantalla.
// - Fondo polarizado negro.
// - Animación slide-in desde la derecha.
// - Scroll interno si el contenido excede altura.
// - Cierra con click en overlay o tecla Escape.
//
// Reutilizable en cualquier parte de la app.
////////////////////////////////////////////////////////////////////////////////////////

import React, { useEffect } from "react";
import "./ModalModules.css";

export default function Modal({ isOpen, onClose, children }) {
  // Cerrar con tecla Escape
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // Bloquear scroll cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-container">
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          {children}
        </div>
      </div>
    </>
  );
}
