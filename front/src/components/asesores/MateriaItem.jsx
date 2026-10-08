import { Badge } from 'react-bootstrap';
import { NIVEL_INFO } from '../../mocks/asesoresMock';

/**
 * Fila visual para una materia que imparte el asesor.
 */
function MateriaItem({ materia }) {
  const nivel = NIVEL_INFO[materia.nivelDominio] || NIVEL_INFO.intermedio;

  return (
    <div className="d-flex align-items-center justify-content-between p-3 rounded border mb-2 bg-white">
      <div className="d-flex align-items-center gap-3">
        <div
          className="d-flex align-items-center justify-content-center rounded"
          style={{
            width: '40px',
            height: '40px',
            backgroundColor: 'var(--azul-suave)',
            color: 'var(--azul-primario)',
            fontWeight: 'bold',
            fontSize: '0.75rem',
          }}
        >
          {materia.clave?.split('-')[0] || '📚'}
        </div>
        <div>
          <div className="fw-semibold text-azul">{materia.nombre}</div>
          {materia.clave && (
            <div className="text-suave small">Clave: {materia.clave}</div>
          )}
        </div>
      </div>
      <Badge bg={nivel.color} className="fw-normal">
        {nivel.label}
      </Badge>
    </div>
  );
}

export default MateriaItem;