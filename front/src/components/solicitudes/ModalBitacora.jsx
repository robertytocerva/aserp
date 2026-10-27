import { useState } from 'react';
import {
  Modal,
  Form,
  Button,
  Alert,
  Spinner,
} from 'react-bootstrap';
import { bitacorasApi } from '../../api/bitacorasApi';

function ModalBitacora({ show, onHide, solicitud, onSuccess }) {
  const [form, setForm] = useState({
    temaTratado: '',
    tareasAsignadas: '',
    observaciones: '',
  });
  const [imagen, setImagen] = useState(null);
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const onImagenChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setImagen(null);
      return;
    }

    // Validar tipo
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setError('La imagen debe ser JPG o PNG.');
      e.target.value = '';
      return;
    }

    // Validar tamaño (2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('La imagen no debe exceder 2MB.');
      e.target.value = '';
      return;
    }

    setImagen(file);
    setError('');
  };

  const handleHide = () => {
    if (enviando) return;
    setForm({ temaTratado: '', tareasAsignadas: '', observaciones: '' });
    setImagen(null);
    setError('');
    onHide();
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.temaTratado.trim()) {
      setError('El tema tratado es obligatorio.');
      return;
    }

    setEnviando(true);
    try {
      await bitacorasApi.crear({
        idAsesoria: solicitud.idAsesoria,
        temaTratado: form.temaTratado.trim(),
        tareasAsignadas: form.tareasAsignadas.trim() || null,
        observaciones: form.observaciones.trim() || null,
        imagen,
      });
      onSuccess();
      handleHide();
    } catch (err) {
      if (err.tipo === 'validacion') {
        setError(Object.values(err.errores)[0] || 'Revisa los datos.');
      } else {
        setError(err.mensaje || 'No se pudo guardar la bitácora.');
      }
    } finally {
      setEnviando(false);
    }
  };

  if (!solicitud) return null;

  return (
    <Modal
      show={show}
      onHide={handleHide}
      size="lg"
      centered
      backdrop={enviando ? 'static' : true}
    >
      <Modal.Header closeButton={!enviando}>
        <Modal.Title className="fw-bold text-azul">
          <i className="bi bi-journal-plus me-2"></i>
          Generar bitácora
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={onSubmit}>
        <Modal.Body>
          {error && (
            <Alert variant="danger" className="py-2 small">
              {error}
            </Alert>
          )}

          {/* Resumen de la sesión */}
          <div
            className="p-3 rounded mb-3"
            style={{ backgroundColor: 'var(--azul-suave)' }}
          >
            <h6 className="fw-bold text-azul mb-2">Sesión completada</h6>
            <div className="small">
              <div className="mb-1">
                <strong>Alumno:</strong> {solicitud.nombreAlumno}
              </div>
              <div className="mb-1">
                <strong>Materia:</strong> {solicitud.nombreMateria}
              </div>
              <div className="mb-1">
                <strong>Fecha:</strong> {solicitud.fecha} ·{' '}
                {solicitud.horaInicio} - {solicitud.horaFin}
              </div>
            </div>
          </div>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold small">
              Tema tratado *
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="temaTratado"
              value={form.temaTratado}
              onChange={onChange}
              placeholder="Ej: Estructuras de datos: listas enlazadas y pilas"
              maxLength={500}
              required
            />
            <Form.Text className="text-suave">
              Describe brevemente los temas que se cubrieron.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold small">
              Tareas asignadas (opcional)
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="tareasAsignadas"
              value={form.tareasAsignadas}
              onChange={onChange}
              placeholder="Ej: Resolver ejercicios 1 a 5 del capítulo 3"
              maxLength={500}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold small">
              Observaciones (opcional)
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="observaciones"
              value={form.observaciones}
              onChange={onChange}
              placeholder="Ej: Buen avance, falta practicar recursión."
              maxLength={500}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label className="fw-semibold small">
              Imagen de evidencia (opcional)
            </Form.Label>
            <Form.Control
              type="file"
              accept=".jpg,.jpeg,.png,image/jpeg,image/png"
              onChange={onImagenChange}
            />
            <Form.Text className="text-suave">
              JPG o PNG · máximo 2 MB.
            </Form.Text>
            {imagen && (
              <div className="mt-2 small text-success">
                <i className="bi bi-check-circle-fill me-1"></i>
                {imagen.name} ({(imagen.size / 1024).toFixed(1)} KB)
              </div>
            )}
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleHide} disabled={enviando}>
            Cancelar
          </Button>
          <Button type="submit" className="btn-azul" disabled={enviando}>
            {enviando ? (
              <>
                <Spinner size="sm" animation="border" className="me-2" />
                Guardando y enviando correos...
              </>
            ) : (
              <>
                <i className="bi bi-save me-1"></i> Guardar bitácora
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default ModalBitacora;