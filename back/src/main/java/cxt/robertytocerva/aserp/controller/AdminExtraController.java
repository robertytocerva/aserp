package cxt.robertytocerva.aserp.controller;

import cxt.robertytocerva.aserp.dto.BitacoraDTO;
import cxt.robertytocerva.aserp.dto.SolicitudDTO;
import cxt.robertytocerva.aserp.service.BitacoraService;
import cxt.robertytocerva.aserp.service.SolicitudService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminExtraController {

    private final SolicitudService solicitudService;
    private final BitacoraService bitacoraService;

    @GetMapping("/solicitudes")
    public ResponseEntity<List<SolicitudDTO.Response>> listarTodasSolicitudes() {
        return ResponseEntity.ok(solicitudService.listarTodas());
    }

    @GetMapping("/bitacoras")
    public ResponseEntity<List<BitacoraDTO.Response>> listarTodasBitacoras() {
        return ResponseEntity.ok(bitacoraService.listarTodas());
    }
}