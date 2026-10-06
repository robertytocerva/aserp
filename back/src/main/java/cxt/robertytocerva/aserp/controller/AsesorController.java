package cxt.robertytocerva.aserp.controller;

import cxt.robertytocerva.aserp.dto.AsesorDTO;
import cxt.robertytocerva.aserp.exception.BadRequestException;
import cxt.robertytocerva.aserp.service.AsesorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/asesores")
@RequiredArgsConstructor
public class AsesorController {

    private final AsesorService asesorService;

    @GetMapping
    public ResponseEntity<List<AsesorDTO.Response>> listarTodos() {
        return ResponseEntity.ok(asesorService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AsesorDTO.Response> buscarPorId(@PathVariable Integer id) {
        return ResponseEntity.ok(asesorService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<AsesorDTO.Response> registrar(@AuthenticationPrincipal Jwt jwt,
                                                        @Valid @RequestBody AsesorDTO.RegistroRequest request) {
        Number claim = jwt.getClaim("idAlumno");
        if (claim == null) {
            throw new BadRequestException("La cuenta no tiene un alumno asociado para postularse como asesor");
        }
        return ResponseEntity.status(201).body(asesorService.registrar(claim.intValue(), request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> desactivar(@PathVariable Integer id) {
        asesorService.desactivar(id);
        return ResponseEntity.noContent().build();
    }
}
