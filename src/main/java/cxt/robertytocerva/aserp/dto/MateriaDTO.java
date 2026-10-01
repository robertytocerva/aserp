package cxt.robertytocerva.aserp.dto;

import jakarta.validation.constraints.*;

public class MateriaDTO {

    public record Request(
            @NotBlank(message = "La clave es obligatoria")
            @Size(max = 20, message = "La clave no debe exceder 20 caracteres")
            String clave,

            @NotBlank(message = "El nombre es obligatorio")
            @Size(max = 150, message = "El nombre no debe exceder 150 caracteres")
            String nombre,

            @NotNull(message = "El idCarrera es obligatorio")
            Integer idCarrera,

            @Min(value = 1, message = "El semestre debe estar entre 1 y 20")
            @Max(value = 20, message = "El semestre debe estar entre 1 y 20")
            Short semestreRecomendado,

            @Min(value = 0, message = "Los creditos no pueden ser negativos")
            Short creditos,

            String descripcion
    ) {}

    public record Response(
            Integer idMateria,
            String clave,
            String nombre,
            Integer idCarrera,
            String nombreCarrera,
            Short semestreRecomendado,
            Short creditos,
            String descripcion,
            Boolean activo
    ) {}
}
