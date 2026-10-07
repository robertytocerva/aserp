package cxt.robertytocerva.aserp.controller;

import cxt.robertytocerva.aserp.dto.HorarioAsesorDTO;
import cxt.robertytocerva.aserp.exception.BadRequestException;
import cxt.robertytocerva.aserp.service.HorarioAsesorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/horarios")
@RequiredArgsConstructor
public class HorarioAsesorController {

    private final HorarioAsesorService horarioAsesorService;

    @GetMapping
    public ResponseEntity<List<HorarioAsesorDTO.Response>> listarMisHorarios(@AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(horarioAsesorService.listarMisHorarios(idAlumno(jwt)));
    }

    @PostMapping
    public ResponseEntity<HorarioAsesorDTO.Response> crear(@AuthenticationPrincipal Jwt jwt,
                                                           @Valid @RequestBody HorarioAsesorDTO.Request request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(horarioAsesorService.crear(idAlumno(jwt), request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<HorarioAsesorDTO.Response> actualizar(@AuthenticationPrincipal Jwt jwt,
                                                                 @PathVariable Integer id,
                                                                 @Valid @RequestBody HorarioAsesorDTO.Request request) {
        return ResponseEntity.ok(horarioAsesorService.actualizar(id, idAlumno(jwt), request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> desactivar(@AuthenticationPrincipal Jwt jwt, @PathVariable Integer id) {
        horarioAsesorService.desactivar(id, idAlumno(jwt));
        return ResponseEntity.noContent().build();
    }

    private Integer idAlumno(Jwt jwt) {
        Number claim = jwt.getClaim("idAlumno");
        if (claim == null) {
            throw new BadRequestException("La cuenta no tiene un alumno asociado");
        }
        return claim.intValue();
    }
}
