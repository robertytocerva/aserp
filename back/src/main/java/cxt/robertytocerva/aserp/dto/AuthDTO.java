package cxt.robertytocerva.aserp.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class AuthDTO {

    public record LoginRequest(
            @NotBlank(message = "El correo es obligatorio")
            @Email(message = "El correo debe ser valido")
            String correo,

            @NotBlank(message = "La contrasena es obligatoria")
            String password
    ) {}

    public record LoginResponse(
            String token,
            String tipo,
            Integer idUsuario,
            Integer idAlumno,
            String rol
    ) {}
}
