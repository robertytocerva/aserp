import axiosClient from './axiosClient';

export const bitacorasApi = {
  /**
   * HU-21: Crear bitácora de una sesión completada.
   * POST /api/bitacoras (multipart/form-data)
   */
  crear: async ({ idAsesoria, temaTratado, tareasAsignadas, observaciones, imagen }) => {
    const formData = new FormData();
    formData.append('idAsesoria', idAsesoria);
    formData.append('temaTratado', temaTratado);
    if (tareasAsignadas) formData.append('tareasAsignadas', tareasAsignadas);
    if (observaciones) formData.append('observaciones', observaciones);
    if (imagen) formData.append('imagen', imagen);

    const { data } = await axiosClient.post('/api/bitacoras', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  /**
   * HU-22: Consultar bitácora por ID.
   * GET /api/bitacoras/{id}
   */
  obtener: async (id) => {
    const { data } = await axiosClient.get(`/api/bitacoras/${id}`);
    return data;
  },

  /**
   * Descargar imagen de evidencia.
   * GET /api/bitacoras/{id}/imagen
   */
  descargarImagen: async (id) => {
    const { data } = await axiosClient.get(`/api/bitacoras/${id}/imagen`, {
      responseType: 'blob',
    });
    return data;
  },

  /**
   * Descargar PDF de la bitácora.
   * GET /api/bitacoras/{id}/pdf
   */
  descargarPdf: async (id) => {
    const { data } = await axiosClient.get(`/api/bitacoras/${id}/pdf`, {
      responseType: 'blob',
    });
    return data;
  },
};