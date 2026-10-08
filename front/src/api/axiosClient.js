import axios from 'axios';

export const API_BASE_URL = '';

const TOKEN_KEY = 'aserp_token';
const USUARIO_KEY = 'aserp_usuario';

// ============ Helpers para manejar el token ============
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const removeToken = () => localStorage.removeItem(TOKEN_KEY);

// ============ Cliente Axios ============
const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// ============ Interceptor de REQUEST: agrega el JWT automáticamente ============
axiosClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ============ Interceptor de RESPONSE: maneja errores del backend ============
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log detallado para depuración
    console.error('[axiosClient] Error capturado:', {
      message: error.message,
      code: error.code,
      hasResponse: !!error.response,
      hasRequest: !!error.request,
      status: error.response?.status,
      data: error.response?.data,
    });

    // ========== Caso 1: El servidor respondió con un status de error ==========
    if (error.response) {
      const { status, data } = error.response;

      // 401: token inválido o expirado → limpiar sesión
      if (status === 401) {
        removeToken();
        localStorage.removeItem(USUARIO_KEY);
      }

      // Validación (400 con campo "errors")
      if (data?.errors) {
        return Promise.reject({
          tipo: 'validacion',
          status,
          errores: data.errors,
          mensaje: 'Hay errores en el formulario.',
        });
      }

      // 401 / 403 → autenticación o permisos
      if (status === 401 || status === 403) {
        return Promise.reject({
          tipo: 'auth',
          status,
          mensaje: data?.message || 'No autorizado.',
        });
      }

      // Otros errores con mensaje del servidor (400, 404, 500)
      return Promise.reject({
        tipo: 'servidor',
        status,
        mensaje: data?.message || 'Ocurrió un error en el servidor.',
      });
    }

    // ========== Caso 2: La petición se hizo pero no hubo respuesta ==========
    if (error.request) {
      // Es un error de red real (backend apagado, timeout, DNS, etc.)
      let mensaje = 'No se pudo conectar con el servidor. Verifica que el backend esté corriendo.';

      if (error.code === 'ECONNABORTED') {
        mensaje = 'La petición tardó demasiado. Intenta de nuevo.';
      } else if (error.code === 'ERR_NETWORK') {
        mensaje = 'Error de red. Verifica tu conexión y que el backend esté corriendo.';
      }

      return Promise.reject({
        tipo: 'red',
        code: error.code,
        mensaje,
      });
    }

    // ========== Caso 3: Error desconocido (setup de la petición) ==========
    return Promise.reject({
      tipo: 'desconocido',
      mensaje: error.message || 'Error inesperado.',
    });
  }
);

export default axiosClient;