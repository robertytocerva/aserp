package cxt.robertytocerva.aserp.repository;

import cxt.robertytocerva.aserp.entity.Carrera;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CarreraRepository extends JpaRepository<Carrera, Integer> {

    Optional<Carrera> findByClave(String clave);

    List<Carrera> findByActivoTrue();

    boolean existsByClave(String clave);
}
