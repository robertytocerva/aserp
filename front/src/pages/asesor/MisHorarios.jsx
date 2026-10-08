import { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Table,
  Badge,
  Modal,
  Form,
  Alert,
  Row,
  Col,
  Spinner,
} from 'react-bootstrap';
import { horariosApi } from '../../api/horariosApi';
import {
  DIAS_SEMANA,
  MODALIDAD_INFO,
} from '../../mocks/asesoresMock';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const FORM_INICIAL = {
  diaSemana: 1,
  horaInicio: '16:00',
  horaFin: '18:00',
  modalidad: 'presencial',
  lugar: '',
};

function MisHorarios() {
  const [horarios, setHorarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

  // Modal de crear/editar
  const [modal, setModal] = useState({ show: false, editando: null });
  const [form, setForm] = useState(FORM_INICIAL);
  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);

  // Modal de confirmación de eliminación
  const [modalEliminar, setModalEliminar] = useState({ show: false, horario: null });

  // ============ CARGA ============
  const cargar = async () => {
    setCargando(true);
    setError('');
    try {
      const data = await horariosApi.misHorarios();
      setHorarios(data);
    } catch (err) {
      setError(err.mensaje || 'No se pudieron cargar tus horarios.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  // ============ MODAL CREAR/EDITAR ============
  const abrirCrear = () => {
    setForm(FORM_INICIAL);
    setErrores({});
    setModal({ show: true, editando: null });
  };

  const abrirEditar = (horario) => {
    setForm({
      diaSemana: horario.diaSemana,
      horaInicio: horario.horaInicio,
      horaFin: horario.horaFin,
      modalidad: horario.modalidad,
      lugar: horario.lugar || '',
    });
    setErrores({});
    setModal({ show: true, editando: horario });
  };

  const cerrarModal = () => {
    setModal({ show: false, editando: null });
    setErrores({});
  };

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errores[e.target.name]) {
      setErrores({ ...errores, [e.target.name]: null });
    }
  };

  const validar = () => {
    const nuevos = {};
    if (!form.diaSemana) nuevos.diaSemana = 'Selecciona un día';
    if (!form.horaInicio) nuevos.horaInicio = 'La hora de inicio es obligatoria';
    if (!form.horaFin) nuevos.horaFin = 'La hora de fin es obligatoria';
    if (form.horaInicio && form.horaFin && form.horaFin <= form.horaInicio) {
      nuevos.horaFin = 'La hora de fin debe ser posterior a la de inicio';
    }
    if (!form.modalidad) nuevos.modalidad = 'Selecciona una modalidad';
    setErrores(nuevos);
    return Object.keys(nuevos).length === 0;
  };

  const guardar = async (e) => {
    e.preventDefault();
    setError('');
    if (!validar()) return;

    setGuardando(true);
    try {
      const payload = {
        diaSemana: Number(form.diaSemana),
        horaInicio: form.horaInicio,
        horaFin: form.horaFin,
        modalidad: form.modalidad,
        lugar: form.lugar.trim() || null,
      };

      if (modal.editando) {
        await horariosApi.actualizar(modal.editando.idHorario, payload);
        setExito('✅ Horario actualizado correctamente.');
      } else {
        await horariosApi.crear(payload);
        setExito('✅ Horario creado correctamente.');
      }
      cerrarModal();
      cargar();
    } catch (err) {
      if (err.tipo === 'validacion') {
        setErrores(err.errores);
      } else {
        setError(err.mensaje || 'No se pudo guardar el horario.');
      }
    } finally {
      setGuardando(false);
    }
  };

  // ============ ELIMINAR ============
  const confirmarEliminar = (horario) => {
    setModalEliminar({ show: true, horario });
  };

  const eliminar = async () => {
    const h = modalEliminar.horario;
    if (!h) return;

    try {
      await horariosApi.eliminar(h.idHorario);
      setExito('🗑️ Horario eliminado correctamente.');
      setModalEliminar({ show: false, horario: null });
      cargar();
    } catch (err) {
      setError(err.mensaje || 'No se pudo eliminar el horario.');
      setModalEliminar({ show: false, horario: null });
    }
  };

  // ============ AGRUPAR POR DÍA ============
  const horariosPorDia = horarios.reduce((acc, h) => {
    const dia = h.diaSemana;
    if (!acc[dia]) acc[dia] = [];
    acc[dia].push(h);
    return acc;
  }, {});

  // ============ RENDER ============
  return (
    <>
      <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-2">
        <div>
          <h2 className="fw-bold text-azul mb-1">Mis horarios</h2>
          <p className="text-suave mb-0">
            Publica los bloques de tiempo en los que puedes dar asesorías.
          </p>
        </div>
        <Button className="btn-amarillo fw-semibold" onClick={abrirCrear}>
          ➕ Nuevo horario
        </Button>
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      {exito && (
        <Alert variant="success" dismissible onClose={() => setExito('')}>
          {exito}
        </Alert>
      )}

      {cargando ? (
        <LoadingSpinner mensaje="Cargando tus horarios..." />
      ) : horarios.length === 0 ? (
        <Card className="border-0 shadow-sm text-center p-5">
          <div style={{ fontSize: '3rem' }}>📅</div>
          <h5 className="fw-bold text-azul mb-2">Aún no tienes horarios</h5>
          <p className="text-suave mb-4">
            Publica tu primer bloque de disponibilidad para que los alumnos puedan
            solicitar asesorías contigo.
          </p>
          <div>
            <Button className="btn-azul" onClick={abrirCrear}>
              ➕ Crear mi primer horario
            </Button>
          </div>
        </Card>
      ) : (
        <>
          {/* Vista de tabla completa */}
          <Card className="border-0 shadow-sm mb-4">
            <div className="table-responsive">
              <Table hover className="mb-0 align-middle">
                <thead style={{ backgroundColor: 'var(--azul-suave)' }}>
                  <tr>
                    <th className="small fw-semibold">Día</th>
                    <th className="small fw-semibold">Horario</th>
                    <th className="small fw-semibold">Modalidad</th>
                    <th className="small fw-semibold">Lugar</th>
                    <th className="small fw-semibold text-center">Estado</th>
                    <th className="small fw-semibold text-end">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {[...horarios]
                    .sort((a, b) => {
                      if (a.diaSemana !== b.diaSemana) return a.diaSemana - b.diaSemana;
                      return a.horaInicio.localeCompare(b.horaInicio);
                    })
                    .map((h) => {
                      const info = MODALIDAD_INFO[h.modalidad] || MODALIDAD_INFO.presencial;
                      return (
                        <tr key={h.idHorario} style={{ opacity: h.activo ? 1 : 0.5 }}>
                          <td className="fw-semibold text-azul small">
                            {DIAS_SEMANA[h.diaSemana]}
                          </td>
                          <td className="small">
                            {h.horaInicio} - {h.horaFin}
                          </td>
                          <td>
                            <Badge bg={info.color} className="fw-normal">
                              {info.icon} {info.label}
                            </Badge>
                          </td>
                          <td className="small text-suave">
                            {h.lugar || '—'}
                          </td>
                          <td className="text-center">
                            {h.activo ? (
                              <Badge bg="success">Activo</Badge>
                            ) : (
                              <Badge bg="secondary">Inactivo</Badge>
                            )}
                          </td>
                          <td className="text-end">
                            <div className="d-flex gap-2 justify-content-end">
                              <Button
                                size="sm"
                                variant="outline-primary"
                                onClick={() => abrirEditar(h)}
                                disabled={!h.activo}
                                title="Editar"
                              >
                                ✏️
                              </Button>
                              <Button
                                size="sm"
                                variant="outline-danger"
                                onClick={() => confirmarEliminar(h)}
                                disabled={!h.activo}
                                title="Eliminar"
                              >
                                🗑️
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </Table>
            </div>
          </Card>

          {/* Vista semanal */}
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <h5 className="fw-bold text-azul mb-3">Vista semanal</h5>
              <Row className="g-2">
                {[1, 2, 3, 4, 5, 6, 7].map((dia) => (
                  <Col key={dia} xs={12} md={6} lg={4}>
                    <div
                      className="p-3 rounded h-100"
                      style={{
                        backgroundColor: horariosPorDia[dia]
                          ? 'var(--azul-suave)'
                          : 'var(--fondo)',
                        border: '1px solid var(--borde)',
                        opacity: horariosPorDia[dia] ? 1 : 0.5,
                      }}
                    >
                      <div className="fw-bold text-azul small mb-2">
                        {DIAS_SEMANA[dia]}
                      </div>
                      {horariosPorDia[dia] ? (
                        horariosPorDia[dia]
                          .filter((h) => h.activo)
                          .map((h) => (
                            <div
                              key={h.idHorario}
                              className="small mb-1 p-2 rounded bg-white"
                            >
                              <div className="fw-semibold">
                                {h.horaInicio} - {h.horaFin}
                              </div>
                              {h.lugar && (
                                <div className="text-suave" style={{ fontSize: '0.75rem' }}>
                                  📍 {h.lugar}
                                </div>
                              )}
                            </div>
                          ))
                      ) : (
                        <div className="text-suave small">Sin horarios</div>
                      )}
                    </div>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        </>
      )}

      {/* ============ MODAL CREAR/EDITAR ============ */}
      <Modal show={modal.show} onHide={cerrarModal} centered>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold text-azul">
            {modal.editando ? '✏️ Editar horario' : '➕ Nuevo horario'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={guardar}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold small">Día de la semana *</Form.Label>
              <Form.Select
                name="diaSemana"
                value={form.diaSemana}
                onChange={onChange}
                isInvalid={!!errores.diaSemana}
              >
                {Object.entries(DIAS_SEMANA).map(([num, nombre]) => (
                  <option key={num} value={num}>
                    {nombre}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errores.diaSemana}
              </Form.Control.Feedback>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold small">Hora inicio *</Form.Label>
                  <Form.Control
                    type="time"
                    name="horaInicio"
                    value={form.horaInicio}
                    onChange={onChange}
                    isInvalid={!!errores.horaInicio}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errores.horaInicio}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold small">Hora fin *</Form.Label>
                  <Form.Control
                    type="time"
                    name="horaFin"
                    value={form.horaFin}
                    onChange={onChange}
                    isInvalid={!!errores.horaFin}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errores.horaFin}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold small">Modalidad *</Form.Label>
              <Form.Select
                name="modalidad"
                value={form.modalidad}
                onChange={onChange}
                isInvalid={!!errores.modalidad}
              >
                <option value="presencial">🏫 Presencial</option>
                <option value="virtual">💻 Virtual</option>
                <option value="hibrida">🔄 Híbrida</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errores.modalidad}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold small">
                Lugar / enlace (opcional)
              </Form.Label>
              <Form.Control
                name="lugar"
                value={form.lugar}
                onChange={onChange}
                placeholder="Ej. Aula 3, Google Meet..."
                maxLength={100}
              />
              <Form.Text className="text-suave">
                Indica dónde será la asesoría (aula, laboratorio, enlace de videollamada).
              </Form.Text>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={cerrarModal} disabled={guardando}>
              Cancelar
            </Button>
            <Button type="submit" className="btn-azul" disabled={guardando}>
              {guardando ? (
                <>
                  <Spinner size="sm" animation="border" className="me-2" />
                  Guardando...
                </>
              ) : modal.editando ? (
                'Guardar cambios'
              ) : (
                'Crear horario'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* ============ MODAL ELIMINAR ============ */}
      <Modal
        show={modalEliminar.show}
        onHide={() => setModalEliminar({ show: false, horario: null })}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold text-danger">
            🗑️ Confirmar eliminación
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Seguro que quieres eliminar este horario?
          {modalEliminar.horario && (
            <div className="mt-3 p-3 rounded" style={{ backgroundColor: 'var(--fondo)' }}>
              <div className="fw-semibold">
                {DIAS_SEMANA[modalEliminar.horario.diaSemana]}
              </div>
              <div className="small text-suave">
                {modalEliminar.horario.horaInicio} - {modalEliminar.horario.horaFin}
              </div>
            </div>
          )}
          <Alert variant="warning" className="small mt-3 mb-0">
            Las asesorías ya agendadas en este horario no se verán afectadas.
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setModalEliminar({ show: false, horario: null })}
          >
            Cancelar
          </Button>
          <Button variant="danger" onClick={eliminar}>
            Sí, eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default MisHorarios;