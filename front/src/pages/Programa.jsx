import { Link } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Accordion,
  Badge,
} from 'react-bootstrap';
import { programaInfo } from '../mocks/programaMock';

function Programa() {
  const info = programaInfo;

  return (
    <>
      {/* ============ HERO ============ */}
      <section className="py-5" style={{ backgroundColor: 'var(--azul-suave)' }}>
        <Container>
          <Row className="align-items-center g-4">
            <Col lg={7}>
              <Badge className="btn-amarillo text-dark mb-3 px-3 py-2">
                Programa Institucional
              </Badge>
              <h1 className="display-5 fw-bold text-azul mb-3">{info.titulo}</h1>
              <p className="lead text-suave mb-4">{info.subtitulo}</p>
              <p className="text-suave mb-4">{info.descripcion}</p>
              <div className="d-flex flex-wrap gap-2">
                <Button as={Link} to="/registro" size="lg" className="btn-amarillo">
                  Registrarme
                </Button>
                <Button as={Link} to="/asesores" size="lg" variant="outline-primary">
                  Ver asesores
                </Button>
              </div>
            </Col>
            <Col lg={5}>
              <img
                src={info.heroImagen}
                alt="Estudiantes colaborando"
                className="img-fluid rounded shadow"
                style={{ maxHeight: '400px', width: '100%', objectFit: 'cover' }}
              />
            </Col>
          </Row>
        </Container>
      </section>

      {/* ============ OBJETIVO ============ */}
      <section className="py-5">
        <Container>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4 p-md-5 text-center">
              <h2 className="fw-bold text-azul mb-3">Nuestro objetivo</h2>
              <p className="lead text-suave mb-0" style={{ maxWidth: '800px', margin: '0 auto' }}>
                {info.objetivoGeneral}
              </p>
            </Card.Body>
          </Card>
        </Container>
      </section>

      {/* ============ BENEFICIOS ============ */}
      <section className="py-5" style={{ backgroundColor: 'var(--blanco)' }}>
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold text-azul">¿Por qué participar?</h2>
            <p className="text-suave mb-0">Beneficios del Programa de Asesores Pares</p>
          </div>
          <Row className="g-4">
            {info.beneficios.map((b, i) => (
              <Col md={6} lg={3} key={i}>
                <Card className="h-100 card-hover border-0 shadow-sm overflow-hidden">
                  <div
                    style={{
                      height: '160px',
                      backgroundImage: `url(${b.imagen})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                  <Card.Body>
                    <Card.Title className="fw-bold text-azul h6 mb-2">
                      {b.titulo}
                    </Card.Title>
                    <Card.Text className="text-suave small mb-0">
                      {b.descripcion}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ============ CÓMO FUNCIONA ============ */}
      <section className="py-5">
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold text-azul">¿Cómo funciona?</h2>
            <p className="text-suave mb-0">Solicita tu asesoría en 4 pasos</p>
          </div>
          <Row className="g-4">
            {info.pasos.map((p, i) => (
              <Col md={6} lg={3} key={i}>
                <Card className="h-100 border-0 shadow-sm overflow-hidden">
                  <div className="position-relative">
                    <div
                      style={{
                        height: '140px',
                        backgroundImage: `url(${p.imagen})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    />
                    <Badge
                      className="btn-amarillo text-dark position-absolute fw-bold"
                      style={{
                        top: '10px',
                        left: '10px',
                        fontSize: '0.85rem',
                        padding: '6px 12px',
                      }}
                    >
                      {p.num}
                    </Badge>
                  </div>
                  <Card.Body>
                    <Card.Title className="fw-bold text-azul h6 mb-2">
                      {p.titulo}
                    </Card.Title>
                    <Card.Text className="text-suave small mb-0">
                      {p.descripcion}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ============ REQUISITOS ============ */}
      <section className="py-5" style={{ backgroundColor: 'var(--azul-suave)' }}>
        <Container>
          <Row className="g-4">
            <Col lg={6}>
              <Card className="border-0 shadow-sm h-100">
                <Card.Body className="p-4">
                  <h3 className="fw-bold text-azul mb-3">
                    Requisitos para ser asesor par
                  </h3>
                  <ol className="text-suave mb-0 ps-3">
                    {info.requisitos.map((r, i) => (
                      <li key={i} className="mb-2">
                        {r}
                      </li>
                    ))}
                  </ol>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={6}>
              <Card className="border-0 shadow-sm h-100">
                <Card.Body className="p-4">
                  <h3 className="fw-bold text-azul mb-3">Responsabilidades</h3>
                  <ul className="text-suave mb-0 ps-3">
                    {info.responsabilidades.map((r, i) => (
                      <li key={i} className="mb-2">
                        {r}
                      </li>
                    ))}
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <div className="text-center mt-4">
            <Button as={Link} to="/postular-asesor" size="lg" className="btn-amarillo">
              Quiero postularme como asesor →
            </Button>
          </div>
        </Container>
      </section>

      {/* ============ FAQ ============ */}
      <section className="py-5" style={{ backgroundColor: 'var(--blanco)' }}>
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold text-azul">Preguntas frecuentes</h2>
            <p className="text-suave mb-0">Resolvemos tus dudas más comunes</p>
          </div>
          <Row className="justify-content-center">
            <Col lg={9}>
              <Accordion>
                {info.faq.map((f, i) => (
                  <Accordion.Item eventKey={String(i)} key={i}>
                    <Accordion.Header>
                      <strong className="text-azul">{f.pregunta}</strong>
                    </Accordion.Header>
                    <Accordion.Body className="text-suave">
                      {f.respuesta}
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ============ CTA FINAL ============ */}
      <section className="py-5" style={{ backgroundColor: 'var(--azul-primario)' }}>
        <Container className="text-center text-white">
          <h2 className="fw-bold mb-3">¿Listo para comenzar?</h2>
          <p className="lead mb-4" style={{ opacity: 0.9 }}>
            Únete a la comunidad de apoyo académico del ITS Uruapan.
          </p>
          <div className="d-flex justify-content-center gap-2 flex-wrap">
            <Button as={Link} to="/registro" size="lg" className="btn-amarillo">
              Crear mi cuenta
            </Button>
            <Button as={Link} to="/asesores" size="lg" variant="outline-light">
              Explorar asesores
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}

export default Programa;