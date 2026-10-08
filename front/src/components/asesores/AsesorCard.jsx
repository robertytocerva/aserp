import { Link } from 'react-router-dom';
import { Card, Badge } from 'react-bootstrap';

/**
 * Tarjeta individual de un asesor par.
 */
function AsesorCard({ asesor }) {
  const inicial = asesor.nombreAlumno?.charAt(0).toUpperCase() || '?';

  // Generar color de avatar a partir del nombre para variedad
  const coloresAvatar = [
    '#0D47A1', '#1976D2', '#0097A7', '#388E3C',
    '#7B1FA2', '#C2185B', '#D32F2F', '#F57C00',
  ];
  const colorAvatar = coloresAvatar[(asesor.idAsesor || 0) % coloresAvatar.length];

  return (
    <Card className="h-100 card-hover border-0 shadow-sm overflow-hidden">
      <Card.Body className="d-flex flex-column">
        {/* Header: Avatar + nombre */}
        <div className="d-flex align-items-center gap-3 mb-3">
          <div
            className="d-flex align-items-center justify-content-center rounded-circle text-white fw-bold flex-shrink-0"
            style={{
              width: '60px',
              height: '60px',
              backgroundColor: colorAvatar,
              fontSize: '1.5rem',
            }}
          >
            {inicial}
          </div>
          <div className="overflow-hidden">
            <h6 className="fw-bold mb-1 text-azul text-truncate">
              {asesor.nombreAlumno}
            </h6>
            <small className="text-suave d-block text-truncate">
              Matrícula: {asesor.matricula}
            </small>
          </div>
        </div>

        {/* Promedio */}
        <div className="d-flex align-items-center gap-2 mb-3">
          <Badge className="btn-amarillo text-dark">
            ⭐ Promedio {asesor.promedio}
          </Badge>
          {asesor.validado && (
            <Badge bg="success" className="fw-normal">
              ✓ Validado
            </Badge>
          )}
        </div>

        {/* Descripción (si existe) */}
        {asesor.descripcion && (
          <p
            className="text-suave small mb-3"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {asesor.descripcion}
          </p>
        )}

        {/* Materias */}
        {asesor.materias && asesor.materias.length > 0 && (
          <div className="mb-3">
            <small className="fw-semibold text-azul d-block mb-1">
              Materias que imparte:
            </small>
            <div className="d-flex flex-wrap gap-1">
              {asesor.materias.slice(0, 3).map((m) => (
                <Badge
                  key={m.idMateria}
                  bg="light"
                  text="dark"
                  className="fw-normal border"
                  style={{ fontSize: '0.7rem' }}
                >
                  {m.nombre}
                </Badge>
              ))}
              {asesor.materias.length > 3 && (
                <Badge bg="light" text="dark" className="fw-normal border" style={{ fontSize: '0.7rem' }}>
                  +{asesor.materias.length - 3} más
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Botón */}
        <div className="mt-auto">
          <Link
            to={`/asesores/${asesor.idAsesor}`}
            className="btn btn-azul w-100 fw-semibold"
          >
            Ver perfil completo
          </Link>
        </div>
      </Card.Body>
    </Card>
  );
}

export default AsesorCard;