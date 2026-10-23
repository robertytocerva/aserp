package cxt.robertytocerva.aserp.service;

public record SolicitudNotificadaEvent(Integer idAsesoria, Tipo tipo) {

    public enum Tipo {
        /** Se creo una solicitud: notifica al asesor. */
        CREADA,
        /** El asesor acepto: notifica al alumno. */
        ACEPTADA,
        /** El asesor rechazo: notifica al alumno. */
        RECHAZADA
    }
}
