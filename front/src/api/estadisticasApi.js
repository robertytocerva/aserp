import axiosClient from './axiosClient';

export const estadisticasApi = {
  /**
   * Obtiene las estadísticas del programa en un periodo.
   * GET /api/admin/estadisticas?desde=YYYY-MM-DD&hasta=YYYY-MM-DD
   * Requiere token de ADMIN.
   */
  obtener: async (desde = null, hasta = null) => {
    const params = new URLSearchParams();
    if (desde) params.append('desde', desde);
    if (hasta) params.append('hasta', hasta);

    const url = params.toString()
      ? `/api/admin/estadisticas?${params.toString()}`
      : '/api/admin/estadisticas';

    const { data } = await axiosClient.get(url);
    return data;
  },

  /**
   * Descarga el PDF del reporte.
   * GET /api/admin/estadisticas/reporte?desde=...&hasta=...
   * Devuelve un Blob (application/pdf).
   */
  descargarPdf: async (desde = null, hasta = null) => {
    const params = new URLSearchParams();
    if (desde) params.append('desde', desde);
    if (hasta) params.append('hasta', hasta);

    const url = params.toString()
      ? `/api/admin/estadisticas/reporte?${params.toString()}`
      : '/api/admin/estadisticas/reporte';

    const { data } = await axiosClient.get(url, { responseType: 'blob' });
    return data;
  },
};