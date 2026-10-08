import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import LogoInstitucional from '../ui/LogoInstitucional';

function Footer() {
  return (
    <footer className="text-white mt-5 pt-5 pb-3" style={{ backgroundColor: 'var(--azul-primario)' }}>
      <Container>
        <Row className="g-4 mb-4">
          {/* Logo y descripción */}
          <Col lg={4} md={6}>
            <div className="d-flex align-items-center gap-2 mb-3">
              <LogoInstitucional tipo="principal" altura={50} />
            </div>
            <p className="small" style={{ opacity: 0.85 }}>
              Programa de Asesores Pares del Instituto Tecnológico Superior Campus
              Uruapan. Apoyo académico entre estudiantes, gratuito y de calidad.
            </p>
          </Col>

          {/* Enlaces rápidos */}
          <Col lg={2} md={6} sm={6}>
            <h6 className="fw-bold text-warning mb-3">Enlaces</h6>
            <ul className="list-unstyled small">
              <li className="mb-2">
                <Link to="/" className="text-white text-decoration-none" style={{ opacity: 0.85 }}>
                  Inicio
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/asesores" className="text-white text-decoration-none" style={{ opacity: 0.85 }}>
                  Asesores
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/programa" className="text-white text-decoration-none" style={{ opacity: 0.85 }}>
                  El Programa
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/postular-asesor" className="text-white text-decoration-none" style={{ opacity: 0.85 }}>
                  Ser asesor
                </Link>
              </li>
            </ul>
          </Col>

          {/* Contacto */}
          <Col lg={3} md={6} sm={6}>
            <h6 className="fw-bold text-warning mb-3">Contacto</h6>
            <ul className="list-unstyled small" style={{ opacity: 0.85 }}>
              <li className="mb-2">📧 asesorias.par@uruapan.tecnm.mx</li>
              <li className="mb-2">📞 (452) 123 4567</li>
              <li className="mb-2">📍 Uruapan, Michoacán</li>
            </ul>
          </Col>

          {/* Horario */}
          <Col lg={3} md={6}>
            <h6 className="fw-bold text-warning mb-3">Horario de atención</h6>
            <ul className="list-unstyled small" style={{ opacity: 0.85 }}>
              <li className="mb-2">Lunes a viernes</li>
              <li className="mb-2">8:00 - 20:00 hrs</li>
              <li className="mb-2">Sábados: 9:00 - 14:00</li>
            </ul>
          </Col>
        </Row>

        <hr className="border-light opacity-25" />

        <Row className="align-items-center">
          <Col md={6} className="text-center text-md-start mb-2 mb-md-0">
            <p className="small mb-0" style={{ opacity: 0.75 }}>
              © {new Date().getFullYear()} ITS Uruapan — Todos los derechos reservados.
            </p>
          </Col>
          <Col md={6} className="text-center text-md-end">
            <p className="small mb-0" style={{ opacity: 0.75 }}>
              Desarrollado por estudiantes de 9° semestre — Ingeniería en Sistemas
              Computacionales
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;