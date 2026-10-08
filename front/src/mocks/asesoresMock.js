/**
 * Mock temporal de asesores para visualizar el diseño
 * mientras la base de datos no tiene datos reales.
 *
 * ⚠️ Para desactivar los mocks:
 *    Cambia USE_MOCKS a false en Asesores.jsx y PerfilAsesor.jsx
 */

export const USE_MOCKS = true;

export const asesoresMock = [
  {
    idAsesor: 1,
    idAlumno: 101,
    nombreAlumno: 'Ana García López',
    matricula: '20220101',
    promedio: 9.5,
    fechaInicio: '2026-08-15',
    validado: true,
    activo: true,
    correo: 'ana.garcia@uruapan.tecnm.mx',
    carrera: 'Ingeniería en Sistemas Computacionales',
    semestre: 7,
    descripcion:
      'Me encanta ayudar a mis compañeros con programación y estructuras de datos. Llevo 2 años como asesora par y he apoyado a más de 30 estudiantes. Mi enfoque es práctico: aprendemos resolviendo ejercicios y proyectos reales.',
    materias: [
      { idMateria: 1, nombre: 'Programación Estructurada', clave: 'IS-101', nivelDominio: 'avanzado' },
      { idMateria: 2, nombre: 'Estructuras de Datos', clave: 'IS-201', nivelDominio: 'avanzado' },
      { idMateria: 3, nombre: 'Bases de Datos', clave: 'IS-301', nivelDominio: 'intermedio' },
    ],
    horarios: [
      { idHorario: 1, diaSemana: 2, horaInicio: '16:00', horaFin: '18:00', modalidad: 'presencial', lugar: 'Aula 3', activo: true },
      { idHorario: 2, diaSemana: 4, horaInicio: '14:00', horaFin: '16:00', modalidad: 'virtual', lugar: 'Google Meet', activo: true },
      { idHorario: 3, diaSemana: 6, horaInicio: '10:00', horaFin: '12:00', modalidad: 'presencial', lugar: 'Biblioteca', activo: true },
    ],
  },
  {
    idAsesor: 2,
    idAlumno: 102,
    nombreAlumno: 'Carlos Mendoza Ruiz',
    matricula: '20210234',
    promedio: 9.2,
    fechaInicio: '2026-08-15',
    validado: true,
    activo: true,
    correo: 'carlos.mendoza@uruapan.tecnm.mx',
    carrera: 'Ingeniería en Sistemas Computacionales',
    semestre: 9,
    descripcion:
      'Especialista en metodologías ágiles y patrones de diseño. Trabajo en una empresa de desarrollo y me gusta compartir la experiencia del mundo laboral. Disponible para asesorías virtuales.',
    materias: [
      { idMateria: 4, nombre: 'Ingeniería de Software', clave: 'IS-401', nivelDominio: 'avanzado' },
      { idMateria: 5, nombre: 'Redes de Computadoras', clave: 'IS-501', nivelDominio: 'intermedio' },
    ],
    horarios: [
      { idHorario: 4, diaSemana: 1, horaInicio: '19:00', horaFin: '21:00', modalidad: 'virtual', lugar: 'Zoom', activo: true },
      { idHorario: 5, diaSemana: 3, horaInicio: '19:00', horaFin: '21:00', modalidad: 'virtual', lugar: 'Zoom', activo: true },
      { idHorario: 6, diaSemana: 5, horaInicio: '17:00', horaFin: '19:00', modalidad: 'hibrida', lugar: 'Aula 12', activo: true },
    ],
  },
  {
    idAsesor: 3,
    idAlumno: 103,
    nombreAlumno: 'María Fernanda Torres',
    matricula: '20220345',
    promedio: 9.8,
    fechaInicio: '2026-08-15',
    validado: true,
    activo: true,
    correo: 'maria.torres@uruapan.tecnm.mx',
    carrera: 'Ingeniería en Inteligencia Artificial',
    semestre: 6,
    descripcion:
      'Apasionada por la IA y las matemáticas. Puedo ayudarte con cálculo, álgebra y fundamentos de machine learning. Creo que la mejor forma de aprender matemáticas es entender el "por qué" detrás de cada fórmula.',
    materias: [
      { idMateria: 6, nombre: 'Machine Learning', clave: 'IA-301', nivelDominio: 'avanzado' },
      { idMateria: 7, nombre: 'Cálculo Diferencial', clave: 'MAT-101', nivelDominio: 'avanzado' },
      { idMateria: 8, nombre: 'Álgebra Lineal', clave: 'MAT-201', nivelDominio: 'intermedio' },
    ],
    horarios: [
      { idHorario: 7, diaSemana: 2, horaInicio: '08:00', horaFin: '10:00', modalidad: 'presencial', lugar: 'Aula 5', activo: true },
      { idHorario: 8, diaSemana: 4, horaInicio: '10:00', horaFin: '12:00', modalidad: 'presencial', lugar: 'Aula 5', activo: true },
    ],
  },
  {
    idAsesor: 4,
    idAlumno: 104,
    nombreAlumno: 'Luis Hernández Pérez',
    matricula: '20210456',
    promedio: 8.9,
    fechaInicio: '2026-08-15',
    validado: true,
    activo: true,
    correo: 'luis.hernandez@uruapan.tecnm.mx',
    carrera: 'Ingeniería Mecatrónica',
    semestre: 8,
    descripcion:
      'Puedo apoyarte con física, electrónica y proyectos de mecatrónica. Me gusta explicar con ejemplos reales y experimentos.',
    materias: [
      { idMateria: 9, nombre: 'Física Mecánica', clave: 'FIS-101', nivelDominio: 'avanzado' },
      { idMateria: 10, nombre: 'Electrónica Analógica', clave: 'MEC-301', nivelDominio: 'intermedio' },
    ],
    horarios: [
      { idHorario: 9, diaSemana: 3, horaInicio: '15:00', horaFin: '17:00', modalidad: 'presencial', lugar: 'Lab. Electrónica', activo: true },
    ],
  },
  {
    idAsesor: 5,
    idAlumno: 105,
    nombreAlumno: 'Sofía Ramírez Cruz',
    matricula: '20220567',
    promedio: 9.6,
    fechaInicio: '2026-08-15',
    validado: true,
    activo: true,
    correo: 'sofia.ramirez@uruapan.tecnm.mx',
    carrera: 'Ingeniería en Sistemas Computacionales',
    semestre: 6,
    descripcion:
      'Amante del código limpio y el desarrollo web. Te ayudo con POO, proyectos web y buenas prácticas de programación.',
    materias: [
      { idMateria: 1, nombre: 'Programación Estructurada', clave: 'IS-101', nivelDominio: 'avanzado' },
      { idMateria: 11, nombre: 'Programación Orientada a Objetos', clave: 'IS-202', nivelDominio: 'avanzado' },
      { idMateria: 12, nombre: 'Desarrollo Web', clave: 'IS-402', nivelDominio: 'intermedio' },
    ],
    horarios: [
      { idHorario: 10, diaSemana: 1, horaInicio: '16:00', horaFin: '18:00', modalidad: 'presencial', lugar: 'Aula 8', activo: true },
      { idHorario: 11, diaSemana: 5, horaInicio: '16:00', horaFin: '18:00', modalidad: 'hibrida', lugar: 'Aula 8', activo: true },
    ],
  },
];

