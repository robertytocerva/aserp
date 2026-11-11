package cxt.robertytocerva.aserp.controller;

import cxt.robertytocerva.aserp.dto.EstadisticaDTO;
import cxt.robertytocerva.aserp.service.EstadisticaExcelService;
import cxt.robertytocerva.aserp.service.EstadisticaService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/admin/estadisticas")
@RequiredArgsConstructor
public class EstadisticasController {

    /** MIME del libro de Excel .xlsx. */
    private static final MediaType XLSX =
            MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

    private final EstadisticaService estadisticaService;
    private final EstadisticaExcelService estadisticaExcelService;

    @GetMapping
    public ResponseEntity<EstadisticaDTO.Response> obtener(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate desde,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate hasta) {
        return ResponseEntity.ok(estadisticaService.obtener(desde, hasta));
    }

    @GetMapping("/reporte")
    public ResponseEntity<byte[]> reporte(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate desde,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate hasta) {
        EstadisticaDTO.Response datos = estadisticaService.obtener(desde, hasta);
        byte[] contenido = estadisticaExcelService.generar(datos);
        String nombre = "estadisticas-" + datos.periodo().desde() + "-" + datos.periodo().hasta() + ".xlsx";
        return ResponseEntity.ok()
                .contentType(XLSX)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + nombre + "\"")
                .body(contenido);
    }
}
