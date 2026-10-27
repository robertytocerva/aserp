import ModalBitacora from '../../components/solicitudes/ModalBitacora';
import { useState, useEffect, useMemo } from 'react';
import {
  Row,
  Col,
  Button,
  Form,
  Alert,
  ButtonGroup,
  InputGroup,
  Modal,
  Spinner,
} from 'react-bootstrap';
import { solicitudesApi } from '../../api/solicitudesApi';
import SolicitudRecibidaCard from '../../components/solicitudes/SolicitudRecibidaCard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

function SolicitudesRecibidas() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

  const [filtro, setFiltro] = useState('pendientes');
  const [busqueda, setBusqueda] = useState('');
  const [accionesEnCurso, setAccionesEnCurso] = useState({});
  const [modalBitacora, setModalBitacora] = useState({ show: false, solicitud: null });

  // Modal de rechazo con motivo
  const [modalRechazar, setModalRechazar] = useState({
    show: false,
    solicitud: null,
    motivo: '',
    enviando: false,
  });

  const cargar = async () => {
    setCargando(true);
    setError('');
    try {
      const data = await solicitudesApi.solicitudesRecibidas();
      setSolicitudes(data);
    } catch (err) {
      setError(err.mensaje || 'No se pudieron cargar las solicitudes.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const handleAceptar = async (solicitud) => {
    setAccionesEnCurso((prev) => ({ ...prev, [solicitud.idAsesoria]: true }));
    setError('');
    setExito('');
    try {
      const actualizada = await solicitudesApi.aceptar(solicitud.idAsesoria);
      setSolicitudes((prev) =>
        prev.map((s) => (s.idAsesoria === solicitud.idAsesoria ? actualizada : s))
      );
      setExito(
        `Solicitud de ${solicitud.nombreAlumno} aceptada. La asesoría está programada.`
      );
    } catch (err) {
      setError(err.mensaje || 'No se pudo aceptar la solicitud.');
    } finally {
      setAccionesEnCurso((prev) => ({ ...prev, [solicitud.idAsesoria]: false }));
    }
  };

  const handleRechazar = (solicitud) => {
    setModalRechazar({
      show: true,
      solicitud,
      motivo: '',
      enviando: false,
    });
  };

  const confirmarRechazo = async () => {
    const { solicitud, motivo } = modalRechazar;
    if (!solicitud) return;

    setModalRechazar((prev) => ({ ...prev, enviando: true }));
    setError('');
    setExito('');

    try {
      const actualizada = await solicitudesApi.rechazar(
        solicitud.idAsesoria,
        motivo.trim() || null
      );
      setSolicitudes((prev) =>
        prev.map((s) => (s.idAsesoria === solicitud.idAsesoria ? actualizada : s))
      );
      setExito(`Solicitud de ${solicitud.nombreAlumno} rechazada.`);
      setModalRechazar({ show: false, solicitud: null, motivo: '', enviando: false });
    } catch (err) {
      setError(err.mensaje || 'No se pudo rechazar la solicitud.');
      setModalRechazar((prev) => ({ ...prev, enviando: false }));
    }
  };

  const handleCompletar = async (solicitud) => {
    setAccionesEnCurso((prev) => ({ ...prev, [solicitud.idAsesoria]: true }));
    setError('');
    setExito('');
    try {
      const actualizada = await solicitudesApi.completar(solicitud.idAsesoria);
      setSolicitudes((prev) =>
        prev.map((s) => (s.idAsesoria === solicitud.idAsesoria ? actualizada : s))
      );
      setExito(`Sesión de ${solicitud.nombreAlumno} marcada como completada.`);
    } catch (err) {
      setError(err.mensaje || 'No se pudo completar la sesión.');
    } finally {
      setAccionesEnCurso((prev) => ({ ...prev, [solicitud.idAsesoria]: false }));
    }
  };

  const handleGenerarBitacora = (solicitud) => {
    setModalBitacora({ show: true, solicitud });
  };

  const handleBitacoraCreada = () => {
    setExito('Bitácora creada y correos enviados correctamente.');
    cargar();
  };

  const solicitudesFiltradas = useMemo(() => {
    return solicitudes.filter((s) => {
      if (filtro === 'pendientes' && s.estado !== 'solicitada') return false;
      if (filtro === 'programadas' && s.estado !== 'programada') return false;
      if (filtro === 'historial') {
        if (!['completada', 'cancelada', 'rechazada', 'no_asistio'].includes(s.estado))
          return false;
      }

      if (busqueda) {
        const q = busqueda.toLowerCase();
        return (
          s.nombreAlumno?.toLowerCase().includes(q) ||
          s.matricula?.toLowerCase().includes(q) ||
          s.nombreMateria?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [solicitudes, filtro, busqueda]);

  const contadores = useMemo(() => {
    return {
      todas: solicitudes.length,
      pendientes: solicitudes.filter((s) => s.estado === 'solicitada').length,
      programadas: solicitudes.filter((s) => s.estado === 'programada').length,
      historial: solicitudes.filter((s) =>
        ['completada', 'cancelada', 'rechazada', 'no_asistio'].includes(s.estado)
      ).length,
    };
  }, [solicitudes]);

  return (
    <>
      <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-2">
        <div>
          <h2 className="fw-bold text-azul mb-1">Solicitudes recibidas</h2>
          <p className="text-suave mb-0">
            Revisa y gestiona las solicitudes de asesoría de tus alumnos.
          </p>
        </div>
        <Button variant="outline-secondary" size="sm" onClick={cargar}>
          <i className="bi bi-arrow-clockwise me-1"></i> Recargar
        </Button>
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      {exito && (
        <Alert variant="success" dismissible onClose={() => setExito('')}>
          {exito}
        </Alert>
      )}

      <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
        <ButtonGroup size="sm">
          <Button
            variant={filtro === 'pendientes' ? 'warning' : 'outline-warning'}
            onClick={() => setFiltro('pendientes')}
          >
            <i className="bi bi-hourglass-split me-1"></i> Pendientes (
            {contadores.pendientes})
          </Button>
          <Button
            variant={filtro === 'programadas' ? 'success' : 'outline-success'}
            onClick={() => setFiltro('programadas')}
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
            placeholder="Buscar por alumno o materia..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="border-start-0"
          />
        </InputGroup>
      </div>

      {cargando ? (
        <LoadingSpinner mensaje="Cargando solicitudes..." />
      ) : solicitudesFiltradas.length === 0 ? (
        <Alert variant="info" className="text-center py-5">
          <div style={{ fontSize: '3rem', color: 'var(--azul-primario)' }}>
            <i className="bi bi-inbox"></i>
          </div>
          <h5 className="fw-bold text-azul mb-2">
            {solicitudes.length === 0
              ? 'Aún no has recibido solicitudes'
              : 'Sin resultados'}
          </h5>
          <p className="text-suave mb-0">
            {solicitudes.length === 0
              ? 'Cuando un alumno solicite una asesoría, aparecerá aquí.'
              : 'Prueba con otros filtros.'}
          </p>
        </Alert>
      ) : (
        <Row className="g-3">
          {solicitudesFiltradas.map((s) => (
            <Col key={s.idAsesoria} md={6} xl={4}>
              <SolicitudRecibidaCard
                solicitud={s}
                onAceptar={handleAceptar}
                onRechazar={handleRechazar}
                onCompletar={handleCompletar}
                onGenerarBitacora={handleGenerarBitacora}
                accionesEnCurso={accionesEnCurso[s.idAsesoria]}
              />
            </Col>
          ))}
        </Row>
      )}

      {/* ============ MODAL DE RECHAZO ============ */}
      <Modal
        show={modalRechazar.show}
        onHide={() =>
          !modalRechazar.enviando &&
          setModalRechazar({ show: false, solicitud: null, motivo: '', enviando: false })
        }
        centered
      >
        <Modal.Header closeButton={!modalRechazar.enviando}>
          <Modal.Title className="fw-bold text-danger">
            <i className="bi bi-x-circle-fill me-2"></i>Rechazar solicitud
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            ¿Seguro que quieres rechazar la solicitud de{' '}
            <strong>{modalRechazar.solicitud?.nombreAlumno}</strong>?
          </p>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold small">
              Motivo del rechazo (opcional)
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Ej: Tengo un examen ese día, no puedo atender."
              value={modalRechazar.motivo}
              onChange={(e) =>
                setModalRechazar({ ...modalRechazar, motivo: e.target.value })
              }
              maxLength={500}
              disabled={modalRechazar.enviando}
            />
            <Form.Text className="text-suave">
              {modalRechazar.motivo.length}/500 caracteres. El alumno verá este
              mensaje en su correo.
            </Form.Text>
          </Form.Group>

          <Alert variant="info" className="small mb-0">
            El slot volverá a estar disponible para otros alumnos.
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() =>
              setModalRechazar({ show: false, solicitud: null, motivo: '', enviando: false })
            }
            disabled={modalRechazar.enviando}
          >
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={confirmarRechazo}
            disabled={modalRechazar.enviando}
          >
            {modalRechazar.enviando ? (
              <>
                <Spinner size="sm" animation="border" className="me-2" />
                Rechazando...
              </>
            ) : (
              <>
                <i className="bi bi-x-circle me-1"></i> Sí, rechazar
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ============ MODAL DE BITÁCORA ============ */}
      <ModalBitacora
        show={modalBitacora.show}
        onHide={() => setModalBitacora({ show: false, solicitud: null })}
        solicitud={modalBitacora.solicitud}
        onSuccess={handleBitacoraCreada}
      />
    </>
  );
}

export default SolicitudesRecibidas;