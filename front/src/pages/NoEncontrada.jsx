import { Link } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';

function NoEncontrada() {
  return (
    <Container className="py-5 text-center" style={{ minHeight: '60vh' }}>
      <div
        className="mx-auto mb-4 d-flex align-items-center justify-content-center rounded-circle"
        style={{
          width: '160px',
          height: '160px',
          backgroundColor: 'var(--azul-suave)',
          fontSize: '5rem',
        }}
      >
        🔍
      </div>
      <h1 className="display-3 fw-bold text-azul mb-2">404</h1>
      <h3 className="fw-bold text-azul mb-3">Página no encontrada</h3>
      <p className="text-suave mb-4" style={{ maxWidth: '500px', margin: '0 auto' }}>
        Lo sentimos, la página que estás buscando no existe o fue movida. Verifica la
        dirección o regresa al inicio.
      </p>
      <div className="d-flex justify-content-center gap-2 flex-wrap">
        <Button as={Link} to="/" className="btn-azul" size="lg">
          🏠 Volver al inicio
        </Button>
        <Button as={Link} to="/asesores" variant="outline-primary" size="lg">
          Ver asesores
        </Button>
      </div>
    </Container>
  );
}

export default NoEncontrada;