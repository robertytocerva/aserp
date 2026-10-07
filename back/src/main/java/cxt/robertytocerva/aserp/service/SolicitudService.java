package cxt.robertytocerva.aserp.service;

import cxt.robertytocerva.aserp.dto.SolicitudDTO;
import cxt.robertytocerva.aserp.entity.*;
import cxt.robertytocerva.aserp.exception.BadRequestException;
import cxt.robertytocerva.aserp.exception.ResourceNotFoundException;
import cxt.robertytocerva.aserp.repository.AlumnoRepository;
import cxt.robertytocerva.aserp.repository.AsesoriaRepository;
import cxt.robertytocerva.aserp.repository.HorarioAsesorRepository;
import cxt.robertytocerva.aserp.repository.MateriaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SolicitudService {

    public static final String ESTADO_SOLICITADA = "solicitada";
    public static final String ESTADO_PROGRAMADA = "programada";
    public static final String ESTADO_RECHAZADA = "rechazada";

    private final AsesoriaRepository asesoriaRepository;
    private final HorarioAsesorRepository horarioAsesorRepository;
    private final AlumnoRepository alumnoRepository;
    private final MateriaRepository materiaRepository;
    private final AsesorService asesorService;

    @Transactional
    public SolicitudDTO.Response solicitar(Integer idAlumno, SolicitudDTO.SolicitudRequest request) {
        HorarioAsesor horario = horarioAsesorRepository.findById(request.idHorario())
                .orElseThrow(() -> new ResourceNotFoundException("Horario no encontrado con id: " + request.idHorario()));
        if (!Boolean.TRUE.equals(horario.getActivo())) {
            throw new BadRequestException("El horario no esta disponible");
        }

        Asesor asesor = horario.getAsesor();
        if (asesor.getAlumno().getIdAlumno().equals(idAlumno)) {
            throw new BadRequestException("El asesor no puede solicitar su propio horario");
        }

        Alumno alumno = alumnoRepository.findById(idAlumno)
                .orElseThrow(() -> new ResourceNotFoundException("Alumno no encontrado con id: " + idAlumno));

        Materia materia = materiaRepository.findById(request.idMateria())
                .orElseThrow(() -> new ResourceNotFoundException("Materia no encontrada con id: " + request.idMateria()));

        LocalDate fecha = parseFecha(request.fecha());
        LocalDate hoy = LocalDate.now();
        if (fecha.isBefore(hoy)) {
            throw new BadRequestException("La fecha debe ser hoy o posterior");
        }
        if (fecha.getDayOfWeek().getValue() != horario.getDiaSemana()) {
            throw new BadRequestException("La fecha no corresponde al dia de semana del horario");
        }

        if (asesoriaRepository.existeTraslape(asesor.getIdAsesor(), fecha, HorarioAsesorService.ESTADOS_ACTIVOS,
                horario.getHoraInicio(), horario.getHoraFin())) {
            throw new BadRequestException("El horario ya no esta disponible para esa fecha");
        }

        Asesoria asesoria = Asesoria.builder()
                .asesor(asesor)
                .alumno(alumno)
                .materia(materia)
                .horario(horario)
                .fecha(fecha)
                .horaInicio(horario.getHoraInicio())
                .horaFin(horario.getHoraFin())
                .modalidad(horario.getModalidad())
                .lugar(horario.getLugar())
                .estado(ESTADO_SOLICITADA)
                .build();

        asesoria = asesoriaRepository.save(asesoria);
        return toResponse(asesoria);
    }

    @Transactional(readOnly = true)
    public List<SolicitudDTO.Response> listarMias(Integer idAlumno) {
        return asesoriaRepository.findByAlumnoIdAlumnoOrderByFechaAscHoraInicioAsc(idAlumno).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<SolicitudDTO.Response> listarRecibidas(Integer idAlumno, String estado) {
        Asesor asesor = asesorService.obtenerAsesorValidadoDeAlumno(idAlumno);
        List<Asesoria> asesorias;
        if (estado == null || estado.isBlank()) {
            asesorias = asesoriaRepository.findByAsesorIdAsesorOrderByFechaAscHoraInicioAsc(asesor.getIdAsesor());
        } else {
            validarEstado(estado);
            asesorias = asesoriaRepository.findByAsesorIdAsesorAndEstadoInOrderByFechaAscHoraInicioAsc(
                    asesor.getIdAsesor(), List.of(estado));
        }
        return asesorias.stream().map(this::toResponse).toList();
    }

    @Transactional
    public SolicitudDTO.Response aceptar(Integer idAsesoria, Integer idAlumno) {
        Asesoria asesoria = buscarPropia(idAsesoria, idAlumno);
        if (!ESTADO_SOLICITADA.equals(asesoria.getEstado())) {
            throw new BadRequestException("Solo se pueden aceptar solicitudes en estado solicitada");
        }
        if (asesoriaRepository.existeTraslape(asesoria.getAsesor().getIdAsesor(), asesoria.getFecha(),
                List.of(ESTADO_PROGRAMADA), asesoria.getHoraInicio(), asesoria.getHoraFin())) {
            throw new BadRequestException("El horario ya no esta disponible para esa fecha");
        }
        asesoria.setEstado(ESTADO_PROGRAMADA);
        asesoria = asesoriaRepository.save(asesoria);
        return toResponse(asesoria);
    }

    @Transactional
    public SolicitudDTO.Response rechazar(Integer idAsesoria, Integer idAlumno) {
        Asesoria asesoria = buscarPropia(idAsesoria, idAlumno);
        if (!ESTADO_SOLICITADA.equals(asesoria.getEstado())) {
            throw new BadRequestException("Solo se pueden rechazar solicitudes en estado solicitada");
        }
        asesoria.setEstado(ESTADO_RECHAZADA);
        asesoria = asesoriaRepository.save(asesoria);
        return toResponse(asesoria);
    }

    private Asesoria buscarPropia(Integer idAsesoria, Integer idAlumno) {
        Asesor asesor = asesorService.obtenerAsesorValidadoDeAlumno(idAlumno);
        Asesoria asesoria = asesoriaRepository.findById(idAsesoria)
                .orElseThrow(() -> new ResourceNotFoundException("Solicitud no encontrada con id: " + idAsesoria));
        if (!asesoria.getAsesor().getIdAsesor().equals(asesor.getIdAsesor())) {
            throw new BadRequestException("La solicitud no pertenece al asesor autenticado");
        }
        return asesoria;
    }

    private void validarEstado(String estado) {
        List<String> estados = List.of("solicitada", "programada", "completada", "cancelada", "no_asistio", "rechazada");
        if (!estados.contains(estado)) {
            throw new BadRequestException("El estado debe ser solicitada, programada, completada, cancelada, no_asistio o rechazada");
        }
    }

    private LocalDate parseFecha(String fecha) {
        try {
            return LocalDate.parse(fecha);
        } catch (Exception e) {
            throw new BadRequestException("La fecha debe tener formato yyyy-MM-dd");
        }
    }

    private SolicitudDTO.Response toResponse(Asesoria a) {
        Alumno alumno = a.getAlumno();
        return new SolicitudDTO.Response(
                a.getIdAsesoria(),
                a.getHorario() != null ? a.getHorario().getIdHorario() : null,
                a.getAsesor().getIdAsesor(),
                a.getAsesor().getAlumno().getNombre() + " " + a.getAsesor().getAlumno().getApellidoPaterno(),
                alumno.getIdAlumno(),
                alumno.getNombre() + " " + alumno.getApellidoPaterno(),
                alumno.getMatricula(),
                a.getMateria().getIdMateria(),
                a.getMateria().getNombre(),
                a.getFecha().toString(),
                HorarioAsesorService.fmtHora(a.getHoraInicio()),
                HorarioAsesorService.fmtHora(a.getHoraFin()),
                a.getModalidad(),
                a.getLugar(),
                a.getEstado()
        );
    }
}
