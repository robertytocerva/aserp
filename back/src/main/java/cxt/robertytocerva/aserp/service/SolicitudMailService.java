package cxt.robertytocerva.aserp.service;

import cxt.robertytocerva.aserp.entity.Asesoria;
import cxt.robertytocerva.aserp.repository.AsesoriaRepository;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Slf4j
@Service
@RequiredArgsConstructor
public class SolicitudMailService {

    private static final int INTENTOS = 2;

    private final AsesoriaRepository asesoriaRepository;
    private final JavaMailSender mailSender;

    @Value("${app.mail.from}")
    private String from;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void notificar(SolicitudNotificadaEvent evento) {
        Asesoria a = asesoriaRepository.findById(evento.idAsesoria()).orElse(null);
        if (a == null) {
            return;
        }

        String destino;
        String asunto;
        String html;
        switch (evento.tipo()) {
            case CREADA:
                destino = a.getAsesor().getAlumno().getCorreo();
                asunto = "Nueva solicitud de tutoria: " + a.getMateria().getNombre() + " (" + a.getFecha() + ")";
                html = cuerpoCreada(a);
                break;
            case ACEPTADA:
                destino = a.getAlumno().getCorreo();
                asunto = "Sesion de tutoria confirmada: " + a.getMateria().getNombre() + " (" + a.getFecha() + ")";
                html = cuerpoAceptada(a);
                break;
            case RECHAZADA:
                destino = a.getAlumno().getCorreo();
                asunto = "Solicitud de tutoria rechazada: " + a.getMateria().getNombre() + " (" + a.getFecha() + ")";
                html = cuerpoRechazada(a);
                break;
            default:
                return;
        }

        String error = enviarConReintento(destino, asunto, html, evento.tipo());
        if (error != null) {
            log.error("No se pudo notificar {} de la sesion {} a {} tras {} intentos: {}",
                    evento.tipo(), evento.idAsesoria(), destino, INTENTOS, error);
        }
    }

    private String enviarConReintento(String destino, String asunto, String html, SolicitudNotificadaEvent.Tipo tipo) {
        String ultimoError = null;
        for (int intento = 1; intento <= INTENTOS; intento++) {
            try {
                MimeMessage mensaje = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(mensaje, true, "UTF-8");
                helper.setFrom(from);
                helper.setTo(destino);
                helper.setSubject(asunto);
                helper.setText(html, true);
                mailSender.send(mensaje);
                return null;
            } catch (Exception e) {
                ultimoError = e.getMessage();
                log.warn("Fallo al enviar notificacion {} de la sesion a {} (intento {}): {}", tipo, destino, intento, e.getMessage());
            }
        }
        return ultimoError;
    }

    private String cuerpoCreada(Asesoria a) {
        StringBuilder html = CorreoInstitucional.abrir("Nueva solicitud de tutoria");
        html.append("<p style=\"margin:0 0 20px 0;\">")
            .append("Estimado/a asesor/a ").append(CorreoInstitucional.esc(nombreAsesor(a)))
            .append(",<br>Le informamos que ").append(CorreoInstitucional.esc(nombreAlumno(a)))
            .append(" ha solicitado una sesion de tutoria con usted.</p>");

        CorreoInstitucional.abrirTabla(html);
        datosComunes(html, a);
        CorreoInstitucional.fila(html, "Solicitante", nombreAlumno(a));
        CorreoInstitucional.cerrarTabla(html);

        html.append("<p style=\"margin:20px 0 0 0;\">Ingrese a la plataforma para <strong>aceptar o rechazar</strong> esta solicitud.</p>");
        CorreoInstitucional.cerrar(html);
        return html.toString();
    }

    private String cuerpoAceptada(Asesoria a) {
        StringBuilder html = CorreoInstitucional.abrir("Sesion de tutoria confirmada");
        html.append("<p style=\"margin:0 0 20px 0;\">")
            .append("Estimado/a alumno/a ").append(CorreoInstitucional.esc(nombreAlumno(a)))
            .append(",<br>Su asesor ").append(CorreoInstitucional.esc(nombreAsesor(a)))
            .append(" ha <strong>aceptado</strong> su solicitud de tutoria.</p>");

        CorreoInstitucional.abrirTabla(html);
        datosComunes(html, a);
        CorreoInstitucional.cerrarTabla(html);

        html.append("<p style=\"margin:20px 0 0 0;\">La sesion quedo agendada. Puede consultarla en <strong>Mis solicitudes</strong> de la plataforma.</p>");
        CorreoInstitucional.cerrar(html);
        return html.toString();
    }

    private String cuerpoRechazada(Asesoria a) {
        StringBuilder html = CorreoInstitucional.abrir("Solicitud de tutoria rechazada");
        html.append("<p style=\"margin:0 0 20px 0;\">")
            .append("Estimado/a alumno/a ").append(CorreoInstitucional.esc(nombreAlumno(a)))
            .append(",<br>Su asesor ").append(CorreoInstitucional.esc(nombreAsesor(a)))
            .append(" ha <strong>rechazado</strong> su solicitud de tutoria.</p>");

        CorreoInstitucional.abrirTabla(html);
        datosComunes(html, a);
        CorreoInstitucional.cerrarTabla(html);

        if (a.getMotivoRechazo() != null && !a.getMotivoRechazo().isBlank()) {
            CorreoInstitucional.bloque(html, "Motivo del rechazo", a.getMotivoRechazo());
        }
        html.append("<p style=\"margin:16px 0 0 0;font-size:13px;color:").append(BitacoraDiseno.GRIS_PIE)
            .append(";\">El horario vuelve a estar disponible para reserva.</p>");
        CorreoInstitucional.cerrar(html);
        return html.toString();
    }

    private static void datosComunes(StringBuilder html, Asesoria a) {
        CorreoInstitucional.fila(html, "Fecha", a.getFecha().toString());
        CorreoInstitucional.fila(html, "Horario", a.getHoraInicio() + " - " + a.getHoraFin());
        CorreoInstitucional.fila(html, "Materia", a.getMateria().getNombre());
        CorreoInstitucional.fila(html, "Modalidad", a.getModalidad() + (a.getLugar() == null ? "" : " - " + a.getLugar()));
    }

    private static String nombreAsesor(Asesoria a) {
        return a.getAsesor().getAlumno().getNombre() + " " + a.getAsesor().getAlumno().getApellidoPaterno();
    }

    private static String nombreAlumno(Asesoria a) {
        return a.getAlumno().getNombre() + " " + a.getAlumno().getApellidoPaterno();
    }
}
