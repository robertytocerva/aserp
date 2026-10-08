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
} from 'react-bootstrap';
import { solicitudesApi } from '../api/solicitudesApi';
import { useAuth } from '../context/AuthContext';
import SolicitudCard, { ESTADOS_SOLICITUD } from '../components/solicitudes/SolicitudCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';

function MisSolicitudes() {
  const { usuario, esAsesor } = useAuth();

  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  // Filtros
  const [filtro, setFiltro] = useState('todas'); // todas | activas | solicitada | programada | completada | historial
  const [busqueda, setBusqueda] = useState('');

  // ============ CARGA ============
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

  // ============ FILTRADO ============
  const solicitudesFiltradas = useMemo(() => {
    return solicitudes.filter((s) => {
      // Filtro por estado
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

      // Búsqueda
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

  // ============ CONTADORES ============
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

  // ============ RENDER ============
  return (
    <>
      {/* Header */}
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

        {/* Filtros */}
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
              variant={filtro === 'solicitada' ? 'warning' : 'outline-warning'}
              onClick={() => setFiltro('solicitada')}
            >
              ⏳ Pendientes ({contadores.solicitadas})
            </Button>
            <Button
              variant={filtro === 'programada' ? 'success' : 'outline-success'}
              onClick={() => setFiltro('programada')}
            >
              ✅ Programadas ({contadores.programadas})
            </Button>
            <Button
              variant={filtro === 'historial' ? 'secondary' : 'outline-secondary'}
              onClick={() => setFiltro('historial')}
            >
              📜 Historial ({contadores.historial})
            </Button>
          </ButtonGroup>

          <InputGroup size="sm" style={{ maxWidth: '300px' }}>
            <InputGroup.Text className="bg-white border-end-0">
              🔍
            </InputGroup.Text>
            <Form.Control
              placeholder="Buscar por asesor o materia..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="border-start-0"
            />
          </InputGroup>
        </div>

        {/* Botón recargar */}
        <div className="d-flex justify-content-end mb-3">
          <Button
            size="sm"
            variant="outline-secondary"
            onClick={cargar}
            disabled={cargando}
          >
            🔄 Recargar
          </Button>
        </div>

        {/* Contenido */}
        {cargando ? (
          <LoadingSpinner mensaje="Cargando tus solicitudes..." />
        ) : solicitudesFiltradas.length === 0 ? (
          <Alert variant="info" className="text-center py-5">
            <div style={{ fontSize: '3rem' }}>📭</div>
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
                  onVerDetalles={() => {
                    // TODO: Abrir modal de detalles
                    alert('Próximamente: modal con detalles');
                  }}
                />
              </Col>
            ))}
          </Row>
        )}

        {/* Info para asesores */}
        {esAsesor && !cargando && solicitudes.length === 0 && (
          <Alert variant="info" className="mt-4 small">
            <strong>¿Eres asesor?</strong> Las solicitudes que recibas las puedes
            gestionar en <Link to="/solicitudes-recibidas">Solicitudes recibidas</Link>.
          </Alert>
        )}
      </Container>
    </>
  );
}

export default MisSolicitudes;