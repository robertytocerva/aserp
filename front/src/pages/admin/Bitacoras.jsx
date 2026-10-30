import { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Badge,
  Button,
  Form,
  Row,
  Col,
  Alert,
  Spinner,
} from 'react-bootstrap';
import { bitacorasApi } from '../../api/bitacorasApi';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

function Bitacoras() {
  const [bitacoras, setBitacoras] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [descargando, setDescargando] = useState({});

  const cargar = async () => {
    setCargando(true);
    setError('');
    try {
      const data = await bitacorasApi.listarTodasAdmin();
      setBitacoras(data);
    } catch (err) {
      setError(err.mensaje || 'No se pudieron cargar las bitácoras.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const handleDescargarPdf = async (idBitacora) => {
    setDescargando((prev) => ({ ...prev, [idBitacora]: true }));
    try {
      const blob = await bitacorasApi.descargarPdf(idBitacora);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `bitacora-${idBitacora}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      alert('No se pudo descargar el PDF.');
    } finally {
      setDescargando((prev) => ({ ...prev, [idBitacora]: false }));
    }
  };

  const filtradas = bitacoras.filter((b) => {
    if (!busqueda) return true;
    const q = busqueda.toLowerCase();
    return (
      b.nombreAlumno?.toLowerCase().includes(q) ||
      b.nombreAsesor?.toLowerCase().includes(q) ||
      b.nombreMateria?.toLowerCase().includes(q)
    );
  });

  return (
    <>
      <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-2">
        <div>
          <h2 className="fw-bold text-azul mb-1">Bitácoras de desempeño</h2>
          <p className="text-suave mb-0">
            Consulta el seguimiento académico de las asesorías.
          </p>
        </div>
        <Button variant="outline-secondary" size="sm" onClick={cargar}>
          <i className="bi bi-arrow-clockwise me-1"></i> Recargar
        </Button>
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <Form.Control
            type="search"
            placeholder="Buscar por alumno, asesor o materia..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </Card.Body>
      </Card>

      {cargando ? (
        <LoadingSpinner mensaje="Cargando bitácoras..." />
      ) : filtradas.length === 0 ? (
        <Alert variant="info" className="text-center py-5">
          <div style={{ fontSize: '3rem', color: 'var(--azul-primario)' }}>
            <i className="bi bi-journal-x"></i>
          </div>
          <h5 className="fw-bold text-azul mb-2">Sin bitácoras</h5>
          <p className="text-suave mb-0">
            {bitacoras.length === 0
              ? 'Aún no se han registrado bitácoras en el sistema.'
              : 'No hay bitácoras que coincidan con la búsqueda.'}
          </p>
        </Alert>
      ) : (
        <Card className="border-0 shadow-sm">
          <div className="table-responsive">
            <Table hover className="mb-0 align-middle">
              <thead style={{ backgroundColor: 'var(--azul-suave)' }}>
                <tr>
                  <th className="small fw-semibold">Fecha</th>
                  <th className="small fw-semibold">Asesor</th>
                  <th className="small fw-semibold">Alumno</th>
                  <th className="small fw-semibold">Materia</th>
                  <th className="small fw-semibold text-center">Correo</th>
                  <th className="small fw-semibold text-end">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtradas.map((b) => (
                  <tr key={b.idBitacora}>
                    <td className="small">{b.fecha}</td>
                    <td className="small fw-semibold text-azul">{b.nombreAsesor}</td>
                    <td className="small">{b.nombreAlumno}</td>
                    <td className="small">{b.nombreMateria}</td>
                    <td className="text-center">
                      {b.correoEnviado ? (
                        <Badge bg="success"><i className="bi bi-check-circle-fill me-1"></i>Enviado</Badge>
                      ) : (
                        <Badge bg="warning" text="dark"><i className="bi bi-hourglass-split me-1"></i>Pendiente</Badge>
                      )}
                    </td>
                    <td className="text-end">
                      <Button
                        size="sm"
                        variant="outline-primary"
                        onClick={() => handleDescargarPdf(b.idBitacora)}
                        disabled={descargando[b.idBitacora]}
                        title="Descargar PDF"
                      >
                        {descargando[b.idBitacora] ? (
                          <Spinner size="sm" animation="border" />
                        ) : (
                          <i className="bi bi-file-pdf"></i>
                        )}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card>
      )}
    </>
  );
}

export default Bitacoras;