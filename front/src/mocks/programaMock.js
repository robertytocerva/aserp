/**
 * Contenido informativo del programa de asesores pares.
 * Basado en el PDF "Aseesor Par.pdf".
 * Las imágenes se sirven desde Unsplash (URLs directas).
 * Los iconos usan Bootstrap Icons (clase "bi bi-...").
 */

export const programaInfo = {
  titulo: 'Programa de Asesores Pares',
  subtitulo: 'Un puente entre estudiantes que necesitan apoyo y quienes pueden ofrecerlo',
  descripcion:
    'El Programa de Asesores Pares del ITS Uruapan conecta a estudiantes de alto rendimiento académico con compañeros que necesitan apoyo en materias específicas. A través de asesorías personalizadas, fomentamos una comunidad de aprendizaje colaborativo, incluyente y medible.',

  heroImagen:
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop',

  objetivoGeneral:
    'Automatizar el registro, coordinación y seguimiento del programa de asesores pares, optimizando la visibilidad del servicio y la administración de las tutorías.',

  beneficios: [
    {
      imagen:
        'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=300&fit=crop',
      titulo: 'Refuerza tu aprendizaje',
      descripcion:
        'Recibe apoyo personalizado en las materias que más se te dificultan, con estudiantes que ya las dominan.',
    },
    {
      imagen:
        'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400&h=300&fit=crop',
      titulo: 'Comunidad colaborativa',
      descripcion:
        'Aprende junto a otros estudiantes en un entorno de apoyo mutuo y sin jerarquías.',
    },
    {
      imagen:
        'https://images.unsplash.com/photo-1508962914676-134849a727f0?w=400&h=300&fit=crop',
      titulo: 'Horarios flexibles',
      descripcion:
        'Consulta la disponibilidad de cada asesor y agenda cuando mejor te convenga.',
    },
    {
      imagen:
        'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=400&h=300&fit=crop',
      titulo: 'Fortalece tu perfil',
      descripcion:
        'Si eres asesor, desarrolla habilidades docentes, de comunicación y suma experiencia.',
    },
  ],

  requisitos: [
    'Ser alumno activo del Instituto Tecnológico Superior Campus Uruapan.',
    'Contar con un promedio general mínimo de 8.5.',
    'Haber cursado y aprobado las materias que deseas asesorar.',
    'Disponibilidad mínima de 2 horas semanales para asesorías.',
    'No tener adeudos académicos ni reportes disciplinarios vigentes.',
    'Compromiso con el programa por al menos un semestre.',
  ],

  responsabilidades: [
    'Publicar horarios con al menos 24 horas de anticipación.',
    'Atender con respeto y profesionalismo a los alumnos solicitantes.',
    'Registrar bitácoras de cada asesoría realizada.',
    'Notificar con anticipación si no podrás atender una asesoría.',
    'Mantener actualizada tu información de perfil.',
  ],

  pasos: [
    {
      num: '01',
      titulo: 'Regístrate',
      descripcion:
        'Crea tu cuenta con tu matrícula institucional y tu correo del TecNM.',
      imagen:
        'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=300&h=200&fit=crop',
    },
    {
      num: '02',
      titulo: 'Explora el catálogo',
      descripcion:
        'Consulta a los asesores disponibles y filtra por materia o tema.',
      imagen:
        'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop',
    },
    {
      num: '03',
      titulo: 'Solicita tu asesoría',
      descripcion: 'Elige un horario disponible y envía tu solicitud.',
      imagen:
        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop',
    },
    {
      num: '04',
      titulo: 'Aprende y crece',
      descripcion:
        'Asiste a tu asesoría y refuerza tus conocimientos con apoyo de tus pares.',
      imagen:
        'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=300&h=200&fit=crop',
    },
  ],

  faq: [
    {
      pregunta: '¿Tiene algún costo?',
      respuesta:
        'No. El programa es completamente gratuito y está pensado como un servicio de apoyo entre estudiantes.',
    },
    {
      pregunta: '¿Cuántas asesorías puedo solicitar?',
      respuesta:
        'No hay un límite estricto. Puedes solicitar todas las que necesites, siempre que respetes los horarios disponibles de cada asesor.',
    },
    {
      pregunta: '¿Qué pasa si el asesor rechaza mi solicitud?',
      respuesta:
        'El slot se libera y puedes solicitar otro horario o con otro asesor. Te recomendamos agendar con anticipación.',
    },
    {
      pregunta: '¿Cuánto dura cada asesoría?',
      respuesta:
        'La duración depende del horario que publiques o reserves. Normalmente son bloques de 1 a 2 horas.',
    },
    {
      pregunta: '¿Puedo ser alumno y asesor a la vez?',
      respuesta:
        'Sí. De hecho, los asesores pares son estudiantes activos. Puedes solicitar asesoría para ti y también ofrecerla a otros.',
    },
  ],
};