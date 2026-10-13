import { Button } from 'react-bootstrap';

const DIAS_CORTOS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MESES_CORTOS = [
  'ene', 'feb', 'mar', 'abr', 'may', 'jun',
  'jul', 'ago', 'sep', 'oct', 'nov', 'dic',
];

function SlotDisponible({ slot, onSeleccionar, deshabilitado }) {
  const [year, month, day] = slot.fecha.split('-').map(Number);
  const fecha = new Date(year, month - 1, day);
  const diaCorto = DIAS_CORTOS[fecha.getDay()];
  const diaNum = fecha.getDate();
  const mes = MESES_CORTOS[fecha.getMonth()];

  // Icono de modalidad
  const iconoModalidad =
    slot.modalidad === 'virtual'
      ? 'bi-laptop'
      : slot.modalidad === 'hibrida'
      ? 'bi-arrow-repeat'
      : 'bi-building';

  const labelModalidad =
    slot.modalidad === 'virtual'
      ? 'Virtual'
      : slot.modalidad === 'hibrida'
      ? 'Híbrida'
      : 'Presencial';

  return (
    <div
      className="p-3 rounded border h-100 d-flex flex-column"
      style={{ backgroundColor: 'var(--blanco)', transition: 'all 0.2s' }}
    >
      <div className="d-flex align-items-center gap-3 mb-2">
        <div
          className="text-center flex-shrink-0"
          style={{
            width: '52px',
            padding: '4px 0',
            backgroundColor: 'var(--azul-primario)',
            color: 'white',
            borderRadius: '8px',
          }}
        >
          <div className="small" style={{ fontSize: '0.7rem' }}>
            {diaCorto}
          </div>
          <div className="fw-bold" style={{ fontSize: '1.2rem', lineHeight: 1 }}>
            {diaNum}
          </div>
          <div className="small" style={{ fontSize: '0.7rem' }}>
            {mes}
          </div>
        </div>
        <div className="flex-grow-1">
          <div className="fw-bold text-azul">
            {slot.horaInicio} - {slot.horaFin}
          </div>
          <div className="small text-suave">
            <i className={`bi ${iconoModalidad} me-1`}></i>
            {labelModalidad}
          </div>
        </div>
      </div>

      {slot.lugar && (
        <div className="small text-suave mb-2 d-flex align-items-start gap-1">
          <i className="bi bi-geo-alt-fill"></i>
          <span>{slot.lugar}</span>
        </div>
      )}

      <div className="mt-auto">
        <Button
          size="sm"
          className="btn-amarillo w-100 fw-semibold"
          onClick={() => onSeleccionar(slot)}
          disabled={deshabilitado}
        >
          Solicitar
        </Button>
      </div>
    </div>
  );
}

export default SlotDisponible;