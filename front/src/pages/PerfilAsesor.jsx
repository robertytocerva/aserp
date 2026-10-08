import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Button,
  Alert,
} from 'react-bootstrap';
import { asesoresApi } from '../api/asesoresApi';
import { USE_MOCKS, getAsesorMockById } from '../mocks/asesoresMock';
import { useAuth } from '../context/AuthContext';
import HorarioCard from '../components/asesores/HorarioCard';
import MateriaItem from '../components/asesores/MateriaItem';
import SlotDisponible from '../components/asesores/SlotDisponible';
import ModalSolicitar from '../components/asesores/ModalSolicitar';
import LoadingSpinner from '../components/ui/LoadingSpinner';

function PerfilAsesor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { estaLogueado, esAlumno, usuario } = useAuth();

  const [asesor, setAsesor] = useState(null);
  const [slots, setSlots] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [cargandoSlots, setCargandoSlots] = useState(false);
  const [error, setError] = useState('');

  // Modal
  const [modal, setModal] = useState({ show: false, slot: null });
  const [exito, setExito] = useState('');

  // ============ CARGA DEL ASESOR ============
  useEffect(() => {
    const cargar = async () => {
      setCargando(true);
      setError('');
      try {
        if (USE_MOCKS) {
          await new Promise((r) => setTimeout(r, 300));
          const data = getAsesorMockById(id);
          if (!data) {
            setError('Asesor no encontrado.');
          } else {
            setAsesor(data);
          }
        } else {
          const [datos, materias, horarios] = await Promise.all([
            asesoresApi.buscarPorId(id),
            asesoresApi.materiasDeAsesor(id),
            asesoresApi.horariosDeAsesor(id),
          ]);
          setAsesor({ ...datos, materias, horarios });
        }
      } catch (err) {
        setError(err.mensaje || 'No se pudo cargar el perfil del asesor.');
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, [id]);

  // ============ CARGA DE SLOTS DISPONIBLES ============
  const cargarSlots = useCallback(async () => {
    if (!asesor) return;
    setCargandoSlots(true);
    try {
      if (USE_MOCKS) {
        // Generar slots mock de las próximas 2 semanas
        await new Promise((r) => setTimeout(r, 200));
        const hoy = new Date();
        const generados = [];

        for (let d = 1; d <= 14; d++) {
          const fecha = new Date(hoy);
          fecha.setDate(hoy.getDate() + d);
          const diaSemana = fecha.getDay() === 0 ? 7 : fecha.getDay(); // 1=lunes...7=domingo

          // Buscar si el asesor tiene un horario para ese día
          (asesor.horarios || []).forEach((h) => {
            // diaSemana en el backend: 1=lunes...7=domingo
            const diaSemanaBackend = h.diaSemana;
            if (diaSemanaBackend === diaSemana) {
              const y = fecha.getFullYear();
              const m = String(fecha.getMonth() + 1).padStart(2, '0');
              const dd = String(fecha.getDate()).padStart(2, '0');
              generados.push({
                idHorario: h.idHorario,
                idAsesor: h.idAsesor,
                nombreAsesor: h.nombreAsesor,
                fecha: `${y}-${m}-${dd}`,
                diaSemana: h.diaSemana,
                horaInicio: h.horaInicio,
                horaFin: h.horaFin,
                modalidad: h.modalidad,
                lugar: h.lugar,
              });
            }
          });
        }
        setSlots(generados);
      } else {
        const hoy = new Date();
        const desde = hoy.toISOString().split('T')[0];
        const hasta = new Date(hoy.getTime() + 14 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0];
        const data = await asesoresApi.horariosDisponibles(id, desde, hasta);
        setSlots(data);
      }
    } catch (err) {
      console.error('Error cargando slots:', err);
    } finally {
      setCargandoSlots(false);
    }
  }, [asesor, id]);

  useEffect(() => {
    if (asesor) cargarSlots();
  }, [asesor, cargarSlots]);

  // ============ AVATAR ============
  const coloresAvatar = [
    '#0D47A1', '#1976D2', '#0097A7', '#388E3C',
    '#7B1FA2', '#C2185B', '#D32F2F', '#F57C00',
  ];
  const colorAvatar = useMemo(
    () => coloresAvatar[(asesor?.idAsesor || 0) % coloresAvatar.length],
    [asesor]
  );

  // ============ PERMISOS ============
  const puedeSolicitar = estaLogueado && (esAlumno || usuario?.rol === 'ASESOR');
  const esMismoAsesor = usuario?.idAsesor === asesor?.idAsesor;

  // ============ MANEJADORES ============
  const handleSeleccionarSlot = (slot) => {
    if (!estaLogueado) {
      navigate('/login');
      return;
    }
    if (esMismoAsesor) return;
    setModal({ show: true, slot });
  };

  const handleSolicitudExitosa = () => {
    setModal({ show: false, slot: null });
    setExito(
      '✅ Tu solicitud fue enviada. El asesor la revisará y te notificará pronto.'
    );
    cargarSlots();
    setTimeout(() => setExito(''), 8000);
  };

  // ============ RENDER ============
  if (cargando) {
    return (
      <Container className="py-5">
        <LoadingSpinner mensaje="Cargando perfil del asesor..." />
      </Container>
    );
  }

  if (error || !asesor) {
    return (
      <Container className="py-5">
        <Alert variant="danger" className="text-center">
          <h5 className="fw-bold">Asesor no encontrado</h5>
          <p className="mb-3">{error || 'El asesor solicitado no existe.'}</p>
          <Button as={Link} to="/asesores" className="btn-azul">
            ← Volver al catálogo
          </Button>
        </Alert>
      </Container>
    );
  }

  const inicial = asesor.nombreAlumno?.charAt(0).toUpperCase() || '?';

  return (
    <>
      {/* ============ HEADER ============ */}
      <section className="py-4" style={{ backgroundColor: 'var(--azul-primario)' }}>
        <Container>
          <Button
            as={Link}
            to="/asesores"
            variant="link"
            className="text-white text-decoration-none mb-3 p-0"
            style={{ opacity: 0.9 }}
          >
            ← Volver al catálogo
          </Button>

          <Row className="align-items-center">
            <Col md="auto" className="text-center text-md-start mb-3 mb-md-0">
              <div
                className="d-inline-flex align-items-center justify-content-center rounded-circle text-white fw-bold"
                style={{
                  width: '110px',
                  height: '110px',
                  backgroundColor: colorAvatar,
                  fontSize: '3rem',
                  border: '4px solid var(--amarillo-primario)',
                }}
              >
                {inicial}
              </div>
            </Col>
            <Col className="text-white">
              <h1 className="fw-bold mb-1">{asesor.nombreAlumno}</h1>
              <p className="mb-2" style={{ opacity: 0.9 }}>
                <span className="me-3">🎓 Matrícula: {asesor.matricula}</span>
                <span>📚 {asesor.semestre}° Semestre</span>
              </p>
              <p className="mb-2 small" style={{ opacity: 0.85 }}>
                {asesor.carrera}
              </p>
              <div className="d-flex flex-wrap gap-2">
                <Badge className="btn-amarillo text-dark fw-normal">
                  ⭐ Promedio {asesor.promedio}
                </Badge>
                {asesor.validado && (
                  <Badge bg="success" className="fw-normal">
                    ✓ Asesor validado
                  </Badge>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ============ CONTENIDO ============ */}
      <Container className="py-4">
        {exito && (
          <Alert variant="success" dismissible onClose={() => setExito('')}>
            {exito}
          </Alert>
        )}

        <Row className="g-4">
          {/* COLUMNA IZQUIERDA */}
          <Col lg={7}>
            {asesor.descripcion && (
              <Card className="border-0 shadow-sm mb-4">
                <Card.Body>
                  <h5 className="fw-bold text-azul mb-3">Sobre mí</h5>
                  <p className="text-suave mb-0">{asesor.descripcion}</p>
                </Card.Body>
              </Card>
            )}

            <Card className="border-0 shadow-sm mb-4">
              <Card.Body>
                <h5 className="fw-bold text-azul mb-3">
                  Materias que imparte ({asesor.materias?.length || 0})
                </h5>
                {asesor.materias && asesor.materias.length > 0 ? (
                  asesor.materias.map((m) => (
                    <MateriaItem key={m.idMateria} materia={m} />
                  ))
                ) : (
                  <p className="text-suave mb-0">
                    Este asesor aún no tiene materias asignadas.
                  </p>
                )}
              </Card.Body>
            </Card>

            {/* Horarios recurrentes */}
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <h5 className="fw-bold text-azul mb-3">Horarios habituales</h5>
                {asesor.horarios && asesor.horarios.length > 0 ? (
                  <Row className="g-2">
                    {asesor.horarios.map((h) => (
                      <Col key={h.idHorario} md={6}>
                        <HorarioCard horario={h} />
                      </Col>
                    ))}
                  </Row>
                ) : (
                  <p className="text-suave mb-0 small">
                    Este asesor aún no ha publicado horarios.
                  </p>
                )}
              </Card.Body>
            </Card>
          </Col>

          {/* COLUMNA DERECHA - DISPONIBILIDAD */}
          <Col lg={5}>
            <Card className="border-0 shadow-sm mb-4">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold text-azul mb-0">
                    Próximas 2 semanas
                  </h5>
                  <Button
                    size="sm"
                    variant="link"
                    className="text-azul p-0 text-decoration-none"
                    onClick={cargarSlots}
                    disabled={cargandoSlots}
                  >
                    🔄
                  </Button>
                </div>

                {!estaLogueado && (
                  <Alert variant="info" className="small py-2 mb-3">
                    <Link to="/login" className="fw-semibold text-decoration-none">
                      Inicia sesión
                    </Link>{' '}
                    para solicitar una asesoría.
                  </Alert>
                )}

                {estaLogueado && esMismoAsesor && (
                  <Alert variant="warning" className="small py-2 mb-3">
                    No puedes solicitar asesoría a ti mismo.
                  </Alert>
                )}

                {cargandoSlots ? (
                  <LoadingSpinner mensaje="Buscando disponibilidad..." tamaño="sm" />
                ) : slots.length === 0 ? (
                  <Alert variant="secondary" className="text-center small mb-0">
                    <div style={{ fontSize: '2rem' }}>📭</div>
                    No hay horarios disponibles en las próximas 2 semanas.
                  </Alert>
                ) : (
                  <>
                    <p className="text-suave small mb-2">
                      {slots.length} {slots.length === 1 ? 'horario disponible' : 'horarios disponibles'}
                    </p>
                    <div
                      className="d-flex flex-column gap-2"
                      style={{ maxHeight: '500px', overflowY: 'auto' }}
                    >
                      {slots.map((slot, idx) => (
                        <SlotDisponible
                          key={`${slot.idHorario}-${slot.fecha}-${idx}`}
                          slot={slot}
                          onSeleccionar={handleSeleccionarSlot}
                          deshabilitado={!puedeSolicitar || esMismoAsesor}
                        />
                      ))}
                    </div>
                  </>
                )}
              </Card.Body>
            </Card>

            {/* Card de acción */}
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center">
                <h6 className="fw-bold text-azul mb-3">
                  ¿Cómo funciona?
                </h6>
                <ol className="text-start small text-suave ps-3 mb-0">
                  <li className="mb-2">Elige un horario disponible.</li>
                  <li className="mb-2">Selecciona la materia que necesitas.</li>
                  <li className="mb-2">Envía tu solicitud.</li>
                  <li>El asesor la aceptará o rechazará.</li>
                </ol>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {USE_MOCKS && (
          <div className="text-center mt-5">
            <Badge bg="warning" text="dark" className="px-3 py-2">
              ⚠️ Mostrando datos de prueba — pendiente conectar al backend real
            </Badge>
          </div>
        )}
      </Container>

      {/* ============ MODAL DE SOLICITUD ============ */}
      <ModalSolicitar
        show={modal.show}
        onHide={() => setModal({ show: false, slot: null })}
        slot={modal.slot}
        asesor={asesor}
        onSuccess={handleSolicitudExitosa}
      />
    </>
  );
}

export default PerfilAsesor;