import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Navbar as BSNavbar, Nav, Container, Button, Dropdown } from 'react-bootstrap';
import LogoInstitucional from '../ui/LogoInstitucional';
import { useAuth } from '../../context/AuthContext';

function Navbar() {
  const { usuario, estaLogueado, esAdmin, esAsesor, esAlumno, tienePerfilAsesor, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const etiquetaRol = esAdmin
    ? 'Administrador'
    : esAsesor
    ? 'Asesor Par'
    : 'Alumno';

  return (
    <BSNavbar expand="lg" className="shadow-sm py-2" style={{ backgroundColor: 'var(--azul-primario)' }} variant="dark">
      <Container>
        <BSNavbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2">
          <LogoInstitucional tipo="principal" altura={42} />
          <span className="fw-bold text-white d-none d-md-inline">Asesorías Par</span>
        </BSNavbar.Brand>

        <BSNavbar.Toggle aria-controls="navbar-nav" />

        <BSNavbar.Collapse id="navbar-nav">
          <Nav className="ms-auto align-items-lg-center gap-lg-2">
            <Nav.Link as={NavLink} to="/" end className="text-white">
              Inicio
            </Nav.Link>
            <Nav.Link as={NavLink} to="/asesores" className="text-white">
              Asesores
            </Nav.Link>
            <Nav.Link as={NavLink} to="/programa" className="text-white">
              El Programa
            </Nav.Link>

            {estaLogueado && esAdmin && (
              <Nav.Link as={NavLink} to="/admin" className="text-white">
                Panel admin
              </Nav.Link>
            )}

            {estaLogueado && esAsesor && (
              <>
                <Nav.Link as={NavLink} to="/panel-asesor" className="text-white">
                  Mi panel
                </Nav.Link>
                <Nav.Link as={NavLink} to="/mis-horarios" className="text-white">
                  Mis horarios
                </Nav.Link>
              </>
            )}

            {estaLogueado && (esAlumno || esAsesor) && (
              <Nav.Link as={NavLink} to="/mis-solicitudes" className="text-white">
                Mis solicitudes
              </Nav.Link>
            )}

            {estaLogueado && esAlumno && !tienePerfilAsesor && (
              <Nav.Link as={NavLink} to="/postular-asesor" className="text-white">
                Quiero ser asesor
              </Nav.Link>
            )}

            {estaLogueado ? (
              <Dropdown align="end">
                <Dropdown.Toggle
                  as={Button}
                  variant="outline-light"
                  size="sm"
                  className="d-flex align-items-center gap-2"
                >
                  <span
                    className="d-inline-flex align-items-center justify-content-center rounded-circle"
                    style={{
                      width: '24px',
                      height: '24px',
                      backgroundColor: 'var(--amarillo-primario)',
                      color: 'var(--texto)',
                      fontWeight: 'bold',
                      fontSize: '0.75rem',
                    }}
                  >
                    {usuario?.nombre?.charAt(0).toUpperCase() || 'U'}
                  </span>
                  <span className="d-none d-md-inline">
                    {usuario?.nombreCompleto || usuario?.nombre}
                  </span>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Header className="small">
                    {usuario?.correo}
                  </Dropdown.Header>
                  <Dropdown.Item disabled className="small text-suave">
                    <i className="bi bi-person-badge me-2"></i>
                    {etiquetaRol}
                    {usuario?.idAsesor && !usuario?.asesorValidado && (
                      <span className="ms-2 badge bg-warning text-dark">Pendiente</span>
                    )}
                  </Dropdown.Item>
                  <Dropdown.Divider />

                  {esAlumno && !tienePerfilAsesor && (
                    <Dropdown.Item as={Link} to="/postular-asesor">
                      <i className="bi bi-mortarboard me-2"></i> Quiero ser asesor
                    </Dropdown.Item>
                  )}

                  {tienePerfilAsesor && !usuario?.asesorValidado && (
                    <Dropdown.Item disabled className="text-warning">
                      <i className="bi bi-hourglass-split me-2"></i> Postulación en revisión
                    </Dropdown.Item>
                  )}

                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout} className="text-danger">
                    <i className="bi bi-box-arrow-right me-2"></i> Cerrar sesión
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <>
                <Nav.Link as={NavLink} to="/login" className="text-white">
                  Iniciar sesión
                </Nav.Link>
                <Button as={Link} to="/registro" className="btn-amarillo ms-lg-2" size="sm">
                  Registrarme
                </Button>
              </>
            )}
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
}

export default Navbar;