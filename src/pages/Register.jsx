///////////////////////////////////////////////////////////////////////////////////////
// Register.jsx
//
// Qué hace este archivo:
// Permite al prestador registrar su teléfono para recibir un SMS de verificación.
// Envía una request POST a /auth/register.
// Muestra mensajes de éxito o error.
///////////////////////////////////////////////////////////////////////////////////////

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./RegisterModules.css";

const Register = () => {
  const [telefono, setTelefono] = useState("");
  const [mensaje, setMensaje] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMensaje(null);
    setError(null);

    if (!telefono) {
      setError("Debes ingresar un número de teléfono.");
      return;
    }

    const regex = /^\+\d{8,15}$/;
    if (!regex.test(telefono)) {
      setError(
        "El número de teléfono debe comenzar con '+' y tener entre 8 y 15 dígitos."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        { telefono }
      );

      setMensaje(response.data.mensaje);

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error ||
          "Ocurrió un error inesperado. Intenta de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">Registro de Prestador</h2>

        {mensaje && <div className="register-success">{mensaje}</div>}
        {error && <div className="register-error">{error}</div>}

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="register-field">
            <label htmlFor="telefono">Número de teléfono</label>
            <input
              type="text"
              id="telefono"
              placeholder="+34123456789"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
            />
            <small>Ingresa tu teléfono con el prefijo internacional.</small>
          </div>

          <button type="submit" className="register-button" disabled={loading}>
            {loading ? "Enviando..." : "Enviar código por SMS"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
