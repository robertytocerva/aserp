package cxt.robertytocerva.aserp.service;

import cxt.robertytocerva.aserp.dto.AsesorMateriaDTO;
import cxt.robertytocerva.aserp.entity.Alumno;
import cxt.robertytocerva.aserp.entity.Asesor;
import cxt.robertytocerva.aserp.entity.Carrera;
import cxt.robertytocerva.aserp.entity.HorarioAsesor;
import cxt.robertytocerva.aserp.entity.Materia;
import cxt.robertytocerva.aserp.exception.BadRequestException;
import cxt.robertytocerva.aserp.exception.ResourceNotFoundException;
import cxt.robertytocerva.aserp.repository.AlumnoRepository;
import cxt.robertytocerva.aserp.repository.AsesorRepository;
import cxt.robertytocerva.aserp.repository.CarreraRepository;
import cxt.robertytocerva.aserp.repository.HorarioAsesorRepository;
import cxt.robertytocerva.aserp.repository.MateriaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Corre contra la base real: cada test crea sus propios datos con claves unicas
 * y @Transactional hace rollback al terminar, sin tocar filas existentes.
 */
@SpringBootTest
@Transactional
class AsesorMateriaServiceTests {

    @Autowired
    private AsesorMateriaService asesorMateriaService;

    @Autowired
    private CarreraRepository carreraRepository;

    @Autowired
    private AlumnoRepository alumnoRepository;

    @Autowired
    private AsesorRepository asesorRepository;

    @Autowired
    private MateriaRepository materiaRepository;

    @Autowired
    private HorarioAsesorRepository horarioAsesorRepository;

    private Carrera carrera;

    @BeforeEach
    void setUp() {
        carrera = carreraRepository.save(Carrera.builder()
                .clave("TC-" + sufijo())
                .nombre("Carrera de prueba")
                .activo(true)
                .build());
    }

    @Test
    void asignarSinNivelUsaIntermedio() {
        Asesor asesor = crearAsesor(true, true);
        Materia materia = crearMateria(true);

        AsesorMateriaDTO.Response response = asesorMateriaService.asignar(asesor.getIdAsesor(),
                new AsesorMateriaDTO.AsignacionRequest(materia.getIdMateria(), null));

        assertNotNull(response.idAsesorMateria());
        assertEquals(asesor.getIdAsesor(), response.idAsesor());
        assertEquals(materia.getIdMateria(), response.idMateria());
        assertEquals(materia.getClave(), response.claveMateria());
        assertEquals("intermedio", response.nivelDominio());
    }

    @Test
    void asignarConNivelExplicito() {
        Asesor asesor = crearAsesor(true, true);
        Materia materia = crearMateria(true);

        AsesorMateriaDTO.Response response = asesorMateriaService.asignar(asesor.getIdAsesor(),
                new AsesorMateriaDTO.AsignacionRequest(materia.getIdMateria(), "avanzado"));

        assertEquals("avanzado", response.nivelDominio());
    }

    @Test
    void asignarAAsesorNoValidadoEstaPermitido() {
        Asesor asesor = crearAsesor(true, false);
        Materia materia = crearMateria(true);

        asesorMateriaService.asignar(asesor.getIdAsesor(),
                new AsesorMateriaDTO.AsignacionRequest(materia.getIdMateria(), null));

        List<AsesorMateriaDTO.Response> materias = asesorMateriaService.listarPorAsesor(asesor.getIdAsesor());
        assertEquals(1, materias.size());
        assertEquals(materia.getIdMateria(), materias.get(0).idMateria());
    }

    @Test
    void asignarDuplicadoLanzaBadRequest() {
        Asesor asesor = crearAsesor(true, true);
        Materia materia = crearMateria(true);
        AsesorMateriaDTO.AsignacionRequest request =
                new AsesorMateriaDTO.AsignacionRequest(materia.getIdMateria(), null);

        asesorMateriaService.asignar(asesor.getIdAsesor(), request);

        BadRequestException ex = assertThrows(BadRequestException.class,
                () -> asesorMateriaService.asignar(asesor.getIdAsesor(), request));
        assertEquals("El asesor ya tiene asignada la materia con id: " + materia.getIdMateria(), ex.getMessage());
    }

    @Test
    void asignarAAsesorInactivoLanzaBadRequest() {
        Asesor asesor = crearAsesor(false, true);
        Materia materia = crearMateria(true);

        assertThrows(BadRequestException.class, () -> asesorMateriaService.asignar(asesor.getIdAsesor(),
                new AsesorMateriaDTO.AsignacionRequest(materia.getIdMateria(), null)));
    }

    @Test
    void asignarMateriaInactivaLanzaBadRequest() {
        Asesor asesor = crearAsesor(true, true);
        Materia materia = crearMateria(false);

        assertThrows(BadRequestException.class, () -> asesorMateriaService.asignar(asesor.getIdAsesor(),
                new AsesorMateriaDTO.AsignacionRequest(materia.getIdMateria(), null)));
    }

    @Test
    void actualizarNivelCambiaElNivel() {
        Asesor asesor = crearAsesor(true, true);
        Materia materia = crearMateria(true);
        asesorMateriaService.asignar(asesor.getIdAsesor(),
                new AsesorMateriaDTO.AsignacionRequest(materia.getIdMateria(), "basico"));

        AsesorMateriaDTO.Response response = asesorMateriaService.actualizarNivel(asesor.getIdAsesor(),
                materia.getIdMateria(), new AsesorMateriaDTO.NivelRequest("avanzado"));

        assertEquals("avanzado", response.nivelDominio());
        assertEquals("avanzado", asesorMateriaService.listarPorAsesor(asesor.getIdAsesor()).get(0).nivelDominio());
    }

