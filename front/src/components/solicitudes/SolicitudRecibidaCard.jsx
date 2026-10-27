import { Card, Badge, Button, Spinner } from 'react-bootstrap';
import { ESTADOS_SOLICITUD } from './SolicitudCard';
import { bitacorasApi } from '../../api/bitacorasApi';
import { useState } from 'react';

const DIAS_CORTOS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MESES_CORTOS = [
  'ene', 'feb', 'mar', 'abr', 'may', 'jun',
  'jul', 'ago', 'sep', 'oct', 'nov', 'dic',
];

function SolicitudRecibidaCard({
  solicitud,
  onAceptar,
  onRechazar,
  onCompletar,
  onGenerarBitacora,
  accionesEnCurso = false,
}) {
  const [descargandoPdf, setDescargandoPdf] = useState(false);
  const [descargandoImagen, setDescargandoImagen] = useState(false);
  
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
  const esProgramada = solicitud.estado === 'programada';
  const esCompletada = solicitud.estado === 'completada';

  const ahora = new Date();
  const [hFin, mFin] = solicitud.horaFin.split(':').map(Number);
  const fechaFin = new Date(year, month - 1, day, hFin, mFin);
  const sesionTerminada = fechaFin <= ahora;

  // Descargar PDF
  const handleDescargarPdf = async () => {
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
      alert('No se pudo descargar el PDF.');
    } finally {
      setDescargandoPdf(false);
    }
  };

  // Descargar imagen
  const handleDescargarImagen = async () => {
    if (!solicitud.idBitacora) return;
    setDescargandoImagen(true);
    try {
      const blob = await bitacorasApi.descargarImagen(solicitud.idBitacora);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `evidencia-${solicitud.idBitacora}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      alert('No se pudo descargar la imagen.');
    } finally {
      setDescargandoImagen(false);
    }
  };

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

        {esPendiente && (
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
        )}

        {esProgramada && (
          <div className="d-flex flex-column gap-2">
            {sesionTerminada ? (
              <Button
                size="sm"
                variant="outline-primary"
                className="w-100"
                onClick={() => onCompletar?.(solicitud)}
                disabled={accionesEnCurso}
              >
                {accionesEnCurso ? (
                  <>
                    <Spinner size="sm" animation="border" className="me-1" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check2-square me-1"></i>
                    Completar sesión
                  </>
                )}
              </Button>
            ) : (
              <div className="text-center text-suave small fst-italic py-2">
                <i className="bi bi-clock-history me-1"></i>
                Podrás completar esta sesión cuando termine.
              </div>
            )}
          </div>
        )}

        {esCompletada && (
          <div className="d-flex flex-column gap-2">
            <Badge bg="success" className="mb-1">
              <i className="bi bi-check-circle-fill me-1"></i>
              Sesión completada
            </Badge>

            {solicitud.idBitacora ? (
              <div className="d-flex gap-2">
                <Button
                  size="sm"
                  className="btn-azul flex-grow-1"
                  onClick={handleDescargarPdf}
                  disabled={descargandoPdf}
                >
                  {descargandoPdf ? (
                    <Spinner size="sm" animation="border" />
                  ) : (
                    <>
                      <i className="bi bi-file-pdf me-1"></i> PDF
                    </>
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="outline-primary"
                  className="flex-grow-1"
                  onClick={handleDescargarImagen}
                  disabled={descargandoImagen}
                  title="Descargar imagen de evidencia"
                >
                  {descargandoImagen ? (
                    <Spinner size="sm" animation="border" />
                  ) : (
                    <>
                      <i className="bi bi-image me-1"></i> Imagen
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                className="btn-amarillo w-100"
                onClick={() => onGenerarBitacora?.(solicitud)}
              >
                <i className="bi bi-journal-plus me-1"></i>
                Generar bitácora
              </Button>
            )}
          </div>
        )}

        {!esPendiente && !esProgramada && !esCompletada && (
          <div className="text-center text-suave small fst-italic py-2">
            {estado.descripcion}
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

export default SolicitudRecibidaCard;