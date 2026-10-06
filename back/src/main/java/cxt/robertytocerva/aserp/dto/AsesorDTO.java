package cxt.robertytocerva.aserp.dto;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public class AsesorDTO {

    public record RegistroRequest(
            @DecimalMin(value = "0.00", message = "El promedio minimo es 0")
            @DecimalMax(value = "10.00", message = "El promedio maximo es 10")
            BigDecimal promedio
    ) {}

    public record ValidacionRequest(
            @NotNull(message = "El estado de validacion es obligatorio")
            Boolean validado
    ) {}

    public record Response(
            Integer idAsesor,
            Integer idAlumno,
            String nombreAlumno,
            String matricula,
            BigDecimal promedio,
            String fechaInicio,
            Boolean validado,
            Boolean activo
    ) {}
}
