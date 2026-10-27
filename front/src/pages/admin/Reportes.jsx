import { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  ProgressBar,
  Table,
  Badge,
  Button,
  Alert,
  Form,
  Spinner,
} from 'react-bootstrap';
import { estadisticasApi } from '../../api/estadisticasApi';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

function Reportes() {
  const [stats, setStats] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [periodo, setPeriodo] = useState({ desde: '', hasta: '' });
  const [descargando, setDescargando] = useState(false);

  // ============ CARGA INICIAL ============
  const cargar = async (desde = null, hasta = null) => {
    setCargando(true);
    setError('');
    try {
      const data = await estadisticasApi.obtener(desde, hasta);
      setStats(data);
    } catch (err) {
      setError(err.mensaje || 'No se pudieron cargar las estadísticas.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  // ============ FILTRAR POR PERIODO ============
  const aplicarFiltro = () => {
    cargar(periodo.desde || null, periodo.hasta || null);
  };

  const limpiarFiltro = () => {
    setPeriodo({ desde: '', hasta: '' });
    cargar();
  };

  // ============ DESCARGAR PDF ============
  const descargarPdf = async () => {
    setDescargando(true);
    try {
      const blob = await estadisticasApi.descargarPdf(
        periodo.desde || null,
        periodo.hasta || null
      );
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `estadisticas-${periodo.desde || 'semestre'}-${periodo.hasta || 'actual'}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.mensaje || 'No se pudo descargar el PDF.');
    } finally {
      setDescargando(false);
    }
  };

  // ============ RENDER ============
  if (cargando && !stats) {
    return (
      <div className="py-4">
        <LoadingSpinner mensaje="Cargando estadísticas..." />
      </div>
    );
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-2">
        <div>
          <h2 className="fw-bold text-azul mb-1">Reportes y estadísticas</h2>
          <p className="text-suave mb-0">
            Consulta el desempeño y uso del programa de asesores pares.
          </p>
        </div>
        <Button
          variant="outline-success"
          size="sm"
          onClick={descargarPdf}
          disabled={descargando}
        >
          {descargando ? (
            <>
              <Spinner size="sm" animation="border" className="me-1" />
              Generando...
            </>
          ) : (
            <>
              <i className="bi bi-download me-1"></i> Descargar PDF
            </>
          )}
        </Button>
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Filtro de periodo */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <Row className="g-2 align-items-end">
            <Col md={4}>
              <Form.Label className="small fw-semibold">Desde</Form.Label>
              <Form.Control
                type="date"
                value={periodo.desde}
                onChange={(e) => setPeriodo({ ...periodo, desde: e.target.value })}
                size="sm"
              />
            </Col>
            <Col md={4}>
              <Form.Label className="small fw-semibold">Hasta</Form.Label>
              <Form.Control
                type="date"
                value={periodo.hasta}
                onChange={(e) => setPeriodo({ ...periodo, hasta: e.target.value })}
                size="sm"
              />
            </Col>
            <Col md={4}>
              <div className="d-flex gap-2">
                <Button size="sm" className="btn-azul" onClick={aplicarFiltro}>
                  <i className="bi bi-funnel me-1"></i> Aplicar
                </Button>
                <Button
                  size="sm"
                  variant="outline-secondary"
                  onClick={limpiarFiltro}
                >
                  Limpiar
                </Button>
              </div>
            </Col>
          </Row>
          {stats?.periodo && (
            <div className="mt-2 text-suave small">
              <i className="bi bi-info-circle me-1"></i>
              Periodo actual:{' '}
              <strong>
                {stats.periodo.desde} → {stats.periodo.hasta}
              </strong>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Resumen general */}
      {stats?.resumen && (
        <>
          <Row className="g-3 mb-4">
            <Col sm={6} lg={3}>
              <Card className="border-0 shadow-sm text-center h-100">
                <Card.Body>
                  <div className="text-suave small fw-semibold mb-1">
                    RECIBIDAS
                  </div>
                  <div className="display-6 fw-bold text-azul">
                    {stats.resumen.recibidas}
                  </div>
                  <div className="small text-suave">
                    {stats.resumen.completadas} completadas
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col sm={6} lg={3}>
              <Card className="border-0 shadow-sm text-center h-100">
                <Card.Body>
                  <div className="text-suave small fw-semibold mb-1">
                    TASA ACEPTACIÓN
                  </div>
                  <div className="display-6 fw-bold text-success">
                    {stats.resumen.tasaAceptacion}%
                  </div>
                  <div className="small text-suave">
                    {stats.resumen.rechazadas} rechazadas
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col sm={6} lg={3}>
              <Card className="border-0 shadow-sm text-center h-100">
                <Card.Body>
                  <div className="text-suave small fw-semibold mb-1">
                    TASA CUMPLIMIENTO
                  </div>
                  <div className="display-6 fw-bold text-warning">
                    {stats.resumen.tasaCumplimiento}%
                  </div>
                  <div className="small text-suave">
                    {stats.resumen.completadas} completadas
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col sm={6} lg={3}>
              <Card className="border-0 shadow-sm text-center h-100">
                <Card.Body>
                  <div className="text-suave small fw-semibold mb-1">
                    HORAS TOTALES
                  </div>
                  <div className="display-6 fw-bold text-azul">
                    {stats.resumen.horasTotales}
                  </div>
                  <div className="small text-suave">
                    {stats.resumen.alumnosAtendidos} alumnos atendidos
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="g-3 mb-4">
            <Col sm={6} lg={4}>
              <Card className="border-0 shadow-sm text-center h-100">
                <Card.Body>
                  <div className="text-suave small fw-semibold mb-1">
                    PENDIENTES
                  </div>
                  <div className="display-6 fw-bold text-warning">
                    {stats.resumen.pendientes}
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col sm={6} lg={4}>
              <Card className="border-0 shadow-sm text-center h-100">
                <Card.Body>
                  <div className="text-suave small fw-semibold mb-1">
                    ASESORES CON ACTIVIDAD
                  </div>
                  <div className="display-6 fw-bold text-success">
                    {stats.resumen.asesoresConActividad} / {stats.resumen.asesoresTotales}
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col sm={6} lg={4}>
              <Card className="border-0 shadow-sm text-center h-100">
                <Card.Body>
                  <div className="text-suave small fw-semibold mb-1">
                    CANCELADAS / NO ASISTIÓ
                  </div>
                  <div className="display-6 fw-bold text-secondary">
                    {stats.resumen.canceladas} / {stats.resumen.noAsistio}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}

      {/* Desempeño por asesor */}
      {stats?.porAsesor && stats.porAsesor.length > 0 && (
        <Card className="border-0 shadow-sm mb-4">
          <Card.Body>
            <h5 className="fw-bold text-azul mb-3">
              <i className="bi bi-trophy-fill me-2"></i>
              Desempeño por asesor
            </h5>
            <div className="table-responsive">
              <Table hover className="mb-0 align-middle">
                <thead style={{ backgroundColor: 'var(--azul-suave)' }}>
                  <tr>
                    <th className="small fw-semibold">Asesor</th>
                    <th className="small fw-semibold text-center">Materias</th>
                    <th className="small fw-semibold text-center">Recibidas</th>
                    <th className="small fw-semibold text-center">Completadas</th>
                    <th className="small fw-semibold text-center">Horas</th>
                    <th className="small fw-semibold text-center">Tasa Acept.</th>
                    <th className="small fw-semibold text-center">Tasa Cumpl.</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.porAsesor.map((a) => (
                    <tr key={a.idAsesor}>
                      <td className="small">
                        <div className="fw-semibold text-azul">{a.nombre}</div>
                        <div className="text-suave" style={{ fontSize: '0.75rem' }}>
                          {a.matricula}
                        </div>
                      </td>
                      <td className="text-center small">{a.materias}</td>
                      <td className="text-center small">{a.recibidas}</td>
                      <td className="text-center small">
                        <Badge bg="success">{a.completadas}</Badge>
                      </td>
                      <td className="text-center small">{a.horasCompletadas}</td>
                      <td className="text-center small">{a.tasaAceptacion}%</td>
                      <td className="text-center small">
                        <Badge
                          bg={
                            a.tasaCumplimiento >= 70
                              ? 'success'
                              : a.tasaCumplimiento >= 40
                              ? 'warning'
                              : 'danger'
                          }
                          text={a.tasaCumplimiento < 70 && a.tasaCumplimiento >= 40 ? 'dark' : 'white'}
                        >
                          {a.tasaCumplimiento}%
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      )}

      {/* Por materia */}
      {stats?.porMateria && stats.porMateria.length > 0 && (
        <Card className="border-0 shadow-sm">
          <Card.Body>
            <h5 className="fw-bold text-azul mb-3">
              <i className="bi bi-book-fill me-2"></i>
              Solicitudes por materia
            </h5>
            {(() => {
              const maxTotal = Math.max(...stats.porMateria.map((m) => m.total));
              return stats.porMateria.map((m, i) => (
                <div key={i} className="mb-3">
                  <div className="d-flex justify-content-between small mb-1">
                    <span className="fw-semibold">{m.materia}</span>
                    <span className="text-suave">
                      {m.total} solicitudes
                      {m.completadas > 0 && ` · ${m.completadas} completadas`}
                    </span>
                  </div>
                  <ProgressBar
                    now={(m.total / maxTotal) * 100}
                    variant="warning"
                    style={{ height: '10px' }}
                  />
                </div>
              ));
            })()}
          </Card.Body>
        </Card>
      )}
    </>
  );
}

export default Reportes;