    @Test
    void actualizarNivelSinAsignacionLanzaNotFound() {
        Asesor asesor = crearAsesor(true, true);
        Materia materia = crearMateria(true);

        assertThrows(ResourceNotFoundException.class, () -> asesorMateriaService.actualizarNivel(
                asesor.getIdAsesor(), materia.getIdMateria(), new AsesorMateriaDTO.NivelRequest("avanzado")));
    }

    @Test
    void quitarBorraLaAsignacionYPermiteReasignar() {
        Asesor asesor = crearAsesor(true, true);
        Materia materia = crearMateria(true);
        AsesorMateriaDTO.AsignacionRequest request =
                new AsesorMateriaDTO.AsignacionRequest(materia.getIdMateria(), null);
        asesorMateriaService.asignar(asesor.getIdAsesor(), request);

        asesorMateriaService.quitar(asesor.getIdAsesor(), materia.getIdMateria());

        assertTrue(asesorMateriaService.listarPorAsesor(asesor.getIdAsesor()).isEmpty());
        assertThrows(ResourceNotFoundException.class,
                () -> asesorMateriaService.quitar(asesor.getIdAsesor(), materia.getIdMateria()));

        AsesorMateriaDTO.Response reasignada = asesorMateriaService.asignar(asesor.getIdAsesor(), request);
        assertEquals(materia.getIdMateria(), reasignada.idMateria());
    }

    @Test
    void listarAsesoresPorMateriaSoloIncluyeActivosYValidadosConHorariosActivos() {
        Materia materia = crearMateria(true);
        Asesor validado = crearAsesor(true, true);
        Asesor noValidado = crearAsesor(true, false);
        Asesor desactivado = crearAsesor(true, true);

        HorarioAsesor horarioActivo = crearHorario(validado, true);
        crearHorario(validado, false);

        AsesorMateriaDTO.AsignacionRequest request =
                new AsesorMateriaDTO.AsignacionRequest(materia.getIdMateria(), "avanzado");
        asesorMateriaService.asignar(validado.getIdAsesor(), request);
        asesorMateriaService.asignar(noValidado.getIdAsesor(), request);
        // A un asesor inactivo no se le puede asignar; se desactiva despues de asignarle la materia.
        asesorMateriaService.asignar(desactivado.getIdAsesor(), request);
        desactivado.setActivo(false);
        asesorRepository.save(desactivado);

        List<AsesorMateriaDTO.AsesorConHorariosResponse> asesores =
                asesorMateriaService.listarAsesoresPorMateria(materia.getIdMateria());

        assertEquals(1, asesores.size());
        AsesorMateriaDTO.AsesorConHorariosResponse response = asesores.get(0);
        assertEquals(validado.getIdAsesor(), response.idAsesor());
        assertEquals(validado.getAlumno().getMatricula(), response.matricula());
        assertEquals("avanzado", response.nivelDominio());
        assertEquals(1, response.horarios().size());
        assertEquals(horarioActivo.getIdHorario(), response.horarios().get(0).idHorario());
    }

    @Test
    void listarPorAsesorInexistenteLanzaNotFound() {
        assertThrows(ResourceNotFoundException.class,
                () -> asesorMateriaService.listarPorAsesor(Integer.MAX_VALUE));
    }

    @Test
    void listarAsesoresPorMateriaInexistenteLanzaNotFound() {
        assertThrows(ResourceNotFoundException.class,
                () -> asesorMateriaService.listarAsesoresPorMateria(Integer.MAX_VALUE));
    }

    private Asesor crearAsesor(boolean activo, boolean validado) {
        String sufijo = sufijo();
        Alumno alumno = alumnoRepository.save(Alumno.builder()
                .matricula("T" + sufijo)
                .nombre("Test")
                .apellidoPaterno("Asesor" + sufijo)
                .correo("test." + sufijo + "@prueba.aserp.invalid")
                .carrera(carrera)
                .semestre((short) 5)
                .activo(true)
                .build());
        return asesorRepository.save(Asesor.builder()
                .alumno(alumno)
                .promedio(new BigDecimal("9.50"))
                .activo(activo)
                .validado(validado)
                .build());
    }

    private Materia crearMateria(boolean activo) {
        return materiaRepository.save(Materia.builder()
                .clave("TM-" + sufijo())
                .nombre("Materia de prueba")
                .carrera(carrera)
                .activo(activo)
                .build());
    }

    private HorarioAsesor crearHorario(Asesor asesor, boolean activo) {
        LocalTime inicio = activo ? LocalTime.of(16, 0) : LocalTime.of(18, 0);
        return horarioAsesorRepository.save(HorarioAsesor.builder()
                .asesor(asesor)
                .diaSemana((short) 2)
                .horaInicio(inicio)
                .horaFin(inicio.plusHours(2))
                .modalidad("presencial")
                .lugar("Aula de prueba")
                .activo(activo)
                .build());
    }

    private static String sufijo() {
        return UUID.randomUUID().toString().replace("-", "").substring(0, 10);
    }
}
