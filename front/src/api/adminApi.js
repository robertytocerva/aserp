import axiosClient from './axiosClient';

export const adminApi = {
  // ============ ASESORES ============
  cambiarValidacion: async (idAsesor, validado) => {
    const { data } = await axiosClient.patch(
      `/api/admin/asesores/${idAsesor}/validacion`,
      { validado }
    );
    return data;
  },

  asignarMateria: async (idAsesor, { idMateria, nivelDominio }) => {
    const { data } = await axiosClient.post(
      `/api/admin/asesores/${idAsesor}/materias`,
      { idMateria, nivelDominio }
    );
    return data;
  },

  cambiarNivelMateria: async (idAsesor, idMateria, nivelDominio) => {
    const { data } = await axiosClient.put(
      `/api/admin/asesores/${idAsesor}/materias/${idMateria}`,
      { nivelDominio }
    );
    return data;
  },

  quitarMateria: async (idAsesor, idMateria) => {
    await axiosClient.delete(`/api/admin/asesores/${idAsesor}/materias/${idMateria}`);
  },

  // ============ MATERIAS ============
  listarMaterias: async () => {
    const { data } = await axiosClient.get('/api/materias');
    return data;
  },

  crearMateria: async (materia) => {
    const { data } = await axiosClient.post('/api/materias', materia);
    return data;
  },

  actualizarMateria: async (id, materia) => {
    const { data } = await axiosClient.put(`/api/materias/${id}`, materia);
    return data;
  },

  eliminarMateria: async (id) => {
    await axiosClient.delete(`/api/materias/${id}`);
  },

  // ============ CARRERAS ============
  listarCarreras: async () => {
    const { data } = await axiosClient.get('/api/carreras');
    return data;
  },

  crearCarrera: async (carrera) => {
    const { data } = await axiosClient.post('/api/carreras', carrera);
    return data;
  },

  actualizarCarrera: async (id, carrera) => {
    const { data } = await axiosClient.put(`/api/carreras/${id}`, carrera);
    return data;
  },

  eliminarCarrera: async (id) => {
    await axiosClient.delete(`/api/carreras/${id}`);
  },
};