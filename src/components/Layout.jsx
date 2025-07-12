////////////////////////////////////////////////////////////////////////////////////////
// Layout.jsx
//
// Qué es este archivo:
//
// - Es el componente Layout global de la aplicación.
// - Su misión es envolver TODAS las páginas.
// - Aquí se declaran:
//     - Header (navegación fija).
//     - Container global para consistencia de diseño.
//     - Margen superior coherente con header fijo.
// - Es un patrón esencial en apps SPA modernas (Single Page Applications).
//
// Razones por las cuales conviene tener un Layout:
// - Evita repetir código (Header, Footer) en cada página.
// - Permite mantener consistencia de diseño.
// - Permite introducir features globales (ej. modals, sidebars).
// - Es fácil de mantener y escalar.
//
// Mejora respecto a tu versión original:
// - Se integra un <div className="container"> global de Bootstrap.
// - Se reemplaza margin-top inline por una clase CSS.
// - Se prepara espacio para futuro Footer (comentado).
////////////////////////////////////////////////////////////////////////////////////////

import Header from "./Header";
import Footer from "./Footer";
// Importamos el Header global de la aplicación.
// Así se renderiza una única vez en todas las páginas.

import "./LayoutModules.css";
// Importamos un CSS Module específico de Layout.
// Aquí colocamos estilos globales del Layout, por ejemplo margen superior.

////////////////////////////////////////////////////////////////////////////////////////
// Declaramos el componente funcional Layout.
//
// Props:
// - children → Es el contenido dinámico que se va a renderizar
//              dentro del Layout. Puede ser cualquier página.
//
// Ejemplo de uso en App.jsx:
// <Layout>
//    <AppRoutes />
// </Layout>
////////////////////////////////////////////////////////////////////////////////////////

export default function Layout({ children }) {
  return (
    <>
      {/* Renderizamos el Header global */}
      <Header />

      {/* 
        <main> es el contenedor semántico principal.
        Le aplicamos la clase .layout-main que define un margin-top
        para separar el contenido del header fijo.
      */}
      <main className="layout-main">
        {/* 
          Usamos un contenedor Bootstrap global.
          Ventajas:
          - Aporta padding horizontal automático.
          - Evita que el contenido se pegue a los bordes.
          - Mantiene consistencia visual en toda la app.
        */}
        <div className="container container-layout">
          {children}
          {/* children representa todas las páginas de la app. */}
        </div>
      </main>

      {/* 
        Futuro Footer:
        Aquí podrías incluir un componente Footer si lo deseas.
        Ejemplo:*/}
      <Footer />
    </>
  );
}
