///////////////////////////////////////////////////////////////////////////////////////
// Layout.jsx
//
// Qué es este componente:
//
// Es el layout global de la aplicación. Se encarga de:
// - Renderizar el Header una sola vez.
// - Proveer un contenedor para las páginas internas.
// - Futuramente podría tener Footer, sidebars, modals, etc.
//
// Uso:
// <Layout>
//    <AppRoutes />
// </Layout>
///////////////////////////////////////////////////////////////////////////////////////

import Header from "./Header"; // Importamos el Header que queremos mostrar en todas las páginas

export default function Layout({ children }) {
  // children → es el contenido que se renderizará dentro del Layout.
  //              En este caso, serán tus rutas (AppRoutes).

  return (
    <>
      {/* Header global */}
      <Header />

      {/* Contenedor principal de la app */}
      <main style={{ marginTop: "60px" }}>{children}</main>

      {/* Futuro Footer (comentado por ahora) */}
      {/*
      <Footer />
      */}
    </>
  );
}
