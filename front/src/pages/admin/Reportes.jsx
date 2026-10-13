import { Card, Alert } from 'react-bootstrap';

function Reportes() {
  return (
    <>
      <div className="mb-4">
        <h2 className="fw-bold text-azul mb-1">Reportes y estadísticas</h2>
        <p className="text-suave mb-0">
          Consulta el desempeño y uso del programa de asesores pares.
        </p>
      </div>

      <Card className="border-0 shadow-sm">
        <Card.Body className="text-center py-5">
          <div
            className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
            style={{
              width: '90px',
              height: '90px',
              backgroundColor: 'var(--azul-suave)',
              color: 'var(--azul-primario)',
              fontSize: '2.5rem',
            }}
          >
            <i className="bi bi-graph-up-arrow"></i>
          </div>
          <h4 className="fw-bold text-azul mb-2">Sección en construcción</h4>
          <p
            className="text-suave mb-4"
            style={{ maxWidth: '600px', margin: '0 auto' }}
          >
            Los reportes estadísticos del programa se generarán automáticamente a
            partir de los datos de asesorías, bitácoras y participación de los
            asesores. Esta pantalla se habilitará cuando el backend implemente el
            endpoint correspondiente.
          </p>

          <Alert
            variant="info"
            className="text-start mx-auto"
            style={{ maxWidth: '600px' }}
          >
            <div className="fw-bold mb-2">
              <i className="bi bi-info-circle-fill me-2"></i>
              Información para el equipo
            </div>
            <p className="small mb-2">
              <strong>Endpoint requerido:</strong>
            </p>
            <code
              className="d-block small p-2 rounded"
              style={{ backgroundColor: 'var(--fondo)' }}
            >
              GET /api/admin/reportes
            </code>
            <p className="small mt-2 mb-0">
              <strong>Headers:</strong> Authorization: Bearer &lt;token-admin&gt;
              <br />
              <strong>Datos esperados:</strong> totalAsesorias, totalAsesores,
              totalAlumnos, promedioCalificacion, asesoriasPorMes,
              asesoriasPorMateria, asesoriasPorEstado, topAsesores.
            </p>
          </Alert>

          <div className="mt-4">
            <a
              href="https://github.com/robertytocerva/aserp/blob/main/back/docEndpoit.md"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline-primary"
            >
              <i className="bi bi-file-text me-1"></i>
              Ver documentación de endpoints
            </a>
          </div>
        </Card.Body>
      </Card>

      {/* Cards con vistas previstas */}
      <div className="row g-3 mt-4">
        <div className="col-md-4">
          <Card className="border-0 shadow-sm h-100 text-center">
            <Card.Body>
              <div
                className="d-inline-flex align-items-center justify-content-center rounded-circle mb-2"
                style={{
                  width: '60px',
                  height: '60px',
                  backgroundColor: 'var(--azul-suave)',
                  color: 'var(--azul-primario)',
                  fontSize: '1.5rem',
                }}
              >
                <i className="bi bi-book-fill"></i>
              </div>
              <h6 className="fw-bold text-azul">Por materia</h6>
              <p className="text-suave small mb-0">
                Materias con mayor demanda de asesorías.
              </p>
            </Card.Body>
          </Card>
        </div>

        <div className="col-md-4">
          <Card className="border-0 shadow-sm h-100 text-center">
            <Card.Body>
              <div
                className="d-inline-flex align-items-center justify-content-center rounded-circle mb-2"
                style={{
                  width: '60px',
                  height: '60px',
                  backgroundColor: 'var(--azul-suave)',
                  color: 'var(--azul-primario)',
                  fontSize: '1.5rem',
                }}
              >
                <i className="bi bi-calendar-event-fill"></i>
              </div>
              <h6 className="fw-bold text-azul">Por periodo</h6>
              <p className="text-suave small mb-0">
                Tendencia de asesorías mes a mes.
              </p>
            </Card.Body>
          </Card>
        </div>

        <div className="col-md-4">
          <Card className="border-0 shadow-sm h-100 text-center">
            <Card.Body>
              <div
                className="d-inline-flex align-items-center justify-content-center rounded-circle mb-2"
                style={{
                  width: '60px',
                  height: '60px',
                  backgroundColor: 'var(--azul-suave)',
                  color: 'var(--azul-primario)',
                  fontSize: '1.5rem',
                }}
              >
                <i className="bi bi-trophy-fill"></i>
              </div>
              <h6 className="fw-bold text-azul">Top asesores</h6>
              <p className="text-suave small mb-0">
                Ranking por asesorías y calificación.
              </p>
            </Card.Body>
          </Card>
        </div>
      </div>
    </>
  );
}

export default Reportes;