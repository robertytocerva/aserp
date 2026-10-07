import axiosClient from './axiosClient';

export const alumnosApi = {
  listarTodos: async () => {
    const { data } = await axiosClient.get('/api/alumnos');
    return data;
  },

  buscarPorId: async (id) => {
    const { data } = await axiosClient.get(`/api/alumnos/${id}`);
    return data;
  },

  /**
   * Registro de alumno (HU-01).
   * POST /api/alumnos
   */
  registrar: async (alumno) => {
    const { data } = await axiosClient.post('/api/alumnos', alumno);
    return data;
  },

  actualizar: async (id, alumno) => {
    const { data } = await axiosClient.put(`/api/alumnos/${id}`, alumno);
    return data;
  },

  eliminar: async (id) => {
    await axiosClient.delete(`/api/alumnos/${id}`);
  },
};