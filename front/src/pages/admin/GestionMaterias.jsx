import { Card } from 'react-bootstrap';

function GestionMaterias() {
  return (
    <>
      <h2 className="fw-bold text-azul mb-1">Materias y carreras</h2>
      <p className="text-suave mb-4">
        Gestiona el catálogo académico del programa.
      </p>
      <Card className="border-0 shadow-sm p-5 text-center">
        <div style={{ fontSize: '3rem' }}>🚧</div>
        <h5 className="fw-bold text-azul">Sección en construcción</h5>
        <p className="text-suave mb-0">
          Esta pantalla se implementará en la fase de gestión de materias (HU-24).
        </p>
      </Card>
    </>
  );
}

export default GestionMaterias;