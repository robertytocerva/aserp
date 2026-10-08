import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { carrerasApi } from '../api/carrerasApi';
import { alumnosApi } from '../api/alumnosApi';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const FORM_INICIAL = {
  matricula: '',
  nombre: '',
  apellidoPaterno: '',
  apellidoMaterno: '',
  correo: '',
  telefono: '',
  idCarrera: '',
  semestre: '',
  password: '',
  confirmarPassword: '',
};

function RegistroAlumno() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState(FORM_INICIAL);
  const [carreras, setCarreras] = useState([]);
  const [cargandoCarreras, setCargandoCarreras] = useState(true);
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState('');
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
  const cargar = async () => {
    try {
      const data = await carrerasApi.listarTodas();
      const activas = data.filter((c) => c.activo);
      setCarreras(activas);

      // Si el backend responde pero no hay carreras, avisar
      if (activas.length === 0) {
        setErrorGeneral(
          'Aún no hay carreras registradas en el sistema. Contacta al administrador.'
        );
      }
    } catch (err) {
      setErrorGeneral(
        err.mensaje || 'No se pudieron cargar las carreras. Verifica que el backend esté corriendo.'
      );
    } finally {
      setCargandoCarreras(false);
    }
  };
  cargar();
}, []);

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errores[e.target.name]) {
      setErrores({ ...errores, [e.target.name]: null });
    }
  };

  const validar = () => {
    const nuevos = {};
    if (!form.matricula.trim()) nuevos.matricula = 'La matrícula es obligatoria';
    if (!form.nombre.trim()) nuevos.nombre = 'El nombre es obligatorio';
    if (!form.apellidoPaterno.trim()) nuevos.apellidoPaterno = 'El apellido paterno es obligatorio';
    if (!form.correo.trim()) {
      nuevos.correo = 'El correo es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo)) {
      nuevos.correo = 'El correo no tiene un formato válido';
    }
    if (!form.idCarrera) nuevos.idCarrera = 'Selecciona una carrera';
    if (!form.semestre) {
      nuevos.semestre = 'El semestre es obligatorio';
    } else if (form.semestre < 1 || form.semestre > 20) {
      nuevos.semestre = 'El semestre debe estar entre 1 y 20';
    }
    if (!form.password) {
      nuevos.password = 'La contraseña es obligatoria';
    } else if (form.password.length < 6) {
      nuevos.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    if (form.password !== form.confirmarPassword) {
      nuevos.confirmarPassword = 'Las contraseñas no coinciden';
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
      const payload = {
        matricula: form.matricula.trim(),
        nombre: form.nombre.trim(),
        apellidoPaterno: form.apellidoPaterno.trim(),
        apellidoMaterno: form.apellidoMaterno.trim() || null,
        correo: form.correo.trim().toLowerCase(),
        telefono: form.telefono.trim() || null,
        idCarrera: Number(form.idCarrera),
        semestre: Number(form.semestre),
        password: form.password,
      };

      await alumnosApi.registrar(payload);
      // Auto-login tras registro
      await login({ correo: payload.correo, password: payload.password });
      navigate('/');
    } catch (err) {
      if (err.tipo === 'validacion') {
        setErrores(err.errores);
        setErrorGeneral('Revisa los campos marcados.');
      } else {
        setErrorGeneral(err.mensaje || 'No se pudo completar el registro.');
      }
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={8} xl={7}>
          <Card className="shadow border-0">
            <Card.Body className="p-4 p-md-5">
              <div className="text-center mb-4">
                <h3 className="fw-bold text-azul mb-1">Crear cuenta de alumno</h3>
                <p className="text-suave small mb-0">
                  Regístrate para solicitar asesorías académicas
                </p>
              </div>

              {errorGeneral && (
                <Alert variant="danger" className="py-2 small">
                  {errorGeneral}
                </Alert>
              )}

              {cargandoCarreras ? (
                <LoadingSpinner mensaje="Cargando carreras..." />
              ) : (
                <Form onSubmit={onSubmit} noValidate>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold small">Matrícula *</Form.Label>
                        <Form.Control
                          name="matricula"
                          value={form.matricula}
                          onChange={onChange}
                          isInvalid={!!errores.matricula}
                          placeholder="20240001"
                          maxLength={20}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errores.matricula}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold small">Semestre *</Form.Label>
                        <Form.Control
                          type="number"
                          name="semestre"
                          value={form.semestre}
                          onChange={onChange}
                          isInvalid={!!errores.semestre}
                          placeholder="1 - 20"
                          min={1}
                          max={20}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errores.semestre}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold small">Nombre(s) *</Form.Label>
                        <Form.Control
                          name="nombre"
                          value={form.nombre}
                          onChange={onChange}
                          isInvalid={!!errores.nombre}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errores.nombre}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold small">Apellido paterno *</Form.Label>
                        <Form.Control
                          name="apellidoPaterno"
                          value={form.apellidoPaterno}
                          onChange={onChange}
                          isInvalid={!!errores.apellidoPaterno}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errores.apellidoPaterno}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold small">Apellido materno</Form.Label>
                    <Form.Control
                      name="apellidoMaterno"
                      value={form.apellidoMaterno}
                      onChange={onChange}
                    />
                  </Form.Group>

                  <Row>
                    <Col md={7}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold small">Correo institucional *</Form.Label>
                        <Form.Control
                          type="email"
                          name="correo"
                          value={form.correo}
                          onChange={onChange}
                          isInvalid={!!errores.correo}
                          placeholder="tu.correo@uruapan.tecnm.mx"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errores.correo}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={5}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold small">Teléfono</Form.Label>
                        <Form.Control
                          name="telefono"
                          value={form.telefono}
                          onChange={onChange}
                          placeholder="4521234567"
                          maxLength={20}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold small">Carrera *</Form.Label>
                    <Form.Select
                      name="idCarrera"
                      value={form.idCarrera}
                      onChange={onChange}
                      isInvalid={!!errores.idCarrera}
                    >
                      <option value="">-- Selecciona tu carrera --</option>
                      {carreras.map((c) => (
                        <option key={c.idCarrera} value={c.idCarrera}>
                          {c.nombre}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errores.idCarrera}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <hr className="my-3" />
                  <p className="fw-semibold small text-azul mb-2">Datos de acceso</p>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold small">Contraseña *</Form.Label>
                        <Form.Control
                          type="password"
                          name="password"
                          value={form.password}
                          onChange={onChange}
                          isInvalid={!!errores.password}
                          placeholder="Mínimo 6 caracteres"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errores.password}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold small">Confirmar contraseña *</Form.Label>
                        <Form.Control
                          type="password"
                          name="confirmarPassword"
                          value={form.confirmarPassword}
                          onChange={onChange}
                          isInvalid={!!errores.confirmarPassword}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errores.confirmarPassword}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Button
                    type="submit"
                    className="btn-azul w-100 py-2 fw-semibold"
                    disabled={enviando || carreras.length === 0}
                  >
                    {enviando ? 'Registrando...' : 'Crear cuenta'}
                  </Button>
                </Form>
              )}

              <hr className="my-4" />

              <p className="text-center text-suave small mb-0">
                ¿Ya tienes cuenta?{' '}
                <Link to="/login" className="text-azul fw-semibold text-decoration-none">
                  Inicia sesión
                </Link>
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default RegistroAlumno;