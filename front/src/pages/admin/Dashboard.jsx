import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card } from 'react-bootstrap';
import { asesoresApi } from '../../api/asesoresApi';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

function Dashboard() {
  const [asesores, setAsesores] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await asesoresApi.listarTodos();
        setAsesores(data);
      } catch {
        // silencioso
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  const pendientes = asesores.filter((a) => !a.validado && a.activo).length;
  const validados = asesores.filter((a) => a.validado && a.activo).length;
  const inactivos = asesores.filter((a) => !a.activo).length;

  return (
    <>
      <div className="mb-4">
        <h2 className="fw-bold text-azul mb-1">Panel de administración</h2>
        <p className="text-suave mb-0">
          Gestiona el programa de asesores pares del ITS Uruapan.
        </p>
      </div>

      {cargando ? (
        <LoadingSpinner mensaje="Cargando estadísticas..." />
      ) : (
        <Row className="g-3 mb-4">
          <Col sm={6} lg={3}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div className="text-suave small fw-semibold">PENDIENTES</div>
                  <span style={{ fontSize: '1.5rem' }}>⏳</span>
                </div>
                <div className="display-5 fw-bold text-warning">{pendientes}</div>
                <div className="text-suave small">Esperando validación</div>
              </Card.Body>
            </Card>
          </Col>

          <Col sm={6} lg={3}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div className="text-suave small fw-semibold">VALIDADOS</div>
                  <span style={{ fontSize: '1.5rem' }}>✅</span>
                </div>
                <div className="display-5 fw-bold text-success">{validados}</div>
                <div className="text-suave small">Asesores activos</div>
              </Card.Body>
            </Card>
          </Col>

          <Col sm={6} lg={3}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div className="text-suave small fw-semibold">INACTIVOS</div>
                  <span style={{ fontSize: '1.5rem' }}>🚫</span>
                </div>
                <div className="display-5 fw-bold text-danger">{inactivos}</div>
                <div className="text-suave small">Dados de baja</div>
              </Card.Body>
            </Card>
          </Col>

          <Col sm={6} lg={3}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div className="text-suave small fw-semibold">TOTAL</div>
                  <span style={{ fontSize: '1.5rem' }}>👥</span>
                </div>
                <div className="display-5 fw-bold text-azul">{asesores.length}</div>
                <div className="text-suave small">Registrados</div>
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
              {pendientes > 0 ? (
                <Link
                  to="/admin/asesores"
                  className="alert alert-warning d-flex align-items-center gap-3 text-decoration-none mb-0"
                >
                  <span style={{ fontSize: '1.5rem' }}>⚠️</span>
                  <div>
                    <div className="fw-bold">
                      Tienes {pendientes}{' '}
                      {pendientes === 1 ? 'asesor pendiente' : 'asesores pendientes'}
                    </div>
                    <div className="small">Clic para revisar y validar</div>
                  </div>
                </Link>
              ) : (
                <div className="alert alert-success mb-0">
                  ✅ No hay asesores pendientes de validación
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <h5 className="fw-bold text-azul mb-3">Enlaces útiles</h5>
              <div className="d-flex flex-column gap-2">
                <Link to="/admin/materias" className="text-decoration-none">
                  📚 Gestionar materias y carreras
                </Link>
                <Link to="/admin/asesores" className="text-decoration-none">
                  🎓 Ver todos los asesores
                </Link>
                <Link to="/admin/reportes" className="text-decoration-none">
                  📈 Generar reportes
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default Dashboard;