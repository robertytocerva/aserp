package cxt.robertytocerva.aserp.service;

import cxt.robertytocerva.aserp.dto.CarreraDTO;
import cxt.robertytocerva.aserp.entity.Carrera;
import cxt.robertytocerva.aserp.exception.BadRequestException;
import cxt.robertytocerva.aserp.exception.ResourceNotFoundException;
import cxt.robertytocerva.aserp.repository.CarreraRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CarreraService {

    private final CarreraRepository carreraRepository;

    @Transactional(readOnly = true)
    public List<CarreraDTO.Response> listarTodas() {
        return carreraRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public CarreraDTO.Response buscarPorId(Integer id) {
        Carrera carrera = carreraRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Carrera no encontrada con id: " + id));
        return toResponse(carrera);
    }

    @Transactional
    public CarreraDTO.Response crear(CarreraDTO.Request request) {
        if (carreraRepository.existsByClave(request.clave())) {
            throw new BadRequestException("Ya existe una carrera con la clave: " + request.clave());
        }

        Carrera carrera = Carrera.builder()
                .clave(request.clave())
                .nombre(request.nombre())
                .build();

        carrera = carreraRepository.save(carrera);
        return toResponse(carrera);
    }

    @Transactional
    public CarreraDTO.Response actualizar(Integer id, CarreraDTO.Request request) {
        Carrera carrera = carreraRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Carrera no encontrada con id: " + id));

        carreraRepository.findByClave(request.clave())
                .ifPresent(existing -> {
                    if (!existing.getIdCarrera().equals(id)) {
                        throw new BadRequestException("Ya existe otra carrera con la clave: " + request.clave());
                    }
                });

        carrera.setClave(request.clave());
        carrera.setNombre(request.nombre());
        carrera = carreraRepository.save(carrera);
        return toResponse(carrera);
    }

    @Transactional
    public void eliminar(Integer id) {
        Carrera carrera = carreraRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Carrera no encontrada con id: " + id));
        carrera.setActivo(false);
        carreraRepository.save(carrera);
    }

    private CarreraDTO.Response toResponse(Carrera c) {
        return new CarreraDTO.Response(
                c.getIdCarrera(),
                c.getClave(),
                c.getNombre(),
                c.getActivo()
        );
    }
}
