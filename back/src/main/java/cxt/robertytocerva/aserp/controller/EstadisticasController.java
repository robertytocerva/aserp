package cxt.robertytocerva.aserp.controller;

import cxt.robertytocerva.aserp.dto.EstadisticaDTO;
import cxt.robertytocerva.aserp.service.EstadisticaPdfService;
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

    private final EstadisticaService estadisticaService;
    private final EstadisticaPdfService estadisticaPdfService;

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
        byte[] pdf = estadisticaPdfService.generar(datos);
        String nombre = "estadisticas-" + datos.periodo().desde() + "-" + datos.periodo().hasta() + ".pdf";
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + nombre + "\"")
                .body(pdf);
    }
}