export const materiasMock = [
  { idMateria: 1, nombre: 'Programación Estructurada', clave: 'IS-101' },
  { idMateria: 2, nombre: 'Estructuras de Datos', clave: 'IS-201' },
  { idMateria: 3, nombre: 'Bases de Datos', clave: 'IS-301' },
  { idMateria: 4, nombre: 'Ingeniería de Software', clave: 'IS-401' },
  { idMateria: 5, nombre: 'Redes de Computadoras', clave: 'IS-501' },
  { idMateria: 6, nombre: 'Machine Learning', clave: 'IA-301' },
  { idMateria: 7, nombre: 'Cálculo Diferencial', clave: 'MAT-101' },
  { idMateria: 8, nombre: 'Álgebra Lineal', clave: 'MAT-201' },
  { idMateria: 9, nombre: 'Física Mecánica', clave: 'FIS-101' },
  { idMateria: 10, nombre: 'Electrónica Analógica', clave: 'MEC-301' },
  { idMateria: 11, nombre: 'Programación Orientada a Objetos', clave: 'IS-202' },
  { idMateria: 12, nombre: 'Desarrollo Web', clave: 'IS-402' },
];

/**
 * Utilidades para trabajar con días y modalidades
 */
export const DIAS_SEMANA = {
  1: 'Lunes',
  2: 'Martes',
  3: 'Miércoles',
  4: 'Jueves',
  5: 'Viernes',
  6: 'Sábado',
  7: 'Domingo',
};

export const MODALIDAD_INFO = {
  presencial: { label: 'Presencial', color: 'primary', icon: '🏫' },
  virtual: { label: 'Virtual', color: 'info', icon: '💻' },
  hibrida: { label: 'Híbrida', color: 'warning', icon: '🔄' },
};

export const NIVEL_INFO = {
  basico: { label: 'Básico', color: 'secondary' },
  intermedio: { label: 'Intermedio', color: 'info' },
  avanzado: { label: 'Avanzado', color: 'success' },
};

/**
 * Obtener un asesor mock por id (para la página de perfil)
 */
export const getAsesorMockById = (id) => {
  return asesoresMock.find((a) => String(a.idAsesor) === String(id)) || null;
};