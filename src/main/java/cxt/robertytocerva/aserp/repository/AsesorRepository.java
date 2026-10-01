package cxt.robertytocerva.aserp.repository;

import cxt.robertytocerva.aserp.entity.Asesor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AsesorRepository extends JpaRepository<Asesor, Integer> {

    Optional<Asesor> findByAlumnoIdAlumno(Integer idAlumno);

    boolean existsByAlumnoIdAlumno(Integer idAlumno);
}
