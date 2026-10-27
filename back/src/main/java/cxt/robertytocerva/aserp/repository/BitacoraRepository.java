package cxt.robertytocerva.aserp.repository;

import cxt.robertytocerva.aserp.entity.Bitacora;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BitacoraRepository extends JpaRepository<Bitacora, Integer> {

    boolean existsByAsesoriaIdAsesoria(Integer idAsesoria);
}
