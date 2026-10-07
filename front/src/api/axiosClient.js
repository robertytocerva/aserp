import axios from 'axios';

// URL base del backend Spring Boot
export const API_BASE_URL = 'http://localhost:8080';

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor de respuestas: normaliza errores del backend
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si el backend respondió con un error controlado
    if (error.response) {
      const { status, data } = error.response;

      // Errores de validación (400 con campo "errors")
      if (data?.errors) {
        return Promise.reject({
          tipo: 'validacion',
          status,
          errores: data.errors,
          mensaje: 'Hay errores en el formulario.',
        });
      }

      // Errores con mensaje simple (400, 404, 500)
      return Promise.reject({
        tipo: 'servidor',
        status,
        mensaje: data?.message || 'Ocurrió un error en el servidor.',
      });
    }

    // Error de red (backend apagado, sin conexión)
    if (error.request) {
      return Promise.reject({
        tipo: 'red',
        mensaje: 'No se pudo conectar con el servidor. Verifica que el backend esté corriendo.',
      });
    }

    return Promise.reject({
      tipo: 'desconocido',
      mensaje: error.message || 'Error inesperado.',
    });
  }
);

export default axiosClient;