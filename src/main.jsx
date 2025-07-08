///////////////////////////////////////////////////////////////////////////////////////
// Que es main.jsx?
// Este archivo es el verdadero punto de entrada técnico de tu aplicación React.

// ¿Qué significa eso?
// Cuando el navegador carga tu proyecto, lo primero que React ejecuta es main.jsx.

// Que hace este archivo?:
// Importa todo lo necesario (estilos, App, Bootstrap).
// Busca el <div id="root"> en tu index.html.
// Renderiza ahí tu aplicación React completa.
///////////////////////////////////////////////////////////////////////////////////////

import { StrictMode } from "react"; // mportamos StrictMode de React. Es una herramienta de desarrollo que te avisa si estás usando código inseguro o pronto obsoleto. No afecta en producción.
import { createRoot } from "react-dom/client"; // Importamos la función createRoot, que es la nueva forma moderna de arrancar una app React desde React 18 en adelante.
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx"; // Importamos tu componente principal App, que es donde se monta todo el sistema de rutas (AppRoutes).
import "bootstrap/dist/css/bootstrap.min.css"; // mportamos Bootstrap desde node_modules. Esto carga todos los estilos necesarios para usar componentes Bootstrap (grillas, botones, tarjetas, etc).

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <App />
    </BrowserRouter>
  </StrictMode>
);
// document.getElementById('root') busca el <div id="root"> en tu index.html.
// createRoot(...).render(...) monta la app React dentro de ese div.
// Todo lo que esté dentro de <App /> (rutas, componentes, vistas) se va a renderizar ahí.
// StrictMode envuelve a la app para ayudarte a detectar malas prácticas en desarrollo.

// Resultado
// Nuestra app React queda completamente inicializada, limpia, y conectada a Bootstrap.
// Ya está lista para empezar a renderizar servicios reales desde el backend.
