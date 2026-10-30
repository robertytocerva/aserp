package cxt.robertytocerva.aserp.controller;

import cxt.robertytocerva.aserp.dto.BitacoraDTO;
import cxt.robertytocerva.aserp.exception.BadRequestException;
import cxt.robertytocerva.aserp.service.BitacoraService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

/////////
import java.util.List;

@RestController
@RequestMapping("/api/bitacoras")
@RequiredArgsConstructor
public class BitacoraController {

    private final BitacoraService bitacoraService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<BitacoraDTO.Response> crear(@AuthenticationPrincipal Jwt jwt,
                                                      @RequestParam(required = false) Integer idAsesoria,
                                                      @RequestParam(required = false) String temaTratado,
                                                      @RequestParam(required = false) String tareasAsignadas,
                                                      @RequestParam(required = false) String observaciones,
                                                      @RequestParam(value = "imagen", required = false) MultipartFile imagen) {
        return ResponseEntity.status(HttpStatus.CREATED).body(
                bitacoraService.crear(idAlumno(jwt), idAsesoria, temaTratado, tareasAsignadas, observaciones, imagen));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BitacoraDTO.Response> obtener(@AuthenticationPrincipal Jwt jwt, @PathVariable Integer id) {
        return ResponseEntity.ok(bitacoraService.obtener(id, idAlumno(jwt)));
    }

        @GetMapping("/{id}/imagen")
    public ResponseEntity<byte[]> imagen(@AuthenticationPrincipal Jwt jwt, @PathVariable Integer id) {
        Integer idAlumnoSeguro = null;
        try {
            idAlumnoSeguro = idAlumno(jwt);
        } catch (BadRequestException e) { }

        BitacoraService.Imagen img = bitacoraService.obtenerImagen(id, idAlumnoSeguro);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(img.tipo()))
                .body(img.datos());
    }

        @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> pdf(@AuthenticationPrincipal Jwt jwt, @PathVariable Integer id) {
        Integer idAlumnoSeguro = null;
        try {
            idAlumnoSeguro = idAlumno(jwt); // Intentamos sacar el ID del alumno
        } catch (BadRequestException e) {
            // Si falla porque es Admin, lo dejamos en null
            // (El servicio buscarAccesible se encargará de validar si es Admin)
        }
        
        byte[] pdf = bitacoraService.obtenerPdf(id, idAlumnoSeguro);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"bitacora-" + id + ".pdf\"")
                .body(pdf);
    }

    private Integer idAlumno(Jwt jwt) {
        Number claim = jwt.getClaim("idAlumno");
        if (claim == null) {
            throw new BadRequestException("La cuenta no tiene un alumno asociado");
        }
        return claim.intValue();
    }


    ///////
    @GetMapping("/admin/todas") 
    public ResponseEntity<List<BitacoraDTO.Response>> listarTodasAdmin() {
        return ResponseEntity.ok(bitacoraService.listarTodas());
    }
}
