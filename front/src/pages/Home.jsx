import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';

function Home() {
  return (
    <>
      {/* ============ HERO ============ */}
      <section className="py-5" style={{ backgroundColor: 'var(--azul-suave)' }}>
        <Container>
          <Row className="align-items-center">
            <Col lg={7} className="mb-4 mb-lg-0">
              <Badge
                className="mb-3 px-3 py-2 fw-semibold"
                style={{
                    backgroundColor: 'var(--azul-primario)',
                    color: 'var(--blanco)',
                    fontSize: '0.85rem',
                    letterSpacing: '0.5px',
                }}
>
  Programa Institucional
</Badge>
              <h1 className="display-4 fw-bold text-azul mb-3">
                Asesorías Par <span className="text-amarillo">ITS Uruapan</span>
              </h1>
              <p className="lead text-suave mb-4">
                Conectamos a estudiantes que necesitan apoyo académico con compañeros
                de alto rendimiento. Solicita una asesoría de forma rápida, sencilla
                y sin trámites.
              </p>
              <div className="d-flex flex-wrap gap-2">
                <Button as={Link} to="/asesores" size="lg" className="btn-azul">
                  Buscar asesor
                </Button>
                <Button as={Link} to="/registro" size="lg" className="btn-amarillo">
                  Quiero ser asesor
                </Button>
              </div>
            </Col>
            <Col lg={5} className="text-center">
              <div
  className="d-inline-flex align-items-center justify-content-center rounded-circle p-4"
  style={{
    width: '280px',
    height: '280px',
    backgroundColor: 'var(--blanco)',
    border: '8px solid var(--azul-primario)',
  }}
>
  <img
    src="/assets/logos/logo-tecnm.png"
    alt="TecNM"
    style={{
      maxWidth: '115%',
      maxHeight: '115%',
      objectFit: 'contain',
    }}
    onError={(e) => {
      // Fallback si aún no existe el logo
      e.target.style.display = 'none';
      e.target.nextSibling.style.display = 'block';
    }}
  />
  <p
    className="fw-bold text-azul mb-0 text-center"
    style={{ display: 'none' }}
  >
    Aprende y comparte
  </p>
</div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ============ BENEFICIOS ============ */}
      <section className="py-5">
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold text-azul">¿Por qué participar?</h2>
            <p className="text-suave">Beneficios del Programa de Asesorías Par</p>
          </div>
          <Row className="g-4">
            {[
                {
                    img: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=250&fit=crop',
                    titulo: 'Refuerza tu aprendizaje',
                    texto: 'Recibe apoyo personalizado en las materias que más se te dificultan.',
                },
                {
                    img: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=250&fit=crop',
                    titulo: 'Comunidad colaborativa',
                    texto: 'Aprende junto a otros estudiantes en un entorno de apoyo mutuo.',
                },
                {
                    img: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=250&fit=crop',
                    titulo: 'Horarios flexibles',
                    texto: 'Consulta la disponibilidad de cada asesor y agenda cuando mejor te convenga.',
                },
                {
                    img: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=250&fit=crop',
                    titulo: 'Fortalece tu perfil',
                    texto: 'Si eres asesor, desarrolla habilidades docentes y suma experiencia.',
                },
                ].map((b, i) => (
                <Col md={6} lg={3} key={i}>
                    <Card className="h-100 card-hover border-0 shadow-sm overflow-hidden">
                    <div
                        style={{
                        height: '160px',
                        backgroundImage: `url(${b.img})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        }}
                    />
                    <Card.Body>
                        <Card.Title className="fw-bold text-azul h6 mb-2">{b.titulo}</Card.Title>
                        <Card.Text className="text-suave small mb-0">{b.texto}</Card.Text>
                    </Card.Body>
                    </Card>
                </Col>
                ))}
          </Row>
        </Container>
      </section>

      {/* ============ CÓMO FUNCIONA ============ */}
      <section className="py-5" style={{ backgroundColor: 'var(--blanco)' }}>
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold text-azul">¿Cómo funciona?</h2>
            <p className="text-suave">Solicita tu asesoría en 3 pasos</p>
          </div>
          <Row className="g-4">
            {[
              { num: '1', titulo: 'Regístrate', texto: 'Crea tu cuenta con tu matrícula institucional.' },
              { num: '2', titulo: 'Elige un asesor', texto: 'Busca por materia o consulta el catálogo completo.' },
              { num: '3', titulo: 'Agenda tu asesoría', texto: 'Selecciona un horario disponible y confirma.' },
            ].map((p, i) => (
              <Col md={4} key={i}>
                <div className="text-center">
                  <div
                    className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                    style={{
                      width: '70px',
                      height: '70px',
                      backgroundColor: 'var(--azul-primario)',
                      color: 'var(--blanco)',
                      fontSize: '1.8rem',
                      fontWeight: 'bold',
                    }}
                  >
                    {p.num}
                  </div>
                  <h5 className="fw-bold text-azul">{p.titulo}</h5>
                  <p className="text-suave">{p.texto}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ============ CTA FINAL ============ */}
      <section className="py-5" style={{ backgroundColor: 'var(--azul-primario)' }}>
        <Container className="text-center text-white">
          <h2 className="fw-bold mb-3">¿Listo para comenzar?</h2>
          <p className="lead mb-4" style={{ opacity: 0.9 }}>
            Únete al programa y forma parte de la comunidad de apoyo académico del ITS Uruapan.
          </p>
          <div className="d-flex justify-content-center gap-2 flex-wrap">
            <Button as={Link} to="/registro" size="lg" className="btn-amarillo">
              Registrarme ahora
            </Button>
            <Button
              as={Link}
              to="/programa"
              size="lg"
              variant="outline-light"
            >
              Conocer más
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}

export default Home;