///////////////////////////////////////////////////////////////////////////////////////
// Register.jsx
//
// Qué hace este archivo:
// Permite al prestador registrar su teléfono para recibir un SMS de verificación.
// Envía una request POST a /auth/register.
// Muestra mensajes de éxito o error.
//
// Flow:
// → El usuario escribe su teléfono.
// → Hace clic en "Enviar código".
// → Recibe mensaje de éxito o error.
//
// Por qué es importante:
// - Es el primer paso del login por SMS.
// - Permite registrar nuevos prestadores.
// - Profesionaliza la UX/UI.
///////////////////////////////////////////////////////////////////////////////////////

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  // Definimos el estado local para el teléfono
  const [telefono, setTelefono] = useState("");

  // Estado para mostrar mensaje de éxito o error
  const [mensaje, setMensaje] = useState(null);
  const [error, setError] = useState(null);

  // Estado para mostrar spinner de carga
  const [loading, setLoading] = useState(false);

  // Hook de React Router para redireccionar
  const navigate = useNavigate();

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reseteamos mensajes previos
    setMensaje(null);
    setError(null);

    // Validamos que el teléfono no esté vacío
    if (!telefono) {
      setError("Debes ingresar un número de teléfono.");
      return;
    }

    // Opcional: validación de patrón (empieza con + y tiene entre 8 y 15 dígitos)
    const regex = /^\+\d{8,15}$/;
    if (!regex.test(telefono)) {
      setError(
        "El número de teléfono debe comenzar con '+' y tener entre 8 y 15 dígitos."
      );
      return;
    }

    try {
      setLoading(true);

      // Llamamos a nuestro backend
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        { telefono }
      );

      // Si todo sale bien, mostramos mensaje de éxito
      setMensaje(response.data.mensaje);

      // Redireccionamos al login tras 2 segundos
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error(err);

      // Mostramos mensaje de error
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
              <h4>Registro de Prestador</h4>
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

              {/* Formulario de teléfono */}
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
                    Ingresa tu teléfono con el prefijo internacional.
                  </div>
                </div>

                {/* Botón enviar */}
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
                      Enviando...
                    </>
                  ) : (
                    "Enviar código por SMS"
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

export default Register;
