import { Navigate } from 'react-router-dom';
import { Container, Alert, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

/**
 * Envuelve rutas que requieren autenticación y/o un rol específico.
 *
 * Uso:
 *   <RutaProtegida rolRequerido="ADMIN">
 *     <MiComponente />
 *   </RutaProtegida>
 */
function RutaProtegida({ children, rolRequerido = null }) {
  const { estaLogueado, esAdmin, esAsesor, esAlumno, cargando } = useAuth();

  if (cargando) {
    return (
      <Container className="py-5">
        <LoadingSpinner mensaje="Verificando sesión..." />
      </Container>
    );
  }

  // No logueado → redirigir a login
  if (!estaLogueado) {
    return <Navigate to="/login" replace />;
  }

  // Verificar rol
  if (rolRequerido) {
    const tieneRol =
      (rolRequerido === 'ADMIN' && esAdmin) ||
      (rolRequerido === 'ASESOR' && esAsesor) ||
      (rolRequerido === 'ALUMNO' && esAlumno);

    if (!tieneRol) {
      return (
        <Container className="py-5">
          <Alert variant="danger" className="text-center">
            <div style={{ fontSize: '3rem' }}>🚫</div>
            <h4 className="fw-bold">Acceso denegado</h4>
            <p className="text-suave mb-3">
              No tienes permisos para acceder a esta sección.
            </p>
            <Button as={Link} to="/" className="btn-azul">
              Volver al inicio
            </Button>
          </Alert>
        </Container>
      );
    }
  }

  return children;
}

export default RutaProtegida;