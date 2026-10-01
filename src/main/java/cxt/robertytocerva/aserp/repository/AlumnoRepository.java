package cxt.robertytocerva.aserp.repository;

import cxt.robertytocerva.aserp.entity.Alumno;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AlumnoRepository extends JpaRepository<Alumno, Integer> {

    Optional<Alumno> findByMatricula(String matricula);

    Optional<Alumno> findByCorreo(String correo);

    boolean existsByMatricula(String matricula);

    boolean existsByCorreo(String correo);
}
