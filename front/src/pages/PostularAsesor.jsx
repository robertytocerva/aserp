import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Badge,
} from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { asesoresApi } from '../api/asesoresApi';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const RESPONSABILIDADES = [
  'Mantener un promedio mínimo de 8.5 durante mi participación.',
  'Publicar y respetar mis horarios de asesoría.',
  'Atender con respeto y profesionalismo a los alumnos que soliciten apoyo.',
  'Registrar bitácoras de las asesorías que imparta.',
  'Notificar con anticipación si no podré atender una asesoría.',
];

function PostularAsesor() {
  const navigate = useNavigate();
  const { usuario, estaLogueado, esAlumno, esAsesor, esAdmin, tienePerfilAsesor, refrescarUsuario } = useAuth();

  const [promedio, setPromedio] = useState('');
  const [motivacion, setMotivacion] = useState('');
  const [acepta, setAcepta] = useState(false);
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [exito, setExito] = useState(false);

  // ============ VALIDACIONES DE ESTADO ============

  if (!estaLogueado) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="border-0 shadow-sm text-center p-4">
              <div style={{ fontSize: '4rem', color: 'var(--azul-primario)' }}>
                <i className="bi bi-lock-fill"></i>
              </div>
              <h4 className="fw-bold text-azul mb-2">Inicia sesión primero</h4>
              <p className="text-suave mb-4">
                Para postularte como asesor par necesitas iniciar sesión con tu cuenta
                institucional.
              </p>
              <div className="d-flex justify-content-center gap-2">
                <Button as={Link} to="/login" className="btn-azul">
                  Iniciar sesión
                </Button>
                <Button as={Link} to="/registro" className="btn-amarillo">
                  Registrarme
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  if (esAdmin) {
    return (
      <Container className="py-5">
        <Alert variant="info" className="text-center">
          <h5 className="fw-bold">Eres administrador</h5>
          <p className="mb-3">
            Las cuentas de administrador no pueden postularse como asesores.
          </p>
          <Button as={Link} to="/admin" className="btn-azul">
            Ir al panel admin
          </Button>
        </Alert>
      </Container>
    );
  }

  if (esAsesor) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="border-0 shadow-sm text-center p-4">
              <div style={{ fontSize: '4rem', color: 'var(--azul-primario)' }}>
                <i className="bi bi-emoji-smile"></i>
              </div>
              <h4 className="fw-bold text-azul mb-2">¡Ya eres asesor par!</h4>
              <p className="text-suave mb-4">
                Tienes acceso a tu panel de asesor donde puedes gestionar horarios,
                solicitudes y asesorías.
              </p>
              <Button as={Link} to="/panel-asesor" className="btn-azul">
                Ir a mi panel
              </Button>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  if (tienePerfilAsesor) {
    // Alumno con postulación ya enviada pero no validada
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="border-0 shadow-sm text-center p-4">
              <div style={{ fontSize: '4rem', color: 'var(--exito)' }}>
                <i className="bi bi-check-circle-fill"></i>
              </div>
              <h4 className="fw-bold text-azul mb-2">Postulación en revisión</h4>
              <p className="text-suave mb-3">
                Tu solicitud para ser asesor par ya fue enviada. Un administrador la
                revisará pronto y te notificará.
              </p>
              <Badge bg="warning" text="dark" className="mb-3 mx-auto px-3 py-2">
                Estado: Pendiente de validación
              </Badge>
              <Button as={Link} to="/" variant="outline-azul">
                Volver al inicio
              </Button>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  // ============ PANTALLA DE ÉXITO ============

  if (exito) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="border-0 shadow-sm text-center p-4">
              <div style={{ fontSize: '4rem', color: 'var(--exito)' }}>
                <i className="bi bi-check-circle-fill"></i>
              </div>
              <h4 className="fw-bold text-azul mb-2">¡Postulación enviada!</h4>
              <p className="text-suave mb-4">
                Tu solicitud ha sido registrada. Un administrador la revisará y
                recibirás una notificación cuando sea validada.
              </p>
              <Alert variant="info" className="small text-start">
                <strong>¿Qué sigue?</strong>
                <ul className="mb-0 mt-2 small">
                  <li>El administrador revisará tu solicitud.</li>
                  <li>Una vez validada, tendrás acceso a tu panel de asesor.</li>
                  <li>Podrás publicar horarios y recibir solicitudes de alumnos.</li>
                </ul>
              </Alert>
              <Button as={Link} to="/" className="btn-azul mt-3">
                Volver al inicio
              </Button>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  // ============ FORMULARIO ============

  const validar = () => {
    const nuevos = {};
    const numPromedio = parseFloat(promedio);
    if (promedio === '') {
      nuevos.promedio = 'El promedio es obligatorio';
    } else if (isNaN(numPromedio) || numPromedio < 0 || numPromedio > 10) {
      nuevos.promedio = 'El promedio debe estar entre 0 y 10';
    }
    if (!acepta) {
      nuevos.acepta = 'Debes aceptar las responsabilidades para continuar';
    }
    setErrores(nuevos);
    return Object.keys(nuevos).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorGeneral('');
    if (!validar()) return;

    setEnviando(true);
    try {
      await asesoresApi.postular({ promedio: parseFloat(promedio) });
      // Refrescar el usuario para que detecte el idAsesor
      await refrescarUsuario();
      setExito(true);
    } catch (err) {
      if (err.tipo === 'validacion') {
        setErrores(err.errores);
        setErrorGeneral('Revisa los campos del formulario.');
      } else if (err.tipo === 'auth') {
        setErrorGeneral('Tu sesión expiró. Inicia sesión de nuevo.');
      } else {
        setErrorGeneral(err.mensaje || 'No se pudo enviar tu postulación.');
      }
    } finally {
      setEnviando(false);
    }
  };

  return (
    <>
      {/* Header */}
      <section className="py-5" style={{ backgroundColor: 'var(--azul-suave)' }}>
        <Container>
          <Badge className="btn-amarillo text-dark mb-3">Postulación</Badge>
          <h1 className="fw-bold text-azul mb-2">Conviértete en asesor par</h1>
          <p className="text-suave mb-0">
            Comparte tus conocimientos y ayuda a otros estudiantes a mejorar
            académicamente.
          </p>
        </Container>
      </section>

      <Container className="py-5">
        <Row className="g-4">
          {/* Formulario */}
          <Col lg={7}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-4">
                <h5 className="fw-bold text-azul mb-4">
                  Datos de tu postulación
                </h5>

                {errorGeneral && (
                  <Alert variant="danger" className="py-2 small">
                    {errorGeneral}
                  </Alert>
                )}

                <Form onSubmit={onSubmit} noValidate>
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold small">
                      Promedio general actual *
                    </Form.Label>
                    <Form.Control
                      type="number"
                      step="0.01"
                      min="0"
                      max="10"
                      placeholder="Ej. 9.50"
                      value={promedio}
                      onChange={(e) => {
                        setPromedio(e.target.value);
                        if (errores.promedio) setErrores({ ...errores, promedio: null });
                      }}
                      isInvalid={!!errores.promedio}
                    />
                    <Form.Text className="text-suave">
                      Se requiere un promedio mínimo de 8.5 para ser asesor.
                    </Form.Text>
                    <Form.Control.Feedback type="invalid">
                      {errores.promedio}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold small">
                      ¿Por qué quieres ser asesor? (opcional)
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Cuéntanos tu motivación para apoyar a otros estudiantes..."
                      value={motivacion}
                      onChange={(e) => setMotivacion(e.target.value)}
                      maxLength={300}
                    />
                    <Form.Text className="text-suave">
                      {motivacion.length}/300 caracteres
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold small d-block mb-2">
                      Acepto las siguientes responsabilidades: *
                    </Form.Label>
                    <div
                      className="p-3 rounded mb-3"
                      style={{ backgroundColor: 'var(--azul-suave)' }}
                    >
                      <ul className="mb-0 small">
                        {RESPONSABILIDADES.map((r, i) => (
                          <li key={i} className="mb-1">
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Form.Check
                      type="checkbox"
                      id="acepta-responsabilidades"
                      label="Acepto las responsabilidades descritas arriba"
                      checked={acepta}
                      onChange={(e) => {
                        setAcepta(e.target.checked);
                        if (errores.acepta) setErrores({ ...errores, acepta: null });
                      }}
                      isInvalid={!!errores.acepta}
                      feedback={errores.acepta}
                      feedbackType="invalid"
                    />
                  </Form.Group>

                  <div className="d-flex gap-2">
                    <Button
                      type="submit"
                      className="btn-azul flex-grow-1 py-2 fw-semibold"
                      disabled={enviando}
                    >
                      {enviando ? 'Enviando...' : 'Enviar postulación'}
                    </Button>
                    <Button
                      as={Link}
                      to="/"
                      variant="outline-secondary"
                      className="py-2"
                    >
                      Cancelar
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          {/* Beneficios */}
          <Col lg={5}>
            <Card className="border-0 shadow-sm mb-4">
              <Card.Body className="p-4">
                <h5 className="fw-bold text-azul mb-3">
                  Beneficios de ser asesor par
                </h5>
                <div className="d-flex flex-column gap-3">
                  {[
                    { icon: 'bi-trophy-fill', txt: 'Reconocimiento institucional como asesor par' },
                    { icon: 'bi-file-text-fill', txt: 'Constancia con valor curricular al finalizar' },
                    { icon: 'bi-people-fill', txt: 'Desarrollo de habilidades docentes y de comunicación' },
                    { icon: 'bi-book-fill', txt: 'Refuerzo de tus propios conocimientos' },
                    { icon: 'bi-hand-thumbs-up-fill', txt: 'Formar parte de la comunidad de apoyo académico' },
                  ].map((b, i) => (
                    <div key={i} className="d-flex align-items-start gap-3">
                      <i
                        className={`bi ${b.icon}`}
                        style={{ fontSize: '1.5rem', color: 'var(--azul-primario)' }}
                      ></i>
                      <span className="text-suave small pt-1">{b.txt}</span>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm">
              <Card.Body className="p-4">
                <h6 className="fw-bold text-azul mb-2">Requisitos</h6>
                <ul className="small text-suave mb-0">
                  <li>Ser alumno activo del ITS Uruapan</li>
                  <li>Promedio general mínimo de 8.5</li>
                  <li>Tener disponibilidad de al menos 2 horas semanales</li>
                  <li>No tener adeudos académicos ni disciplinarios</li>
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default PostularAsesor;