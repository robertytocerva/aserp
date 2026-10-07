package cxt.robertytocerva.aserp.repository;

import cxt.robertytocerva.aserp.entity.HorarioAsesor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalTime;
import java.util.List;

public interface HorarioAsesorRepository extends JpaRepository<HorarioAsesor, Integer> {

    List<HorarioAsesor> findByAsesorIdAsesor(Integer idAsesor);

    List<HorarioAsesor> findByAsesorIdAsesorAndActivoTrue(Integer idAsesor);

    boolean existsByAsesorIdAsesorAndDiaSemanaAndHoraInicioAndHoraFin(Integer idAsesor, Short diaSemana,
                                                                     LocalTime horaInicio, LocalTime horaFin);

    boolean existsByAsesorIdAsesorAndDiaSemanaAndHoraInicioAndHoraFinAndIdHorarioNot(Integer idAsesor, Short diaSemana,
                                                                                    LocalTime horaInicio, LocalTime horaFin,
                                                                                    Integer idHorario);
}
