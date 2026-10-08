import axiosClient from './axiosClient';

export const asesoresApi = {
  /**
   * Lista todos los asesores activos.
   * GET /api/asesores
   */
  listarTodos: async () => {
    const { data } = await axiosClient.get('/api/asesores');
    return data;
  },

  /**
   * Busca un asesor por su ID.
   * GET /api/asesores/{id}
   */
  buscarPorId: async (id) => {
    const { data } = await axiosClient.get(`/api/asesores/${id}`);
    return data;
  },

  /**
   * HU-10: Postularse como asesor.
   * POST /api/asesores
   * Body: { promedio }
   * Requiere token de ALUMNO o ASESOR.
   */
  postular: async ({ promedio }) => {
    const { data } = await axiosClient.post('/api/asesores', { promedio });
    return data;
  },

  /**
   * HU-19: Dar de baja a un asesor (soft delete).
   * DELETE /api/asesores/{id}
   */
  darDeBaja: async (id) => {
    await axiosClient.delete(`/api/asesores/${id}`);
  },

  /**
   * HU-11: Lista las materias que imparte un asesor.
   * GET /api/asesores/{id}/materias
   */
  materiasDeAsesor: async (id) => {
    const { data } = await axiosClient.get(`/api/asesores/${id}/materias`);
    return data;
  },

  /**
   * HU-05: Lista los horarios activos de un asesor.
   * GET /api/asesores/{id}/horarios
   */
  horariosDeAsesor: async (id) => {
    const { data } = await axiosClient.get(`/api/asesores/${id}/horarios`);
    return data;
  },

  /**
   * HU-06: Lista los slots disponibles (horario + fecha) de un asesor.
   * GET /api/asesores/{id}/horarios/disponibles?desde=YYYY-MM-DD&hasta=YYYY-MM-DD
   */
  horariosDisponibles: async (id, desde, hasta) => {
    const params = new URLSearchParams();
    if (desde) params.append('desde', desde);
    if (hasta) params.append('hasta', hasta);
    const { data } = await axiosClient.get(
      `/api/asesores/${id}/horarios/disponibles?${params.toString()}`
    );
    return data;
  },

  /**
   * HU-04: Lista los asesores que imparten una materia (con sus horarios).
   * GET /api/materias/{idMateria}/asesores
   */
  asesoresDeMateria: async (idMateria) => {
    const { data } = await axiosClient.get(`/api/materias/${idMateria}/asesores`);
    return data;
  },
};