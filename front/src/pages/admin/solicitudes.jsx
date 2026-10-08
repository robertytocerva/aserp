import { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Badge,
  Alert,
  Button,
  Form,
  Row,
  Col,
} from 'react-bootstrap';
import { solicitudesApi } from '../../api/solicitudesApi';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { ESTADOS_SOLICITUD } from '../../components/solicitudes/SolicitudCard';

function Solicitudes() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todas');
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    const cargar = async () => {
      setCargando(true);
      setError('');
      try {
        // Nota: El backend no tiene endpoint admin para listar TODAS las solicitudes.
        // Como alternativa, mostramos las solicitudes del alumno actual (si es alumno)
        // o usamos un array vacío.
        // Cuando el backend agregue un endpoint admin, este se reemplaza.
        const data = await solicitudesApi.misSolicitudes().catch(() => []);
        setSolicitudes(data);
      } catch (err) {
        setError(err.mensaje || 'No se pudieron cargar las solicitudes.');
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  const filtradas = solicitudes.filter((s) => {
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

  return (
    <>
      <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-2">
        <div>
          <h2 className="fw-bold text-azul mb-1">Solicitudes de asesoría</h2>
          <p className="text-suave mb-0">
            Supervisa las solicitudes realizadas en la plataforma.
          </p>
        </div>
      </div>

      <Alert variant="info" className="small">
        <strong>⚠️ Nota:</strong> El endpoint administrativo para ver todas las
        solicitudes no existe aún en el backend. Esta pantalla muestra los datos
        disponibles y se conectará cuando el endpoint esté listo.
      </Alert>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* Filtros */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <Row className="g-2 align-items-center">
            <Col md={6}>
              <Form.Select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                size="sm"
              >
                <option value="todas">Todos los estados</option>
                {Object.entries(ESTADOS_SOLICITUD).map(([key, val]) => (
                  <option key={key} value={key}>
                    {val.icon} {val.label}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col md={6}>
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
      ) : filtradas.length === 0 ? (
        <Alert variant="info" className="text-center py-5">
          <div style={{ fontSize: '3rem' }}>📭</div>
          <h5 className="fw-bold text-azul mb-1">Sin solicitudes</h5>
          <p className="text-suave mb-0 small">
            {solicitudes.length === 0
              ? 'Aún no hay solicitudes registradas.'
              : 'No hay solicitudes que coincidan con los filtros.'}
          </p>
        </Alert>
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
                {filtradas.map((s) => {
                  const est = ESTADOS_SOLICITUD[s.estado] || ESTADOS_SOLICITUD.solicitada;
                  return (
                    <tr key={s.idAsesoria}>
                      <td className="small text-suave">#{s.idAsesoria}</td>
                      <td className="small fw-semibold">{s.nombreAsesor}</td>
                      <td className="small">{s.nombreAlumno}</td>
                      <td className="small">{s.nombreMateria}</td>
                      <td className="small">
                        {s.fecha} {s.horaInicio}
                      </td>
                      <td className="text-center">
                        <Badge
                          bg={est.color}
                          text={est.color === 'warning' ? 'dark' : 'white'}
                          className="fw-normal"
                        >
                          {est.icon} {est.label}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        </Card>
      )}
    </>
  );
}

export default Solicitudes;