package cxt.robertytocerva.aserp.repository;

import cxt.robertytocerva.aserp.entity.Materia;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MateriaRepository extends JpaRepository<Materia, Integer> {

    Optional<Materia> findByClave(String clave);

    List<Materia> findByCarreraIdCarrera(Integer idCarrera);

    List<Materia> findByActivoTrue();

    boolean existsByClave(String clave);
}
