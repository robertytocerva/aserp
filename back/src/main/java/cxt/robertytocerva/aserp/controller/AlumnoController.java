package cxt.robertytocerva.aserp.controller;

import cxt.robertytocerva.aserp.dto.AlumnoDTO;
import cxt.robertytocerva.aserp.service.AlumnoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alumnos")
@RequiredArgsConstructor
public class AlumnoController {

    private final AlumnoService alumnoService;

    @GetMapping
    public ResponseEntity<List<AlumnoDTO.Response>> listarTodos() {
        return ResponseEntity.ok(alumnoService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AlumnoDTO.Response> buscarPorId(@PathVariable Integer id) {
        return ResponseEntity.ok(alumnoService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<AlumnoDTO.Response> registrar(@Valid @RequestBody AlumnoDTO.RegistroRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(alumnoService.registrar(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AlumnoDTO.Response> actualizar(@PathVariable Integer id,
                                                          @Valid @RequestBody AlumnoDTO.Request request) {
        return ResponseEntity.ok(alumnoService.actualizar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        alumnoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
