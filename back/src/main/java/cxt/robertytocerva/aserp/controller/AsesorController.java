package cxt.robertytocerva.aserp.controller;

import cxt.robertytocerva.aserp.dto.AsesorDTO;
import cxt.robertytocerva.aserp.dto.HorarioAsesorDTO;
import cxt.robertytocerva.aserp.exception.BadRequestException;
import cxt.robertytocerva.aserp.service.AsesorService;
import cxt.robertytocerva.aserp.service.HorarioAsesorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/asesores")
@RequiredArgsConstructor
public class AsesorController {

    private final AsesorService asesorService;
    private final HorarioAsesorService horarioAsesorService;

    @GetMapping
    public ResponseEntity<List<AsesorDTO.Response>> listarTodos() {
        return ResponseEntity.ok(asesorService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AsesorDTO.Response> buscarPorId(@PathVariable Integer id) {
        return ResponseEntity.ok(asesorService.buscarPorId(id));
    }

    @GetMapping("/{id}/horarios")
    public ResponseEntity<List<HorarioAsesorDTO.Response>> listarHorarios(@PathVariable Integer id) {
        return ResponseEntity.ok(horarioAsesorService.listarActivosDeAsesor(id));
    }

    @GetMapping("/{id}/horarios/disponibles")
    public ResponseEntity<List<HorarioAsesorDTO.DisponibleResponse>> listarDisponibles(
            @PathVariable Integer id,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate desde,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate hasta) {
        LocalDate desdeReal = desde != null ? desde : LocalDate.now();
        LocalDate hastaReal = hasta != null ? hasta : desdeReal.plusDays(14);
        return ResponseEntity.ok(horarioAsesorService.listarDisponibles(id, desdeReal, hastaReal));
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
