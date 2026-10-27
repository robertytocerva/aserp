package cxt.robertytocerva.aserp.dto;

import java.math.BigDecimal;
import java.util.List;

public class EstadisticaDTO {

    public record Response(
            PeriodoDTO periodo,
            ResumenDTO resumen,
            List<AsesorStatsDTO> porAsesor,
            List<MateriaStatsDTO> porMateria
    ) {}

    public record PeriodoDTO(
            String desde,
            String hasta
    ) {}

    public record ResumenDTO(
            long recibidas,
            long pendientes,
            long completadas,
            long rechazadas,
            long canceladas,
            long noAsistio,
            double tasaAceptacion,
            double tasaCumplimiento,
            double horasTotales,
            long alumnosAtendidos,
            long asesoresConActividad,
            long asesoresTotales
    ) {}

    public record AsesorStatsDTO(
            Integer idAsesor,
            String nombre,
            String matricula,
            BigDecimal promedio,
            boolean validado,
            long materias,
            long recibidas,
            long completadas,
            long rechazadas,
            long canceladas,
            long pendientes,
            long noAsistio,
            double horasCompletadas,
            long alumnosAtendidos,
            double tasaAceptacion,
            double tasaCumplimiento
    ) {}

    public record MateriaStatsDTO(
            String materia,
            long total,
            long completadas
    ) {}
}
