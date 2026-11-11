package cxt.robertytocerva.aserp.service;

import cxt.robertytocerva.aserp.dto.EstadisticaDTO;
import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.VerticalAlignment;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFColor;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;

/**
 * Reporte de estadisticas como libro de Excel (.xlsx) para abrir en Microsoft Excel.
 * OpenPDF solo se usa para el PDF de bitacoras.
 */
@Service
public class EstadisticaExcelService {

    private static final byte[] RGB_BLANCO = {(byte) 0xFF, (byte) 0xFF, (byte) 0xFF};
    private static final byte[] RGB_PRIMARIO = {0x1F, 0x4E, 0x79};
    private static final byte[] RGB_TEXTO_CLARO = {(byte) 0xC8, (byte) 0xD6, (byte) 0xE8};
    private static final byte[] RGB_CLARO = {(byte) 0xF2, (byte) 0xF7, (byte) 0xFB};
    private static final byte[] RGB_BORDE = {(byte) 0xE0, (byte) 0xE6, (byte) 0xED};
    private static final byte[] RGB_TEXTO = {0x33, 0x33, 0x33};

    private static final String FORMATO_DECIMAL = "0.0";
    private static final String FORMATO_PROMEDIO = "0.00";
    private static final String FORMATO_PORCENTAJE = "0.0\"%\"";

    public byte[] generar(EstadisticaDTO.Response datos) {
        try (XSSFWorkbook libro = new XSSFWorkbook(); ByteArrayOutputStream salida = new ByteArrayOutputStream()) {
            Estilos estilos = new Estilos(libro);

            hojaResumen(libro.createSheet("Resumen"), datos, estilos);
            hojaAsesores(libro.createSheet("Por asesor"), datos.porAsesor(), estilos);
            if (!datos.porMateria().isEmpty()) {
                hojaMaterias(libro.createSheet("Por materia"), datos.porMateria(), estilos);
            }

            libro.write(salida);
            return salida.toByteArray();
        } catch (IOException e) {
            throw new IllegalStateException("No se pudo generar el reporte de estadisticas", e);
        }
    }

    // ---------- Resumen ----------

    private void hojaResumen(Sheet hoja, EstadisticaDTO.Response datos, Estilos e) {
        filaTitulo(hoja, 0, "Reporte de estadisticas", e.titulo);
        filaTitulo(hoja, 1, BitacoraDiseno.INSTITUTO, e.subtitulo);
        filaTitulo(hoja, 2, nombrePeriodo(datos.periodo()) + "  |  "
                + datos.periodo().desde() + " al " + datos.periodo().hasta(), e.subtitulo);

        EstadisticaDTO.ResumenDTO r = datos.resumen();
        int fila = 4;
        fila = par(hoja, fila, "Solicitudes recibidas", r.recibidas(), e.etiqueta, e.valor);
        fila = par(hoja, fila, "Pendientes", r.pendientes(), e.etiqueta, e.valor);
        fila = par(hoja, fila, "Completadas", r.completadas(), e.etiqueta, e.valor);
        fila = par(hoja, fila, "Rechazadas", r.rechazadas(), e.etiqueta, e.valor);
        fila = par(hoja, fila, "Canceladas", r.canceladas(), e.etiqueta, e.valor);
        fila = par(hoja, fila, "No asistio", r.noAsistio(), e.etiqueta, e.valor);
        fila = par(hoja, fila, "Tasa de aceptacion", r.tasaAceptacion(), e.etiqueta, e.porcentaje);
        fila = par(hoja, fila, "Tasa de cumplimiento", r.tasaCumplimiento(), e.etiqueta, e.porcentaje);
        fila = par(hoja, fila, "Horas de tutoria", r.horasTotales(), e.etiqueta, e.decimal);
        fila = par(hoja, fila, "Alumnos atendidos", r.alumnosAtendidos(), e.etiqueta, e.valor);
        par(hoja, fila, "Asesores con actividad",
                r.asesoresConActividad() + " / " + r.asesoresTotales(), e.etiqueta, e.valor);

        hoja.setColumnWidth(0, 32 * 256);
        hoja.setColumnWidth(1, 14 * 256);
        hoja.setColumnWidth(2, 32 * 256);
        hoja.setColumnWidth(3, 14 * 256);
    }

