package cxt.robertytocerva.aserp.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CarreraDTO {

    public record Request(
            @NotBlank(message = "La clave es obligatoria")
            @Size(max = 20, message = "La clave no debe exceder 20 caracteres")
            String clave,

            @NotBlank(message = "El nombre es obligatorio")
            @Size(max = 150, message = "El nombre no debe exceder 150 caracteres")
            String nombre
    ) {}

    public record Response(
            Integer idCarrera,
            String clave,
            String nombre,
            Boolean activo
    ) {}
}
