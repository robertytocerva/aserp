package cxt.robertytocerva.aserp.controller;

import cxt.robertytocerva.aserp.dto.AsesorDTO;
import cxt.robertytocerva.aserp.service.AsesorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AsesorService asesorService;

    @PatchMapping("/asesores/{id}/validacion")
    public ResponseEntity<AsesorDTO.Response> actualizarValidacion(@PathVariable Integer id,
                                                                    @Valid @RequestBody AsesorDTO.ValidacionRequest request) {
        return ResponseEntity.ok(asesorService.actualizarValidacion(id, request));
    }
}
