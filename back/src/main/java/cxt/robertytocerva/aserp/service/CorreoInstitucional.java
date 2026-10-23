package cxt.robertytocerva.aserp.service;

public final class CorreoInstitucional {

    private CorreoInstitucional() {}

    /** Abre el contenedor, la banda de encabezado y el cuerpo del correo. Devuelve el StringBuilder abierto. */
    public static StringBuilder abrir(String tituloEncabezado) {
        StringBuilder html = new StringBuilder();
        html.append("<div style=\"background-color:").append(BitacoraDiseno.CLARO)
            .append(";padding:24px 12px;font-family:Arial,Helvetica,sans-serif;\">");
        html.append("<table role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"max-width:640px;margin:0 auto;background-color:")
            .append(BitacoraDiseno.BLANCO).append(";border-radius:6px;overflow:hidden;border:1px solid")
            .append(BitacoraDiseno.BORDE).append(";\">");

        // banda institucional
        html.append("<tr><td style=\"background-color:").append(BitacoraDiseno.PRIMARIO)
            .append(";padding:28px 32px;text-align:center;\">")
            .append("<div style=\"font-size:12px;letter-spacing:1px;color:").append(BitacoraDiseno.TEXTO_CLARO)
            .append(";text-transform:uppercase;\">").append(BitacoraDiseno.INSTITUTO).append("</div>")
            .append("<div style=\"font-size:24px;font-weight:bold;color:").append(BitacoraDiseno.BLANCO)
            .append(";margin-top:8px;\">").append(esc(tituloEncabezado)).append("</div>")
            .append("</td></tr>");

        // barra de acento
        html.append("<tr><td style=\"height:4px;background-color:").append(BitacoraDiseno.ACCENTO)
            .append(";font-size:0;line-height:0;\">&nbsp;</td></tr>");

        // cuerpo abierto
        html.append("<tr><td style=\"padding:28px 32px;font-size:14px;line-height:1.5;color:")
            .append(BitacoraDiseno.TEXTO).append(";\">");
        return html;
    }

    /** Cierra el cuerpo y agrega el pie institucional. */
    public static void cerrar(StringBuilder html) {
        html.append("</td></tr>");
        html.append("<tr><td style=\"background-color:").append(BitacoraDiseno.CLARO)
            .append(";border-top:1px solid").append(BitacoraDiseno.BORDE)
            .append(";padding:16px 32px;font-size:12px;color:").append(BitacoraDiseno.GRIS_PIE)
            .append(";text-align:center;\">Este mensaje fue generado automaticamente por ASERP.<br>No responda a este correo.</td></tr>");
        html.append("</table></div>");
    }

    /** Par etiqueta/valor de la tabla de datos. */
    public static void fila(StringBuilder html, String etiqueta, String valor) {
        html.append("<tr><td style=\"padding:10px 14px;border-bottom:1px solid").append(BitacoraDiseno.BORDE)
            .append(";background-color:").append(BitacoraDiseno.CLARO)
            .append(";font-weight:bold;color:").append(BitacoraDiseno.PRIMARIO)
            .append(";width:180px;\">").append(esc(etiqueta)).append("</td>")
            .append("<td style=\"padding:10px 14px;border-bottom:1px solid").append(BitacoraDiseno.BORDE)
            .append(";color:").append(BitacoraDiseno.TEXTO).append(";\">").append(esc(valor)).append("</td></tr>");
    }

    /** Seccion titulo + texto con saltos de linea. */
    public static void bloque(StringBuilder html, String titulo, String texto) {
        html.append("<p style=\"margin:20px 0 4px 0;font-size:14px;font-weight:bold;color:")
            .append(BitacoraDiseno.PRIMARIO).append(";\">").append(esc(titulo)).append("</p>");
        html.append("<p style=\"margin:0;font-size:14px;line-height:1.5;color:")
            .append(BitacoraDiseno.TEXTO).append(";\">").append(esc(texto).replace("\n", "<br>")).append("</p>");
    }

    /** Cierre de tabla de datos. */
    public static void cerrarTabla(StringBuilder html) {
        html.append("</table>");
    }

    /** Abre la tabla de datos. */
    public static void abrirTabla(StringBuilder html) {
        html.append("<table cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"border:1px solid")
            .append(BitacoraDiseno.BORDE).append(";border-collapse:collapse;\">");
    }

    public static String esc(String texto) {
        return org.springframework.web.util.HtmlUtils.htmlEscape(texto == null ? "" : texto);
    }
}
