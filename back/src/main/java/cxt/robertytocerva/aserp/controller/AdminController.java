package cxt.robertytocerva.aserp.controller;

import cxt.robertytocerva.aserp.dto.AsesorDTO;
import cxt.robertytocerva.aserp.dto.AsesorMateriaDTO;
import cxt.robertytocerva.aserp.service.AsesorMateriaService;
import cxt.robertytocerva.aserp.service.AsesorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AsesorService asesorService;
    private final AsesorMateriaService asesorMateriaService;

    @PatchMapping("/asesores/{id}/validacion")
    public ResponseEntity<AsesorDTO.Response> actualizarValidacion(@PathVariable Integer id,
                                                                    @Valid @RequestBody AsesorDTO.ValidacionRequest request) {
        return ResponseEntity.ok(asesorService.actualizarValidacion(id, request));
    }

    @PostMapping("/asesores/{idAsesor}/materias")
    public ResponseEntity<AsesorMateriaDTO.Response> asignarMateria(@PathVariable Integer idAsesor,
                                                                    @Valid @RequestBody AsesorMateriaDTO.AsignacionRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(asesorMateriaService.asignar(idAsesor, request));
    }

    @PutMapping("/asesores/{idAsesor}/materias/{idMateria}")
    public ResponseEntity<AsesorMateriaDTO.Response> actualizarNivelMateria(@PathVariable Integer idAsesor,
                                                                            @PathVariable Integer idMateria,
                                                                            @Valid @RequestBody AsesorMateriaDTO.NivelRequest request) {
        return ResponseEntity.ok(asesorMateriaService.actualizarNivel(idAsesor, idMateria, request));
    }

    @DeleteMapping("/asesores/{idAsesor}/materias/{idMateria}")
    public ResponseEntity<Void> quitarMateria(@PathVariable Integer idAsesor, @PathVariable Integer idMateria) {
        asesorMateriaService.quitar(idAsesor, idMateria);
        return ResponseEntity.noContent().build();
    }
}
