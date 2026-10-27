package cxt.robertytocerva.aserp.service;

import cxt.robertytocerva.aserp.dto.EstadisticaDTO;
import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfPageEventHelper;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.util.List;

@Service
public class EstadisticaPdfService {

    private static final float MARGEN_LATERAL = 30f;
    private static final float MARGEN_INFERIOR = 50f;

    public byte[] generar(EstadisticaDTO.Response datos) {
        try (ByteArrayOutputStream salida = new ByteArrayOutputStream()) {
            Document doc = new Document(PageSize.A4.rotate(), MARGEN_LATERAL, MARGEN_LATERAL, 0f, MARGEN_INFERIOR);
            PdfWriter writer = PdfWriter.getInstance(doc, salida);
            writer.setPageEvent(new PiePeriodo(datos.periodo()));
            doc.open();

            encabezado(doc, datos.periodo());
            resumen(doc, datos.resumen());
            tablaAsesores(doc, datos.porAsesor());
            if (!datos.porMateria().isEmpty()) {
                tablaMaterias(doc, datos.porMateria());
            }

            doc.close();
            return salida.toByteArray();
        } catch (DocumentException | java.io.IOException e) {
            throw new IllegalStateException("No se pudo generar el reporte de estadisticas", e);
        }
    }

    private static Font fuente(float tamano, int estilo, java.awt.Color color) {
        return FontFactory.getFont(FontFactory.HELVETICA, tamano, estilo, color);
    }

    private static void encabezado(Document doc, EstadisticaDTO.PeriodoDTO periodo) throws DocumentException {
        Font instituto = fuente(9, Font.BOLD, BitacoraDiseno.BLANCO_BC);
        Font titulo = fuente(20, Font.BOLD, BitacoraDiseno.BLANCO_BC);
        Font sub = fuente(10, Font.NORMAL, BitacoraDiseno.TEXTO_CLARO_BC);

        PdfPTable banda = new PdfPTable(1);
        banda.setWidthPercentage(100);
        PdfPCell celda = new PdfPCell();
        celda.setBackgroundColor(BitacoraDiseno.PRIMARIO_BC);
        celda.setPadding(20f);

        Paragraph pInstituto = new Paragraph(BitacoraDiseno.INSTITUTO.toUpperCase(), instituto);
        pInstituto.setAlignment(Element.ALIGN_CENTER);
        pInstituto.setSpacingAfter(5f);
        celda.addElement(pInstituto);

        Paragraph pTitulo = new Paragraph("Reporte de estadisticas", titulo);
        pTitulo.setAlignment(Element.ALIGN_CENTER);
        pTitulo.setSpacingAfter(5f);
        celda.addElement(pTitulo);

        Paragraph pPeriodo = new Paragraph(nombrePeriodo(periodo) + "  |  " + periodo.desde() + " al " + periodo.hasta(), sub);
        pPeriodo.setAlignment(Element.ALIGN_CENTER);
        celda.addElement(pPeriodo);

        banda.addCell(celda);
        doc.add(banda);
    }

    /** Etiqueta del semestre academico si el rango coincide con uno completo. */
    private static String nombrePeriodo(EstadisticaDTO.PeriodoDTO periodo) {
        String desde = periodo.desde();
        String hasta = periodo.hasta();
        String anio = desde.substring(0, 4);
        if (desde.endsWith("-01-01") && hasta.endsWith("-07-31")) {
            return "Semestre Ene-Jul " + anio;
        }
        if (desde.endsWith("-08-01") && hasta.endsWith("-12-31")) {
            return "Semestre Ago-Dic " + anio;
        }
        return "Periodo personalizado";
    }

