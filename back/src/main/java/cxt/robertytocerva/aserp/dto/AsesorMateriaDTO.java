package cxt.robertytocerva.aserp.dto;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.util.List;

public class AsesorMateriaDTO {

    public record AsignacionRequest(
            @NotNull(message = "El idMateria es obligatorio")
            Integer idMateria,

            @Pattern(regexp = "basico|intermedio|avanzado",
                    message = "El nivel de dominio debe ser basico, intermedio o avanzado")
            String nivelDominio
    ) {}

    public record NivelRequest(
            @NotBlank(message = "El nivel de dominio es obligatorio")
            @Pattern(regexp = "basico|intermedio|avanzado",
                    message = "El nivel de dominio debe ser basico, intermedio o avanzado")
            String nivelDominio
    ) {}

    public record Response(
            Integer idAsesorMateria,
            Integer idAsesor,
            String nombreAsesor,
            Integer idMateria,
            String claveMateria,
            String nombreMateria,
            String nivelDominio
    ) {}

    public record AsesorConHorariosResponse(
            Integer idAsesor,
            String nombreAsesor,
            String matricula,
            BigDecimal promedio,
            String nivelDominio,
            List<HorarioAsesorDTO.Response> horarios
    ) {}
}
