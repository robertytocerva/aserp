import { Spinner } from 'react-bootstrap';

function LoadingSpinner({ mensaje = 'Cargando...', tamaño = 'md' }) {
  const dimension = tamaño === 'sm' ? '1.5rem' : '3rem';

  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5">
      <Spinner
        animation="border"
        role="status"
        style={{
          width: dimension,
          height: dimension,
          color: 'var(--azul-primario)',
        }}
      >
        <span className="visually-hidden">Cargando...</span>
      </Spinner>
      {mensaje && (
        <p className="text-suave mt-3 mb-0 small">{mensaje}</p>
      )}
    </div>
  );
}

export default LoadingSpinner;