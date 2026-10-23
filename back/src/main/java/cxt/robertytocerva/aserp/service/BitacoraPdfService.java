package cxt.robertytocerva.aserp.service;

import cxt.robertytocerva.aserp.entity.Bitacora;
import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.Image;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfPageEventHelper;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;

@Service
public class BitacoraPdfService {

    private static final float MARGEN_LATERAL = 40f;
    private static final float MARGEN_INFERIOR = 50f;

    public byte[] generar(Bitacora b) {
        try (ByteArrayOutputStream salida = new ByteArrayOutputStream()) {
            Document doc = new Document(PageSize.A4, MARGEN_LATERAL, MARGEN_LATERAL, 0f, MARGEN_INFERIOR);
            PdfWriter writer = PdfWriter.getInstance(doc, salida);
            writer.setPageEvent(new PiePagina());
            doc.open();

            encabezado(doc);

            Font etiqueta = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, BitacoraDiseno.PRIMARIO_BC);
            Font texto = FontFactory.getFont(FontFactory.HELVETICA, 10, BitacoraDiseno.TEXTO_BC);

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
                Paragraph tituloEvidencia = new Paragraph("Evidencia fotografica", etiqueta);
                tituloEvidencia.setSpacingBefore(14);
                doc.add(tituloEvidencia);
                try {
                    Image img = Image.getInstance(b.getImagenEvidencia());
                    img.scaleToFit(480, 320);
                    img.setAlignment(Element.ALIGN_CENTER);
                    img.setSpacingBefore(6);
                    doc.add(img);
                } catch (Exception ignorada) {
                    doc.add(new Paragraph("(La imagen de evidencia no pudo incrustarse)", texto));
                }
            }

            doc.close();
            return salida.toByteArray();
        } catch (DocumentException | java.io.IOException e) {
            throw new IllegalStateException("No se pudo generar el PDF de la bitacora", e);
        }
    }

    private static void encabezado(Document doc) throws DocumentException {
        Font instituto = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9, BitacoraDiseno.BLANCO_BC);
        Font titulo = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 20, BitacoraDiseno.BLANCO_BC);

        PdfPTable banda = new PdfPTable(1);
        banda.setWidthPercentage(100);
        PdfPCell celda = new PdfPCell();
        celda.setBackgroundColor(BitacoraDiseno.PRIMARIO_BC);
        celda.setPadding(22f);

        Paragraph pInstituto = new Paragraph(BitacoraDiseno.INSTITUTO.toUpperCase(), instituto);
        pInstituto.setAlignment(Element.ALIGN_CENTER);
        pInstituto.setSpacingAfter(6f);
        celda.addElement(pInstituto);

        Paragraph pTitulo = new Paragraph("Bitácora de tutoría", titulo);
        pTitulo.setAlignment(Element.ALIGN_CENTER);
        celda.addElement(pTitulo);

        banda.addCell(celda);
        doc.add(banda);
    }

    private static String fmt(java.time.LocalTime hora) {
        return String.format("%02d:%02d", hora.getHour(), hora.getMinute());
    }

    private static void agregarFila(PdfPTable tabla, String nombre, String valor, Font etiqueta, Font texto) {
        tabla.addCell(celda(nombre, etiqueta, true));
        tabla.addCell(celda(valor == null ? "" : valor, texto, false));
    }

    private static PdfPCell celda(String contenido, Font fuente, boolean etiqueta) {
        PdfPCell c = new PdfPCell(new Phrase(contenido, fuente));
        c.setPadding(7f);
        c.setBorderColor(BitacoraDiseno.BORDE_BC);
        c.setBorderWidth(0.5f);
        if (etiqueta) {
            c.setBackgroundColor(BitacoraDiseno.CLARO_BC);
        }
        return c;
    }

    private static Paragraph seccion(String titulo, String contenido, Font etiqueta, Font texto) {
        Paragraph p = new Paragraph();
        p.setSpacingBefore(14);
        Paragraph pTitulo = new Paragraph(titulo, etiqueta);
        pTitulo.setSpacingAfter(3f);
        p.add(pTitulo);
        p.add(new Phrase(contenido, texto));
        return p;
    }

    private static class PiePagina extends PdfPageEventHelper {

        private final Font fuente = FontFactory.getFont(FontFactory.HELVETICA, 8, BitacoraDiseno.GRIS_PIE_BC);

        @Override
        public void onEndPage(PdfWriter writer, Document doc) {
            float centro = (doc.left() + doc.right()) / 2;

            PdfPTable banda = new PdfPTable(1);
            banda.setWidthPercentage(100);
            PdfPCell celda = new PdfPCell(new Phrase(
                    BitacoraDiseno.INSTITUTO + "  |  ASERP", fuente));
            celda.setHorizontalAlignment(Element.ALIGN_CENTER);
            celda.setPaddingTop(5f);
            celda.setBorder(PdfPCell.NO_BORDER);
            celda.setBorderWidthTop(0.5f);
            celda.setBorderColorTop(BitacoraDiseno.BORDE_BC);
            banda.addCell(celda);
            try {
                // writeSelectedRows exige el ancho absoluto fijado, si no lanza IllegalStateException
                banda.setTotalWidth(doc.right() - doc.left());
                banda.writeSelectedRows(0, -1, doc.left(), doc.bottom() - 2f, writer.getDirectContent());
            } catch (Exception ignorada) {
                // el pie es decorativo: su fallo no debe impedir el PDF
            }

            com.lowagie.text.pdf.ColumnText.showTextAligned(
                    writer.getDirectContent(),
                    Element.ALIGN_CENTER,
                    new Phrase("Pagina " + writer.getPageNumber(), fuente),
                    centro,
                    doc.bottom() - 36f,
                    0);
        }
    }
}