    private static void resumen(Document doc, EstadisticaDTO.ResumenDTO r) throws DocumentException {
        Font etiqueta = fuente(9, Font.BOLD, BitacoraDiseno.PRIMARIO_BC);
        Font valor = fuente(10, Font.NORMAL, BitacoraDiseno.TEXTO_BC);

        PdfPTable t = new PdfPTable(4);
        t.setWidthPercentage(100);
        t.setWidths(new float[]{2.4f, 1f, 2.4f, 1f});
        t.setSpacingBefore(14f);

        par(t, "Solicitudes recibidas", String.valueOf(r.recibidas()), etiqueta, valor);
        par(t, "Pendientes", String.valueOf(r.pendientes()), etiqueta, valor);
        par(t, "Completadas", String.valueOf(r.completadas()), etiqueta, valor);
        par(t, "Rechazadas", String.valueOf(r.rechazadas()), etiqueta, valor);
        par(t, "Canceladas", String.valueOf(r.canceladas()), etiqueta, valor);
        par(t, "No asistio", String.valueOf(r.noAsistio()), etiqueta, valor);
        par(t, "Tasa de aceptacion", r.tasaAceptacion() + " %", etiqueta, valor);
        par(t, "Tasa de cumplimiento", r.tasaCumplimiento() + " %", etiqueta, valor);
        par(t, "Horas de tutoria", String.valueOf(r.horasTotales()), etiqueta, valor);
        par(t, "Alumnos atendidos", String.valueOf(r.alumnosAtendidos()), etiqueta, valor);
        par(t, "Asesores con actividad", r.asesoresConActividad() + " / " + r.asesoresTotales(), etiqueta, valor);
        // la fila debe cerrarse con 4 celdas: OpenPDF descarta las filas incompletas
        PdfPCell vacia = new PdfPCell(new Phrase("", valor));
        vacia.setBorder(PdfPCell.NO_BORDER);
        t.addCell(vacia);
        t.addCell(new PdfPCell(vacia));
        doc.add(t);
    }

    private static void par(PdfPTable t, String nombre, String valorTxt, Font etiqueta, Font valor) {
        PdfPCell c1 = celda(nombre, etiqueta);
        c1.setBackgroundColor(BitacoraDiseno.CLARO_BC);
        t.addCell(c1);
        t.addCell(celda(valorTxt, valor));
    }

    private static void tablaAsesores(Document doc, List<EstadisticaDTO.AsesorStatsDTO> asesores) throws DocumentException {
        Font cabecera = fuente(8, Font.BOLD, BitacoraDiseno.BLANCO_BC);
        Font celda = fuente(8, Font.NORMAL, BitacoraDiseno.TEXTO_BC);

        Paragraph titulo = new Paragraph("Desempeno por asesor", fuente(12, Font.BOLD, BitacoraDiseno.PRIMARIO_BC));
        titulo.setSpacingBefore(16f);
        titulo.setSpacingAfter(6f);
        doc.add(titulo);

        String[] columnas = {"Asesor", "Matricula", "Materias", "Recibidas", "Complet.", "Rechaz.",
                "Pend.", "No asist.", "Horas", "% Acept.", "% Cumpl."};
        float[] anchos = {16f, 8f, 6f, 7.5f, 7.5f, 6.5f, 6f, 7f, 6f, 7f, 7f};

        PdfPTable t = new PdfPTable(columnas.length);
        t.setWidthPercentage(100);
        t.setWidths(anchos);

        for (String c : columnas) {
            PdfPCell h = new PdfPCell(new Phrase(c, cabecera));
            h.setBackgroundColor(BitacoraDiseno.PRIMARIO_BC);
            h.setPadding(5f);
            h.setHorizontalAlignment(Element.ALIGN_CENTER);
            t.addCell(h);
        }

        for (EstadisticaDTO.AsesorStatsDTO a : asesores) {
            t.addCell(celdaTabla(a.nombre(), celda, Element.ALIGN_LEFT));
            t.addCell(celdaTabla(a.matricula(), celda, Element.ALIGN_CENTER));
            t.addCell(celdaTabla(String.valueOf(a.materias()), celda, Element.ALIGN_CENTER));
            t.addCell(celdaTabla(String.valueOf(a.recibidas()), celda, Element.ALIGN_CENTER));
            t.addCell(celdaTabla(String.valueOf(a.completadas()), celda, Element.ALIGN_CENTER));
            t.addCell(celdaTabla(String.valueOf(a.rechazadas()), celda, Element.ALIGN_CENTER));
            t.addCell(celdaTabla(String.valueOf(a.pendientes()), celda, Element.ALIGN_CENTER));
            t.addCell(celdaTabla(String.valueOf(a.noAsistio()), celda, Element.ALIGN_CENTER));
            t.addCell(celdaTabla(String.valueOf(a.horasCompletadas()), celda, Element.ALIGN_CENTER));
            t.addCell(celdaTabla(a.tasaAceptacion() + " %", celda, Element.ALIGN_CENTER));
            t.addCell(celdaTabla(a.tasaCumplimiento() + " %", celda, Element.ALIGN_CENTER));
        }
        doc.add(t);
    }

