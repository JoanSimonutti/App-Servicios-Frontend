///////////////////////////////////////////////////////////////////////////////////////
// ¿Qué hace este archivo routes.jsx?
// Este archivo define las rutas internas de la app (SPA con React Router)

// Pero, ¿qué hace exactamente?
// Le dice a React que use navegación SPA (sin recargar la página).

// Muestra distintos componentes según la URL, 
// ejemplos:
// app-servicios.com/ → página de inicio.
// app-servicios.com/detalle/123 → muestra el detalle del servicio con ID 123.

// El componente AppRoutes es el contenedor central del ruteo de la app.
///////////////////////////////////////////////////////////////////////////////////////

// Importamos los componentes de React Router necesarios para crear rutas internas
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Importamos las páginas que vamos a mostrar en cada ruta
import Home from "../pages/Home";             // Página principal de la app (inicio)
import Detalle from "../pages/Detalle";       // Página de detalle de un servicio
import AdminClicks from "../pages/AdminClicks"; // Página de vista de admin


// Definimos un componente funcional llamado AppRoutes
// Este componente será el contenedor de todas las rutas de nuestra aplicación
export default function AppRoutes() {
  return (
    // Usamos BrowserRouter para activar el modo SPA (Single Page Application)
    <BrowserRouter>

      {/* Dentro de Routes, definimos cada ruta usando <Route> */}
      <Routes>
        {/* Ruta raíz "/" → renderiza el componente Home */}
        <Route path="/" element={<Home />} />
        <Route path="/admin/clicks" element={<AdminClicks />} />
        
      </Routes>
    </BrowserRouter>
  );
}
