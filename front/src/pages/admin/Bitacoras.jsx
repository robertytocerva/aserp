import { Card, Alert } from 'react-bootstrap';

function Bitacoras() {
  return (
    <>
      <div className="mb-4">
        <h2 className="fw-bold text-azul mb-1">Bitácoras de desempeño</h2>
        <p className="text-suave mb-0">
          Registra y consulta el seguimiento académico de las asesorías.
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
            <i className="bi bi-journal-text"></i>
          </div>
          <h4 className="fw-bold text-azul mb-2">Sección en construcción</h4>
          <p
            className="text-suave mb-4"
            style={{ maxWidth: '600px', margin: '0 auto' }}
          >
            El sistema de bitácoras digitales permitirá a los asesores registrar
            el detalle y avance de cada sesión en tiempo real. Esta pantalla se
            habilitará cuando el backend implemente los endpoints correspondientes.
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
              <strong>Endpoints requeridos:</strong>
            </p>
            <code
              className="d-block small p-2 rounded mb-2"
              style={{ backgroundColor: 'var(--fondo)' }}
            >
              GET /api/admin/bitacoras
            </code>
            <code
              className="d-block small p-2 rounded"
              style={{ backgroundColor: 'var(--fondo)' }}
            >
              POST /api/admin/bitacoras
            </code>
            <p className="small mt-2 mb-0">
              <strong>Headers:</strong> Authorization: Bearer &lt;token-admin&gt;
              <br />
              <strong>Campos esperados:</strong> idBitacora, asesor, alumno, materia,
              fecha, temasTratados, tareasAsignadas, observaciones,
              calificacionAlumno, comentarioAlumno.
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

      {/* Cards informativos */}
      <div className="row g-3 mt-4">
        <div className="col-md-6">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <h6 className="fw-bold text-azul mb-3">
                <i className="bi bi-bullseye me-2"></i>
                ¿Qué es una bitácora?
              </h6>
              <p className="small text-suave mb-0">
                Es un registro detallado de cada asesoría donde el asesor documenta
                los temas tratados, las tareas asignadas y las observaciones sobre
                el desempeño del alumno.
              </p>
            </Card.Body>
          </Card>
        </div>

        <div className="col-md-6">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <h6 className="fw-bold text-azul mb-3">
                <i className="bi bi-lightbulb-fill me-2"></i>
                Beneficios esperados
              </h6>
              <ul className="small text-suave mb-0 ps-3">
                <li className="mb-1">Seguimiento académico individualizado.</li>
                <li className="mb-1">Detección temprana de dificultades.</li>
                <li className="mb-1">Reportes automatizados por semestre.</li>
                <li>Base de datos para toma de decisiones.</li>
              </ul>
            </Card.Body>
          </Card>
        </div>
      </div>
    </>
  );
}

export default Bitacoras;