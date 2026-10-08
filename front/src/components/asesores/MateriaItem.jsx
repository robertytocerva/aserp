import { Badge } from 'react-bootstrap';
import { NIVEL_INFO } from '../../mocks/asesoresMock';

function MateriaItem({ materia }) {
  const nivel = NIVEL_INFO[materia.nivelDominio] || NIVEL_INFO.intermedio;

  // Soporta ambos formatos
  const nombre = materia.nombre || materia.nombreMateria || 'Materia';
  const clave = materia.clave || materia.claveMateria || '';

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
          {clave?.split('-')[0] || '📚'}
        </div>
        <div>
          <div className="fw-semibold text-azul">{nombre}</div>
          {clave && <div className="text-suave small">Clave: {clave}</div>}
        </div>
      </div>
      <Badge bg={nivel.color} className="fw-normal">
        {nivel.label}
      </Badge>
    </div>
  );
}

export default MateriaItem;