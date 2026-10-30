package cxt.robertytocerva.aserp.service;

import cxt.robertytocerva.aserp.dto.BitacoraDTO;
import cxt.robertytocerva.aserp.entity.Alumno;
import cxt.robertytocerva.aserp.entity.Asesor;
import cxt.robertytocerva.aserp.entity.Asesoria;
import cxt.robertytocerva.aserp.entity.Bitacora;
import cxt.robertytocerva.aserp.exception.BadRequestException;
import cxt.robertytocerva.aserp.exception.ResourceNotFoundException;
import cxt.robertytocerva.aserp.repository.AsesoriaRepository;
import cxt.robertytocerva.aserp.repository.BitacoraRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

//
import java.util.List;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class BitacoraService {

    public record Imagen(byte[] datos, String tipo) {}

    private final BitacoraRepository bitacoraRepository;
    private final AsesoriaRepository asesoriaRepository;
    private final AsesorService asesorService;
    private final BitacoraPdfService bitacoraPdfService;
    private final ApplicationEventPublisher eventos;

    @Transactional
    public BitacoraDTO.Response crear(Integer idAlumno, Integer idAsesoria, String temaTratado,
                                      String tareasAsignadas, String observaciones, MultipartFile imagen) {
        Asesor asesor = asesorService.obtenerAsesorValidadoDeAlumno(idAlumno);

        if (idAsesoria == null) {
            throw new BadRequestException("El idAsesoria es obligatorio");
        }
        if (temaTratado == null || temaTratado.isBlank()) {
            throw new BadRequestException("El tema tratado es obligatorio");
        }

        Asesoria asesoria = asesoriaRepository.findById(idAsesoria)
                .orElseThrow(() -> new ResourceNotFoundException("Sesion no encontrada con id: " + idAsesoria));
        if (!asesoria.getAsesor().getIdAsesor().equals(asesor.getIdAsesor())) {
            throw new BadRequestException("La sesion no pertenece al asesor autenticado");
        }
        if (!SolicitudService.ESTADO_COMPLETADA.equals(asesoria.getEstado())) {
            throw new BadRequestException("Solo se puede generar bitacora de sesiones completadas");
        }
        if (bitacoraRepository.existsByAsesoriaIdAsesoria(idAsesoria)) {
            throw new BadRequestException("La sesion ya tiene una bitacora registrada");
        }

        byte[] datosImagen = null;
        String tipoImagen = null;
        if (imagen != null && !imagen.isEmpty()) {
            if (imagen.getSize() > ImagenEvidenciaValidator.MAX_BYTES) {
                throw new BadRequestException("La imagen no debe exceder 2 MB");
            }
            try {
                datosImagen = imagen.getBytes();
            } catch (IOException e) {
                throw new BadRequestException("No se pudo leer la imagen");
            }
            tipoImagen = ImagenEvidenciaValidator.tipoMime(datosImagen);
            if (tipoImagen == null) {
                throw new BadRequestException("La imagen debe ser JPG o PNG");
            }
        }

        Alumno alumno = asesoria.getAlumno();
        Alumno alumnoAsesor = asesor.getAlumno();
        Bitacora bitacora = Bitacora.builder()
                .asesoria(asesoria)
                .registradoPor(asesor)
                .temasTratados(temaTratado.trim())
                .tareasAsignadas(tareasAsignadas == null || tareasAsignadas.isBlank() ? null : tareasAsignadas.trim())
                .observaciones(observaciones == null || observaciones.isBlank() ? null : observaciones.trim())
                .fechaSesion(asesoria.getFecha())
                .horaInicio(asesoria.getHoraInicio())
                .horaFin(asesoria.getHoraFin())
                .matriculaAlumno(alumno.getMatricula())
                .nombreAlumno(nombreCompleto(alumno))
                .nombreAsesor(nombreCompleto(alumnoAsesor))
                .nombreMateria(asesoria.getMateria().getNombre())
                .nombreCarrera(alumno.getCarrera().getNombre())
                .imagenEvidencia(datosImagen)
                .imagenTipo(tipoImagen)
                .correoEnviado(false)
                .build();

        bitacora = bitacoraRepository.save(bitacora);
        eventos.publishEvent(new BitacoraCreadaEvent(bitacora.getIdBitacora()));
        return toResponse(bitacora);
    }

    @Transactional(readOnly = true)
    public BitacoraDTO.Response obtener(Integer idBitacora, Integer idAlumno) {
        Bitacora b = buscarAccesible(idBitacora, idAlumno);
        return toResponse(b);
    }

    @Transactional(readOnly = true)
    public Imagen obtenerImagen(Integer idBitacora, Integer idAlumno) {
        Bitacora b = buscarAccesible(idBitacora, idAlumno);
        if (b.getImagenEvidencia() == null) {
            throw new ResourceNotFoundException("La bitacora no tiene imagen de evidencia");
        }
        return new Imagen(b.getImagenEvidencia(), b.getImagenTipo());
    }

    @Transactional(readOnly = true)
    public byte[] obtenerPdf(Integer idBitacora, Integer idAlumno) {
        Bitacora b = buscarAccesible(idBitacora, idAlumno);
        return bitacoraPdfService.generar(b);
    }

    /////////
    @Transactional(readOnly = true)
    public List<BitacoraDTO.Response> listarTodas() {
        return bitacoraRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }


        private Bitacora buscarAccesible(Integer idBitacora, Integer idAlumno) {
        Bitacora b = bitacoraRepository.findById(idBitacora)
                .orElseThrow(() -> new ResourceNotFoundException("Bitacora no encontrada con id: " + idBitacora));
        Asesoria a = b.getAsesoria();
        
        // Si el idAlumno es nulo, significa que es el Admin haciendo la peticion
        if (idAlumno == null) {
            return b;
        }

        boolean esAsesor = a.getAsesor().getAlumno().getIdAlumno().equals(idAlumno);
        boolean esAlumno = a.getAlumno().getIdAlumno().equals(idAlumno);
        
        if (!esAsesor && !esAlumno) {
            throw new ResourceNotFoundException("Bitacora no encontrada con id: " + idBitacora);
        }
        return b;
    }

    private static String nombreCompleto(Alumno a) {
        String apMat = a.getApellidoMaterno() == null ? "" : " " + a.getApellidoMaterno();
        return a.getNombre() + " " + a.getApellidoPaterno() + apMat;
    }

    private BitacoraDTO.Response toResponse(Bitacora b) {
        return new BitacoraDTO.Response(
                b.getIdBitacora(),
                b.getAsesoria().getIdAsesoria(),
                b.getFechaSesion().toString(),
                HorarioAsesorService.fmtHora(b.getHoraInicio()) + " - " + HorarioAsesorService.fmtHora(b.getHoraFin()),
                b.getMatriculaAlumno(),
                b.getNombreAlumno(),
                b.getNombreAsesor(),
                b.getNombreMateria(),
                b.getNombreCarrera(),
                b.getTemasTratados(),
                b.getTareasAsignadas(),
                b.getObservaciones(),
                b.getImagenEvidencia() != null,
                b.getCorreoEnviado()
        );
    }
}
