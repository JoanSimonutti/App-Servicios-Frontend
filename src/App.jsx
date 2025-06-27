///////////////////////////////////////////////////////////////////////////////////////
// Que es App.jsx?
// Este archivo es el componente raíz de la aplicación React. 
// Se va a renderizar dentro del <div id="root"> que está en index.html.
// Es el punto de entrada visual donde se conecta todo el sistema de rutas SPA.

// Objetivo, porque dejar este archivo así?:
// Queda limpio y sin basura de Vite, todo el contenido de prueba (logos, contador, texto de Vite) se elimina.
// App.jsx queda limpio y profesional.
// Conectado al sistema de rutas SPA (AppRoutes).
// Listo para que empieces a mostrar contenido real (como el home con servicios).
// Aquí simplemente mostramos <AppRoutes />, que contiene todas las rutas internas
// (inicio, detalle de servicio, etc.). Esto mantiene el código limpio y modular.

// Si en el futuro querés agregar un layout común (header/footer global), este sería el lugar ideal.
///////////////////////////////////////////////////////////////////////////////////////

import AppRoutes from "./routes/routes"; // Importamos el componente que define todas las rutas (routes/routes.jsx → contiene toda la lógica de navegación)

export default function App() {
  return (
    // Renderizamos el sistema de rutas (SPA)
    <AppRoutes />
  );
}
