export const reportesMock = {
  resumen: {
    totalAsesorias: 48,
    totalAsesores: 5,
    totalAlumnos: 32,
    promedioCalificacion: 4.6,
    tasaAceptacion: 0.82,
    tasaCancelacion: 0.08,
  },

  asesoriasPorMes: [
    { mes: 'May', total: 5 },
    { mes: 'Jun', total: 8 },
    { mes: 'Jul', total: 4 },
    { mes: 'Ago', total: 10 },
    { mes: 'Sep', total: 13 },
    { mes: 'Oct', total: 8 },
  ],

  asesoriasPorMateria: [
    { materia: 'Programación Estructurada', total: 12 },
    { materia: 'Estructuras de Datos', total: 10 },
    { materia: 'Cálculo Diferencial', total: 8 },
    { materia: 'Bases de Datos', total: 7 },
    { materia: 'Ingeniería de Software', total: 6 },
    { materia: 'Física Mecánica', total: 5 },
  ],

  asesoriasPorEstado: [
    { estado: 'Programada', total: 18, color: 'success' },
    { estado: 'Completada', total: 22, color: 'primary' },
    { estado: 'Cancelada', total: 4, color: 'secondary' },
    { estado: 'Rechazada', total: 3, color: 'danger' },
    { estado: 'No asistió', total: 1, color: 'dark' },
  ],

  topAsesores: [
    { nombre: 'Ana García López', asesorias: 14, calificacion: 4.9 },
    { nombre: 'Sofía Ramírez Cruz', asesorias: 11, calificacion: 4.8 },
    { nombre: 'María Fernanda Torres', asesorias: 9, calificacion: 4.7 },
    { nombre: 'Carlos Mendoza Ruiz', asesorias: 8, calificacion: 4.5 },
    { nombre: 'Luis Hernández Pérez', asesorias: 6, calificacion: 4.4 },
  ],
};