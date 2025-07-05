///////////////////////////////////////////////////////////////////////////////////////
// PrivateRoute.jsx
//
// Qué hace este archivo:
// Protege rutas privadas de la app.
// Permite entrar solo si existe un token JWT en LocalStorage.
// Redirige al usuario a /login si no está autenticado.
//
// Ejemplo de uso:
// <Route path="/perfil" element={
//   <PrivateRoute>
//      <Perfil />
//   </PrivateRoute>
// } />
//
// Por qué es importante:
// - Protege información sensible.
// - Evita acceso no autorizado.
// - Profesionaliza la seguridad del frontend.
///////////////////////////////////////////////////////////////////////////////////////

import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  // Recuperamos el token desde LocalStorage
  const token = localStorage.getItem("token");

  // Si NO hay token, redirigimos al login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Si hay token, renderizamos el componente protegido
  return children;
};

export default PrivateRoute;
