///////////////////////////////////////////////////////////////////////////////////////
// api.js
//
// Qué hace:
// - Crea una instancia de Axios con baseURL.
// - Agrega automáticamente el token JWT (si existe) en Authorization.
// - Permite usar api.get/post/... sin repetir lógica.
// - Facilita el mantenimiento y escalabilidad.
///////////////////////////////////////////////////////////////////////////////////////

import axios from "axios";

// Creamos una instancia de Axios
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

// Interceptor para agregar token JWT a todas las requests si existe
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
