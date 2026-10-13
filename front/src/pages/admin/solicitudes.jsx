import { Card, Alert, Container } from 'react-bootstrap';

function Solicitudes() {
  return (
    <>
      <div className="mb-4">
        <h2 className="fw-bold text-azul mb-1">Solicitudes de asesoría</h2>
        <p className="text-suave mb-0">
          Supervisa todas las solicitudes realizadas en la plataforma.
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
            <i className="bi bi-tools"></i>
          </div>
          <h4 className="fw-bold text-azul mb-2">Sección en construcción</h4>
          <p
            className="text-suave mb-4"
            style={{ maxWidth: '600px', margin: '0 auto' }}
          >
            El endpoint administrativo para listar todas las solicitudes aún no
            está disponible en el backend. Esta pantalla se conectará
            automáticamente cuando el endpoint esté implementado.
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
              GET /api/admin/solicitudes
            </code>
            <p className="small mt-2 mb-0">
              <strong>Headers:</strong> Authorization: Bearer &lt;token-admin&gt;
              <br />
              <strong>Campos esperados:</strong> idAsesoria, nombreAsesor,
              nombreAlumno, nombreMateria, fecha, horaInicio, horaFin, modalidad,
              lugar, estado.
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

      {/* Secciones informativas alternas */}
      <div className="row g-3 mt-4">
        <div className="col-md-6">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <h6 className="fw-bold text-azul mb-3">
                <i className="bi bi-check-circle-fill me-2"></i>
                Lo que SÍ puedes hacer ahora
              </h6>
              <ul className="small text-suave mb-0 ps-3">
                <li className="mb-2">
                  Ver las solicitudes en{' '}
                  <a href="/mis-solicitudes" className="text-azul">
                    Mis solicitudes
                  </a>{' '}
                  (como alumno).
                </li>
                <li className="mb-2">
                  Ver solicitudes recibidas en{' '}
                  <a href="/solicitudes-recibidas" className="text-azul">
                    Solicitudes recibidas
                  </a>{' '}
                  (como asesor).
                </li>
                <li className="mb-2">
                  Gestionar asesores en{' '}
                  <a href="/admin/asesores" className="text-azul">
                    Gestión de asesores
                  </a>
                  .
                </li>
              </ul>
            </Card.Body>
          </Card>
        </div>

        <div className="col-md-6">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <h6 className="fw-bold text-azul mb-3">
                <i className="bi bi-lightbulb-fill me-2"></i>
                Próximamente
              </h6>
              <ul className="small text-suave mb-0 ps-3">
                <li className="mb-2">Vista global de todas las solicitudes.</li>
                <li className="mb-2">Filtros por estado, asesor, alumno o materia.</li>
                <li className="mb-2">Exportación a CSV y PDF.</li>
                <li className="mb-2">Estadísticas de uso y desempeño.</li>
              </ul>
            </Card.Body>
          </Card>
        </div>
      </div>
    </>
  );
}

export default Solicitudes;