import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Nav, Button } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';

function PanelAsesorLayout() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const items = [
    { to: '/panel-asesor', label: 'Dashboard', icon: 'bi-speedometer2', end: true },
    { to: '/mis-horarios', label: 'Mis horarios', icon: 'bi-calendar-event-fill' },
    { to: '/solicitudes-recibidas', label: 'Solicitudes recibidas', icon: 'bi-envelope-paper-fill' },
    { to: '/mi-agenda', label: 'Mi agenda', icon: 'bi-calendar-week-fill' },
  ];

  return (
    <Container fluid className="py-4">
      <Row className="g-4">
        {/* ============ SIDEBAR ============ */}
        <Col lg={3} xl={2}>
          <div
            className="rounded shadow-sm p-3 sticky-top"
            style={{
              backgroundColor: 'var(--blanco)',
              top: '80px',
              border: '1px solid var(--borde)',
            }}
          >
            <div className="text-center mb-3 pb-3 border-bottom">
              <div
                className="d-inline-flex align-items-center justify-content-center rounded-circle mb-2"
                style={{
                  width: '50px',
                  height: '50px',
                  backgroundColor: 'var(--amarillo-primario)',
                  color: 'var(--texto)',
                  fontSize: '1.3rem',
                  fontWeight: 'bold',
                }}
              >
                {usuario?.nombre?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="fw-bold small">
                {usuario?.nombreCompleto || usuario?.nombre}
              </div>
              <div className="text-suave small">Asesor Par</div>
            </div>

            <Nav className="flex-column">
              {items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `nav-link d-flex align-items-center gap-2 rounded mb-1 ${
                      isActive ? 'text-white fw-semibold' : 'text-dark'
                    }`
                  }
                  style={({ isActive }) => ({
                    backgroundColor: isActive ? 'var(--azul-primario)' : 'transparent',
                    fontSize: '0.9rem',
                    padding: '0.6rem 0.8rem',
                  })}
                >
                  <i className={`bi ${item.icon}`}></i>
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </Nav>

            <hr />
            <Button
              as={Link}
              to="/"
              variant="outline-secondary"
              size="sm"
              className="w-100 mb-2"
            >
              <i className="bi bi-arrow-left me-1"></i> Volver al sitio
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline-danger"
              size="sm"
              className="w-100"
            >
              <i className="bi bi-box-arrow-right me-1"></i> Cerrar sesión
            </Button>
          </div>
        </Col>

        {/* ============ CONTENIDO ============ */}
        <Col lg={9} xl={10}>
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
}

export default PanelAsesorLayout;