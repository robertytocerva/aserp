package cxt.robertytocerva.aserp.service;

import cxt.robertytocerva.aserp.dto.AlumnoDTO;
import cxt.robertytocerva.aserp.entity.Alumno;
import cxt.robertytocerva.aserp.entity.Carrera;
import cxt.robertytocerva.aserp.exception.BadRequestException;
import cxt.robertytocerva.aserp.exception.ResourceNotFoundException;
import cxt.robertytocerva.aserp.repository.AlumnoRepository;
import cxt.robertytocerva.aserp.repository.CarreraRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AlumnoService {

    private final AlumnoRepository alumnoRepository;
    private final CarreraRepository carreraRepository;

    @Transactional(readOnly = true)
    public List<AlumnoDTO.Response> listarTodos() {
        return alumnoRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public AlumnoDTO.Response buscarPorId(Integer id) {
        Alumno alumno = alumnoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Alumno no encontrado con id: " + id));
        return toResponse(alumno);
    }

    @Transactional
    public AlumnoDTO.Response registrar(AlumnoDTO.Request request) {
        if (alumnoRepository.existsByMatricula(request.matricula())) {
            throw new BadRequestException("Ya existe un alumno con la matricula: " + request.matricula());
        }
        if (alumnoRepository.existsByCorreo(request.correo())) {
            throw new BadRequestException("Ya existe un alumno con el correo: " + request.correo());
        }

        Carrera carrera = carreraRepository.findById(request.idCarrera())
                .orElseThrow(() -> new ResourceNotFoundException("Carrera no encontrada con id: " + request.idCarrera()));

        Alumno alumno = Alumno.builder()
                .matricula(request.matricula())
                .nombre(request.nombre())
                .apellidoPaterno(request.apellidoPaterno())
                .apellidoMaterno(request.apellidoMaterno())
                .correo(request.correo())
                .telefono(request.telefono())
                .carrera(carrera)
                .semestre(request.semestre())
                .build();

        alumno = alumnoRepository.save(alumno);
        return toResponse(alumno);
    }

    @Transactional
    public AlumnoDTO.Response actualizar(Integer id, AlumnoDTO.Request request) {
        Alumno alumno = alumnoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Alumno no encontrado con id: " + id));

        alumnoRepository.findByMatricula(request.matricula())
                .ifPresent(existing -> {
                    if (!existing.getIdAlumno().equals(id)) {
                        throw new BadRequestException("Ya existe otro alumno con la matricula: " + request.matricula());
                    }
                });

        alumnoRepository.findByCorreo(request.correo())
                .ifPresent(existing -> {
                    if (!existing.getIdAlumno().equals(id)) {
                        throw new BadRequestException("Ya existe otro alumno con el correo: " + request.correo());
                    }
                });

        Carrera carrera = carreraRepository.findById(request.idCarrera())
                .orElseThrow(() -> new ResourceNotFoundException("Carrera no encontrada con id: " + request.idCarrera()));

        alumno.setMatricula(request.matricula());
        alumno.setNombre(request.nombre());
        alumno.setApellidoPaterno(request.apellidoPaterno());
        alumno.setApellidoMaterno(request.apellidoMaterno());
        alumno.setCorreo(request.correo());
        alumno.setTelefono(request.telefono());
        alumno.setCarrera(carrera);
        alumno.setSemestre(request.semestre());

        alumno = alumnoRepository.save(alumno);
        return toResponse(alumno);
    }

    @Transactional
    public void eliminar(Integer id) {
        Alumno alumno = alumnoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Alumno no encontrado con id: " + id));
        alumno.setActivo(false);
        alumnoRepository.save(alumno);
    }

    private AlumnoDTO.Response toResponse(Alumno a) {
        return new AlumnoDTO.Response(
                a.getIdAlumno(),
                a.getMatricula(),
                a.getNombre(),
                a.getApellidoPaterno(),
                a.getApellidoMaterno(),
                a.getCorreo(),
                a.getTelefono(),
                a.getCarrera().getIdCarrera(),
                a.getCarrera().getNombre(),
                a.getSemestre(),
                a.getActivo()
        );
    }
}
