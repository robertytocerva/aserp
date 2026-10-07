package cxt.robertytocerva.aserp.controller;

import cxt.robertytocerva.aserp.dto.AsesorMateriaDTO;
import cxt.robertytocerva.aserp.service.AsesorMateriaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AsesorMateriaController {

    private final AsesorMateriaService asesorMateriaService;

    @GetMapping("/asesores/{id}/materias")
    public ResponseEntity<List<AsesorMateriaDTO.Response>> listarMateriasDeAsesor(@PathVariable Integer id) {
        return ResponseEntity.ok(asesorMateriaService.listarPorAsesor(id));
    }

    @GetMapping("/materias/{id}/asesores")
    public ResponseEntity<List<AsesorMateriaDTO.AsesorConHorariosResponse>> listarAsesoresDeMateria(@PathVariable Integer id) {
        return ResponseEntity.ok(asesorMateriaService.listarAsesoresPorMateria(id));
    }
}
