import { useState, useEffect, useMemo } from 'react';
import {
  Card,
  Table,
  Badge,
  Button,
  Form,
  Alert,
  ButtonGroup,
  Spinner,
  Modal,
} from 'react-bootstrap';
import { asesoresApi } from '../../api/asesoresApi';
import { adminApi } from '../../api/adminApi';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

function GestionAsesores() {
  const [asesores, setAsesores] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

  const [filtro, setFiltro] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  const [accionesEnCurso, setAccionesEnCurso] = useState({});
  const [modalBaja, setModalBaja] = useState({ show: false, asesor: null });

  const cargarAsesores = async () => {
    setCargando(true);
    setError('');
    try {
      const data = await asesoresApi.listarTodos();
      setAsesores(data);
    } catch (err) {
      setError(err.mensaje || 'No se pudieron cargar los asesores.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarAsesores();
  }, []);

  const handleValidar = async (asesor, validar) => {
    setAccionesEnCurso((prev) => ({ ...prev, [asesor.idAsesor]: true }));
    setError('');
    setExito('');
    try {
      const actualizado = await adminApi.cambiarValidacion(asesor.idAsesor, validar);
      setAsesores((prev) =>
        prev.map((a) => (a.idAsesor === asesor.idAsesor ? actualizado : a))
      );
      setExito(
        validar
          ? `${asesor.nombreAlumno} ha sido validado como asesor.`
          : `Se revocó la validación de ${asesor.nombreAlumno}.`
      );
    } catch (err) {
      setError(err.mensaje || 'No se pudo actualizar la validación.');
    } finally {
      setAccionesEnCurso((prev) => ({ ...prev, [asesor.idAsesor]: false }));
    }
  };

  const handleBaja = async () => {
    const asesor = modalBaja.asesor;
    if (!asesor) return;

    setAccionesEnCurso((prev) => ({ ...prev, [asesor.idAsesor]: true }));
    setError('');
    setExito('');
    try {
      await asesoresApi.darDeBaja(asesor.idAsesor);
      setAsesores((prev) =>
        prev.map((a) =>
          a.idAsesor === asesor.idAsesor ? { ...a, activo: false } : a
        )
      );
      setExito(`${asesor.nombreAlumno} ha sido dado de baja.`);
    } catch (err) {
      setError(err.mensaje || 'No se pudo dar de baja al asesor.');
    } finally {
      setAccionesEnCurso((prev) => ({ ...prev, [asesor.idAsesor]: false }));
      setModalBaja({ show: false, asesor: null });
    }
  };

  const asesoresFiltrados = useMemo(() => {
    return asesores.filter((a) => {
      if (filtro === 'pendientes' && (a.validado || !a.activo)) return false;
      if (filtro === 'validados' && (!a.validado || !a.activo)) return false;
      if (filtro === 'inactivos' && a.activo) return false;

      if (busqueda) {
        const q = busqueda.toLowerCase();
        return (
          a.nombreAlumno?.toLowerCase().includes(q) ||
          a.matricula?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [asesores, filtro, busqueda]);

  const pendientes = asesores.filter((a) => !a.validado && a.activo).length;

  return (
    <>
      <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-2">
        <div>
          <h2 className="fw-bold text-azul mb-1">Gestión de asesores</h2>
          <p className="text-suave mb-0">
            Valida, revoca o da de baja a los asesores pares.
          </p>
        </div>
        <Button variant="outline-secondary" size="sm" onClick={cargarAsesores}>
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

      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <div className="d-flex gap-3 flex-wrap align-items-center">
            <ButtonGroup size="sm">
              <Button
                variant={filtro === 'todos' ? 'primary' : 'outline-primary'}
                onClick={() => setFiltro('todos')}
              >
                Todos ({asesores.length})
              </Button>
              <Button
                variant={filtro === 'pendientes' ? 'warning' : 'outline-warning'}
                onClick={() => setFiltro('pendientes')}
              >
                Pendientes ({pendientes})
              </Button>
              <Button
                variant={filtro === 'validados' ? 'success' : 'outline-success'}
                onClick={() => setFiltro('validados')}
              >
                Validados
              </Button>
              <Button
                variant={filtro === 'inactivos' ? 'danger' : 'outline-danger'}
                onClick={() => setFiltro('inactivos')}
              >
                Inactivos
              </Button>
            </ButtonGroup>

            <Form.Control
              type="search"
              placeholder="Buscar por nombre o matrícula..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              style={{ maxWidth: '300px' }}
              size="sm"
            />
          </div>
        </Card.Body>
      </Card>

      {cargando ? (
        <LoadingSpinner mensaje="Cargando asesores..." />
      ) : asesoresFiltrados.length === 0 ? (
        <Alert variant="info" className="text-center">
          <div style={{ fontSize: '2.5rem', color: 'var(--azul-primario)' }}>
            <i className="bi bi-inbox"></i>
          </div>
          <h5 className="fw-bold text-azul mb-1">Sin resultados</h5>
          <p className="text-suave mb-0 small">
            {asesores.length === 0
              ? 'Aún no hay asesores registrados.'
              : 'No hay asesores que coincidan con los filtros.'}
          </p>
        </Alert>
      ) : (
        <Card className="border-0 shadow-sm">
          <div className="table-responsive">
            <Table hover className="mb-0 align-middle">
              <thead style={{ backgroundColor: 'var(--azul-suave)' }}>
                <tr>
                  <th className="small fw-semibold">Asesor</th>
                  <th className="small fw-semibold">Matrícula</th>
                  <th className="small fw-semibold text-center">Promedio</th>
                  <th className="small fw-semibold text-center">Estado</th>
                  <th className="small fw-semibold text-end">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {asesoresFiltrados.map((a) => {
                  const enCurso = accionesEnCurso[a.idAsesor];
                  return (
                    <tr key={a.idAsesor} style={{ opacity: a.activo ? 1 : 0.5 }}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div
                            className="d-flex align-items-center justify-content-center rounded-circle text-white fw-bold flex-shrink-0"
                            style={{
                              width: '36px',
                              height: '36px',
                              backgroundColor: 'var(--azul-primario)',
                              fontSize: '0.9rem',
                            }}
                          >
                            {a.nombreAlumno?.charAt(0) || '?'}
                          </div>
                          <div className="fw-semibold text-azul small">
                            {a.nombreAlumno}
                          </div>
                        </div>
                      </td>
                      <td className="small">{a.matricula}</td>
                      <td className="text-center">
                        <Badge className="badge-promedio">
                          <i className="bi bi-star-fill"></i> {a.promedio}
                        </Badge>
                      </td>
                      <td className="text-center">
                        {!a.activo ? (
                          <Badge bg="danger">
                            <i className="bi bi-slash-circle me-1"></i>Inactivo
                          </Badge>
                        ) : a.validado ? (
                          <Badge bg="success">
                            <i className="bi bi-check-circle-fill me-1"></i>Validado
                          </Badge>
                        ) : (
                          <Badge bg="warning" text="dark">
                            <i className="bi bi-hourglass-split me-1"></i>Pendiente
                          </Badge>
                        )}
                      </td>
                      <td className="text-end">
                        <div className="d-flex gap-2 justify-content-end">
                          {a.activo && !a.validado && (
                            <Button
                              size="sm"
                              className="btn-azul"
                              onClick={() => handleValidar(a, true)}
                              disabled={enCurso}
                            >
                              {enCurso ? (
                                <>
                                  <Spinner size="sm" animation="border" className="me-1" />
                                  Validando
                                </>
                              ) : (
                                <>
                                  <i className="bi bi-check-circle me-1"></i> Validar
                                </>
                              )}
                            </Button>
                          )}
                          {a.activo && a.validado && (
                            <Button
                              size="sm"
                              variant="outline-warning"
                              onClick={() => handleValidar(a, false)}
                              disabled={enCurso}
                              title="Revocar validación (el usuario vuelve a ser alumno)"
                            >
                              <i className="bi bi-arrow-counterclockwise me-1"></i> Revocar
                            </Button>
                          )}
                          {a.activo && (
                            <Button
                              size="sm"
                              variant="outline-danger"
                              onClick={() => setModalBaja({ show: true, asesor: a })}
                              disabled={enCurso}
                              title="Dar de baja definitivamente"
                            >
                              <i className="bi bi-slash-circle"></i>
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        </Card>
      )}

      <Modal
        show={modalBaja.show}
        onHide={() => setModalBaja({ show: false, asesor: null })}
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold text-danger">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            Confirmar baja de asesor
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            ¿Estás seguro de que quieres dar de baja a{' '}
            <strong>{modalBaja.asesor?.nombreAlumno}</strong>?
          </p>
          <Alert variant="warning" className="small mb-0">
            Esta acción desactivará su perfil. El asesor dejará de aparecer en el
            catálogo y no podrá recibir nuevas solicitudes.
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setModalBaja({ show: false, asesor: null })}
          >
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleBaja}>
            <i className="bi bi-slash-circle me-1"></i> Sí, dar de baja
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default GestionAsesores;