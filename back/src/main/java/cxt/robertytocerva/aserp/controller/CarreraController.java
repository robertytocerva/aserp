package cxt.robertytocerva.aserp.controller;

import cxt.robertytocerva.aserp.dto.CarreraDTO;
import cxt.robertytocerva.aserp.service.CarreraService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/carreras")
@RequiredArgsConstructor
public class CarreraController {

    private final CarreraService carreraService;

    @GetMapping
    public ResponseEntity<List<CarreraDTO.Response>> listarTodas() {
        return ResponseEntity.ok(carreraService.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CarreraDTO.Response> buscarPorId(@PathVariable Integer id) {
        return ResponseEntity.ok(carreraService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<CarreraDTO.Response> crear(@Valid @RequestBody CarreraDTO.Request request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(carreraService.crear(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CarreraDTO.Response> actualizar(@PathVariable Integer id,
                                                           @Valid @RequestBody CarreraDTO.Request request) {
        return ResponseEntity.ok(carreraService.actualizar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        carreraService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
