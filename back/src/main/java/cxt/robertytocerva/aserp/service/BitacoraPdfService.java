package cxt.robertytocerva.aserp.service;

import cxt.robertytocerva.aserp.entity.Bitacora;
import com.lowagie.text.Document;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.Image;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;

@Service
public class BitacoraPdfService {

    public byte[] generar(Bitacora b) {
        try (ByteArrayOutputStream salida = new ByteArrayOutputStream()) {
            Document doc = new Document();
            PdfWriter.getInstance(doc, salida);
            doc.open();

            Font titulo = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16);
            Font etiqueta = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11);
            Font texto = FontFactory.getFont(FontFactory.HELVETICA, 11);

            Paragraph encabezado = new Paragraph("Bitacora de tutoria", titulo);
            encabezado.setAlignment(Element.ALIGN_CENTER);
            encabezado.setSpacingAfter(16);
            doc.add(encabezado);

            PdfPTable tabla = new PdfPTable(2);
            tabla.setWidthPercentage(100);
            tabla.setWidths(new float[]{1f, 2.2f});
            agregarFila(tabla, "Fecha", b.getFechaSesion().toString(), etiqueta, texto);
            agregarFila(tabla, "Horario", fmt(b.getHoraInicio()) + " - " + fmt(b.getHoraFin()), etiqueta, texto);
            agregarFila(tabla, "No. de control", b.getMatriculaAlumno(), etiqueta, texto);
            agregarFila(tabla, "Estudiante", b.getNombreAlumno(), etiqueta, texto);
            agregarFila(tabla, "Carrera", b.getNombreCarrera(), etiqueta, texto);
            agregarFila(tabla, "Asesor", b.getNombreAsesor(), etiqueta, texto);
            agregarFila(tabla, "Materia", b.getNombreMateria(), etiqueta, texto);
            doc.add(tabla);

            doc.add(seccion("Tema tratado", b.getTemasTratados(), etiqueta, texto));
            if (b.getTareasAsignadas() != null && !b.getTareasAsignadas().isBlank()) {
                doc.add(seccion("Tareas asignadas", b.getTareasAsignadas(), etiqueta, texto));
            }
            if (b.getObservaciones() != null && !b.getObservaciones().isBlank()) {
                doc.add(seccion("Observaciones", b.getObservaciones(), etiqueta, texto));
            }

            if (b.getImagenEvidencia() != null) {
                doc.add(new Paragraph("Evidencia", etiqueta));
                try {
                    Image img = Image.getInstance(b.getImagenEvidencia());
                    img.scaleToFit(480, 320);
                    img.setAlignment(Element.ALIGN_CENTER);
                    doc.add(img);
                } catch (Exception ignorada) {
                    doc.add(new Paragraph("(La imagen de evidencia no pudo incrustarse)", texto));
                }
            }

            doc.close();
            return salida.toByteArray();
        } catch (Exception e) {
            throw new IllegalStateException("No se pudo generar el PDF de la bitacora", e);
        }
    }

    private static String fmt(java.time.LocalTime hora) {
        return String.format("%02d:%02d", hora.getHour(), hora.getMinute());
    }

    private static void agregarFila(PdfPTable tabla, String nombre, String valor, Font etiqueta, Font texto) {
        tabla.addCell(celda(nombre, etiqueta));
        tabla.addCell(celda(valor == null ? "" : valor, texto));
    }

    private static PdfPCell celda(String contenido, Font fuente) {
        PdfPCell c = new PdfPCell(new Paragraph(contenido, fuente));
        c.setPadding(6);
        return c;
    }

    private static Paragraph seccion(String titulo, String contenido, Font etiqueta, Font texto) {
        Paragraph p = new Paragraph();
        p.setSpacingBefore(12);
        p.add(new com.lowagie.text.Chunk(titulo + "\n", etiqueta));
        p.add(new com.lowagie.text.Chunk(contenido, texto));
        return p;
    }
}
