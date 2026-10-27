import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Alert,
  Badge,
  ButtonGroup,
  InputGroup,
  Modal,
  Spinner,
} from 'react-bootstrap';
import { solicitudesApi } from '../api/solicitudesApi';
import { bitacorasApi } from '../api/bitacorasApi';
import { useAuth } from '../context/AuthContext';
import SolicitudCard, { ESTADOS_SOLICITUD } from '../components/solicitudes/SolicitudCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';

function MisSolicitudes() {
  const { usuario, esAsesor } = useAuth();

  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const [filtro, setFiltro] = useState('todas');
  const [busqueda, setBusqueda] = useState('');

  // Modal de detalles
  const [modal, setModal] = useState({ show: false, solicitud: null });
  const [descargandoPdf, setDescargandoPdf] = useState(false);

  const cargar = async () => {
    setCargando(true);
    setError('');
    try {
      const data = await solicitudesApi.misSolicitudes();
      setSolicitudes(data);
    } catch (err) {
      setError(err.mensaje || 'No se pudieron cargar tus solicitudes.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const solicitudesFiltradas = useMemo(() => {
    return solicitudes.filter((s) => {
      if (filtro === 'activas') {
        if (s.estado !== 'solicitada' && s.estado !== 'programada') return false;
      } else if (filtro === 'historial') {
        if (
          s.estado !== 'completada' &&
          s.estado !== 'cancelada' &&
          s.estado !== 'rechazada' &&
          s.estado !== 'no_asistio'
        )
          return false;
      } else if (filtro !== 'todas' && s.estado !== filtro) {
        return false;
      }

      if (busqueda) {
        const q = busqueda.toLowerCase();
        return (
          s.nombreAsesor?.toLowerCase().includes(q) ||
          s.nombreMateria?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [solicitudes, filtro, busqueda]);

  const contadores = useMemo(() => {
    return {
      todas: solicitudes.length,
      solicitadas: solicitudes.filter((s) => s.estado === 'solicitada').length,
      programadas: solicitudes.filter((s) => s.estado === 'programada').length,
      completadas: solicitudes.filter((s) => s.estado === 'completada').length,
      activas: solicitudes.filter(
        (s) => s.estado === 'solicitada' || s.estado === 'programada'
      ).length,
      historial: solicitudes.filter((s) =>
        ['completada', 'cancelada', 'rechazada', 'no_asistio'].includes(s.estado)
      ).length,
    };
  }, [solicitudes]);

  const descargarPdf = async () => {
    if (!modal.solicitud?.idBitacora) return;
    setDescargandoPdf(true);
    try {
      const blob = await bitacorasApi.descargarPdf(modal.solicitud.idBitacora);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `bitacora-${modal.solicitud.idBitacora}.pdf`;
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

  return (
    <>
      <section className="py-5" style={{ backgroundColor: 'var(--azul-suave)' }}>
        <Container>
          <h1 className="fw-bold text-azul mb-2">Mis solicitudes</h1>
          <p className="text-suave mb-0">
            Consulta el estado de tus solicitudes de asesoría y tu historial.
          </p>
        </Container>
      </section>

      <Container className="py-4">
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
          <ButtonGroup size="sm" className="flex-wrap">
            <Button
              variant={filtro === 'todas' ? 'primary' : 'outline-primary'}
              onClick={() => setFiltro('todas')}
            >
              Todas ({contadores.todas})
            </Button>
            <Button
              variant={filtro === 'activas' ? 'warning' : 'outline-warning'}
              onClick={() => setFiltro('activas')}
            >
              Activas ({contadores.activas})
            </Button>
            <Button
              variant={filtro === 'programada' ? 'success' : 'outline-success'}
              onClick={() => setFiltro('programada')}
            >
              <i className="bi bi-check-circle-fill me-1"></i> Programadas (
              {contadores.programadas})
            </Button>
            <Button
              variant={filtro === 'historial' ? 'secondary' : 'outline-secondary'}
              onClick={() => setFiltro('historial')}
            >
              <i className="bi bi-clock-history me-1"></i> Historial (
              {contadores.historial})
            </Button>
          </ButtonGroup>

          <InputGroup size="sm" style={{ maxWidth: '300px' }}>
            <InputGroup.Text className="bg-white border-end-0">
              <i className="bi bi-search"></i>
            </InputGroup.Text>
            <Form.Control
              placeholder="Buscar por asesor o materia..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="border-start-0"
            />
          </InputGroup>
        </div>

        <div className="d-flex justify-content-end mb-3">
          <Button size="sm" variant="outline-secondary" onClick={cargar} disabled={cargando}>
            <i className="bi bi-arrow-clockwise me-1"></i> Recargar
          </Button>
        </div>

        {cargando ? (
          <LoadingSpinner mensaje="Cargando tus solicitudes..." />
        ) : solicitudesFiltradas.length === 0 ? (
          <Alert variant="info" className="text-center py-5">
            <div style={{ fontSize: '3rem', color: 'var(--azul-primario)' }}>
              <i className="bi bi-inbox"></i>
            </div>
            <h5 className="fw-bold text-azul mb-2">
              {solicitudes.length === 0
                ? 'Aún no has solicitado asesorías'
                : 'Sin resultados'}
            </h5>
            <p className="text-suave mb-3">
              {solicitudes.length === 0
                ? 'Explora el catálogo de asesores y solicita tu primera asesoría.'
                : 'Prueba con otros filtros o términos de búsqueda.'}
            </p>
            {solicitudes.length === 0 && (
              <Button as={Link} to="/asesores" className="btn-azul">
                Ver asesores disponibles
              </Button>
            )}
          </Alert>
        ) : (
          <Row className="g-3">
            {solicitudesFiltradas.map((s) => (
              <Col key={s.idAsesoria} md={6} lg={4}>
                <SolicitudCard
                  solicitud={s}
                  onVerDetalles={() => setModal({ show: true, solicitud: s })}
                />
              </Col>
            ))}
          </Row>
        )}

        {esAsesor && !cargando && solicitudes.length === 0 && (
          <Alert variant="info" className="mt-4 small">
            <strong>¿Eres asesor?</strong> Las solicitudes que recibas las puedes
            gestionar en <Link to="/solicitudes-recibidas">Solicitudes recibidas</Link>.
          </Alert>
        )}
      </Container>

      {/* ============ MODAL DE DETALLES ============ */}
      <Modal
        show={modal.show}
        onHide={() => setModal({ show: false, solicitud: null })}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold text-azul">
            Detalles de la solicitud #{modal.solicitud?.idAsesoria}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modal.solicitud && (
            <>
              <Row className="mb-3">
                <Col md={6}>
                  <div className="text-suave small">Asesor</div>
                  <div className="fw-semibold">{modal.solicitud.nombreAsesor}</div>
                </Col>
                <Col md={6}>
                  <div className="text-suave small">Materia</div>
                  <div className="fw-semibold">{modal.solicitud.nombreMateria}</div>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <div className="text-suave small">Fecha y hora</div>
                  <div className="fw-semibold">
                    {modal.solicitud.fecha} · {modal.solicitud.horaInicio} -{' '}
                    {modal.solicitud.horaFin}
                  </div>
                </Col>
                <Col md={6}>
                  <div className="text-suave small">Modalidad y lugar</div>
                  <div className="fw-semibold">
                    {modal.solicitud.modalidad} · {modal.solicitud.lugar}
                  </div>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <div className="text-suave small">Estado</div>
                  <Badge
                    bg={ESTADOS_SOLICITUD[modal.solicitud.estado]?.color || 'secondary'}
                    className="fw-normal"
                  >
                    <i
                      className={`bi ${ESTADOS_SOLICITUD[modal.solicitud.estado]?.icon} me-1`}
                    ></i>
                    {ESTADOS_SOLICITUD[modal.solicitud.estado]?.label}
                  </Badge>
                </Col>
              </Row>

              {modal.solicitud.motivoRechazo && (
                <Alert variant="warning" className="small">
                  <div className="fw-semibold mb-1">
                    <i className="bi bi-info-circle-fill me-1"></i>
                    Motivo del rechazo:
                  </div>
                  <div className="fst-italic">{modal.solicitud.motivoRechazo}</div>
                </Alert>
              )}

              {modal.solicitud.idBitacora && (
                <Alert variant="success" className="small">
                  <div className="fw-semibold mb-2">
                    <i className="bi bi-journal-check me-1"></i>
                    Bitácora disponible
                  </div>
                  <Button
                    size="sm"
                    className="btn-azul"
                    onClick={descargarPdf}
                    disabled={descargandoPdf}
                  >
                    {descargandoPdf ? (
                      <>
                        <Spinner size="sm" animation="border" className="me-1" />
                        Descargando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-file-pdf me-1"></i>
                        Descargar PDF
                      </>
                    )}
                  </Button>
                </Alert>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModal({ show: false, solicitud: null })}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default MisSolicitudes;