    /** Fila del resumen: etiqueta | valor (numerico o texto). Devuelve la siguiente fila libre. */
    private int par(Sheet hoja, int numFila, String etiqueta, Object valor,
                   CellStyle estiloEtiqueta, CellStyle estiloValor) {
        Row fila = hoja.createRow(numFila);
        texto(fila, 0, etiqueta, estiloEtiqueta);
        if (valor instanceof Number || valor instanceof BigDecimal) {
            numerico(fila, 1, valor, estiloValor);
        } else {
            texto(fila, 1, valor == null ? "" : String.valueOf(valor), estiloValor);
        }
        return numFila + 1;
    }

    private void filaTitulo(Sheet hoja, int numFila, String texto, CellStyle estilo) {
        Row fila = hoja.createRow(numFila);
        for (int i = 0; i < 4; i++) {
            texto(fila, i, i == 0 ? texto : "", estilo);
        }
        hoja.addMergedRegion(new CellRangeAddress(numFila, numFila, 0, 3));
    }

    // ---------- Por asesor ----------

    private void hojaAsesores(Sheet hoja, List<EstadisticaDTO.AsesorStatsDTO> asesores, Estilos e) {
        String[] columnas = {
                "Asesor", "Matricula", "Promedio", "Validado", "Materias", "Recibidas",
                "Completadas", "Rechazadas", "Canceladas", "Pendientes", "No asistio",
                "Horas completadas", "Alumnos atendidos", "% Aceptacion", "% Cumplimiento"
        };
        Row encabezado = hoja.createRow(0);
        for (int i = 0; i < columnas.length; i++) {
            texto(encabezado, i, columnas[i], e.encabezado);
        }

        int numFila = 1;
        for (EstadisticaDTO.AsesorStatsDTO a : asesores) {
            Row fila = hoja.createRow(numFila++);
            texto(fila, 0, a.nombre(), e.texto);
            texto(fila, 1, a.matricula(), e.texto);
            numerico(fila, 2, a.promedio(), e.promedio);
            texto(fila, 3, a.validado() ? "Si" : "No", e.textoCentrado);
            numerico(fila, 4, a.materias(), e.valorCentrado);
            numerico(fila, 5, a.recibidas(), e.valorCentrado);
            numerico(fila, 6, a.completadas(), e.valorCentrado);
            numerico(fila, 7, a.rechazadas(), e.valorCentrado);
            numerico(fila, 8, a.canceladas(), e.valorCentrado);
            numerico(fila, 9, a.pendientes(), e.valorCentrado);
            numerico(fila, 10, a.noAsistio(), e.valorCentrado);
            numerico(fila, 11, a.horasCompletadas(), e.decimalCentrado);
            numerico(fila, 12, a.alumnosAtendidos(), e.valorCentrado);
            numerico(fila, 13, a.tasaAceptacion(), e.porcentajeCentrado);
            numerico(fila, 14, a.tasaCumplimiento(), e.porcentajeCentrado);
        }

        hoja.createFreezePane(0, 1);
        hoja.setAutoFilter(new CellRangeAddress(0, 0, 0, columnas.length - 1));
        int[] anchos = {34, 12, 10, 9, 9, 10, 11, 10, 11, 10, 11, 15, 15, 13, 14};
        for (int i = 0; i < anchos.length; i++) {
            hoja.setColumnWidth(i, anchos[i] * 256);
        }
    }

    // ---------- Por materia ----------

    private void hojaMaterias(Sheet hoja, List<EstadisticaDTO.MateriaStatsDTO> materias, Estilos e) {
        String[] columnas = {"Materia", "Total", "Completadas"};
        Row encabezado = hoja.createRow(0);
        for (int i = 0; i < columnas.length; i++) {
            texto(encabezado, i, columnas[i], e.encabezado);
        }

        int numFila = 1;
        for (EstadisticaDTO.MateriaStatsDTO m : materias) {
            Row fila = hoja.createRow(numFila++);
            texto(fila, 0, m.materia(), e.texto);
            numerico(fila, 1, m.total(), e.valorCentrado);
            numerico(fila, 2, m.completadas(), e.valorCentrado);
        }

        hoja.createFreezePane(0, 1);
        hoja.setAutoFilter(new CellRangeAddress(0, 0, 0, columnas.length - 1));
        hoja.setColumnWidth(0, 46 * 256);
        hoja.setColumnWidth(1, 12 * 256);
        hoja.setColumnWidth(2, 14 * 256);
    }

    // ---------- Helpers de celda ----------

