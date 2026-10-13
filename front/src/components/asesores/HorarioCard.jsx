import { Badge } from 'react-bootstrap';
import { DIAS_SEMANA, MODALIDAD_INFO } from '../../mocks/asesoresMock';

function HorarioCard({ horario, onSeleccionar, seleccionado, deshabilitado }) {
  const infoModalidad = MODALIDAD_INFO[horario.modalidad] || MODALIDAD_INFO.presencial;
  const dia = DIAS_SEMANA[horario.diaSemana] || `Día ${horario.diaSemana}`;

  return (
    <div
      className={`p-3 rounded border ${seleccionado ? 'border-primary border-2' : ''} ${
        deshabilitado ? 'opacity-50' : ''
      }`}
      style={{
        backgroundColor: seleccionado ? 'var(--azul-suave)' : 'var(--blanco)',
        cursor: deshabilitado || !onSeleccionar ? 'default' : 'pointer',
        transition: 'all 0.2s',
      }}
      onClick={() => !deshabilitado && onSeleccionar && onSeleccionar(horario)}
    >
      <div className="d-flex justify-content-between align-items-start mb-2">
        <div className="d-flex align-items-center gap-2">
          <i
            className="bi bi-calendar-event"
            style={{ fontSize: '1.2rem', color: 'var(--azul-primario)' }}
          ></i>
          <div>
            <div className="fw-bold text-azul">{dia}</div>
            <div className="text-suave small">
              {horario.horaInicio} - {horario.horaFin}
            </div>
          </div>
        </div>
        <Badge bg={infoModalidad.color} className="fw-normal">
          <i className={`bi ${infoModalidad.icon} me-1`}></i>
          {infoModalidad.label}
        </Badge>
      </div>

      {horario.lugar && (
        <div className="text-suave small d-flex align-items-center gap-1">
          <i className="bi bi-geo-alt-fill"></i>
          <span>{horario.lugar}</span>
        </div>
      )}
    </div>
  );
}

export default HorarioCard;