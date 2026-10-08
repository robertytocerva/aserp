import { Card, Badge, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';

/**
 * Mapa de estados → etiquetas y colores.
 */
export const ESTADOS_SOLICITUD = {
  solicitada: {
    label: 'Solicitada',
    color: 'warning',
    icon: '⏳',
    descripcion: 'Esperando respuesta del asesor',
  },
  programada: {
    label: 'Programada',
    color: 'success',
    icon: '✅',
    descripcion: 'Confirmada por el asesor',
  },
  completada: {
    label: 'Completada',
    color: 'primary',
    icon: '🎓',
    descripcion: 'Asesoría realizada',
  },
  cancelada: {
    label: 'Cancelada',
    color: 'secondary',
    icon: '🚫',
    descripcion: 'Cancelada',
  },
  rechazada: {
    label: 'Rechazada',
    color: 'danger',
    icon: '❌',
    descripcion: 'El asesor no pudo atender',
  },
  no_asistio: {
    label: 'No asistió',
    color: 'dark',
    icon: '👻',
    descripcion: 'No se presentó a la asesoría',
  },
};

const DIAS_CORTOS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MESES_CORTOS = [
  'ene', 'feb', 'mar', 'abr', 'may', 'jun',
  'jul', 'ago', 'sep', 'oct', 'nov', 'dic',
];

function SolicitudCard({ solicitud, onVerDetalles }) {
  const estado = ESTADOS_SOLICITUD[solicitud.estado] || ESTADOS_SOLICITUD.solicitada;

  // Formatear fecha
  const [year, month, day] = solicitud.fecha.split('-').map(Number);
  const fecha = new Date(year, month - 1, day);
  const diaSemana = DIAS_CORTOS[fecha.getDay()];
  const diaNum = fecha.getDate();
  const mes = MESES_CORTOS[fecha.getMonth()];
  const anio = fecha.getFullYear();

  const iconoModalidad =
    solicitud.modalidad === 'virtual'
      ? '💻'
      : solicitud.modalidad === 'hibrida'
      ? '🔄'
      : '🏫';

  // ¿Es futura? (para saber si se puede cancelar)
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const esFutura = fecha >= hoy;

  // ¿Se puede cancelar? (solo si está solicitada o programada y es futura)
  const sePuedeCancelar =
    esFutura && (solicitud.estado === 'solicitada' || solicitud.estado === 'programada');

  return (
    <Card className="border-0 shadow-sm h-100">
      <Card.Body>
        {/* Header: Estado + Materia */}
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="flex-grow-1 me-2">
            <div className="text-suave small mb-1">Materia</div>
            <h6 className="fw-bold text-azul mb-0">
              {solicitud.nombreMateria || 'Sin materia'}
            </h6>
          </div>
          <Badge bg={estado.color} text={estado.color === 'warning' ? 'dark' : 'white'}>
            {estado.icon} {estado.label}
          </Badge>
        </div>

        {/* Info del asesor */}
        <div className="d-flex align-items-center gap-2 mb-3 p-2 rounded" style={{ backgroundColor: 'var(--azul-suave)' }}>
          <div
            className="d-flex align-items-center justify-content-center rounded-circle text-white fw-bold flex-shrink-0"
            style={{
              width: '36px',
              height: '36px',
              backgroundColor: 'var(--azul-primario)',
              fontSize: '0.9rem',
            }}
          >
            {solicitud.nombreAsesor?.charAt(0) || '?'}
          </div>
          <div className="overflow-hidden">
            <div className="fw-semibold small text-truncate">
              {solicitud.nombreAsesor}
            </div>
            <div className="text-suave" style={{ fontSize: '0.75rem' }}>
              Asesor par
            </div>
          </div>
        </div>

        {/* Fecha y hora */}
        <div className="d-flex align-items-center gap-3 mb-2">
          <div className="d-flex align-items-center gap-2">
            <span style={{ fontSize: '1.2rem' }}>📅</span>
            <div>
              <div className="fw-semibold small">
                {diaSemana} {diaNum} {mes} {anio}
              </div>
              <div className="text-suave" style={{ fontSize: '0.75rem' }}>
                {solicitud.horaInicio} - {solicitud.horaFin}
              </div>
            </div>
          </div>
        </div>

        {/* Modalidad y lugar */}
        <div className="d-flex align-items-center gap-2 text-suave small mb-3">
          <span>{iconoModalidad}</span>
          <span>
            {solicitud.modalidad?.charAt(0).toUpperCase() + solicitud.modalidad?.slice(1)}
            {solicitud.lugar && ` · ${solicitud.lugar}`}
          </span>
        </div>

        {/* Descripción del estado */}
        <div className="text-suave small mb-3 fst-italic">
          {estado.descripcion}
        </div>

        {/* Botones */}
        <div className="d-flex gap-2">
          <Button
            size="sm"
            variant="outline-primary"
            className="flex-grow-1"
            onClick={() => onVerDetalles?.(solicitud)}
          >
            Ver detalles
          </Button>

          {sePuedeCancelar && (
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip>Función próximamente (HU-09)</Tooltip>
              }
            >
              <div>
                <Button
                  size="sm"
                  variant="outline-danger"
                  disabled
                  style={{ pointerEvents: 'auto' }}
                >
                  🚫
                </Button>
              </div>
            </OverlayTrigger>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}

export default SolicitudCard;