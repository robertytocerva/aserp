package cxt.robertytocerva.aserp.dto;

import jakarta.validation.constraints.*;

public class SolicitudDTO {

    public record SolicitudRequest(
            @NotNull(message = "El idHorario es obligatorio")
            Integer idHorario,

            @NotBlank(message = "La fecha es obligatoria")
            @Pattern(regexp = "^\\d{4}-\\d{2}-\\d{2}$", message = "La fecha debe tener formato yyyy-MM-dd")
            String fecha,

            @NotNull(message = "El idMateria es obligatorio")
            Integer idMateria
    ) {}

    public record Response(
            Integer idAsesoria,
            Integer idHorario,
            Integer idAsesor,
            String nombreAsesor,
            Integer idAlumno,
            String nombreAlumno,
            String matricula,
            Integer idMateria,
            String nombreMateria,
            String fecha,
            String horaInicio,
            String horaFin,
            String modalidad,
            String lugar,
            String estado
    ) {}
}
