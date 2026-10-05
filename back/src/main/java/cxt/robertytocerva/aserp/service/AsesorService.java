package cxt.robertytocerva.aserp.service;

import cxt.robertytocerva.aserp.dto.AsesorDTO;
import cxt.robertytocerva.aserp.entity.Alumno;
import cxt.robertytocerva.aserp.entity.Asesor;
import cxt.robertytocerva.aserp.exception.BadRequestException;
import cxt.robertytocerva.aserp.exception.ResourceNotFoundException;
import cxt.robertytocerva.aserp.repository.AlumnoRepository;
import cxt.robertytocerva.aserp.repository.AsesorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AsesorService {

    private final AsesorRepository asesorRepository;
    private final AlumnoRepository alumnoRepository;

    @Transactional(readOnly = true)
    public List<AsesorDTO.Response> listarTodos() {
        return asesorRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public AsesorDTO.Response buscarPorId(Integer id) {
        Asesor asesor = asesorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Asesor no encontrado con id: " + id));
        return toResponse(asesor);
    }

    @Transactional
    public AsesorDTO.Response registrar(AsesorDTO.RegistroRequest request) {
        Alumno alumno = alumnoRepository.findById(request.idAlumno())
                .orElseThrow(() -> new ResourceNotFoundException("Alumno no encontrado con id: " + request.idAlumno()));

        if (asesorRepository.existsByAlumnoIdAlumno(request.idAlumno())) {
            throw new BadRequestException("El alumno con id " + request.idAlumno() + " ya tiene una cuenta de asesor");
        }

        Asesor asesor = Asesor.builder()
                .alumno(alumno)
                .promedio(request.promedio())
                .build();

        asesor = asesorRepository.save(asesor);
        return toResponse(asesor);
    }

    @Transactional
    public void desactivar(Integer id) {
        Asesor asesor = asesorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Asesor no encontrado con id: " + id));
        asesor.setActivo(false);
        asesorRepository.save(asesor);
    }

    private AsesorDTO.Response toResponse(Asesor a) {
        return new AsesorDTO.Response(
                a.getIdAsesor(),
                a.getAlumno().getIdAlumno(),
                a.getAlumno().getNombre() + " " + a.getAlumno().getApellidoPaterno(),
                a.getAlumno().getMatricula(),
                a.getPromedio(),
                a.getFechaInicio().toString(),
                a.getActivo()
        );
    }
}
