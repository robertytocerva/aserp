import { Card, Badge, Button, Spinner } from 'react-bootstrap';
import { ESTADOS_SOLICITUD } from './SolicitudCard';

const DIAS_CORTOS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MESES_CORTOS = [
  'ene', 'feb', 'mar', 'abr', 'may', 'jun',
  'jul', 'ago', 'sep', 'oct', 'nov', 'dic',
];

function SolicitudRecibidaCard({
  solicitud,
  onAceptar,
  onRechazar,
  accionesEnCurso = false,
}) {
  const estado = ESTADOS_SOLICITUD[solicitud.estado] || ESTADOS_SOLICITUD.solicitada;

  const [year, month, day] = solicitud.fecha.split('-').map(Number);
  const fecha = new Date(year, month - 1, day);
  const diaSemana = DIAS_CORTOS[fecha.getDay()];
  const diaNum = fecha.getDate();
  const mes = MESES_CORTOS[fecha.getMonth()];

  const iconoModalidad =
    solicitud.modalidad === 'virtual'
      ? 'bi-laptop'
      : solicitud.modalidad === 'hibrida'
      ? 'bi-arrow-repeat'
      : 'bi-building';

  const esPendiente = solicitud.estado === 'solicitada';

  return (
    <Card className="border-0 shadow-sm h-100">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-3">
          <Badge bg={estado.color} text={estado.color === 'warning' ? 'dark' : 'white'}>
            <i className={`bi ${estado.icon} me-1`}></i>
            {estado.label}
          </Badge>
          <div className="text-suave small">#{solicitud.idAsesoria}</div>
        </div>

        <div className="d-flex align-items-center gap-2 mb-3">
          <div
            className="d-flex align-items-center justify-content-center rounded-circle text-white fw-bold flex-shrink-0"
            style={{
              width: '44px',
              height: '44px',
              backgroundColor: 'var(--azul-primario)',
              fontSize: '1rem',
            }}
          >
            {solicitud.nombreAlumno?.charAt(0) || '?'}
          </div>
          <div className="overflow-hidden">
            <div className="fw-semibold small text-truncate">
              {solicitud.nombreAlumno}
            </div>
            <div className="text-suave" style={{ fontSize: '0.75rem' }}>
              Matrícula: {solicitud.matricula}
            </div>
          </div>
        </div>

        <div className="mb-3 p-2 rounded" style={{ backgroundColor: 'var(--azul-suave)' }}>
          <div className="text-suave" style={{ fontSize: '0.7rem' }}>
            MATERIA SOLICITADA
          </div>
          <div className="fw-bold text-azul small">
            {solicitud.nombreMateria || 'Sin materia'}
          </div>
        </div>

        <div className="d-flex align-items-center gap-3 mb-2">
          <div className="d-flex align-items-center gap-2">
            <i
              className="bi bi-calendar-event"
              style={{ fontSize: '1.2rem', color: 'var(--azul-primario)' }}
            ></i>
            <div>
              <div className="fw-semibold small">
                {diaSemana} {diaNum} {mes} {year}
              </div>
              <div className="text-suave" style={{ fontSize: '0.75rem' }}>
                {solicitud.horaInicio} - {solicitud.horaFin}
              </div>
            </div>
          </div>
        </div>

        <div className="d-flex align-items-center gap-2 text-suave small mb-3">
          <i className={`bi ${iconoModalidad}`}></i>
          <span>
            {solicitud.modalidad?.charAt(0).toUpperCase() + solicitud.modalidad?.slice(1)}
            {solicitud.lugar && ` · ${solicitud.lugar}`}
          </span>
        </div>

        {esPendiente ? (
          <div className="d-flex gap-2">
            <Button
              size="sm"
              className="btn-azul flex-grow-1"
              onClick={() => onAceptar?.(solicitud)}
              disabled={accionesEnCurso}
            >
              {accionesEnCurso ? (
                <>
                  <Spinner size="sm" animation="border" className="me-1" />
                  Procesando...
                </>
              ) : (
                <>
                  <i className="bi bi-check-circle me-1"></i> Aceptar
                </>
              )}
            </Button>
            <Button
              size="sm"
              variant="outline-danger"
              className="flex-grow-1"
              onClick={() => onRechazar?.(solicitud)}
              disabled={accionesEnCurso}
            >
              <i className="bi bi-x-circle me-1"></i> Rechazar
            </Button>
          </div>
        ) : (
          <div className="text-center text-suave small fst-italic py-2">
            {estado.descripcion}
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

export default SolicitudRecibidaCard;