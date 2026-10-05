package cxt.robertytocerva.aserp.controller;

import cxt.robertytocerva.aserp.dto.MateriaDTO;
import cxt.robertytocerva.aserp.service.MateriaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/materias")
@RequiredArgsConstructor
public class MateriaController {

    private final MateriaService materiaService;

    @GetMapping
    public ResponseEntity<List<MateriaDTO.Response>> listarTodas() {
        return ResponseEntity.ok(materiaService.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MateriaDTO.Response> buscarPorId(@PathVariable Integer id) {
        return ResponseEntity.ok(materiaService.buscarPorId(id));
    }

    @GetMapping("/carrera/{idCarrera}")
    public ResponseEntity<List<MateriaDTO.Response>> listarPorCarrera(@PathVariable Integer idCarrera) {
        return ResponseEntity.ok(materiaService.listarPorCarrera(idCarrera));
    }

    @PostMapping
    public ResponseEntity<MateriaDTO.Response> crear(@Valid @RequestBody MateriaDTO.Request request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(materiaService.crear(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MateriaDTO.Response> actualizar(@PathVariable Integer id,
                                                           @Valid @RequestBody MateriaDTO.Request request) {
        return ResponseEntity.ok(materiaService.actualizar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        materiaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
