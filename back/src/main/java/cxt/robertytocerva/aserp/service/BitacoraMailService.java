package cxt.robertytocerva.aserp.service;

import cxt.robertytocerva.aserp.entity.Bitacora;
import cxt.robertytocerva.aserp.repository.BitacoraRepository;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;
import org.springframework.web.util.HtmlUtils;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class BitacoraMailService {

    private static final int INTENTOS = 2;

    private final BitacoraRepository bitacoraRepository;
    private final BitacoraPdfService bitacoraPdfService;
    private final JavaMailSender mailSender;

    @Value("${app.mail.from}")
    private String from;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void enviarBitacora(BitacoraCreadaEvent evento) {
        Bitacora b = bitacoraRepository.findById(evento.idBitacora()).orElse(null);
        if (b == null) {
            return;
        }

        List<String> destinatarios = new ArrayList<>();
        destinatarios.add(b.getAsesoria().getAsesor().getAlumno().getCorreo());
        destinatarios.add(b.getAsesoria().getAlumno().getCorreo());

        List<String> errores = new ArrayList<>();
        byte[] pdf = null;
        try {
            pdf = bitacoraPdfService.generar(b);
        } catch (Exception e) {
            errores.add("PDF: " + e.getMessage());
        }

        if (pdf != null) {
            for (String destino : destinatarios) {
                String error = enviarConReintento(destino, b, pdf);
                if (error != null) {
                    errores.add(destino + ": " + error);
                }
            }
        }

        b.setCorreoEnviado(errores.isEmpty());
        b.setCorreoError(errores.isEmpty() ? null : String.join(" | ", errores));
        bitacoraRepository.save(b);
    }

    private String enviarConReintento(String destino, Bitacora b, byte[] pdf) {
        String ultimoError = null;
        for (int intento = 1; intento <= INTENTOS; intento++) {
            try {
                MimeMessage mensaje = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(mensaje, true, "UTF-8");
                helper.setFrom(from);
                helper.setTo(destino);
                helper.setSubject("Bitacora de tutoria: " + b.getNombreMateria() + " (" + b.getFechaSesion() + ")");
                helper.setText(cuerpoHtml(b), true);
                helper.addAttachment("bitacora-" + b.getIdBitacora() + ".pdf", new ByteArrayResource(pdf), "application/pdf");
                mailSender.send(mensaje);
                return null;
            } catch (Exception e) {
                ultimoError = e.getMessage();
                log.warn("Fallo al enviar bitacora {} a {} (intento {}): {}", b.getIdBitacora(), destino, intento, e.getMessage());
            }
        }
        return ultimoError;
    }

    private String cuerpoHtml(Bitacora b) {
        StringBuilder html = new StringBuilder();
        html.append("<h2>Bitacora de tutoria</h2>");
        html.append("<table border=\"1\" cellpadding=\"6\" cellspacing=\"0\">");
        fila(html, "Fecha", b.getFechaSesion().toString());
        fila(html, "Horario", b.getHoraInicio() + " - " + b.getHoraFin());
        fila(html, "No. de control", b.getMatriculaAlumno());
        fila(html, "Estudiante", b.getNombreAlumno());
        fila(html, "Carrera", b.getNombreCarrera());
        fila(html, "Asesor", b.getNombreAsesor());
        fila(html, "Materia", b.getNombreMateria());
        html.append("</table>");
        bloque(html, "Tema tratado", b.getTemasTratados());
        if (b.getTareasAsignadas() != null) {
            bloque(html, "Tareas asignadas", b.getTareasAsignadas());
        }
        if (b.getObservaciones() != null) {
            bloque(html, "Observaciones", b.getObservaciones());
        }
        if (b.getImagenEvidencia() != null) {
            html.append("<p>La evidencia fotografica se incluye en el PDF adjunto.</p>");
        }
        html.append("<p>Se adjunta la bitacora en PDF.</p>");
        return html.toString();
    }

    private static void fila(StringBuilder html, String etiqueta, String valor) {
        html.append("<tr><th align=\"left\">").append(HtmlUtils.htmlEscape(etiqueta))
                .append("</th><td>").append(HtmlUtils.htmlEscape(valor == null ? "" : valor))
                .append("</td></tr>");
    }

    private static void bloque(StringBuilder html, String titulo, String texto) {
        html.append("<h3>").append(HtmlUtils.htmlEscape(titulo)).append("</h3>");
        html.append("<p>").append(HtmlUtils.htmlEscape(texto).replace("\n", "<br>")).append("</p>");
    }
}
