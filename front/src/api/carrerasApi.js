import axiosClient from './axiosClient';

export const carrerasApi = {
  listarTodas: async () => {
    const { data } = await axiosClient.get('/api/carreras');
    return data;
  },

  buscarPorId: async (id) => {
    const { data } = await axiosClient.get(`/api/carreras/${id}`);
    return data;
  },
};