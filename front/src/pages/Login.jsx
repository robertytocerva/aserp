import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import LogoInstitucional from '../components/ui/LogoInstitucional';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ correo: '', password: '' });
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setEnviando(true);

    try {
      await login(form);
      navigate('/');
    } catch (err) {
      if (err.tipo === 'auth') {
        setError(err.mensaje || 'Correo o contraseña incorrectos.');
      } else if (err.tipo === 'validacion') {
        setError('Revisa los campos del formulario.');
      } else {
        setError(err.mensaje || 'Error al iniciar sesión.');
      }
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={5}>
          <Card className="shadow border-0">
            <Card.Body className="p-4 p-md-5">
              <div className="text-center mb-4">
                <div className="mb-3">
                  <LogoInstitucional tipo="principal" altura={70} />
                </div>
                <h3 className="fw-bold text-azul mb-1">Iniciar sesión</h3>
                <p className="text-suave small mb-0">
                  Accede a tu cuenta de Asesorías Par
                </p>
              </div>

              {error && (
                <Alert variant="danger" className="py-2 small">
                  {error}
                </Alert>
              )}

              <Form onSubmit={onSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold small">Correo institucional</Form.Label>
                  <Form.Control
                    type="email"
                    name="correo"
                    placeholder="tu.correo@uruapan.tecnm.mx"
                    value={form.correo}
                    onChange={onChange}
                    required
                    autoComplete="email"
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold small">Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={onChange}
                    required
                    autoComplete="current-password"
                  />
                </Form.Group>

                <Button
                  type="submit"
                  className="btn-azul w-100 py-2 fw-semibold"
                  disabled={enviando}
                >
                  {enviando ? 'Ingresando...' : 'Iniciar sesión'}
                </Button>
              </Form>

              <hr className="my-4" />

              <p className="text-center text-suave small mb-0">
                ¿No tienes cuenta?{' '}
                <Link to="/registro" className="text-azul fw-semibold text-decoration-none">
                  Regístrate aquí
                </Link>
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;