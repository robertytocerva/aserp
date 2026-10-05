package cxt.robertytocerva.aserp.service;

import cxt.robertytocerva.aserp.dto.MateriaDTO;
import cxt.robertytocerva.aserp.entity.Carrera;
import cxt.robertytocerva.aserp.entity.Materia;
import cxt.robertytocerva.aserp.exception.BadRequestException;
import cxt.robertytocerva.aserp.exception.ResourceNotFoundException;
import cxt.robertytocerva.aserp.repository.CarreraRepository;
import cxt.robertytocerva.aserp.repository.MateriaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MateriaService {

    private final MateriaRepository materiaRepository;
    private final CarreraRepository carreraRepository;

    @Transactional(readOnly = true)
    public List<MateriaDTO.Response> listarTodas() {
        return materiaRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<MateriaDTO.Response> listarPorCarrera(Integer idCarrera) {
        return materiaRepository.findByCarreraIdCarrera(idCarrera).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public MateriaDTO.Response buscarPorId(Integer id) {
        Materia materia = materiaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Materia no encontrada con id: " + id));
        return toResponse(materia);
    }

    @Transactional
    public MateriaDTO.Response crear(MateriaDTO.Request request) {
        if (materiaRepository.existsByClave(request.clave())) {
            throw new BadRequestException("Ya existe una materia con la clave: " + request.clave());
        }

        Carrera carrera = carreraRepository.findById(request.idCarrera())
                .orElseThrow(() -> new ResourceNotFoundException("Carrera no encontrada con id: " + request.idCarrera()));

        Materia materia = Materia.builder()
                .clave(request.clave())
                .nombre(request.nombre())
                .carrera(carrera)
                .semestreRecomendado(request.semestreRecomendado())
                .creditos(request.creditos())
                .descripcion(request.descripcion())
                .build();

        materia = materiaRepository.save(materia);
        return toResponse(materia);
    }

    @Transactional
    public MateriaDTO.Response actualizar(Integer id, MateriaDTO.Request request) {
        Materia materia = materiaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Materia no encontrada con id: " + id));

        materiaRepository.findByClave(request.clave())
                .ifPresent(existing -> {
                    if (!existing.getIdMateria().equals(id)) {
                        throw new BadRequestException("Ya existe otra materia con la clave: " + request.clave());
                    }
                });

        Carrera carrera = carreraRepository.findById(request.idCarrera())
                .orElseThrow(() -> new ResourceNotFoundException("Carrera no encontrada con id: " + request.idCarrera()));

        materia.setClave(request.clave());
        materia.setNombre(request.nombre());
        materia.setCarrera(carrera);
        materia.setSemestreRecomendado(request.semestreRecomendado());
        materia.setCreditos(request.creditos());
        materia.setDescripcion(request.descripcion());

        materia = materiaRepository.save(materia);
        return toResponse(materia);
    }

    @Transactional
    public void eliminar(Integer id) {
        Materia materia = materiaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Materia no encontrada con id: " + id));
        materia.setActivo(false);
        materiaRepository.save(materia);
    }

    private MateriaDTO.Response toResponse(Materia m) {
        return new MateriaDTO.Response(
                m.getIdMateria(),
                m.getClave(),
                m.getNombre(),
                m.getCarrera().getIdCarrera(),
                m.getCarrera().getNombre(),
                m.getSemestreRecomendado(),
                m.getCreditos(),
                m.getDescripcion(),
                m.getActivo()
        );
    }
}
