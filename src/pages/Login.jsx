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
//
// Por qué es importante:
// - Completa el flujo de login por SMS.
// - Permite acceder a rutas privadas.
// - Profesionaliza la UX/UI.
///////////////////////////////////////////////////////////////////////////////////////

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  // Estado local para campos del formulario
  const [telefono, setTelefono] = useState("");
  const [codigo, setCodigo] = useState("");

  // Estados para feedback al usuario
  const [mensaje, setMensaje] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Función para manejar submit del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Limpiamos mensajes anteriores
    setMensaje(null);
    setError(null);

    // Validaciones básicas
    if (!telefono || !codigo) {
      setError("Debes ingresar tu teléfono y el código.");
      return;
    }

    // Validación de formato del teléfono
    const regex = /^\+\d{8,15}$/;
    if (!regex.test(telefono)) {
      setError(
        "El número de teléfono debe comenzar con '+' y tener entre 8 y 15 dígitos."
      );
      return;
    }

    try {
      setLoading(true);

      // Llamada al backend
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/verify`,
        { telefono, codigo }
      );

      // Guardamos el token en LocalStorage
      localStorage.setItem("token", response.data.token);

      // Mensaje de éxito
      setMensaje("¡Login exitoso!");

      // Redireccionamos al perfil
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
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          {/* Card Bootstrap */}
          <div className="card shadow">
            <div className="card-header text-center bg-primary text-white">
              <h4>Iniciar Sesión</h4>
            </div>
            <div className="card-body">
              {/* Mensaje de éxito */}
              {mensaje && (
                <div className="alert alert-success" role="alert">
                  {mensaje}
                </div>
              )}

              {/* Mensaje de error */}
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="telefono" className="form-label">
                    Número de teléfono
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-telephone-fill"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      id="telefono"
                      placeholder="+34123456789"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                    />
                  </div>
                  <div className="form-text">
                    Ingresa tu teléfono con prefijo internacional.
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="codigo" className="form-label">
                    Código de verificación
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="codigo"
                    placeholder="123456"
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Verificando...
                    </>
                  ) : (
                    "Verificar y entrar"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
