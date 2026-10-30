package cxt.robertytocerva.aserp.controller;

import cxt.robertytocerva.aserp.dto.SolicitudDTO;
import cxt.robertytocerva.aserp.exception.BadRequestException;
import cxt.robertytocerva.aserp.service.SolicitudService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

//
import java.util.List;

@RestController
@RequestMapping("/api/solicitudes")
@RequiredArgsConstructor
public class SolicitudController {

    private final SolicitudService solicitudService;

    @PostMapping
    public ResponseEntity<SolicitudDTO.Response> solicitar(@AuthenticationPrincipal Jwt jwt,
                                                           @Valid @RequestBody SolicitudDTO.SolicitudRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(solicitudService.solicitar(idAlumno(jwt), request));
    }

    @GetMapping("/mis")
    public ResponseEntity<List<SolicitudDTO.Response>> listarMias(@AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(solicitudService.listarMias(idAlumno(jwt)));
    }

    @GetMapping("/recibidas")
    public ResponseEntity<List<SolicitudDTO.Response>> listarRecibidas(@AuthenticationPrincipal Jwt jwt,
                                                                       @RequestParam(required = false) String estado) {
        return ResponseEntity.ok(solicitudService.listarRecibidas(idAlumno(jwt), estado));
    }

    @PatchMapping("/{id}/aceptar")
    public ResponseEntity<SolicitudDTO.Response> aceptar(@AuthenticationPrincipal Jwt jwt,
                                                         @PathVariable Integer id) {
        return ResponseEntity.ok(solicitudService.aceptar(id, idAlumno(jwt)));
    }

    @PatchMapping("/{id}/completar")
    public ResponseEntity<SolicitudDTO.Response> completar(@AuthenticationPrincipal Jwt jwt,
                                                           @PathVariable Integer id) {
        return ResponseEntity.ok(solicitudService.completar(id, idAlumno(jwt)));
    }

    @PatchMapping("/{id}/rechazar")
    public ResponseEntity<SolicitudDTO.Response> rechazar(@AuthenticationPrincipal Jwt jwt,
                                                          @PathVariable Integer id,
                                                          @Valid @RequestBody(required = false) SolicitudDTO.RechazarRequest request) {
        String motivo = request == null ? null : request.motivo();
        return ResponseEntity.ok(solicitudService.rechazar(id, idAlumno(jwt), motivo));
    }

    private Integer idAlumno(Jwt jwt) {
        Number claim = jwt.getClaim("idAlumno");
        if (claim == null) {
            throw new BadRequestException("La cuenta no tiene un alumno asociado");
        }
        return claim.intValue();
    }

    //endpoint para listar
    @GetMapping("/admin/todas") 
    public ResponseEntity<List<SolicitudDTO.Response>> listarTodasAdmin() {
        return ResponseEntity.ok(solicitudService.listarTodas());
    }
}
