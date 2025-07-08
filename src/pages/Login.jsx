///////////////////////////////////////////////////////////////////////////////////////
// Login.jsx
//
// Qué hace este archivo:
// Permite al prestador ingresar su teléfono y el código recibido por SMS.
// Envía una request POST a /auth/verify.
// Guarda el JWT en LocalStorage.
// Redirecciona al perfil del prestador.
//
// Flow:
// → El usuario escribe teléfono y código.
// → Hace clic en "Verificar y entrar".
// → Si es correcto, se guarda el token y entra al sistema.
///////////////////////////////////////////////////////////////////////////////////////

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./LoginModules.css";

const Login = () => {
  const [telefono, setTelefono] = useState("");
  const [codigo, setCodigo] = useState("");

  const [mensaje, setMensaje] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMensaje(null);
    setError(null);

    if (!telefono || !codigo) {
      setError("Debes ingresar tu teléfono y el código.");
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
        `${import.meta.env.VITE_API_URL}/auth/verify`,
        { telefono, codigo }
      );

      localStorage.setItem("token", response.data.token);
      setMensaje("¡Login exitoso!");

      setTimeout(() => {
        navigate("/perfil");
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
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Iniciar Sesión</h2>

        {mensaje && <div className="login-success">{mensaje}</div>}
        {error && <div className="login-error">{error}</div>}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label htmlFor="telefono">Número de teléfono</label>
            <input
              type="text"
              id="telefono"
              placeholder="+34123456789"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
            />
            <small>Ingresa tu teléfono con prefijo internacional.</small>
          </div>

          <div className="login-field">
            <label htmlFor="codigo">Código de verificación</label>
            <input
              type="text"
              id="codigo"
              placeholder="123456"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
            />
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Verificando..." : "Verificar y entrar"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
