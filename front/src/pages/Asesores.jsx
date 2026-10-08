import { useState, useEffect, useMemo } from 'react';
import { Container, Row, Col, Form, InputGroup, Alert, Badge } from 'react-bootstrap';
import { asesoresApi } from '../api/asesoresApi';
import { USE_MOCKS, asesoresMock, materiasMock } from '../mocks/asesoresMock';
import AsesorCard from '../components/asesores/AsesorCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';

function Asesores() {
  const [asesores, setAsesores] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  // Filtros
  const [busqueda, setBusqueda] = useState('');
  const [materiaSeleccionada, setMateriaSeleccionada] = useState('');

  // Cargar datos
  useEffect(() => {
    const cargar = async () => {
      setCargando(true);
      setError('');
      try {
        if (USE_MOCKS) {
          // Simular delay de red para ver el spinner
          await new Promise((r) => setTimeout(r, 400));
          setAsesores(asesoresMock);
        } else {
          const data = await asesoresApi.listarTodos();
          // Enriquecer con materias y datos extra (cuando el backend lo soporte)
          setAsesores(data.filter((a) => a.activo && a.validado));
        }
      } catch (err) {
        setError(err.mensaje || 'No se pudieron cargar los asesores.');
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  // Extraer materias únicas (para el filtro)
  const materiasDisponibles = useMemo(() => {
    if (USE_MOCKS) return materiasMock;

    const mapa = new Map();
    asesores.forEach((a) => {
      (a.materias || []).forEach((m) => {
        if (!mapa.has(m.idMateria)) {
          mapa.set(m.idMateria, { idMateria: m.idMateria, nombre: m.nombre });
        }
      });
    });
    return Array.from(mapa.values()).sort((a, b) => a.nombre.localeCompare(b.nombre));
  }, [asesores]);

  // Aplicar filtros
  const asesoresFiltrados = useMemo(() => {
    return asesores.filter((a) => {
      // Filtro por búsqueda de texto (nombre o matrícula)
      if (busqueda) {
        const q = busqueda.toLowerCase();
        const coincide =
          a.nombreAlumno?.toLowerCase().includes(q) ||
          a.matricula?.toLowerCase().includes(q);
        if (!coincide) return false;
      }

      // Filtro por materia
      if (materiaSeleccionada) {
        const tieneMateria = (a.materias || []).some(
          (m) => String(m.idMateria) === String(materiaSeleccionada)
        );
        if (!tieneMateria) return false;
      }

      return true;
    });
  }, [asesores, busqueda, materiaSeleccionada]);

  return (
    <>
      {/* ============ HEADER ============ */}
      <section className="py-5" style={{ backgroundColor: 'var(--azul-suave)' }}>
        <Container>
          <h1 className="fw-bold text-azul mb-2">Encuentra tu asesor par</h1>
          <p className="text-suave mb-0">
            Consulta el catálogo de asesores disponibles y solicita apoyo académico
            en la materia que necesites.
          </p>
        </Container>
      </section>

      {/* ============ FILTROS ============ */}
      <Container className="py-4">
        <Row className="g-3 mb-4">
          <Col md={7}>
            <InputGroup>
              <InputGroup.Text className="bg-white border-end-0">
                🔍
              </InputGroup.Text>
              <Form.Control
                placeholder="Buscar por nombre o matrícula..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="border-start-0"
              />
            </InputGroup>
          </Col>
          <Col md={5}>
            <Form.Select
              value={materiaSeleccionada}
              onChange={(e) => setMateriaSeleccionada(e.target.value)}
            >
              <option value="">Todas las materias</option>
              {materiasDisponibles.map((m) => (
                <option key={m.idMateria} value={m.idMateria}>
                  {m.nombre}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Row>

        {/* Contador */}
        {!cargando && !error && (
          <div className="d-flex justify-content-between align-items-center mb-3">
            <p className="text-suave small mb-0">
              {asesoresFiltrados.length}{' '}
              {asesoresFiltrados.length === 1 ? 'asesor encontrado' : 'asesores encontrados'}
            </p>
            {(busqueda || materiaSeleccionada) && (
              <button
                className="btn btn-sm btn-link text-decoration-none text-azul"
                onClick={() => {
                  setBusqueda('');
                  setMateriaSeleccionada('');
                }}
              >
                Limpiar filtros
              </button>
            )}
          </div>
        )}

        {/* ============ CONTENIDO ============ */}
        {cargando ? (
          <LoadingSpinner mensaje="Cargando asesores..." />
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : asesoresFiltrados.length === 0 ? (
          <Alert variant="info" className="text-center">
            <div style={{ fontSize: '3rem' }}>🔎</div>
            <h5 className="fw-bold text-azul">No se encontraron asesores</h5>
            <p className="text-suave mb-0">
              {asesores.length === 0
                ? 'Aún no hay asesores registrados. Vuelve pronto.'
                : 'Prueba con otros filtros o términos de búsqueda.'}
            </p>
          </Alert>
        ) : (
          <Row className="g-4">
            {asesoresFiltrados.map((a) => (
              <Col key={a.idAsesor} md={6} lg={4}>
                <AsesorCard asesor={a} />
              </Col>
            ))}
          </Row>
        )}

        {/* Aviso de mocks */}
        {USE_MOCKS && !cargando && (
          <div className="text-center mt-5">
            <Badge bg="warning" text="dark" className="px-3 py-2">
              ⚠️ Mostrando datos de prueba — pendiente conectar al backend real
            </Badge>
          </div>
        )}
      </Container>
    </>
  );
}

export default Asesores;