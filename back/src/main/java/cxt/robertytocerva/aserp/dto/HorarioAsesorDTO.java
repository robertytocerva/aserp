package cxt.robertytocerva.aserp.dto;

import jakarta.validation.constraints.*;

public class HorarioAsesorDTO {

    public record Request(
            @NotNull(message = "El dia de semana es obligatorio")
            @Min(value = 1, message = "El dia de semana debe estar entre 1 y 7")
            @Max(value = 7, message = "El dia de semana debe estar entre 1 y 7")
            Short diaSemana,

            @NotBlank(message = "La hora de inicio es obligatoria")
            @Pattern(regexp = "^([01][0-9]|2[0-3]):[0-5][0-9]$",
                    message = "La hora de inicio debe tener formato HH:mm")
            String horaInicio,

            @NotBlank(message = "La hora de fin es obligatoria")
            @Pattern(regexp = "^([01][0-9]|2[0-3]):[0-5][0-9]$",
                    message = "La hora de fin debe tener formato HH:mm")
            String horaFin,

            @NotBlank(message = "La modalidad es obligatoria")
            @Pattern(regexp = "presencial|virtual|hibrida",
                    message = "La modalidad debe ser presencial, virtual o hibrida")
            String modalidad,

            @Size(max = 100, message = "El lugar no debe exceder 100 caracteres")
            String lugar
    ) {}

    public record Response(
            Integer idHorario,
            Integer idAsesor,
            String nombreAsesor,
            Short diaSemana,
            String horaInicio,
            String horaFin,
            String modalidad,
            String lugar,
            Boolean activo
    ) {}

    public record DisponibleResponse(
            Integer idHorario,
            Integer idAsesor,
            String nombreAsesor,
            String fecha,
            Short diaSemana,
            String horaInicio,
            String horaFin,
            String modalidad,
            String lugar
    ) {}
}
