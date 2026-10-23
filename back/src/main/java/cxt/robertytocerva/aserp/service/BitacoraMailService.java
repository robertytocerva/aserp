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
                helper.setSubject("Bitácora de tutoría: " + b.getNombreMateria() + " (" + b.getFechaSesion() + ")");
                helper.setText(cuerpoHtml(b, destino), true);
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

    private String cuerpoHtml(Bitacora b, String correoDestino) {
        boolean esAsesor = b.getAsesoria().getAsesor().getAlumno().getCorreo().equals(correoDestino);
        String saludo = esAsesor
                ? "Estimado/a asesor/a " + esc(b.getNombreAsesor()) + ",<br>Le compartimos la bitacora de la sesion de tutoria que usted registro."
                : "Estimado/a alumno/a " + esc(b.getNombreAlumno()) + ",<br>Le compartimos la bitacora de la sesion de tutoria que tuvo con su asesor.";

        StringBuilder html = CorreoInstitucional.abrir("Bitacora de tutoria");
        html.append("<p style=\"margin:0 0 20px 0;\">").append(saludo).append("</p>");

        CorreoInstitucional.abrirTabla(html);
        CorreoInstitucional.fila(html, "Fecha", b.getFechaSesion().toString());
        CorreoInstitucional.fila(html, "Horario", b.getHoraInicio() + " - " + b.getHoraFin());
        CorreoInstitucional.fila(html, "No. de control", b.getMatriculaAlumno());
        CorreoInstitucional.fila(html, "Estudiante", b.getNombreAlumno());
        CorreoInstitucional.fila(html, "Carrera", b.getNombreCarrera());
        CorreoInstitucional.fila(html, "Asesor", b.getNombreAsesor());
        CorreoInstitucional.fila(html, "Materia", b.getNombreMateria());
        CorreoInstitucional.cerrarTabla(html);

        CorreoInstitucional.bloque(html, "Tema tratado", b.getTemasTratados());
        if (b.getTareasAsignadas() != null) {
            CorreoInstitucional.bloque(html, "Tareas asignadas", b.getTareasAsignadas());
        }
        if (b.getObservaciones() != null) {
            CorreoInstitucional.bloque(html, "Observaciones", b.getObservaciones());
        }
        if (b.getImagenEvidencia() != null) {
            html.append("<p style=\"margin:16px 0 0 0;font-size:13px;color:").append(BitacoraDiseno.GRIS_PIE)
                .append(";\">La evidencia fotografica se incluye en el PDF adjunto.</p>");
        }

        CorreoInstitucional.cerrar(html);
        return html.toString();
    }

    private static String esc(String texto) {
        return CorreoInstitucional.esc(texto);
    }
}
