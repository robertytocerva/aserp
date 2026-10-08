import { useState } from 'react';
import { Card, Row, Col, ProgressBar, Table, Badge, Button, Alert } from 'react-bootstrap';
import { reportesMock } from '../../mocks/reportesMock';

function Reportes() {
  const [periodo, setPeriodo] = useState('semestre');
  const r = reportesMock;

  // Cálculo de máximo para barras proporcionales
  const maxAsesoriasMes = Math.max(...r.asesoriasPorMes.map((x) => x.total));
  const maxAsesoriasMateria = Math.max(...r.asesoriasPorMateria.map((x) => x.total));

  return (
    <>
      <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-2">
        <div>
          <h2 className="fw-bold text-azul mb-1">Reportes y estadísticas</h2>
          <p className="text-suave mb-0">
            Consulta el desempeño y uso del programa de asesores pares.
          </p>
        </div>
        <div className="d-flex gap-2">
          <Button variant="outline-primary" size="sm">
            📥 Exportar PDF
          </Button>
          <Button variant="outline-success" size="sm">
            📊 Exportar Excel
          </Button>
        </div>
      </div>

      <Alert variant="warning" className="small">
        <strong>⚠️ Datos de prueba:</strong> Los reportes se generarán con datos
        reales cuando el backend implemente el endpoint correspondiente.
      </Alert>

      {/* ============ RESUMEN ============ */}
      <Row className="g-3 mb-4">
        <Col sm={6} lg={3}>
          <Card className="border-0 shadow-sm text-center h-100">
            <Card.Body>
              <div style={{ fontSize: '2rem' }}>📚</div>
              <div className="display-5 fw-bold text-azul">
                {r.resumen.totalAsesorias}
              </div>
              <div className="text-suave small">Asesorías totales</div>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={6} lg={3}>
          <Card className="border-0 shadow-sm text-center h-100">
            <Card.Body>
              <div style={{ fontSize: '2rem' }}>🎓</div>
              <div className="display-5 fw-bold text-success">
                {r.resumen.totalAsesores}
              </div>
              <div className="text-suave small">Asesores activos</div>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={6} lg={3}>
          <Card className="border-0 shadow-sm text-center h-100">
            <Card.Body>
              <div style={{ fontSize: '2rem' }}>👥</div>
              <div className="display-5 fw-bold text-warning">
                {r.resumen.totalAlumnos}
              </div>
              <div className="text-suave small">Alumnos atendidos</div>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={6} lg={3}>
          <Card className="border-0 shadow-sm text-center h-100">
            <Card.Body>
              <div style={{ fontSize: '2rem' }}>⭐</div>
              <div className="display-5 fw-bold text-azul">
                {r.resumen.promedioCalificacion}
              </div>
              <div className="text-suave small">Satisfacción promedio</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4">
        {/* ============ ASESORÍAS POR MES ============ */}
        <Col lg={7}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <h5 className="fw-bold text-azul mb-3">
                📈 Asesorías por mes
              </h5>
              {r.asesoriasPorMes.map((m) => (
                <div key={m.mes} className="mb-3">
                  <div className="d-flex justify-content-between small mb-1">
                    <span className="fw-semibold">{m.mes}</span>
                    <span className="text-suave">{m.total} asesorías</span>
                  </div>
                  <ProgressBar
                    now={(m.total / maxAsesoriasMes) * 100}
                    style={{ height: '10px' }}
                  />
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>

        {/* ============ ESTADOS ============ */}
        <Col lg={5}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <h5 className="fw-bold text-azul mb-3">
                📊 Distribución por estado
              </h5>
              {r.asesoriasPorEstado.map((e) => {
                const totalEstados = r.asesoriasPorEstado.reduce(
                  (acc, x) => acc + x.total,
                  0
                );
                const pct = ((e.total / totalEstados) * 100).toFixed(0);
                return (
                  <div
                    key={e.estado}
                    className="d-flex justify-content-between align-items-center mb-2 p-2 rounded"
                    style={{ backgroundColor: 'var(--fondo)' }}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <Badge bg={e.color} className="fw-normal">
                        {e.estado}
                      </Badge>
                    </div>
                    <div className="fw-semibold">
                      {e.total}{' '}
                      <span className="text-suave small">({pct}%)</span>
                    </div>
                  </div>
                );
              })}
            </Card.Body>
          </Card>
        </Col>

        {/* ============ TOP ASESORES ============ */}
        <Col lg={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <h5 className="fw-bold text-azul mb-3">
                🏆 Top asesores del semestre
              </h5>
              <Table hover className="mb-0 align-middle">
                <thead>
                  <tr>
                    <th className="small fw-semibold">#</th>
                    <th className="small fw-semibold">Asesor</th>
                    <th className="small fw-semibold text-center">Asesorías</th>
                    <th className="small fw-semibold text-center">⭐</th>
                  </tr>
                </thead>
                <tbody>
                  {r.topAsesores.map((a, i) => (
                    <tr key={i}>
                      <td>
                        <Badge bg={i === 0 ? 'warning' : i === 1 ? 'secondary' : 'light'} text={i < 2 ? 'dark' : 'dark'}>
                          {i + 1}
                        </Badge>
                      </td>
                      <td className="small fw-semibold">{a.nombre}</td>
                      <td className="text-center small">{a.asesorias}</td>
                      <td className="text-center small">{a.calificacion}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        {/* ============ MATERIAS MÁS SOLICITADAS ============ */}
        <Col lg={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <h5 className="fw-bold text-azul mb-3">
                📚 Materias más solicitadas
              </h5>
              {r.asesoriasPorMateria.map((m) => (
                <div key={m.materia} className="mb-3">
                  <div className="d-flex justify-content-between small mb-1">
                    <span>{m.materia}</span>
                    <span className="text-suave">{m.total}</span>
                  </div>
                  <ProgressBar
                    now={(m.total / maxAsesoriasMateria) * 100}
                    variant="warning"
                    style={{ height: '8px' }}
                  />
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default Reportes;