package cxt.robertytocerva.aserp.dto;

public class BitacoraDTO {

    public record Response(
            Integer idBitacora,
            Integer idAsesoria,
            String fecha,
            String horario,
            String matricula,
            String nombreAlumno,
            String nombreAsesor,
            String materia,
            String carrera,
            String temaTratado,
            String tareasAsignadas,
            String observaciones,
            Boolean tieneImagen,
            Boolean correoEnviado
    ) {}
}
