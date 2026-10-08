import axiosClient from './axiosClient';

export const authApi = {
  /**
   * Inicia sesión.
   * POST /api/auth/login
   * Body: { correo, password }
   * Response: { token, tipo, idUsuario, idAlumno, rol }
   */
  login: async ({ correo, password }) => {
    const { data } = await axiosClient.post('/api/auth/login', { correo, password });
    return data;
  },
};