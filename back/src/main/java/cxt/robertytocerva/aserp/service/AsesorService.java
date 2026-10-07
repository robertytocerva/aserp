package cxt.robertytocerva.aserp.service;

import cxt.robertytocerva.aserp.dto.AsesorDTO;
import cxt.robertytocerva.aserp.entity.Alumno;
import cxt.robertytocerva.aserp.entity.Asesor;
import cxt.robertytocerva.aserp.entity.RolUsuario;
import cxt.robertytocerva.aserp.entity.Usuario;
import cxt.robertytocerva.aserp.exception.BadRequestException;
import cxt.robertytocerva.aserp.exception.ResourceNotFoundException;
import cxt.robertytocerva.aserp.repository.AlumnoRepository;
import cxt.robertytocerva.aserp.repository.AsesorRepository;
import cxt.robertytocerva.aserp.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AsesorService {

    private final AsesorRepository asesorRepository;
    private final AlumnoRepository alumnoRepository;
    private final UsuarioRepository usuarioRepository;

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
    public AsesorDTO.Response registrar(Integer idAlumno, AsesorDTO.RegistroRequest request) {
        Alumno alumno = alumnoRepository.findById(idAlumno)
                .orElseThrow(() -> new ResourceNotFoundException("Alumno no encontrado con id: " + idAlumno));

        if (asesorRepository.existsByAlumnoIdAlumno(idAlumno)) {
            throw new BadRequestException("El alumno con id " + idAlumno + " ya tiene una cuenta de asesor");
        }

        Asesor asesor = Asesor.builder()
                .alumno(alumno)
                .promedio(request.promedio())
                .validado(false)
                .activo(true)
                .build();

        asesor = asesorRepository.save(asesor);
        return toResponse(asesor);
    }

    @Transactional
    public AsesorDTO.Response actualizarValidacion(Integer id, AsesorDTO.ValidacionRequest request) {
        Asesor asesor = asesorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Asesor no encontrado con id: " + id));

        asesor.setValidado(request.validado());
        asesor = asesorRepository.save(asesor);

        Usuario usuario = usuarioRepository.findByAlumnoIdAlumno(asesor.getAlumno().getIdAlumno())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Cuenta de usuario no encontrada para el asesor con id: " + id));
        usuario.setRol(request.validado() ? RolUsuario.ASESOR : RolUsuario.ALUMNO);
        usuarioRepository.save(usuario);

        return toResponse(asesor);
    }

    @Transactional
    public void desactivar(Integer id) {
        Asesor asesor = asesorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Asesor no encontrado con id: " + id));
        asesor.setActivo(false);
        asesorRepository.save(asesor);
    }

    @Transactional(readOnly = true)
    public Asesor obtenerAsesorValidado(Integer id) {
        Asesor asesor = asesorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Asesor no encontrado con id: " + id));
        if (!Boolean.TRUE.equals(asesor.getValidado())) {
            throw new BadRequestException("El asesor aun no ha sido validado por el administrador");
        }
        return asesor;
    }

    @Transactional(readOnly = true)
    public Asesor obtenerAsesorValidadoDeAlumno(Integer idAlumno) {
        Asesor asesor = asesorRepository.findByAlumnoIdAlumno(idAlumno)
                .orElseThrow(() -> new BadRequestException("La cuenta no tiene un perfil de asesor"));
        return obtenerAsesorValidado(asesor.getIdAsesor());
    }

    private AsesorDTO.Response toResponse(Asesor a) {
        return new AsesorDTO.Response(
                a.getIdAsesor(),
                a.getAlumno().getIdAlumno(),
                a.getAlumno().getNombre() + " " + a.getAlumno().getApellidoPaterno(),
                a.getAlumno().getMatricula(),
                a.getPromedio(),
                a.getFechaInicio().toString(),
                a.getValidado(),
                a.getActivo()
        );
    }
}
