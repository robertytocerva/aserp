import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card } from 'react-bootstrap';
import { horariosApi } from '../../api/horariosApi';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

function Dashboard() {
  const { usuario } = useAuth();
  const [horarios, setHorarios] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await horariosApi.misHorarios();
        setHorarios(data);
      } catch {
        // silencioso
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  const activos = horarios.filter((h) => h.activo).length;

  return (
    <>
      <div className="mb-4">
        <h2 className="fw-bold text-azul mb-1">
          ¡Hola, {usuario?.nombre || 'asesor'}!
        </h2>
        <p className="text-suave mb-0">
          Bienvenido a tu panel de asesor par.
        </p>
      </div>

      {cargando ? (
        <LoadingSpinner mensaje="Cargando tu panel..." />
      ) : (
        <Row className="g-3 mb-4">
          <Col sm={6} lg={4}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div className="text-suave small fw-semibold">
                    HORARIOS ACTIVOS
                  </div>
                  <span style={{ fontSize: '1.5rem' }}>📅</span>
                </div>
                <div className="display-5 fw-bold text-azul">{activos}</div>
                <div className="text-suave small">Bloques publicados</div>
              </Card.Body>
            </Card>
          </Col>

          <Col sm={6} lg={4}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div className="text-suave small fw-semibold">
                    SOLICITUDES PENDIENTES
                  </div>
                  <span style={{ fontSize: '1.5rem' }}>📩</span>
                </div>
                <div className="display-5 fw-bold text-warning">—</div>
                <div className="text-suave small">Disponible próximamente</div>
              </Card.Body>
            </Card>
          </Col>

          <Col sm={6} lg={4}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div className="text-suave small fw-semibold">
                    ASESORÍAS PROGRAMADAS
                  </div>
                  <span style={{ fontSize: '1.5rem' }}>🗓️</span>
                </div>
                <div className="display-5 fw-bold text-success">—</div>
                <div className="text-suave small">Disponible próximamente</div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      <Row className="g-3">
        <Col md={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <h5 className="fw-bold text-azul mb-3">Acciones rápidas</h5>
              <div className="d-flex flex-column gap-2">
                <Link
                  to="/mis-horarios"
                  className="btn btn-azul text-start d-flex align-items-center gap-2"
                >
                  📅 Gestionar mis horarios
                </Link>
                <Link
                  to="/solicitudes-recibidas"
                  className="btn btn-outline-primary text-start d-flex align-items-center gap-2"
                >
                  📩 Ver solicitudes recibidas
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <h5 className="fw-bold text-azul mb-3">Consejos</h5>
              <ul className="small text-suave mb-0 ps-3">
                <li className="mb-2">
                  Publica horarios con al menos 24 horas de anticipación.
                </li>
                <li className="mb-2">
                  Responde las solicitudes a la brevedad posible.
                </li>
                <li className="mb-2">
                  Si no puedes asistir a una asesoría, cancélala con antelación.
                </li>
                <li>Mantén actualizados tus horarios cada semestre.</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default Dashboard;