package cxt.robertytocerva.aserp.repository;

import cxt.robertytocerva.aserp.entity.Asesoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Collection;
import java.util.List;

public interface AsesoriaRepository extends JpaRepository<Asesoria, Integer> {

    List<Asesoria> findByAlumnoIdAlumnoOrderByFechaAscHoraInicioAsc(Integer idAlumno);

    List<Asesoria> findByAsesorIdAsesorOrderByFechaAscHoraInicioAsc(Integer idAsesor);

    List<Asesoria> findByAsesorIdAsesorAndEstadoInOrderByFechaAscHoraInicioAsc(Integer idAsesor,
                                                                              Collection<String> estados);

    @Query("""
            SELECT CASE WHEN COUNT(a) > 0 THEN TRUE ELSE FALSE END
            FROM Asesoria a
            WHERE a.asesor.idAsesor = :idAsesor
              AND a.fecha = :fecha
              AND a.estado IN :estados
              AND a.horaInicio < :horaFin
              AND a.horaFin > :horaInicio
            """)
    boolean existeTraslape(@Param("idAsesor") Integer idAsesor,
                           @Param("fecha") LocalDate fecha,
                           @Param("estados") Collection<String> estados,
                           @Param("horaInicio") LocalTime horaInicio,
                           @Param("horaFin") LocalTime horaFin);

    @Query("""
            SELECT a FROM Asesoria a
            WHERE a.asesor.idAsesor = :idAsesor
              AND a.fecha BETWEEN :desde AND :hasta
              AND a.estado IN :estados
            """)
    List<Asesoria> buscarPorAsesorYRangoDeFechas(@Param("idAsesor") Integer idAsesor,
                                                 @Param("desde") LocalDate desde,
                                                 @Param("hasta") LocalDate hasta,
                                                 @Param("estados") Collection<String> estados);
}
