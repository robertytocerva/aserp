import { useState } from 'react';
import {
  Modal,
  Form,
  Button,
  Alert,
  Spinner,
  ListGroup,
} from 'react-bootstrap';
import { solicitudesApi } from '../../api/solicitudesApi';

function ModalSolicitar({ show, onHide, slot, asesor, onSuccess }) {
  const [idMateria, setIdMateria] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const materias = asesor?.materias || [];

  const handleHide = () => {
    if (enviando) return;
    setIdMateria('');
    setError('');
    onHide();
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!idMateria) {
      setError('Selecciona la materia para tu asesoría.');
      return;
    }

    setEnviando(true);
    try {
      await solicitudesApi.crear({
        idHorario: slot.idHorario,
        fecha: slot.fecha,
        idMateria: Number(idMateria),
      });
      onSuccess();
    } catch (err) {
      if (err.tipo === 'validacion') {
        setError(Object.values(err.errores)[0] || 'Revisa los datos.');
      } else {
        setError(err.mensaje || 'No se pudo enviar la solicitud.');
      }
    } finally {
      setEnviando(false);
    }
  };

  if (!slot) return null;

  const [year, month, day] = slot.fecha.split('-').map(Number);
  const fecha = new Date(year, month - 1, day);
  const fechaLarga = fecha.toLocaleDateString('es-MX', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <Modal show={show} onHide={handleHide} centered backdrop={enviando ? 'static' : true}>
      <Modal.Header closeButton={!enviando}>
        <Modal.Title className="fw-bold text-azul">
          <i className="bi bi-pencil-square me-2"></i>
          Solicitar asesoría
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={onSubmit}>
        <Modal.Body>
          {error && (
            <Alert variant="danger" className="py-2 small">
              {error}
            </Alert>
          )}

          <div
            className="p-3 rounded mb-3"
            style={{ backgroundColor: 'var(--azul-suave)' }}
          >
            <h6 className="fw-bold text-azul mb-2">Detalles de la asesoría</h6>
            <ListGroup variant="flush" className="bg-transparent">
              <ListGroup.Item className="bg-transparent border-0 px-0 py-1 small">
                <strong>Asesor:</strong> {asesor?.nombreAlumno}
              </ListGroup.Item>
              <ListGroup.Item className="bg-transparent border-0 px-0 py-1 small">
                <strong>Fecha:</strong> {fechaLarga}
              </ListGroup.Item>
              <ListGroup.Item className="bg-transparent border-0 px-0 py-1 small">
                <strong>Hora:</strong> {slot.horaInicio} - {slot.horaFin}
              </ListGroup.Item>
              <ListGroup.Item className="bg-transparent border-0 px-0 py-1 small">
                <strong>Modalidad:</strong>{' '}
                {slot.modalidad.charAt(0).toUpperCase() + slot.modalidad.slice(1)}
              </ListGroup.Item>
              {slot.lugar && (
                <ListGroup.Item className="bg-transparent border-0 px-0 py-1 small">
                  <strong>Lugar:</strong> {slot.lugar}
                </ListGroup.Item>
              )}
            </ListGroup>
          </div>

          <Form.Group>
            <Form.Label className="fw-semibold small">
              Materia de la asesoría *
            </Form.Label>
            {materias.length > 0 ? (
              <Form.Select
                value={idMateria}
                onChange={(e) => setIdMateria(e.target.value)}
                required
              >
                <option value="">-- Selecciona una materia --</option>
                {materias.map((m) => (
                  <option key={m.idMateria} value={m.idMateria}>
                    {m.nombre || m.nombreMateria}
                  </option>
                ))}
              </Form.Select>
            ) : (
              <Alert variant="warning" className="small py-2 mb-0">
                Este asesor no tiene materias asignadas. Contacta al administrador.
              </Alert>
            )}
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleHide} disabled={enviando}>
            Cancelar
          </Button>
          <Button
            type="submit"
            className="btn-amarillo fw-semibold"
            disabled={enviando || materias.length === 0}
          >
            {enviando ? (
              <>
                <Spinner size="sm" animation="border" className="me-2" />
                Enviando...
              </>
            ) : (
              'Confirmar solicitud'
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default ModalSolicitar;