    private void texto(Row fila, int numColumna, String valor, CellStyle estilo) {
        Cell celda = fila.createCell(numColumna);
        celda.setCellValue(valor == null ? "" : valor);
        celda.setCellStyle(estilo);
    }

    /** Escribe el valor como numero, para que Excel pueda ordenarlo y calcular con el. */
    private void numerico(Row fila, int numColumna, Object valor, CellStyle estilo) {
        Cell celda = fila.createCell(numColumna);
        celda.setCellValue(valor instanceof BigDecimal d ? d.doubleValue() : ((Number) valor).doubleValue());
        celda.setCellStyle(estilo);
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

    /** Estilos compartidos por todas las hojas del libro. */
    private static final class Estilos {

        final CellStyle titulo;
        final CellStyle subtitulo;
        final CellStyle encabezado;
        final CellStyle etiqueta;
        final CellStyle valor;
        final CellStyle valorCentrado;
        final CellStyle texto;
        final CellStyle textoCentrado;
        final CellStyle decimal;
        final CellStyle decimalCentrado;
        final CellStyle promedio;
        final CellStyle porcentaje;
        final CellStyle porcentajeCentrado;

        Estilos(XSSFWorkbook libro) {
            short fmtDecimal = libro.createDataFormat().getFormat(FORMATO_DECIMAL);
            short fmtPromedio = libro.createDataFormat().getFormat(FORMATO_PROMEDIO);
            short fmtPorcentaje = libro.createDataFormat().getFormat(FORMATO_PORCENTAJE);

            titulo = base(libro, true, RGB_PRIMARIO, RGB_BLANCO, true, null);
            subtitulo = base(libro, false, RGB_PRIMARIO, RGB_TEXTO_CLARO, true, null);
            encabezado = base(libro, true, RGB_PRIMARIO, RGB_BLANCO, false, null);
            etiqueta = base(libro, true, RGB_CLARO, RGB_PRIMARIO, false, null);
            valor = base(libro, false, null, RGB_TEXTO, false, null);
            valorCentrado = base(libro, false, null, RGB_TEXTO, false, HorizontalAlignment.CENTER);
            texto = base(libro, false, null, RGB_TEXTO, false, null);
            textoCentrado = base(libro, false, null, RGB_TEXTO, false, HorizontalAlignment.CENTER);
            decimal = base(libro, false, null, RGB_TEXTO, false, null);
            decimalCentrado = base(libro, false, null, RGB_TEXTO, false, HorizontalAlignment.CENTER);
            promedio = base(libro, false, null, RGB_TEXTO, false, null);
            porcentaje = base(libro, false, null, RGB_TEXTO, false, null);
            porcentajeCentrado = base(libro, false, null, RGB_TEXTO, false, HorizontalAlignment.CENTER);

            decimal.setDataFormat(fmtDecimal);
            decimalCentrado.setDataFormat(fmtDecimal);
            promedio.setDataFormat(fmtPromedio);
            porcentaje.setDataFormat(fmtPorcentaje);
            porcentajeCentrado.setDataFormat(fmtPorcentaje);
        }

        private static CellStyle base(XSSFWorkbook libro, boolean negrita, byte[] fondo,
                                      byte[] colorFuente, boolean centradoVertical,
                                      HorizontalAlignment alineacion) {
            XSSFCellStyle estilo = (XSSFCellStyle) libro.createCellStyle();
            if (fondo != null) {
                estilo.setFillForegroundColor(new XSSFColor(fondo, null));
                estilo.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            }
            estilo.setBorderTop(BorderStyle.THIN);
            estilo.setBorderBottom(BorderStyle.THIN);
            estilo.setBorderLeft(BorderStyle.THIN);
            estilo.setBorderRight(BorderStyle.THIN);
            XSSFColor borde = new XSSFColor(RGB_BORDE, null);
            estilo.setTopBorderColor(borde);
            estilo.setBottomBorderColor(borde);
            estilo.setLeftBorderColor(borde);
            estilo.setRightBorderColor(borde);
            if (centradoVertical) {
                estilo.setVerticalAlignment(VerticalAlignment.CENTER);
            }
            if (alineacion != null) {
                estilo.setAlignment(alineacion);
            }

            XSSFFont fuente = (XSSFFont) libro.createFont();
            fuente.setBold(negrita);
            fuente.setColor(new XSSFColor(colorFuente, null));
            estilo.setFont(fuente);
            return estilo;
        }
    }
}
