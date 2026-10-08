import { useState, useMemo } from 'react';
import {
  Card,
  Table,
  Badge,
  Button,
  Modal,
  Form,
  Row,
  Col,
  Alert,
  ButtonGroup,
} from 'react-bootstrap';
import {
  bitacorasMock,
  USE_MOCKS_BITACORAS,
} from '../../mocks/bitacorasMock';

function Bitacoras() {
  const [bitacoras, setBitacoras] = useState(bitacorasMock);
  const [modalVer, setModalVer] = useState({ show: false, bitacora: null });
  const [modalEditar, setModalEditar] = useState({ show: false, bitacora: null });
  const [form, setForm] = useState({
    temasTratados: '',
    tareasAsignadas: '',
    observaciones: '',
    calificacionAlumno: '',
  });
  const [busqueda, setBusqueda] = useState('');
  const [vista, setVista] = useState('tabla'); // tabla | tarjetas

  const filtradas = useMemo(() => {
    if (!busqueda) return bitacoras;
    const q = busqueda.toLowerCase();
    return bitacoras.filter(
      (b) =>
        b.asesor?.toLowerCase().includes(q) ||
        b.alumno?.toLowerCase().includes(q) ||
        b.materia?.toLowerCase().includes(q)
    );
  }, [bitacoras, busqueda]);

  const abrirVer = (bitacora) => setModalVer({ show: true, bitacora });
  const abrirEditar = (bitacora) => {
    setForm({
      temasTratados: bitacora.temasTratados,
      tareasAsignadas: bitacora.tareasAsignadas || '',
      observaciones: bitacora.observaciones || '',
      calificacionAlumno: bitacora.calificacionAlumno || '',
    });
    setModalEditar({ show: true, bitacora });
  };

  const guardarEdicion = () => {
    setBitacoras((prev) =>
      prev.map((b) =>
        b.idBitacora === modalEditar.bitacora.idBitacora
          ? {
              ...b,
              temasTratados: form.temasTratados,
              tareasAsignadas: form.tareasAsignadas,
              observaciones: form.observaciones,
              calificacionAlumno: Number(form.calificacionAlumno) || null,
            }
          : b
      )
    );
    setModalEditar({ show: false, bitacora: null });
  };

  const renderEstrellas = (n) => {
    if (!n) return '—';
    return '⭐'.repeat(n);
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-2">
        <div>
          <h2 className="fw-bold text-azul mb-1">Bitácoras de desempeño</h2>
          <p className="text-suave mb-0">
            Registra y consulta el seguimiento académico de las asesorías.
          </p>
        </div>
        <Button variant="outline-secondary" size="sm">
          ➕ Nueva bitácora
        </Button>
      </div>

      {USE_MOCKS_BITACORAS && (
        <Alert variant="warning" className="small">
          <strong>⚠️ Datos de prueba:</strong> El backend aún no tiene endpoints de
          bitácoras. Esta pantalla muestra datos mock para visualizar el diseño.
        </Alert>
      )}

      {/* Filtros */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <Row className="g-2 align-items-center">
            <Col md={6}>
              <Form.Control
                type="search"
                placeholder="Buscar por asesor, alumno o materia..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                size="sm"
              />
            </Col>
            <Col md={6} className="text-md-end">
              <ButtonGroup size="sm">
                <Button
                  variant={vista === 'tabla' ? 'primary' : 'outline-primary'}
                  onClick={() => setVista('tabla')}
                >
                  📋 Tabla
                </Button>
                <Button
                  variant={vista === 'tarjetas' ? 'primary' : 'outline-primary'}
                  onClick={() => setVista('tarjetas')}
                >
                  🗂️ Tarjetas
                </Button>
              </ButtonGroup>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Contenido */}
      {filtradas.length === 0 ? (
        <Alert variant="info" className="text-center py-5">
          <div style={{ fontSize: '3rem' }}>📭</div>
          <h5 className="fw-bold text-azul mb-1">Sin bitácoras</h5>
          <p className="text-suave mb-0 small">
            {bitacoras.length === 0
              ? 'Aún no se han registrado bitácoras.'
              : 'No hay bitácoras que coincidan con la búsqueda.'}
          </p>
        </Alert>
      ) : vista === 'tabla' ? (
        <Card className="border-0 shadow-sm">
          <div className="table-responsive">
            <Table hover className="mb-0 align-middle">
              <thead style={{ backgroundColor: 'var(--azul-suave)' }}>
                <tr>
                  <th className="small fw-semibold">Fecha</th>
                  <th className="small fw-semibold">Asesor</th>
                  <th className="small fw-semibold">Alumno</th>
                  <th className="small fw-semibold">Materia</th>
                  <th className="small fw-semibold text-center">Calif.</th>
                  <th className="small fw-semibold text-end">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtradas.map((b) => (
                  <tr key={b.idBitacora}>
                    <td className="small">{b.fecha}</td>
                    <td className="small fw-semibold">{b.asesor}</td>
                    <td className="small">{b.alumno}</td>
                    <td className="small">{b.materia}</td>
                    <td className="text-center small">{renderEstrellas(b.calificacionAlumno)}</td>
                    <td className="text-end">
                      <div className="d-flex gap-2 justify-content-end">
                        <Button
                          size="sm"
                          variant="outline-primary"
                          onClick={() => abrirVer(b)}
                        >
                          👁️
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-secondary"
                          onClick={() => abrirEditar(b)}
                        >
                          ✏️
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card>
      ) : (
        <Row className="g-3">
          {filtradas.map((b) => (
            <Col md={6} lg={4} key={b.idBitacora}>
              <Card className="border-0 shadow-sm h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <Badge className="btn-amarillo text-dark">{b.fecha}</Badge>
                    <span>{renderEstrellas(b.calificacionAlumno)}</span>
                  </div>
                  <h6 className="fw-bold text-azul mb-1">{b.materia}</h6>
                  <p className="text-suave small mb-2">
                    👨‍🏫 {b.asesor} → 👤 {b.alumno}
                  </p>
                  <p
                    className="small mb-3"
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {b.temasTratados}
                  </p>
                  <div className="d-flex gap-2">
                    <Button
                      size="sm"
                      variant="outline-primary"
                      className="flex-grow-1"
                      onClick={() => abrirVer(b)}
                    >
                      Ver detalles
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-secondary"
                      onClick={() => abrirEditar(b)}
                    >
                      ✏️
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Modal Ver */}
      <Modal
        show={modalVer.show}
        onHide={() => setModalVer({ show: false, bitacora: null })}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold text-azul">
            📓 Detalles de la bitácora
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalVer.bitacora && (
            <>
              <Row className="mb-3">
                <Col md={6}>
                  <div className="text-suave small">Asesor</div>
                  <div className="fw-semibold">{modalVer.bitacora.asesor}</div>
                </Col>
                <Col md={6}>
                  <div className="text-suave small">Alumno</div>
                  <div className="fw-semibold">
                    {modalVer.bitacora.alumno} ({modalVer.bitacora.matricula})
                  </div>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}>
                  <div className="text-suave small">Materia</div>
                  <div className="fw-semibold">{modalVer.bitacora.materia}</div>
                </Col>
                <Col md={6}>
                  <div className="text-suave small">Fecha</div>
                  <div className="fw-semibold">{modalVer.bitacora.fecha}</div>
                </Col>
              </Row>

              <hr />
              <h6 className="fw-bold text-azul">Temas tratados</h6>
              <p className="text-suave small">{modalVer.bitacora.temasTratados}</p>

              {modalVer.bitacora.tareasAsignadas && (
                <>
                  <h6 className="fw-bold text-azul">Tareas asignadas</h6>
                  <p className="text-suave small">{modalVer.bitacora.tareasAsignadas}</p>
                </>
              )}

              {modalVer.bitacora.observaciones && (
                <>
                  <h6 className="fw-bold text-azul">Observaciones</h6>
                  <p className="text-suave small">{modalVer.bitacora.observaciones}</p>
                </>
              )}

              <hr />
              <Row>
                <Col md={6}>
                  <div className="text-suave small">Calificación del alumno</div>
                  <div className="fs-4">
                    {renderEstrellas(modalVer.bitacora.calificacionAlumno)}
                  </div>
                </Col>
                {modalVer.bitacora.comentarioAlumno && (
                  <Col md={6}>
                    <div className="text-suave small">Comentario</div>
                    <p className="small fst-italic">
                      "{modalVer.bitacora.comentarioAlumno}"
                    </p>
                  </Col>
                )}
              </Row>
            </>
          )}
        </Modal.Body>
      </Modal>

      {/* Modal Editar */}
      <Modal
        show={modalEditar.show}
        onHide={() => setModalEditar({ show: false, bitacora: null })}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold text-azul">
            ✏️ Editar bitácora
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold small">Temas tratados</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={form.temasTratados}
                onChange={(e) => setForm({ ...form, temasTratados: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold small">Tareas asignadas</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={form.tareasAsignadas}
                onChange={(e) => setForm({ ...form, tareasAsignadas: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold small">Observaciones</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={form.observaciones}
                onChange={(e) => setForm({ ...form, observaciones: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label className="fw-semibold small">
                Calificación del alumno (1-5)
              </Form.Label>
              <Form.Select
                value={form.calificacionAlumno}
                onChange={(e) =>
                  setForm({ ...form, calificacionAlumno: e.target.value })
                }
              >
                <option value="">Sin calificación</option>
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {'⭐'.repeat(n)} ({n})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setModalEditar({ show: false, bitacora: null })}
          >
            Cancelar
          </Button>
          <Button className="btn-azul" onClick={guardarEdicion}>
            Guardar cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Bitacoras;