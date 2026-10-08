import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, Spinner } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { asesoresApi } from '../api/asesoresApi';
import { USE_MOCKS, asesoresMock } from '../mocks/asesoresMock';

function Home() {
  const [asesoresDestacados, setAsesoresDestacados] = useState([]);
  const [cargandoAsesores, setCargandoAsesores] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        if (USE_MOCKS) {
          setAsesoresDestacados(asesoresMock.slice(0, 3));
        } else {
          const data = await asesoresApi.listarTodos();
          setAsesoresDestacados(data.filter((a) => a.activo && a.validado).slice(0, 3));
        }
      } catch {
        // silencioso
      } finally {
        setCargandoAsesores(false);
      }
    };
    cargar();
  }, []);

  return (
    <>
      {/* ============ HERO ============ */}
      <section className="py-5" style={{ backgroundColor: 'var(--azul-suave)' }}>
        <Container>
          <Row className="align-items-center g-4">
            <Col lg={7}>
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
                  🔍 Buscar asesor
                </Button>
                <Button as={Link} to="/registro" size="lg" className="btn-amarillo">
                  Quiero ser asesor
                </Button>
              </div>
            </Col>
            <Col lg={5}>
              <div
                className="d-flex align-items-center justify-content-center rounded-circle mx-auto p-4"
                style={{
                  width: '280px',
                  height: '280px',
                  backgroundColor: 'var(--blanco)',
                  border: '8px solid var(--azul-primario)',
                  boxShadow: '0 10px 30px rgba(13, 71, 161, 0.2)',
                }}
              >
                <img
                  src="/assets/logos/logo-tecnm.png"
                  alt="TecNM"
                  style={{
                    maxWidth: '90%',
                    maxHeight: '90%',
                    objectFit: 'contain',
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ============ ESTADÍSTICAS ============ */}
      <section className="py-4" style={{ backgroundColor: 'var(--azul-primario)' }}>
        <Container>
          <Row className="text-white text-center g-3">
            <Col md={4}>
              <div className="display-5 fw-bold text-warning">+50</div>
              <div className="small" style={{ opacity: 0.9 }}>
                Asesorías impartidas
              </div>
            </Col>
            <Col md={4}>
              <div className="display-5 fw-bold text-warning">+30</div>
              <div className="small" style={{ opacity: 0.9 }}>
                Alumnos beneficiados
              </div>
            </Col>
            <Col md={4}>
              <div className="display-5 fw-bold text-warning">100%</div>
              <div className="small" style={{ opacity: 0.9 }}>
                Gratuito
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
            <p className="text-suave">Beneficios del Programa de Asesores Par</p>
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

      {/* ============ ASESORES DESTACADOS ============ */}
      <section className="py-5" style={{ backgroundColor: 'var(--blanco)' }}>
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold text-azul">Asesores destacados</h2>
            <p className="text-suave">Conoce a algunos de nuestros asesores pares</p>
          </div>

          {cargandoAsesores ? (
            <div className="text-center py-4">
              <Spinner animation="border" style={{ color: 'var(--azul-primario)' }} />
            </div>
          ) : asesoresDestacados.length === 0 ? (
            <div className="text-center text-suave">
              Aún no hay asesores registrados.
            </div>
          ) : (
            <Row className="g-4">
              {asesoresDestacados.map((a) => (
                <Col md={6} lg={4} key={a.idAsesor}>
                  <Card className="h-100 border-0 shadow-sm text-center p-3">
                    <div
                      className="d-inline-flex align-items-center justify-content-center rounded-circle text-white fw-bold mx-auto mb-3"
                      style={{
                        width: '70px',
                        height: '70px',
                        backgroundColor: 'var(--azul-primario)',
                        fontSize: '1.8rem',
                      }}
                    >
                      {a.nombreAlumno?.charAt(0) || '?'}
                    </div>
                    <Card.Body className="pt-0">
                      <h6 className="fw-bold text-azul mb-1">{a.nombreAlumno}</h6>
                      <Badge className="btn-amarillo text-dark mb-2">
                        ⭐ {a.promedio}
                      </Badge>
                      {a.materias && a.materias.length > 0 && (
                        <p className="text-suave small mb-2">
                          {a.materias.slice(0, 2).map((m) => m.nombre).join(', ')}
                          {a.materias.length > 2 && ` +${a.materias.length - 2}`}
                        </p>
                      )}
                      <Button
                        as={Link}
                        to={`/asesores/${a.idAsesor}`}
                        size="sm"
                        className="btn-azul"
                      >
                        Ver perfil
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}

          <div className="text-center mt-4">
            <Button as={Link} to="/asesores" variant="outline-primary">
              Ver todos los asesores →
            </Button>
          </div>
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
            <Button as={Link} to="/programa" size="lg" variant="outline-light">
              Conocer más
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}

export default Home;