import { Container, Row, Col } from 'react-bootstrap';
import LogoInstitucional from '../ui/LogoInstitucional';

function Footer() {
  return (
    <footer className="text-white mt-5 pt-4 pb-3" style={{ backgroundColor: 'var(--azul-primario)' }}>
      <Container>
        <Row className="align-items-center mb-3">
          <Col md={4} className="mb-3 mb-md-0">
            <LogoInstitucional tipo="principal" altura={50} />
          </Col>
          <Col md={4} className="mb-3 mb-md-0">
            <h6 className="fw-bold text-warning mb-2">Programa de Asesorías Par</h6>
            <p className="small mb-0" style={{ opacity: 0.9 }}>
              Instituto Tecnológico Superior Campus Uruapan
            </p>
          </Col>
          <Col md={4}>
            <h6 className="fw-bold text-warning mb-2">Contacto</h6>
            <p className="small mb-0" style={{ opacity: 0.9 }}>
              asesorias.par@uruapan.tecnm.mx<br />
              Tel. (452) 123 4567
            </p>
          </Col>
        </Row>
        <hr className="border-light opacity-25" />
        <p className="text-center small mb-0" style={{ opacity: 0.75 }}>
          © {new Date().getFullYear()} ITS Uruapan — Todos los derechos reservados
        </p>
      </Container>
    </footer>
  );
}

export default Footer;