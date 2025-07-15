///////////////////////////////////////////////////////////////////////////////////////
// ¿Qué hace este archivo routes.jsx?
// Este archivo define las rutas internas de la app (SPA con React Router)
//
// Pero, ¿qué hace exactamente?
// Le dice a React que use navegación SPA (sin recargar la página).
//
// Muestra distintos componentes según la URL,
// ejemplos:
// app-servicios.com/ → página de inicio.
// app-servicios.com/detalle/123 → muestra el detalle del servicio con ID 123.
//
// El componente AppRoutes es el contenedor central del ruteo de la app.
///////////////////////////////////////////////////////////////////////////////////////

// Importamos los componentes de React Router necesarios para crear rutas internas
import { Routes, Route } from "react-router-dom";

// Importamos las páginas que vamos a mostrar en cada ruta
import Home from "../pages/Home"; // Página principal de la app (inicio)
import Detalle from "../pages/Detalle"; // Página de detalle de un servicio
import AdminClicks from "../pages/AdminClicks"; // Página de vista de admin
import ServicesList from "../pages/ServicesList";

///////////////////////////////////////////////////////////////////////////////////////
// PrivateRoute y páginas de auth

// Qué hace:
// Importa PrivateRoute → permite proteger rutas privadas.
// Importa las nuevas páginas de Login, Register y Perfil.
// - PrivateRoute es un wrapper que chequea si hay token en localStorage.
// - Si no hay token, redirige a /login automáticamente.
// - Si hay token, deja pasar al componente protegido.

// Gracias a esto:
// Podremos proteger la ruta /perfil solo para usuarios logueados.
///////////////////////////////////////////////////////////////////////////////////////

import PrivateRoute from "../components/PrivateRoute";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Perfil from "../pages/Perfil";

///////////////////////////////////////////////////////////////////////////////////////
// Definimos un componente funcional llamado AppRoutes
// Este componente será el contenedor de todas las rutas de nuestra aplicación
///////////////////////////////////////////////////////////////////////////////////////

export default function AppRoutes() {
  return (
    // AGREGADO: Eliminamos <BrowserRouter> de acá porque ahora ya está en main.jsx
    // Si lo dejamos, tendríamos dos Routers anidados, lo cual genera error:
    // "You cannot render a <Router> inside another <Router>."
    //
    // Ahora simplemente devolvemos <Routes />, porque main.jsx
    // ya se encarga de envolver toda la app con <BrowserRouter>.

    <Routes>
      {/* Ruta raíz "/" → renderiza el componente Home */}
      <Route path="/" element={<Home />} />
      <Route path="/services" element={<ServicesList />} />

      {/*Rutas públicas de autenticación */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/*Ruta protegida */}
      <Route
        path="/perfil"
        element={
          <PrivateRoute>
            <Perfil />
          </PrivateRoute>
        }
      />

      {/* Rutas admin existentes */}
      <Route path="/admin/clicks" element={<AdminClicks />} />
    </Routes>
  );
}
