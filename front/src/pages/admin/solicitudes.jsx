import { useState, useEffect, useMemo } from 'react';
import {
  Card,
  Table,
  Badge,
  Alert,
  Form,
  Row,
  Col,
  Button,
} from 'react-bootstrap';
import { solicitudesApi } from '../../api/solicitudesApi';
import { ESTADOS_SOLICITUD } from '../../components/solicitudes/SolicitudCard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

function Solicitudes() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  
  const [filtroEstado, setFiltroEstado] = useState('todas');
  const [busqueda, setBusqueda] = useState('');

  const cargar = async () => {
    setCargando(true);
    setError('');
    try {
      const data = await solicitudesApi.listarTodasAdmin();
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

  const filtradas = useMemo(() => {
    return solicitudes.filter((s) => {
      if (filtroEstado !== 'todas' && s.estado !== filtroEstado) return false;
      if (busqueda) {
        const q = busqueda.toLowerCase();
        return (
          s.nombreAsesor?.toLowerCase().includes(q) ||
          s.nombreAlumno?.toLowerCase().includes(q) ||
          s.nombreMateria?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [solicitudes, filtroEstado, busqueda]);

  const contadores = useMemo(() => {
    const c = { todas: solicitudes.length };
    Object.keys(ESTADOS_SOLICITUD).forEach((key) => {
      c[key] = solicitudes.filter((s) => s.estado === key).length;
    });
    return c;
  }, [solicitudes]);

  return (
    <>
      <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-2">
        <div>
          <h2 className="fw-bold text-azul mb-1">Solicitudes de asesoría</h2>
          <p className="text-suave mb-0">
            Supervisa todas las solicitudes realizadas en la plataforma.
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

      {/* Tarjetas resumen */}
      <Row className="g-2 mb-4">
        <Col sm={6} lg={3}>
          <Card className="border-0 shadow-sm text-center">
            <Card.Body className="py-3">
              <div className="display-6 fw-bold text-azul">{contadores.todas}</div>
              <div className="text-suave small">Totales</div>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={6} lg={3}>
          <Card className="border-0 shadow-sm text-center">
            <Card.Body className="py-3">
              <div className="display-6 fw-bold text-warning">
                {contadores.solicitada}
              </div>
              <div className="text-suave small">Pendientes</div>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={6} lg={3}>
          <Card className="border-0 shadow-sm text-center">
            <Card.Body className="py-3">
              <div className="display-6 fw-bold text-success">
                {contadores.programada}
              </div>
              <div className="text-suave small">Programadas</div>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={6} lg={3}>
          <Card className="border-0 shadow-sm text-center">
            <Card.Body className="py-3">
              <div className="display-6 fw-bold text-danger">
                {contadores.rechazada}
              </div>
              <div className="text-suave small">Rechazadas</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Filtros */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <Row className="g-2 align-items-center">
            <Col md={4}>
              <Form.Select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                size="sm"
              >
                <option value="todas">Todos los estados ({contadores.todas})</option>
                {Object.entries(ESTADOS_SOLICITUD).map(([key, val]) => (
                  <option key={key} value={key}>
                    {val.label} ({contadores[key] || 0})
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col md={8}>
              <Form.Control
                type="search"
                placeholder="Buscar por asesor, alumno o materia..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                size="sm"
              />
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Tabla */}
      {cargando ? (
        <LoadingSpinner mensaje="Cargando solicitudes..." />
      ) : (
        <Card className="border-0 shadow-sm">
          <div className="table-responsive">
            <Table hover className="mb-0 align-middle">
              <thead style={{ backgroundColor: 'var(--azul-suave)' }}>
                <tr>
                  <th className="small fw-semibold">#</th>
                  <th className="small fw-semibold">Asesor</th>
                  <th className="small fw-semibold">Alumno</th>
                  <th className="small fw-semibold">Materia</th>
                  <th className="small fw-semibold">Fecha</th>
                  <th className="small fw-semibold text-center">Estado</th>
                </tr>
              </thead>
              <tbody>
                {filtradas.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-5 text-suave">
                      <div style={{ fontSize: '2.5rem', color: 'var(--azul-primario)' }}>
                        <i className="bi bi-inbox"></i>
                      </div>
                      No hay solicitudes que coincidan con los filtros.
                    </td>
                  </tr>
                ) : (
                  filtradas.map((s) => {
                    const est = ESTADOS_SOLICITUD[s.estado] || ESTADOS_SOLICITUD.solicitada;
                    return (
                      <tr key={s.idAsesoria}>
                        <td className="small text-suave">#{s.idAsesoria}</td>
                        <td className="small fw-semibold">{s.nombreAsesor}</td>
                        <td className="small">{s.nombreAlumno}</td>
                        <td className="small">{s.nombreMateria}</td>
                        <td className="small">
                          {s.fecha} · {s.horaInicio}
                        </td>
                        <td className="text-center">
                          <Badge
                            bg={est.color}
                            text={est.color === 'warning' ? 'dark' : 'white'}
                            className="fw-normal"
                          >
                            <i className={`bi ${est.icon} me-1`}></i>
                            {est.label}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </Table>
          </div>
        </Card>
      )}
    </>
  );
}

export default Solicitudes;