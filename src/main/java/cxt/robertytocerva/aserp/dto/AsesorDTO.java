package cxt.robertytocerva.aserp.dto;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public class AsesorDTO {

    public record RegistroRequest(
            @NotNull(message = "El idAlumno es obligatorio")
            Integer idAlumno,

            @DecimalMin(value = "0.00", message = "El promedio minimo es 0")
            @DecimalMax(value = "10.00", message = "El promedio maximo es 10")
            BigDecimal promedio
    ) {}

    public record Response(
            Integer idAsesor,
            Integer idAlumno,
            String nombreAlumno,
            String matricula,
            BigDecimal promedio,
            String fechaInicio,
            Boolean activo
    ) {}
}
