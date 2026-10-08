import axiosClient from './axiosClient';

export const solicitudesApi = {
  /**
   * HU-07: Enviar una solicitud de asesoría (reservar un slot).
   * POST /api/solicitudes
   * Body: { idHorario, fecha, idMateria }
   * Requiere token de ALUMNO o ASESOR.
   */
  crear: async ({ idHorario, fecha, idMateria }) => {
    const { data } = await axiosClient.post('/api/solicitudes', {
      idHorario,
      fecha,
      idMateria,
    });
    return data;
  },

  /**
   * HU-08: Lista las solicitudes del alumno autenticado.
   * GET /api/solicitudes/mis
   */
  misSolicitudes: async () => {
    const { data } = await axiosClient.get('/api/solicitudes/mis');
    return data;
  },

  /**
   * HU-14: Lista las solicitudes recibidas por el asesor autenticado.
   * GET /api/solicitudes/recibidas?estado=...
   */
  solicitudesRecibidas: async (estado = null) => {
    const url = estado
      ? `/api/solicitudes/recibidas?estado=${estado}`
      : '/api/solicitudes/recibidas';
    const { data } = await axiosClient.get(url);
    return data;
  },

  /**
   * HU-15: Aceptar una solicitud.
   * PATCH /api/solicitudes/{id}/aceptar
   */
  aceptar: async (id) => {
    const { data } = await axiosClient.patch(`/api/solicitudes/${id}/aceptar`);
    return data;
  },

  /**
   * HU-15: Rechazar una solicitud.
   * PATCH /api/solicitudes/{id}/rechazar
   */
  rechazar: async (id) => {
    const { data } = await axiosClient.patch(`/api/solicitudes/${id}/rechazar`);
    return data;
  },
};