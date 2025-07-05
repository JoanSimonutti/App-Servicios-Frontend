///////////////////////////////////////////////////////////////////////////////////////
// Perfil.jsx
//
// Qué hace este archivo:
// Permite al prestador consultar y editar su perfil.
// Hace GET /profile para traer datos actuales.
// Permite modificar campos vía PUT /profile.
// Permite eliminar la cuenta (soft delete) vía DELETE /profile.
//
// Flow:
// → Al entrar, carga datos desde /profile.
// → Permite modificar datos y guardarlos.
// → Permite borrar cuenta (soft delete).
//
// Por qué es importante:
// - Permite al prestador mantener actualizado su perfil.
// - Profesionaliza la UX/UI.
// - Completa la integración front-back.
///////////////////////////////////////////////////////////////////////////////////////

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Perfil = () => {
  const [perfil, setPerfil] = useState(null);
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Configuración inicial de Axios para incluir token automáticamente
  const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  // Cargar datos al entrar
  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/profile");
        setPerfil(response.data);
      } catch (err) {
        console.error(err);
        setError("Error al cargar el perfil.");
      } finally {
        setLoading(false);
      }
    };

    fetchPerfil();
  }, []);

  // Handler para cambios en el formulario
  const handleChange = (e) => {
    setPerfil({
      ...perfil,
      [e.target.name]: e.target.value,
    });
  };

  // Guardar cambios en el perfil
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMensaje(null);
      setError(null);

      const { telefono, ...datosActualizables } = perfil;

      const response = await axiosInstance.put("/profile", datosActualizables);
      setMensaje(response.data.mensaje);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error || "Ocurrió un error al actualizar el perfil."
      );
    } finally {
      setLoading(false);
    }
  };

  // Borrar cuenta (soft delete)
  const handleDelete = async () => {
    if (
      !window.confirm(
        "¿Estás seguro de que quieres eliminar tu cuenta? Esta acción es irreversible."
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      await axiosInstance.delete("/profile");
      localStorage.removeItem("token");
      navigate("/"); // Redirigir al Home tras borrar cuenta
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error ||
          "Ocurrió un error al intentar borrar el perfil."
      );
    } finally {
      setLoading(false);
    }
  };

  // Mientras carga datos
  if (loading && !perfil) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border" role="status"></div>
        <p className="mt-2">Cargando perfil...</p>
      </div>
    );
  }

  // Si ocurrió un error
  if (error && !perfil) {
    return <div className="alert alert-danger mt-5 text-center">{error}</div>;
  }

  // Si aún no hay datos
  if (!perfil) {
    return null;
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-header bg-primary text-white text-center">
              <h4>Mi Perfil</h4>
            </div>
            <div className="card-body">
              {/* Mensaje de éxito */}
              {mensaje && <div className="alert alert-success">{mensaje}</div>}

              {/* Mensaje de error */}
              {error && <div className="alert alert-danger">{error}</div>}

              <form onSubmit={handleSubmit}>
                {/* Teléfono (no editable) */}
                <div className="mb-3">
                  <label className="form-label">Teléfono (no editable)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={perfil.telefono}
                    disabled
                  />
                </div>

                {/* Nombre */}
                <div className="mb-3">
                  <label className="form-label">Nombre</label>
                  <input
                    type="text"
                    className="form-control"
                    name="nombre"
                    value={perfil.nombre || ""}
                    onChange={handleChange}
                  />
                </div>

                {/* Localidad */}
                <div className="mb-3">
                  <label className="form-label">Localidad</label>
                  <input
                    type="text"
                    className="form-control"
                    name="localidad"
                    value={perfil.localidad || ""}
                    onChange={handleChange}
                  />
                </div>

                {/* Categoría */}
                <div className="mb-3">
                  <label className="form-label">Categoría</label>
                  <input
                    type="text"
                    className="form-control"
                    name="categoria"
                    value={perfil.categoria || ""}
                    onChange={handleChange}
                  />
                </div>

                {/* Otros campos que quieras agregar… */}

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
                      Guardando...
                    </>
                  ) : (
                    "Guardar cambios"
                  )}
                </button>
              </form>

              <hr />

              <button
                className="btn btn-danger w-100 mt-2"
                onClick={handleDelete}
                disabled={loading}
              >
                Eliminar cuenta
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
