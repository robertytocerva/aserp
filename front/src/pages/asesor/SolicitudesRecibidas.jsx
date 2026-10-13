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
  const [modalRechazar, setModalRechazar] = useState({ show: false, solicitud: null });

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

  const handleRechazar = async () => {
    const solicitud = modalRechazar.solicitud;
    if (!solicitud) return;

    setAccionesEnCurso((prev) => ({ ...prev, [solicitud.idAsesoria]: true }));
    setError('');
    setExito('');
    try {
      const actualizada = await solicitudesApi.rechazar(solicitud.idAsesoria);
      setSolicitudes((prev) =>
        prev.map((s) => (s.idAsesoria === solicitud.idAsesoria ? actualizada : s))
      );
      setExito(`Solicitud de ${solicitud.nombreAlumno} rechazada.`);
    } catch (err) {
      setError(err.mensaje || 'No se pudo rechazar la solicitud.');
    } finally {
      setAccionesEnCurso((prev) => ({ ...prev, [solicitud.idAsesoria]: false }));
      setModalRechazar({ show: false, solicitud: null });
    }
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
            <i className="bi bi-hourglass-split me-1"></i> Pendientes ({contadores.pendientes})
          </Button>
          <Button
            variant={filtro === 'programadas' ? 'success' : 'outline-success'}
            onClick={() => setFiltro('programadas')}
          >
            <i className="bi bi-check-circle-fill me-1"></i> Programadas ({contadores.programadas})
          </Button>
          <Button
            variant={filtro === 'historial' ? 'secondary' : 'outline-secondary'}
            onClick={() => setFiltro('historial')}
          >
            <i className="bi bi-clock-history me-1"></i> Historial ({contadores.historial})
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
                onRechazar={(sol) => setModalRechazar({ show: true, solicitud: sol })}
                accionesEnCurso={accionesEnCurso[s.idAsesoria]}
              />
            </Col>
          ))}
        </Row>
      )}

      <Modal
        show={modalRechazar.show}
        onHide={() => setModalRechazar({ show: false, solicitud: null })}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold text-danger">
            <i className="bi bi-x-circle-fill me-2"></i>Confirmar rechazo
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            ¿Seguro que quieres rechazar la solicitud de{' '}
            <strong>{modalRechazar.solicitud?.nombreAlumno}</strong>?
          </p>
          <Alert variant="info" className="small mb-0">
            El slot volverá a estar disponible para otros alumnos.
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setModalRechazar({ show: false, solicitud: null })}
          >
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleRechazar}>
            <i className="bi bi-x-circle me-1"></i> Sí, rechazar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default SolicitudesRecibidas;