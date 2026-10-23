package cxt.robertytocerva.aserp.service;

import cxt.robertytocerva.aserp.dto.EstadisticaDTO;
import cxt.robertytocerva.aserp.entity.Asesor;
import cxt.robertytocerva.aserp.entity.Asesoria;
import cxt.robertytocerva.aserp.exception.BadRequestException;
import cxt.robertytocerva.aserp.repository.AsesoriaRepository;
import cxt.robertytocerva.aserp.repository.AsesorMateriaRepository;
import cxt.robertytocerva.aserp.repository.AsesorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EstadisticaService {

    private static final String COMPLETADA = "completada";
    private static final String SOLICITADA = "solicitada";
    private static final String RECHAZADA = "rechazada";

    private final AsesoriaRepository asesoriaRepository;
    private final AsesorRepository asesorRepository;
    private final AsesorMateriaRepository asesorMateriaRepository;

    @Transactional(readOnly = true)
    public EstadisticaDTO.Response obtener(LocalDate desde, LocalDate hasta) {
        LocalDate desdeReal = desde != null ? desde : inicioSemestreActual();
        LocalDate hastaReal = hasta != null ? hasta : finSemestreActual();
        if (desdeReal.isAfter(hastaReal)) {
            throw new BadRequestException("La fecha desde debe ser anterior o igual a la fecha hasta");
        }

        List<Asesoria> asesorias = asesoriaRepository.findByFechaBetween(desdeReal, hastaReal);

        EstadisticaDTO.PeriodoDTO periodo = new EstadisticaDTO.PeriodoDTO(
                desdeReal.toString(), hastaReal.toString());
        EstadisticaDTO.ResumenDTO resumen = construirResumen(asesorias);
        List<EstadisticaDTO.AsesorStatsDTO> porAsesor = construirPorAsesor(asesorias);
        List<EstadisticaDTO.MateriaStatsDTO> porMateria = construirPorMateria(asesorias);

        return new EstadisticaDTO.Response(periodo, resumen, porAsesor, porMateria);
    }

    private EstadisticaDTO.ResumenDTO construirResumen(List<Asesoria> asesorias) {
        long recibidas = asesorias.size();
        long pendientes = contarEstado(asesorias, SOLICITADA);
        long completadas = contarEstado(asesorias, COMPLETADA);
        long rechazadas = contarEstado(asesorias, RECHAZADA);
        long canceladas = contarEstado(asesorias, "cancelada");
        long noAsistio = contarEstado(asesorias, "no_asistio");

        // aceptadas = las que pasaron de solicitada (solo rechazada queda fuera)
        long aceptadas = recibidas - pendientes - rechazadas;

        double horas = asesorias.stream()
                .filter(a -> COMPLETADA.equals(a.getEstado()))
                .mapToLong(a -> Duration.between(a.getHoraInicio(), a.getHoraFin()).toMinutes())
                .sum() / 60.0;

        long alumnosAtendidos = asesorias.stream()
                .filter(a -> COMPLETADA.equals(a.getEstado()))
                .map(a -> a.getAlumno().getIdAlumno())
                .collect(Collectors.toSet())
                .size();

        long asesoresConActividad = asesorias.stream()
                .map(a -> a.getAsesor().getIdAsesor())
                .collect(Collectors.toSet())
                .size();

        return new EstadisticaDTO.ResumenDTO(
                recibidas, pendientes, completadas, rechazadas, canceladas, noAsistio,
                porcentaje(aceptadas, recibidas),
                porcentaje(completadas, aceptadas),
                Math.round(horas * 10.0) / 10.0,
                alumnosAtendidos,
                asesoresConActividad,
                asesorRepository.count());
    }

    private List<EstadisticaDTO.AsesorStatsDTO> construirPorAsesor(List<Asesoria> asesorias) {
        Map<Integer, List<Asesoria>> porAsesor = asesorias.stream()
                .collect(Collectors.groupingBy(a -> a.getAsesor().getIdAsesor()));

        List<EstadisticaDTO.AsesorStatsDTO> resultados = new ArrayList<>();
        for (Asesor asesor : asesorRepository.findAll()) {
            List<Asesoria> suyas = porAsesor.getOrDefault(asesor.getIdAsesor(), List.of());

            long recibidas = suyas.size();
            long completadas = suyas.stream().filter(a -> COMPLETADA.equals(a.getEstado())).count();
            long rechazadas = suyas.stream().filter(a -> RECHAZADA.equals(a.getEstado())).count();
            long pendientes = suyas.stream().filter(a -> SOLICITADA.equals(a.getEstado())).count();
            long canceladas = suyas.stream().filter(a -> "cancelada".equals(a.getEstado())).count();
            long noAsistio = suyas.stream().filter(a -> "no_asistio".equals(a.getEstado())).count();
            long aceptadas = recibidas - pendientes - rechazadas;

            double horas = suyas.stream()
                    .filter(a -> COMPLETADA.equals(a.getEstado()))
                    .mapToLong(a -> Duration.between(a.getHoraInicio(), a.getHoraFin()).toMinutes())
                    .sum() / 60.0;

            long alumnos = suyas.stream()
                    .filter(a -> COMPLETADA.equals(a.getEstado()))
                    .map(a -> a.getAlumno().getIdAlumno())
                    .collect(Collectors.toSet())
                    .size();

            resultados.add(new EstadisticaDTO.AsesorStatsDTO(
                    asesor.getIdAsesor(),
                    nombreCompleto(asesor),
                    asesor.getAlumno().getMatricula(),
                    asesor.getPromedio(),
                    Boolean.TRUE.equals(asesor.getValidado()),
                    asesorMateriaRepository.countByAsesorIdAsesor(asesor.getIdAsesor()),
                    recibidas, completadas, rechazadas, canceladas, pendientes, noAsistio,
                    Math.round(horas * 10.0) / 10.0,
                    alumnos,
                    porcentaje(aceptadas, recibidas),
                    porcentaje(completadas, aceptadas)));
        }

        resultados.sort(Comparator
                .comparingLong((EstadisticaDTO.AsesorStatsDTO a) -> a.completadas()).reversed()
                .thenComparing(EstadisticaDTO.AsesorStatsDTO::nombre));
        return resultados;
    }

    private List<EstadisticaDTO.MateriaStatsDTO> construirPorMateria(List<Asesoria> asesorias) {
        Map<String, long[]> conteos = new LinkedHashMap<>();
        for (Asesoria a : asesorias) {
            String nombre = a.getMateria().getNombre();
            long[] c = conteos.computeIfAbsent(nombre, k -> new long[2]);
            c[0]++;
            if (COMPLETADA.equals(a.getEstado())) {
                c[1]++;
            }
        }

        List<EstadisticaDTO.MateriaStatsDTO> resultados = new ArrayList<>();
        conteos.forEach((materia, c) -> resultados.add(new EstadisticaDTO.MateriaStatsDTO(materia, c[0], c[1])));
        resultados.sort(Comparator.comparingLong(EstadisticaDTO.MateriaStatsDTO::total).reversed()
                .thenComparing(EstadisticaDTO.MateriaStatsDTO::materia));
        return resultados;
    }

    private static long contarEstado(List<Asesoria> asesorias, String estado) {
        return asesorias.stream().filter(a -> estado.equals(a.getEstado())).count();
    }

    private static double porcentaje(long parte, long total) {
        if (total <= 0) {
            return 0.0;
        }
        return Math.round(parte * 1000.0 / total) / 10.0;
    }

    private static String nombreCompleto(Asesor asesor) {
        String materno = asesor.getAlumno().getApellidoMaterno();
        return asesor.getAlumno().getNombre() + " " + asesor.getAlumno().getApellidoPaterno()
                + (materno == null ? "" : " " + materno);
    }

    static LocalDate inicioSemestreActual() {
        LocalDate hoy = LocalDate.now();
        return hoy.getMonthValue() <= 7
                ? hoy.withMonth(1).withDayOfMonth(1)
                : hoy.withMonth(8).withDayOfMonth(1);
    }

    static LocalDate finSemestreActual() {
        LocalDate hoy = LocalDate.now();
        return hoy.getMonthValue() <= 7
                ? hoy.withMonth(7).withDayOfMonth(31)
                : hoy.withMonth(12).withDayOfMonth(31);
    }
}
