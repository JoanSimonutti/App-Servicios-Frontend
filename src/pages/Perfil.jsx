///////////////////////////////////////////////////////////////////////////////////////
// Perfil.jsx
//
// Qué hace este archivo:
// Permite al prestador consultar y editar su perfil.
// Hace GET /profile para traer datos actuales.
// Permite modificar campos vía PUT /profile.
// Permite eliminar la cuenta (soft delete) vía DELETE /profile.
///////////////////////////////////////////////////////////////////////////////////////

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./PerfilModules.css";

const Perfil = () => {
  const [perfil, setPerfil] = useState(null);
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

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

  const handleChange = (e) => {
    setPerfil({
      ...perfil,
      [e.target.name]: e.target.value,
    });
  };

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
      navigate("/");
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

  if (loading && !perfil) {
    return (
      <div className="perfil-loading">
        <div className="perfil-spinner"></div>
        <p>Cargando perfil...</p>
      </div>
    );
  }

  if (error && !perfil) {
    return <div className="perfil-error mt-5 text-center">{error}</div>;
  }

  if (!perfil) {
    return null;
  }

  return (
    <div className="perfil-container">
      <div className="perfil-card">
        <h2 className="perfil-title">Mi Perfil</h2>

        {mensaje && <div className="perfil-success">{mensaje}</div>}
        {error && <div className="perfil-error">{error}</div>}

        <form className="perfil-form" onSubmit={handleSubmit}>
          <div className="perfil-field">
            <label>Teléfono (no editable)</label>
            <input type="text" value={perfil.telefono} disabled />
          </div>

          <div className="perfil-field">
            <label>Nombre</label>
            <input
              type="text"
              name="nombre"
              value={perfil.nombre || ""}
              onChange={handleChange}
            />
          </div>

          <div className="perfil-field">
            <label>Localidad</label>
            <input
              type="text"
              name="localidad"
              value={perfil.localidad || ""}
              onChange={handleChange}
            />
          </div>

          <div className="perfil-field">
            <label>Categoría</label>
            <input
              type="text"
              name="categoria"
              value={perfil.categoria || ""}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="perfil-button" disabled={loading}>
            {loading ? "Guardando..." : "Guardar cambios"}
          </button>
        </form>

        <hr className="perfil-divider" />

        <button
          className="perfil-delete-button"
          onClick={handleDelete}
          disabled={loading}
        >
          Eliminar cuenta
        </button>
      </div>
    </div>
  );
};

export default Perfil;