    private static void tablaMaterias(Document doc, List<EstadisticaDTO.MateriaStatsDTO> materias) throws DocumentException {
        Font cabecera = fuente(9, Font.BOLD, BitacoraDiseno.BLANCO_BC);
        Font celda = fuente(9, Font.NORMAL, BitacoraDiseno.TEXTO_BC);

        Paragraph titulo = new Paragraph("Solicitudes por materia", fuente(12, Font.BOLD, BitacoraDiseno.PRIMARIO_BC));
        titulo.setSpacingBefore(16f);
        titulo.setSpacingAfter(6f);
        doc.add(titulo);

        PdfPTable t = new PdfPTable(3);
        t.setWidthPercentage(60);
        t.setWidths(new float[]{3f, 1f, 1f});

        String[] columnas = {"Materia", "Total", "Completadas"};
        for (String c : columnas) {
            PdfPCell h = new PdfPCell(new Phrase(c, cabecera));
            h.setBackgroundColor(BitacoraDiseno.PRIMARIO_BC);
            h.setPadding(5f);
            h.setHorizontalAlignment(Element.ALIGN_CENTER);
            t.addCell(h);
        }

        for (EstadisticaDTO.MateriaStatsDTO m : materias) {
            t.addCell(celdaTabla(m.materia(), celda, Element.ALIGN_LEFT));
            t.addCell(celdaTabla(String.valueOf(m.total()), celda, Element.ALIGN_CENTER));
            t.addCell(celdaTabla(String.valueOf(m.completadas()), celda, Element.ALIGN_CENTER));
        }
        doc.add(t);
    }

    private static PdfPCell celda(String contenido, Font fuente) {
        PdfPCell c = new PdfPCell(new Phrase(contenido, fuente));
        c.setPadding(5f);
        c.setBorderColor(BitacoraDiseno.BORDE_BC);
        c.setBorderWidth(0.5f);
        return c;
    }

    private static PdfPCell celdaTabla(String contenido, Font fuente, int alineacion) {
        PdfPCell c = celda(contenido, fuente);
        c.setHorizontalAlignment(alineacion);
        return c;
    }

    private static class PiePeriodo extends PdfPageEventHelper {

        private final Font fuente = fuente(8, Font.NORMAL, BitacoraDiseno.GRIS_PIE_BC);
        private final String periodo;

        PiePeriodo(EstadisticaDTO.PeriodoDTO periodo) {
            this.periodo = periodo.desde() + " al " + periodo.hasta();
        }

        @Override
        public void onEndPage(PdfWriter writer, Document doc) {
            PdfPTable banda = new PdfPTable(1);
            banda.setWidthPercentage(100);
            PdfPCell celda = new PdfPCell(new Phrase(
                    BitacoraDiseno.INSTITUTO + "  |  ASERP  |  Filtro: " + periodo
                            + "  |  Generado el " + LocalDate.now(), fuente));
            celda.setHorizontalAlignment(Element.ALIGN_CENTER);
            celda.setBorder(PdfPCell.NO_BORDER);
            celda.setBorderWidthTop(0.5f);
            celda.setBorderColorTop(BitacoraDiseno.BORDE_BC);
            celda.setPaddingTop(5f);
            banda.addCell(celda);
            try {
                // writeSelectedRows exige el ancho absoluto fijado, si no lanza IllegalStateException
                banda.setTotalWidth(doc.right() - doc.left());
                banda.writeSelectedRows(0, -1, doc.left(), doc.bottom() - 2f, writer.getDirectContent());
            } catch (Exception ignorada) {
                // el pie es decorativo
            }
            com.lowagie.text.pdf.ColumnText.showTextAligned(
                    writer.getDirectContent(),
                    Element.ALIGN_CENTER,
                    new Phrase("Pagina " + writer.getPageNumber(), fuente),
                    (doc.left() + doc.right()) / 2,
                    doc.bottom() - 36f,
                    0);
        }
    }
}
