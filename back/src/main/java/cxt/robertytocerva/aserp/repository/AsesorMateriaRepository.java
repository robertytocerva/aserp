package cxt.robertytocerva.aserp.repository;

import cxt.robertytocerva.aserp.entity.AsesorMateria;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AsesorMateriaRepository extends JpaRepository<AsesorMateria, Integer> {

    List<AsesorMateria> findByAsesorIdAsesor(Integer idAsesor);

    List<AsesorMateria> findByMateriaIdMateriaAndAsesorActivoTrueAndAsesorValidadoTrue(Integer idMateria);

    Optional<AsesorMateria> findByAsesorIdAsesorAndMateriaIdMateria(Integer idAsesor, Integer idMateria);

    boolean existsByAsesorIdAsesorAndMateriaIdMateria(Integer idAsesor, Integer idMateria);
}
