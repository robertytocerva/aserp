import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import LogoInstitucional from '../ui/LogoInstitucional';

function Footer() {
  return (
    <footer className="bg-azul-primario mt-5 pt-5 pb-3">
      <Container>
        <Row className="g-4 mb-4">
          <Col lg={4} md={6}>
            <div className="d-flex align-items-center gap-2 mb-3">
              <LogoInstitucional tipo="principal" altura={50} />
            </div>
            <p className="small mb-0">
              Programa de Asesores Pares del Instituto Tecnológico Superior Campus
              Uruapan. Apoyo académico entre estudiantes, gratuito y de calidad.
            </p>
          </Col>

          <Col lg={2} md={6} sm={6}>
            <h6 className="fw-bold text-warning mb-3">Enlaces</h6>
            <ul className="list-unstyled small">
              <li className="mb-2">
                <Link to="/" className="text-white text-decoration-none">
                  Inicio
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/asesores" className="text-white text-decoration-none">
                  Asesores
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/programa" className="text-white text-decoration-none">
                  El Programa
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/postular-asesor" className="text-white text-decoration-none">
                  Ser asesor
                </Link>
              </li>
            </ul>
          </Col>

          <Col lg={3} md={6} sm={6}>
            <h6 className="fw-bold text-warning mb-3">Contacto</h6>
            <ul className="list-unstyled small">
              <li className="mb-2">
                <i className="bi bi-envelope-fill me-2"></i>
                asesorias.par@uruapan.tecnm.mx
              </li>
              <li className="mb-2">
                <i className="bi bi-telephone-fill me-2"></i>
                (452) 123 4567
              </li>
              <li className="mb-2">
                <i className="bi bi-geo-alt-fill me-2"></i>
                Uruapan, Michoacán
              </li>
            </ul>
          </Col>

          <Col lg={3} md={6}>
            <h6 className="fw-bold text-warning mb-3">Horario de atención</h6>
            <ul className="list-unstyled small">
              <li className="mb-2">Lunes a viernes</li>
              <li className="mb-2">8:00 - 20:00 hrs</li>
              <li className="mb-2">Sábados: 9:00 - 14:00</li>
            </ul>
          </Col>
        </Row>

        <hr className="border-light opacity-25" />

        <Row className="align-items-center">
          <Col md={6} className="text-center text-md-start mb-2 mb-md-0">
            <p className="small mb-0">
              © {new Date().getFullYear()} ITS Uruapan — Todos los derechos reservados.
            </p>
          </Col>
          <Col md={6} className="text-center text-md-end">
            <p className="small mb-0">
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