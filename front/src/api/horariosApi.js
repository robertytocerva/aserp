import axiosClient from './axiosClient';

export const horariosApi = {
  /**
   * HU-13: Lista los horarios del asesor autenticado (incluye inactivos).
   * GET /api/horarios
   * Requiere token de ASESOR.
   */
  misHorarios: async () => {
    const { data } = await axiosClient.get('/api/horarios');
    return data;
  },

  /**
   * HU-13: Crea un nuevo horario.
   * POST /api/horarios
   * Body: { diaSemana, horaInicio, horaFin, modalidad, lugar }
   */
  crear: async (horario) => {
    const { data } = await axiosClient.post('/api/horarios', horario);
    return data;
  },

  /**
   * HU-13: Actualiza un horario existente.
   * PUT /api/horarios/{id}
   */
  actualizar: async (id, horario) => {
    const { data } = await axiosClient.put(`/api/horarios/${id}`, horario);
    return data;
  },

  /**
   * HU-13: Elimina (soft delete) un horario.
   * DELETE /api/horarios/{id}
   */
  eliminar: async (id) => {
    await axiosClient.delete(`/api/horarios/${id}`);
  },
};