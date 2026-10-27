import { Card, Badge, Button, OverlayTrigger, Tooltip, Spinner } from 'react-bootstrap';
import { bitacorasApi } from '../../api/bitacorasApi';
import { useState } from 'react';

export const ESTADOS_SOLICITUD = {
  solicitada: {
    label: 'Solicitada',
    color: 'warning',
    icon: 'bi-hourglass-split',
    descripcion: 'Esperando respuesta del asesor',
  },
  programada: {
    label: 'Programada',
    color: 'success',
    icon: 'bi-check-circle-fill',
    descripcion: 'Confirmada por el asesor',
  },
  completada: {
    label: 'Completada',
    color: 'primary',
    icon: 'bi-mortarboard-fill',
    descripcion: 'Asesoría realizada',
  },
  cancelada: {
    label: 'Cancelada',
    color: 'secondary',
    icon: 'bi-slash-circle',
    descripcion: 'Cancelada',
  },
  rechazada: {
    label: 'Rechazada',
    color: 'danger',
    icon: 'bi-x-circle-fill',
    descripcion: 'El asesor no pudo atender',
  },
  no_asistio: {
    label: 'No asistió',
    color: 'dark',
    icon: 'bi-person-x-fill',
    descripcion: 'No se presentó a la asesoría',
  },
};

const DIAS_CORTOS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MESES_CORTOS = [
  'ene', 'feb', 'mar', 'abr', 'may', 'jun',
  'jul', 'ago', 'sep', 'oct', 'nov', 'dic',
];

function SolicitudCard({ solicitud, onVerDetalles }) {
  const [descargandoPdf, setDescargandoPdf] = useState(false);
  const estado = ESTADOS_SOLICITUD[solicitud.estado] || ESTADOS_SOLICITUD.solicitada;

  const [year, month, day] = solicitud.fecha.split('-').map(Number);
  const fecha = new Date(year, month - 1, day);
  const diaSemana = DIAS_CORTOS[fecha.getDay()];
  const diaNum = fecha.getDate();
  const mes = MESES_CORTOS[fecha.getMonth()];
  const anio = fecha.getFullYear();

  const iconoModalidad =
    solicitud.modalidad === 'virtual'
      ? 'bi-laptop'
      : solicitud.modalidad === 'hibrida'
      ? 'bi-arrow-repeat'
      : 'bi-building';

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const esFutura = fecha >= hoy;

  const sePuedeCancelar =
    esFutura && (solicitud.estado === 'solicitada' || solicitud.estado === 'programada');

  // Descargar PDF de la bitácora (si existe)
  const descargarPdf = async () => {
    if (!solicitud.idBitacora) return;
    setDescargandoPdf(true);
    try {
      const blob = await bitacorasApi.descargarPdf(solicitud.idBitacora);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `bitacora-${solicitud.idBitacora}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      alert('No se pudo descargar el PDF de la bitácora.');
    } finally {
      setDescargandoPdf(false);
    }
  };

  return (
    <Card className="border-0 shadow-sm h-100">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="flex-grow-1 me-2">
            <div className="text-suave small mb-1">Materia</div>
            <h6 className="fw-bold text-azul mb-0">
              {solicitud.nombreMateria || 'Sin materia'}
            </h6>
          </div>
          <Badge bg={estado.color} text={estado.color === 'warning' ? 'dark' : 'white'}>
            <i className={`bi ${estado.icon} me-1`}></i>
            {estado.label}
          </Badge>
        </div>

        <div
          className="d-flex align-items-center gap-2 mb-3 p-2 rounded"
          style={{ backgroundColor: 'var(--azul-suave)' }}
        >
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

        <div className="d-flex align-items-center gap-3 mb-2">
          <div className="d-flex align-items-center gap-2">
            <i
              className="bi bi-calendar-event"
              style={{ fontSize: '1.2rem', color: 'var(--azul-primario)' }}
            ></i>
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

        <div className="d-flex align-items-center gap-2 text-suave small mb-3">
          <i className={`bi ${iconoModalidad}`}></i>
          <span>
            {solicitud.modalidad?.charAt(0).toUpperCase() + solicitud.modalidad?.slice(1)}
            {solicitud.lugar && ` · ${solicitud.lugar}`}
          </span>
        </div>

        {/* Motivo del rechazo */}
        {solicitud.motivoRechazo && (
          <div
            className="mb-3 p-2 rounded small"
            style={{ backgroundColor: '#FFF3CD', border: '1px solid #FFECB5' }}
          >
            <div className="fw-semibold mb-1">
              <i className="bi bi-info-circle-fill me-1"></i>
              Motivo del rechazo:
            </div>
            <div className="fst-italic">{solicitud.motivoRechazo}</div>
          </div>
        )}

        <div className="text-suave small mb-3 fst-italic">
          {estado.descripcion}
        </div>

        <div className="d-flex gap-2 flex-wrap">
          <Button
            size="sm"
            variant="outline-primary"
            className="flex-grow-1"
            onClick={() => onVerDetalles?.(solicitud)}
          >
            Ver detalles
          </Button>

          {solicitud.idBitacora && (
            <Button
              size="sm"
              className="btn-amarillo"
              onClick={descargarPdf}
              disabled={descargandoPdf}
              title="Descargar bitácora en PDF"
            >
              {descargandoPdf ? (
                <Spinner size="sm" animation="border" />
              ) : (
                <i className="bi bi-file-pdf"></i>
              )}
            </Button>
          )}

          {sePuedeCancelar && (
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Función próximamente (HU-09)</Tooltip>}
            >
              <div>
                <Button
                  size="sm"
                  variant="outline-danger"
                  disabled
                  style={{ pointerEvents: 'auto' }}
                >
                  <i className="bi bi-x-circle"></i>
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