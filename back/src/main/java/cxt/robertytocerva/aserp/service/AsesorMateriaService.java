package cxt.robertytocerva.aserp.service;

import cxt.robertytocerva.aserp.dto.AsesorMateriaDTO;
import cxt.robertytocerva.aserp.entity.Asesor;
import cxt.robertytocerva.aserp.entity.AsesorMateria;
import cxt.robertytocerva.aserp.entity.Materia;
import cxt.robertytocerva.aserp.exception.BadRequestException;
import cxt.robertytocerva.aserp.exception.ResourceNotFoundException;
import cxt.robertytocerva.aserp.repository.AsesorMateriaRepository;
import cxt.robertytocerva.aserp.repository.AsesorRepository;
import cxt.robertytocerva.aserp.repository.MateriaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AsesorMateriaService {

    private final AsesorMateriaRepository asesorMateriaRepository;
    private final AsesorRepository asesorRepository;
    private final MateriaRepository materiaRepository;
    private final HorarioAsesorService horarioAsesorService;

    @Transactional(readOnly = true)
    public List<AsesorMateriaDTO.Response> listarPorAsesor(Integer idAsesor) {
        if (!asesorRepository.existsById(idAsesor)) {
            throw new ResourceNotFoundException("Asesor no encontrado con id: " + idAsesor);
        }
        return asesorMateriaRepository.findByAsesorIdAsesor(idAsesor).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AsesorMateriaDTO.AsesorConHorariosResponse> listarAsesoresPorMateria(Integer idMateria) {
        if (!materiaRepository.existsById(idMateria)) {
            throw new ResourceNotFoundException("Materia no encontrada con id: " + idMateria);
        }
        return asesorMateriaRepository.findByMateriaIdMateriaAndAsesorActivoTrueAndAsesorValidadoTrue(idMateria).stream()
                .map(this::toAsesorConHorariosResponse)
                .toList();
    }

    @Transactional
    public AsesorMateriaDTO.Response asignar(Integer idAsesor, AsesorMateriaDTO.AsignacionRequest request) {
        Asesor asesor = asesorRepository.findById(idAsesor)
                .orElseThrow(() -> new ResourceNotFoundException("Asesor no encontrado con id: " + idAsesor));
        if (!Boolean.TRUE.equals(asesor.getActivo())) {
            throw new BadRequestException("El asesor con id " + idAsesor + " esta inactivo");
        }

        Materia materia = materiaRepository.findById(request.idMateria())
                .orElseThrow(() -> new ResourceNotFoundException("Materia no encontrada con id: " + request.idMateria()));
        if (!Boolean.TRUE.equals(materia.getActivo())) {
            throw new BadRequestException("La materia con id " + request.idMateria() + " esta inactiva");
        }

        if (asesorMateriaRepository.existsByAsesorIdAsesorAndMateriaIdMateria(idAsesor, request.idMateria())) {
            throw new BadRequestException("El asesor ya tiene asignada la materia con id: " + request.idMateria());
        }

        AsesorMateria asesorMateria = AsesorMateria.builder()
                .asesor(asesor)
                .materia(materia)
                .nivelDominio(request.nivelDominio())
                .build();

        asesorMateria = asesorMateriaRepository.save(asesorMateria);
        return toResponse(asesorMateria);
    }

    @Transactional
    public AsesorMateriaDTO.Response actualizarNivel(Integer idAsesor, Integer idMateria,
                                                     AsesorMateriaDTO.NivelRequest request) {
        AsesorMateria asesorMateria = buscarAsignacion(idAsesor, idMateria);
        asesorMateria.setNivelDominio(request.nivelDominio());
        asesorMateria = asesorMateriaRepository.save(asesorMateria);
        return toResponse(asesorMateria);
    }

    @Transactional
    public void quitar(Integer idAsesor, Integer idMateria) {
        AsesorMateria asesorMateria = buscarAsignacion(idAsesor, idMateria);
        asesorMateriaRepository.delete(asesorMateria);
    }

    private AsesorMateria buscarAsignacion(Integer idAsesor, Integer idMateria) {
        return asesorMateriaRepository.findByAsesorIdAsesorAndMateriaIdMateria(idAsesor, idMateria)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "El asesor con id " + idAsesor + " no tiene asignada la materia con id: " + idMateria));
    }

    private AsesorMateriaDTO.Response toResponse(AsesorMateria am) {
        return new AsesorMateriaDTO.Response(
                am.getIdAsesorMateria(),
                am.getAsesor().getIdAsesor(),
                am.getAsesor().getAlumno().getNombre() + " " + am.getAsesor().getAlumno().getApellidoPaterno(),
                am.getMateria().getIdMateria(),
                am.getMateria().getClave(),
                am.getMateria().getNombre(),
                am.getNivelDominio()
        );
    }

    private AsesorMateriaDTO.AsesorConHorariosResponse toAsesorConHorariosResponse(AsesorMateria am) {
        Asesor a = am.getAsesor();
        return new AsesorMateriaDTO.AsesorConHorariosResponse(
                a.getIdAsesor(),
                a.getAlumno().getNombre() + " " + a.getAlumno().getApellidoPaterno(),
                a.getAlumno().getMatricula(),
                a.getPromedio(),
                am.getNivelDominio(),
                horarioAsesorService.listarActivosDeAsesor(a.getIdAsesor())
        );
    }
}
