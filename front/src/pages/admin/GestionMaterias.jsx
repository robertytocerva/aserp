import { useState, useEffect, useMemo } from 'react';
import {
  Card,
  Table,
  Badge,
  Button,
  Modal,
  Form,
  Alert,
  Row,
  Col,
  Tabs,
  Tab,
  Spinner,
} from 'react-bootstrap';
import { adminApi } from '../../api/adminApi';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const FORM_MATERIA_INICIAL = {
  clave: '',
  nombre: '',
  idCarrera: '',
  semestreRecomendado: '',
  creditos: '',
  descripcion: '',
};

const FORM_CARRERA_INICIAL = {
  clave: '',
  nombre: '',
};

function GestionMaterias() {
  // ============ ESTADO ============
  const [materias, setMaterias] = useState([]);
  const [carreras, setCarreras] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

  // Modal materia
  const [modalMateria, setModalMateria] = useState({ show: false, editando: null });
  const [formMateria, setFormMateria] = useState(FORM_MATERIA_INICIAL);
  const [erroresMateria, setErroresMateria] = useState({});

  // Modal carrera
  const [modalCarrera, setModalCarrera] = useState({ show: false, editando: null });
  const [formCarrera, setFormCarrera] = useState(FORM_CARRERA_INICIAL);
  const [erroresCarrera, setErroresCarrera] = useState({});

  // Modal eliminar
  const [modalEliminar, setModalEliminar] = useState({
    show: false,
    tipo: null,
    item: null,
  });

  const [guardando, setGuardando] = useState(false);

  // Filtros
  const [filtroCarrera, setFiltroCarrera] = useState('');
  const [busqueda, setBusqueda] = useState('');

  // ============ CARGA ============
  const cargar = async () => {
    setCargando(true);
    setError('');
    try {
      const [mats, cars] = await Promise.all([
        adminApi.listarMaterias(),
        adminApi.listarCarreras(),
      ]);
      setMaterias(mats);
      setCarreras(cars);
    } catch (err) {
      setError(err.mensaje || 'No se pudieron cargar los datos.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  // ============ MATERIAS: CRUD ============
  const abrirCrearMateria = () => {
    setFormMateria(FORM_MATERIA_INICIAL);
    setErroresMateria({});
    setModalMateria({ show: true, editando: null });
  };

  const abrirEditarMateria = (materia) => {
    setFormMateria({
      clave: materia.clave,
      nombre: materia.nombre,
      idCarrera: materia.idCarrera,
      semestreRecomendado: materia.semestreRecomendado || '',
      creditos: materia.creditos || '',
      descripcion: materia.descripcion || '',
    });
    setErroresMateria({});
    setModalMateria({ show: true, editando: materia });
  };

  const guardarMateria = async (e) => {
    e.preventDefault();
    setError('');
    setGuardando(true);
    try {
      const payload = {
        clave: formMateria.clave.trim(),
        nombre: formMateria.nombre.trim(),
        idCarrera: Number(formMateria.idCarrera),
        semestreRecomendado: formMateria.semestreRecomendado
          ? Number(formMateria.semestreRecomendado)
          : null,
        creditos: formMateria.creditos ? Number(formMateria.creditos) : null,
        descripcion: formMateria.descripcion.trim() || null,
      };

      if (modalMateria.editando) {
        await adminApi.actualizarMateria(modalMateria.editando.idMateria, payload);
        setExito('<i className="bi bi-check-circle me-1"></i> Materia actualizada correctamente.');
      } else {
        await adminApi.crearMateria(payload);
        setExito('<i className="bi bi-check-circle me-1"></i> Materia creada correctamente.');
      }
      setModalMateria({ show: false, editando: null });
      cargar();
    } catch (err) {
      if (err.tipo === 'validacion') {
        setErroresMateria(err.errores);
      } else {
        setError(err.mensaje || 'No se pudo guardar la materia.');
      }
    } finally {
      setGuardando(false);
    }
  };

  // ============ CARRERAS: CRUD ============
  const abrirCrearCarrera = () => {
    setFormCarrera(FORM_CARRERA_INICIAL);
    setErroresCarrera({});
    setModalCarrera({ show: true, editando: null });
  };

  const abrirEditarCarrera = (carrera) => {
    setFormCarrera({
      clave: carrera.clave,
      nombre: carrera.nombre,
    });
    setErroresCarrera({});
    setModalCarrera({ show: true, editando: carrera });
  };

  const guardarCarrera = async (e) => {
    e.preventDefault();
    setError('');
    setGuardando(true);
    try {
      const payload = {
        clave: formCarrera.clave.trim().toUpperCase(),
        nombre: formCarrera.nombre.trim(),
      };

      if (modalCarrera.editando) {
        await adminApi.actualizarCarrera(modalCarrera.editando.idCarrera, payload);
        setExito('<i className="bi bi-check-circle me-1"></i> Carrera actualizada correctamente.');
      } else {
        await adminApi.crearCarrera(payload);
        setExito('<i className="bi bi-check-circle me-1"></i> Carrera creada correctamente.');
      }
      setModalCarrera({ show: false, editando: null });
      cargar();
    } catch (err) {
      if (err.tipo === 'validacion') {
        setErroresCarrera(err.errores);
      } else {
        setError(err.mensaje || 'No se pudo guardar la carrera.');
      }
    } finally {
      setGuardando(false);
    }
  };

  // ============ ELIMINAR ============
  const confirmarEliminar = (tipo, item) => {
    setModalEliminar({ show: true, tipo, item });
  };

  const eliminar = async () => {
    const { tipo, item } = modalEliminar;
    setError('');
    try {
      if (tipo === 'materia') {
        await adminApi.eliminarMateria(item.idMateria);
        setExito('<i className="bi bi-trash me-1"></i> Materia eliminada correctamente.');
      } else {
        await adminApi.eliminarCarrera(item.idCarrera);
        setExito('<i className="bi bi-trash me-1"></i> Carrera eliminada correctamente.');
      }
      setModalEliminar({ show: false, tipo: null, item: null });
      cargar();
    } catch (err) {
      setError(err.mensaje || 'No se pudo eliminar el elemento.');
      setModalEliminar({ show: false, tipo: null, item: null });
    }
  };

  // ============ FILTRADO ============
  const materiasFiltradas = useMemo(() => {
    return materias.filter((m) => {
      if (filtroCarrera && m.idCarrera !== Number(filtroCarrera)) return false;
      if (busqueda) {
        const q = busqueda.toLowerCase();
        return (
          m.clave?.toLowerCase().includes(q) ||
          m.nombre?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [materias, filtroCarrera, busqueda]);

  // ============ RENDER ============
  return (
    <>
      <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-2">
        <div>
          <h2 className="fw-bold text-azul mb-1">Materias y carreras</h2>
          <p className="text-suave mb-0">
            Gestiona el catálogo académico del programa de asesores.
          </p>
        </div>
        <Button variant="outline-secondary" size="sm" onClick={cargar}>
          <i className="bi bi-arrow-clockwise me-1"></i> Recargar
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
        <LoadingSpinner mensaje="Cargando catálogo..." />
      ) : (
        <Tabs defaultActiveKey="materias" className="mb-3">
          {/* ============ TAB MATERIAS ============ */}
          <Tab eventKey="materias" title={<span><i className="bi bi-book-fill me-1"></i> Materias ({materias.length})</span>}>
            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
              <div className="d-flex gap-2">
                <Form.Select
                  size="sm"
                  value={filtroCarrera}
                  onChange={(e) => setFiltroCarrera(e.target.value)}
                  style={{ minWidth: '200px' }}
                >
                  <option value="">Todas las carreras</option>
                  {carreras.map((c) => (
                    <option key={c.idCarrera} value={c.idCarrera}>
                      {c.nombre}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control
                  size="sm"
                  type="search"
                  placeholder="Buscar por clave o nombre..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  style={{ minWidth: '250px' }}
                />
              </div>
              <Button className="btn-amarillo" size="sm" onClick={abrirCrearMateria}>
                <i className="bi bi-plus-circle me-1"></i> Nueva materia
              </Button>
            </div>

            <Card className="border-0 shadow-sm">
              <div className="table-responsive">
                <Table hover className="mb-0 align-middle">
                  <thead style={{ backgroundColor: 'var(--azul-suave)' }}>
                    <tr>
                      <th className="small fw-semibold">Clave</th>
                      <th className="small fw-semibold">Nombre</th>
                      <th className="small fw-semibold">Carrera</th>
                      <th className="small fw-semibold text-center">Sem.</th>
                      <th className="small fw-semibold text-center">Créd.</th>
                      <th className="small fw-semibold text-center">Estado</th>
                      <th className="small fw-semibold text-end">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {materiasFiltradas.map((m) => (
                      <tr key={m.idMateria}>
                        <td className="small fw-semibold text-azul">{m.clave}</td>
                        <td className="small">{m.nombre}</td>
                        <td className="small text-suave">
                          {m.nombreCarrera || '—'}
                        </td>
                        <td className="text-center small">
                          {m.semestreRecomendado || '—'}
                        </td>
                        <td className="text-center small">{m.creditos || '—'}</td>
                        <td className="text-center">
                          {m.activo ? (
                            <Badge bg="success">Activa</Badge>
                          ) : (
                            <Badge bg="secondary">Inactiva</Badge>
                          )}
                        </td>
                        <td className="text-end">
                          <div className="d-flex gap-2 justify-content-end">
                            <Button
                              size="sm"
                              variant="outline-primary"
                              onClick={() => abrirEditarMateria(m)}
                              title="Editar"
                            >
                              <i className="bi bi-pencil me-1"></i> Editar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline-danger"
                              onClick={() => confirmarEliminar('materia', m)}
                              title="Eliminar"
                            >
                              <i className="bi bi-trash me-1"></i> Eliminar
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card>
          </Tab>

          {/* ============ TAB CARRERAS ============ */}
          <Tab eventKey="carreras" title={<span><i className="bi bi-mortarboard-fill me-1"></i> Carreras ({carreras.length})</span>}>
            <div className="d-flex justify-content-end mb-3">
              <Button className="btn-amarillo" size="sm" onClick={abrirCrearCarrera}>
                <i className="bi bi-plus-circle me-1"></i> Nueva carrera
              </Button>
            </div>

            <Card className="border-0 shadow-sm">
              <div className="table-responsive">
                <Table hover className="mb-0 align-middle">
                  <thead style={{ backgroundColor: 'var(--azul-suave)' }}>
                    <tr>
                      <th className="small fw-semibold">Clave</th>
                      <th className="small fw-semibold">Nombre</th>
                      <th className="small fw-semibold text-center">Estado</th>
                      <th className="small fw-semibold text-center">Materias</th>
                      <th className="small fw-semibold text-end">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {carreras.map((c) => {
                      const numMaterias = materias.filter(
                        (m) => m.idCarrera === c.idCarrera
                      ).length;
                      return (
                        <tr key={c.idCarrera}>
                          <td className="small fw-semibold text-azul">{c.clave}</td>
                          <td className="small">{c.nombre}</td>
                          <td className="text-center">
                            {c.activo ? (
                              <Badge bg="success">Activa</Badge>
                            ) : (
                              <Badge bg="secondary">Inactiva</Badge>
                            )}
                          </td>
                          <td className="text-center small">{numMaterias}</td>
                          <td className="text-end">
                            <div className="d-flex gap-2 justify-content-end">
                              <Button
                                size="sm"
                                variant="outline-primary"
                                onClick={() => abrirEditarCarrera(c)}
                                title="Editar"
                              >
                                <i className="bi bi-pencil me-1"></i> Editar
                              </Button>
                              <Button
                                size="sm"
                                variant="outline-danger"
                                onClick={() => confirmarEliminar('carrera', c)}
                                title="Eliminar"
                              >
                                <i className="bi bi-trash me-1"></i> Eliminar
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
          </Tab>
        </Tabs>
      )}

      {/* ============ MODAL MATERIA ============ */}
      <Modal
        show={modalMateria.show}
        onHide={() => setModalMateria({ show: false, editando: null })}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold text-azul">
            {modalMateria.editando ? '<i className="bi bi-pencil"></i> Editar materia' : '<i className="bi bi-plus-circle me-1"></i> Nueva materia'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={guardarMateria}>
          <Modal.Body>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold small">Clave *</Form.Label>
                  <Form.Control
                    value={formMateria.clave}
                    onChange={(e) =>
                      setFormMateria({ ...formMateria, clave: e.target.value })
                    }
                    isInvalid={!!erroresMateria.clave}
                    placeholder="ISC101"
                    maxLength={20}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {erroresMateria.clave}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold small">Nombre *</Form.Label>
                  <Form.Control
                    value={formMateria.nombre}
                    onChange={(e) =>
                      setFormMateria({ ...formMateria, nombre: e.target.value })
                    }
                    isInvalid={!!erroresMateria.nombre}
                    placeholder="Programación Orientada a Objetos"
                    maxLength={150}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {erroresMateria.nombre}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold small">Carrera *</Form.Label>
              <Form.Select
                value={formMateria.idCarrera}
                onChange={(e) =>
                  setFormMateria({ ...formMateria, idCarrera: e.target.value })
                }
                isInvalid={!!erroresMateria.idCarrera}
                required
              >
                <option value="">-- Selecciona --</option>
                {carreras.map((c) => (
                  <option key={c.idCarrera} value={c.idCarrera}>
                    {c.nombre}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {erroresMateria.idCarrera}
              </Form.Control.Feedback>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold small">
                    Semestre recomendado
                  </Form.Label>
                  <Form.Control
                    type="number"
                    min={1}
                    max={20}
                    value={formMateria.semestreRecomendado}
                    onChange={(e) =>
                      setFormMateria({
                        ...formMateria,
                        semestreRecomendado: e.target.value,
                      })
                    }
                    isInvalid={!!erroresMateria.semestreRecomendado}
                  />
                  <Form.Control.Feedback type="invalid">
                    {erroresMateria.semestreRecomendado}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold small">Créditos</Form.Label>
                  <Form.Control
                    type="number"
                    min={0}
                    value={formMateria.creditos}
                    onChange={(e) =>
                      setFormMateria({ ...formMateria, creditos: e.target.value })
                    }
                    isInvalid={!!erroresMateria.creditos}
                  />
                  <Form.Control.Feedback type="invalid">
                    {erroresMateria.creditos}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold small">Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={formMateria.descripcion}
                onChange={(e) =>
                  setFormMateria({ ...formMateria, descripcion: e.target.value })
                }
                maxLength={500}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setModalMateria({ show: false, editando: null })}
              disabled={guardando}
            >
              Cancelar
            </Button>
            <Button type="submit" className="btn-azul" disabled={guardando}>
              {guardando ? (
                <>
                  <Spinner size="sm" animation="border" className="me-2" />
                  Guardando...
                </>
              ) : modalMateria.editando ? (
                'Guardar cambios'
              ) : (
                'Crear materia'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* ============ MODAL CARRERA ============ */}
      <Modal
        show={modalCarrera.show}
        onHide={() => setModalCarrera({ show: false, editando: null })}
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold text-azul">
            {modalCarrera.editando ? '<i className="bi bi-pencil"></i> Editar carrera' : '<i className="bi bi-plus-circle"></i> Nueva carrera'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={guardarCarrera}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold small">Clave *</Form.Label>
              <Form.Control
                value={formCarrera.clave}
                onChange={(e) =>
                  setFormCarrera({ ...formCarrera, clave: e.target.value.toUpperCase() })
                }
                isInvalid={!!erroresCarrera.clave}
                placeholder="ISC"
                maxLength={20}
                required
              />
              <Form.Control.Feedback type="invalid">
                {erroresCarrera.clave}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold small">Nombre *</Form.Label>
              <Form.Control
                value={formCarrera.nombre}
                onChange={(e) =>
                  setFormCarrera({ ...formCarrera, nombre: e.target.value })
                }
                isInvalid={!!erroresCarrera.nombre}
                placeholder="Ingeniería en Sistemas Computacionales"
                maxLength={150}
                required
              />
              <Form.Control.Feedback type="invalid">
                {erroresCarrera.nombre}
              </Form.Control.Feedback>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setModalCarrera({ show: false, editando: null })}
              disabled={guardando}
            >
              Cancelar
            </Button>
            <Button type="submit" className="btn-azul" disabled={guardando}>
              {guardando ? (
                <>
                  <Spinner size="sm" animation="border" className="me-2" />
                  Guardando...
                </>
              ) : modalCarrera.editando ? (
                'Guardar cambios'
              ) : (
                'Crear carrera'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* ============ MODAL ELIMINAR ============ */}
      <Modal
        show={modalEliminar.show}
        onHide={() => setModalEliminar({ show: false, tipo: null, item: null })}
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold text-danger"><i className="bi bi-trash"></i> Confirmar eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            ¿Seguro que quieres eliminar{' '}
            {modalEliminar.tipo === 'materia' ? 'la materia' : 'la carrera'}{' '}
            <strong>
              {modalEliminar.item?.nombre}
            </strong>
            ?
          </p>
          <Alert variant="warning" className="small mb-0">
            Esta acción es un <strong>soft delete</strong>: el elemento se marcará como
            inactivo pero no se borrará de la base de datos.
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setModalEliminar({ show: false, tipo: null, item: null })}
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

export default GestionMaterias;