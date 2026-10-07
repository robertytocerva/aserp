package cxt.robertytocerva.aserp.service;

import cxt.robertytocerva.aserp.dto.HorarioAsesorDTO;
import cxt.robertytocerva.aserp.entity.Asesor;
import cxt.robertytocerva.aserp.entity.Asesoria;
import cxt.robertytocerva.aserp.entity.HorarioAsesor;
import cxt.robertytocerva.aserp.exception.BadRequestException;
import cxt.robertytocerva.aserp.exception.ResourceNotFoundException;
import cxt.robertytocerva.aserp.repository.AsesorRepository;
import cxt.robertytocerva.aserp.repository.AsesoriaRepository;
import cxt.robertytocerva.aserp.repository.HorarioAsesorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class HorarioAsesorService {

    public static final List<String> ESTADOS_ACTIVOS = List.of("solicitada", "programada");

    private final HorarioAsesorRepository horarioAsesorRepository;
    private final AsesoriaRepository asesoriaRepository;
    private final AsesorRepository asesorRepository;
    private final AsesorService asesorService;

    @Transactional(readOnly = true)
    public List<HorarioAsesorDTO.Response> listarMisHorarios(Integer idAlumno) {
        Asesor asesor = asesorService.obtenerAsesorValidadoDeAlumno(idAlumno);
        return horarioAsesorRepository.findByAsesorIdAsesor(asesor.getIdAsesor()).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<HorarioAsesorDTO.Response> listarActivosDeAsesor(Integer idAsesor) {
        validarAsesorExiste(idAsesor);
        return horarioAsesorRepository.findByAsesorIdAsesorAndActivoTrue(idAsesor).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<HorarioAsesorDTO.DisponibleResponse> listarDisponibles(Integer idAsesor, LocalDate desde, LocalDate hasta) {
        validarAsesorExiste(idAsesor);

        LocalDate hoy = LocalDate.now();
        if (desde.isBefore(hoy)) {
            throw new BadRequestException("La fecha desde debe ser hoy o posterior");
        }
        if (hasta.isBefore(desde)) {
            throw new BadRequestException("La fecha hasta debe ser posterior o igual a la fecha desde");
        }
        if (desde.plusDays(60).isBefore(hasta)) {
            throw new BadRequestException("El rango de fechas no debe exceder 60 dias");
        }

        List<HorarioAsesor> horarios = horarioAsesorRepository.findByAsesorIdAsesorAndActivoTrue(idAsesor);
        List<Asesoria> activas = asesoriaRepository.buscarPorAsesorYRangoDeFechas(
                idAsesor, desde, hasta, ESTADOS_ACTIVOS);
        List<HorarioAsesorDTO.DisponibleResponse> disponibles = new ArrayList<>();

        for (LocalDate fecha = desde; !fecha.isAfter(hasta); fecha = fecha.plusDays(1)) {
            final LocalDate fechaSlot = fecha;
            for (HorarioAsesor horario : horarios) {
                if (horario.getDiaSemana() != fechaSlot.getDayOfWeek().getValue()) {
                    continue;
                }
                boolean ocupado = activas.stream().anyMatch(a -> a.getFecha().equals(fechaSlot)
                        && a.getHoraInicio().isBefore(horario.getHoraFin())
                        && a.getHoraFin().isAfter(horario.getHoraInicio()));
                if (ocupado) {
                    continue;
                }
                disponibles.add(toDisponibleResponse(horario, fechaSlot));
            }
        }

        disponibles.sort((a, b) -> {
            int porFecha = a.fecha().compareTo(b.fecha());
            return porFecha != 0 ? porFecha : a.horaInicio().compareTo(b.horaInicio());
        });
        return disponibles;
    }

    @Transactional
    public HorarioAsesorDTO.Response crear(Integer idAlumno, HorarioAsesorDTO.Request request) {
        Asesor asesor = asesorService.obtenerAsesorValidadoDeAlumno(idAlumno);
        LocalTime horaInicio = parseHora(request.horaInicio());
        LocalTime horaFin = parseHora(request.horaFin());
        validarRangoHoras(horaInicio, horaFin);

        if (horarioAsesorRepository.existsByAsesorIdAsesorAndDiaSemanaAndHoraInicioAndHoraFin(
                asesor.getIdAsesor(), request.diaSemana(), horaInicio, horaFin)) {
            throw new BadRequestException("Ya existe un horario con ese dia y rango de horas para este asesor");
        }

        HorarioAsesor horario = HorarioAsesor.builder()
                .asesor(asesor)
                .diaSemana(request.diaSemana())
                .horaInicio(horaInicio)
                .horaFin(horaFin)
                .modalidad(request.modalidad())
                .lugar(request.lugar())
                .activo(true)
                .build();

        horario = horarioAsesorRepository.save(horario);
        return toResponse(horario);
    }

    @Transactional
    public HorarioAsesorDTO.Response actualizar(Integer idHorario, Integer idAlumno, HorarioAsesorDTO.Request request) {
        Asesor asesor = asesorService.obtenerAsesorValidadoDeAlumno(idAlumno);
        HorarioAsesor horario = buscarHorarioPropio(idHorario, asesor);
        LocalTime horaInicio = parseHora(request.horaInicio());
        LocalTime horaFin = parseHora(request.horaFin());
        validarRangoHoras(horaInicio, horaFin);

        if (horarioAsesorRepository.existsByAsesorIdAsesorAndDiaSemanaAndHoraInicioAndHoraFinAndIdHorarioNot(
                asesor.getIdAsesor(), request.diaSemana(), horaInicio, horaFin, idHorario)) {
            throw new BadRequestException("Ya existe otro horario con ese dia y rango de horas para este asesor");
        }

        horario.setDiaSemana(request.diaSemana());
        horario.setHoraInicio(horaInicio);
        horario.setHoraFin(horaFin);
        horario.setModalidad(request.modalidad());
        horario.setLugar(request.lugar());

        horario = horarioAsesorRepository.save(horario);
        return toResponse(horario);
    }

    @Transactional
    public void desactivar(Integer idHorario, Integer idAlumno) {
        Asesor asesor = asesorService.obtenerAsesorValidadoDeAlumno(idAlumno);
        HorarioAsesor horario = buscarHorarioPropio(idHorario, asesor);
        horario.setActivo(false);
        horarioAsesorRepository.save(horario);
    }

    private HorarioAsesor buscarHorarioPropio(Integer idHorario, Asesor asesor) {
        HorarioAsesor horario = horarioAsesorRepository.findById(idHorario)
                .orElseThrow(() -> new ResourceNotFoundException("Horario no encontrado con id: " + idHorario));
        if (!horario.getAsesor().getIdAsesor().equals(asesor.getIdAsesor())) {
            throw new BadRequestException("El horario no pertenece al asesor autenticado");
        }
        return horario;
    }

    private void validarAsesorExiste(Integer idAsesor) {
        if (!asesorRepository.existsById(idAsesor)) {
            throw new ResourceNotFoundException("Asesor no encontrado con id: " + idAsesor);
        }
    }

    static LocalTime parseHora(String hora) {
        return LocalTime.parse(hora);
    }

    static void validarRangoHoras(LocalTime horaInicio, LocalTime horaFin) {
        if (!horaFin.isAfter(horaInicio)) {
            throw new BadRequestException("La hora de fin debe ser posterior a la hora de inicio");
        }
    }

    private HorarioAsesorDTO.Response toResponse(HorarioAsesor h) {
        return new HorarioAsesorDTO.Response(
                h.getIdHorario(),
                h.getAsesor().getIdAsesor(),
                h.getAsesor().getAlumno().getNombre() + " " + h.getAsesor().getAlumno().getApellidoPaterno(),
                h.getDiaSemana(),
                fmtHora(h.getHoraInicio()),
                fmtHora(h.getHoraFin()),
                h.getModalidad(),
                h.getLugar(),
                h.getActivo()
        );
    }

    private HorarioAsesorDTO.DisponibleResponse toDisponibleResponse(HorarioAsesor h, LocalDate fecha) {
        return new HorarioAsesorDTO.DisponibleResponse(
                h.getIdHorario(),
                h.getAsesor().getIdAsesor(),
                h.getAsesor().getAlumno().getNombre() + " " + h.getAsesor().getAlumno().getApellidoPaterno(),
                fecha.toString(),
                h.getDiaSemana(),
                fmtHora(h.getHoraInicio()),
                fmtHora(h.getHoraFin()),
                h.getModalidad(),
                h.getLugar()
        );
    }

    static String fmtHora(LocalTime hora) {
        return String.format("%02d:%02d", hora.getHour(), hora.getMinute());
    }
}
