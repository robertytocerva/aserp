package cxt.robertytocerva.aserp.dto;

import jakarta.validation.constraints.*;

public class AlumnoDTO {

    public record Request(
            @NotBlank(message = "La matricula es obligatoria")
            @Size(max = 20, message = "La matricula no debe exceder 20 caracteres")
            String matricula,

            @NotBlank(message = "El nombre es obligatorio")
            @Size(max = 100, message = "El nombre no debe exceder 100 caracteres")
            String nombre,

            @NotBlank(message = "El apellido paterno es obligatorio")
            @Size(max = 100, message = "El apellido paterno no debe exceder 100 caracteres")
            String apellidoPaterno,

            @Size(max = 100, message = "El apellido materno no debe exceder 100 caracteres")
            String apellidoMaterno,

            @NotBlank(message = "El correo es obligatorio")
            @Email(message = "El correo debe ser valido")
            @Size(max = 150, message = "El correo no debe exceder 150 caracteres")
            String correo,

            @Size(max = 20, message = "El telefono no debe exceder 20 caracteres")
            String telefono,

            @NotNull(message = "El idCarrera es obligatorio")
            Integer idCarrera,

            @NotNull(message = "El semestre es obligatorio")
            @Min(value = 1, message = "El semestre debe estar entre 1 y 20")
            @Max(value = 20, message = "El semestre debe estar entre 1 y 20")
            Short semestre
    ) {}

    public record Response(
            Integer idAlumno,
            String matricula,
            String nombre,
            String apellidoPaterno,
            String apellidoMaterno,
            String correo,
            String telefono,
            Integer idCarrera,
            String nombreCarrera,
            Short semestre,
            Boolean activo
    ) {}
}
