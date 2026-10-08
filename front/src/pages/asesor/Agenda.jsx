import { useState, useEffect, useMemo } from 'react';
import {
  Row,
  Col,
  Card,
  Badge,
  Button,
  Alert,
  ButtonGroup,
} from 'react-bootstrap';
import { solicitudesApi } from '../../api/solicitudesApi';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const DIAS_LARGOS = [
  'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado',
];
const MESES_LARGOS = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];

function Agenda() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [vista, setVista] = useState('programadas'); // programadas | completadas

  // ============ CARGA ============
  const cargar = async () => {
    setCargando(true);
    setError('');
    try {
      const data = await solicitudesApi.solicitudesRecibidas();
      setSolicitudes(data);
    } catch (err) {
      setError(err.mensaje || 'No se pudieron cargar tus asesorías.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  // ============ FILTRAR Y AGRUPAR ============
  const solicitudesFiltradas = useMemo(() => {
    if (vista === 'programadas') {
      return solicitudes.filter((s) => s.estado === 'programada');
    } else {
      return solicitudes.filter((s) =>
        ['completada', 'no_asistio'].includes(s.estado)
      );
    }
  }, [solicitudes, vista]);

  // Agrupar por fecha
  const agrupadasPorFecha = useMemo(() => {
    const grupos = {};
    solicitudesFiltradas.forEach((s) => {
      if (!grupos[s.fecha]) grupos[s.fecha] = [];
      grupos[s.fecha].push(s);
    });
    // Ordenar fechas
    const fechasOrdenadas = Object.keys(grupos).sort((a, b) =>
      vista === 'programadas' ? a.localeCompare(b) : b.localeCompare(a)
    );
    return fechasOrdenadas.map((fecha) => ({
      fecha,
      solicitudes: grupos[fecha].sort((a, b) =>
        a.horaInicio.localeCompare(b.horaInicio)
      ),
    }));
  }, [solicitudesFiltradas, vista]);

  // ============ HELPERS ============
  const formatearFecha = (fechaStr) => {
    const [year, month, day] = fechaStr.split('-').map(Number);
    const fecha = new Date(year, month - 1, day);
    return `${DIAS_LARGOS[fecha.getDay()]}, ${day} de ${MESES_LARGOS[fecha.getMonth()]} de ${year}`;
  };

  const esHoy = (fechaStr) => {
    const hoy = new Date();
    const hoyStr = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;
    return fechaStr === hoyStr;
  };

  const esFuturo = (fechaStr) => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const [year, month, day] = fechaStr.split('-').map(Number);
    const fecha = new Date(year, month - 1, day);
    return fecha >= hoy;
  };

  // ============ RENDER ============
  return (
    <>
      <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-2">
        <div>
          <h2 className="fw-bold text-azul mb-1">Mi agenda</h2>
          <p className="text-suave mb-0">
            Consulta tus asesorías programadas y tu historial.
          </p>
        </div>
        <Button variant="outline-secondary" size="sm" onClick={cargar}>
          🔄 Recargar
        </Button>
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Selector de vista */}
      <ButtonGroup className="mb-4">
        <Button
          variant={vista === 'programadas' ? 'primary' : 'outline-primary'}
          onClick={() => setVista('programadas')}
        >
          🗓️ Próximas ({solicitudes.filter((s) => s.estado === 'programada').length})
        </Button>
        <Button
          variant={vista === 'completadas' ? 'primary' : 'outline-primary'}
          onClick={() => setVista('completadas')}
        >
          📜 Historial (
          {solicitudes.filter((s) => ['completada', 'no_asistio'].includes(s.estado)).length}
          )
        </Button>
      </ButtonGroup>

      {/* Contenido */}
      {cargando ? (
        <LoadingSpinner mensaje="Cargando tu agenda..." />
      ) : agrupadasPorFecha.length === 0 ? (
        <Alert variant="info" className="text-center py-5">
          <div style={{ fontSize: '3rem' }}>
            {vista === 'programadas' ? '📅' : '📜'}
          </div>
          <h5 className="fw-bold text-azul mb-2">
            {vista === 'programadas'
              ? 'No tienes asesorías programadas'
              : 'Aún no hay asesorías en tu historial'}
          </h5>
          <p className="text-suave mb-0">
            {vista === 'programadas'
              ? 'Cuando aceptes solicitudes, aparecerán aquí.'
              : 'Las asesorías completadas aparecerán aquí.'}
          </p>
        </Alert>
      ) : (
        <div className="d-flex flex-column gap-4">
          {agrupadasPorFecha.map(({ fecha, solicitudes: lista }) => (
            <div key={fecha}>
              {/* Encabezado del día */}
              <div className="d-flex align-items-center gap-2 mb-3">
                <h6 className="fw-bold text-azul mb-0">
                  {formatearFecha(fecha)}
                </h6>
                {esHoy(fecha) && (
                  <Badge className="btn-amarillo text-dark">HOY</Badge>
                )}
                {!esHoy(fecha) && esFuturo(fecha) && vista === 'programadas' && (
                  <Badge bg="info">Próximamente</Badge>
                )}
              </div>

              {/* Asesorías del día */}
              <Row className="g-3">
                {lista.map((s) => (
                  <Col key={s.idAsesoria} md={6}>
                    <Card className="border-0 shadow-sm h-100">
                      <Card.Body>
                        <div className="d-flex align-items-center gap-3 mb-2">
                          <div
                            className="text-center flex-shrink-0"
                            style={{
                              backgroundColor: 'var(--azul-primario)',
                              color: 'white',
                              padding: '6px 12px',
                              borderRadius: '8px',
                              minWidth: '80px',
                            }}
                          >
                            <div className="fw-bold small">{s.horaInicio}</div>
                            <div className="small" style={{ fontSize: '0.65rem' }}>
                              a {s.horaFin}
                            </div>
                          </div>
                          <div className="flex-grow-1">
                            <div className="fw-semibold text-azul small mb-1">
                              {s.nombreMateria}
                            </div>
                            <div className="text-suave small">
                              👤 {s.nombreAlumno}
                            </div>
                            {s.matricula && (
                              <div className="text-suave" style={{ fontSize: '0.7rem' }}>
                                Matrícula: {s.matricula}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                          <div className="text-suave small">
                            {s.modalidad === 'virtual'
                              ? '💻 Virtual'
                              : s.modalidad === 'hibrida'
                              ? '🔄 Híbrida'
                              : '🏫 Presencial'}
                            {s.lugar && ` · ${s.lugar}`}
                          </div>
                          <Badge
                            bg={s.estado === 'programada' ? 'success' : 'secondary'}
                            className="fw-normal"
                          >
                            {s.estado === 'programada'
                              ? '✅ Programada'
                              : s.estado === 'completada'
                              ? '🎓 Completada'
                              : s.estado === 'no_asistio'
                              ? '👻 No asistió'
                              : s.estado}
                          </Badge>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default Agenda;