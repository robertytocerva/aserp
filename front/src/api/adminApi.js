import axiosClient from './axiosClient';

export const adminApi = {
  /**
   * HU-18: Validar o revocar la validación de un asesor.
   * PATCH /api/admin/asesores/{id}/validacion
   * Body: { validado: boolean }
   */
  cambiarValidacion: async (idAsesor, validado) => {
    const { data } = await axiosClient.patch(
      `/api/admin/asesores/${idAsesor}/validacion`,
      { validado }
    );
    return data;
  },

  /**
   * HU-23: Asignar una materia a un asesor.
   */
  asignarMateria: async (idAsesor, { idMateria, nivelDominio }) => {
    const { data } = await axiosClient.post(
      `/api/admin/asesores/${idAsesor}/materias`,
      { idMateria, nivelDominio }
    );
    return data;
  },

  /**
   * HU-23: Cambiar nivel de dominio de una materia asignada.
   */
  cambiarNivelMateria: async (idAsesor, idMateria, nivelDominio) => {
    const { data } = await axiosClient.put(
      `/api/admin/asesores/${idAsesor}/materias/${idMateria}`,
      { nivelDominio }
    );
    return data;
  },

  /**
   * HU-23: Quitar una materia a un asesor.
   */
  quitarMateria: async (idAsesor, idMateria) => {
    await axiosClient.delete(`/api/admin/asesores/${idAsesor}/materias/${idMateria}`);
  },
};