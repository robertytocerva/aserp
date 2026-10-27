package cxt.robertytocerva.aserp.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "bitacoras")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Bitacora {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_bitacora")
    private Integer idBitacora;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_asesoria", nullable = false, unique = true)
    private Asesoria asesoria;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "registrado_por", nullable = false)
    private Asesor registradoPor;

    @Column(name = "temas_tratados", nullable = false, columnDefinition = "TEXT")
    private String temasTratados;

    @Column(name = "tareas_asignadas", columnDefinition = "TEXT")
    private String tareasAsignadas;

    @Column(columnDefinition = "TEXT")
    private String observaciones;

    @Column(name = "fecha_registro", nullable = false, updatable = false)
    private LocalDateTime fechaRegistro;

    @Column(name = "fecha_sesion")
    private LocalDate fechaSesion;

    @Column(name = "hora_inicio")
    private LocalTime horaInicio;

    @Column(name = "hora_fin")
    private LocalTime horaFin;

    @Column(name = "matricula_alumno", length = 20)
    private String matriculaAlumno;

    @Column(name = "nombre_alumno", length = 250)
    private String nombreAlumno;

    @Column(name = "nombre_asesor", length = 250)
    private String nombreAsesor;

    @Column(name = "nombre_materia", length = 150)
    private String nombreMateria;

    @Column(name = "nombre_carrera", length = 150)
    private String nombreCarrera;

    @Column(name = "imagen_evidencia")
    private byte[] imagenEvidencia;

    @Column(name = "imagen_tipo", length = 20)
    private String imagenTipo;

    @Column(name = "correo_enviado", nullable = false)
    private Boolean correoEnviado;

    @Column(name = "correo_error", columnDefinition = "TEXT")
    private String correoError;

    @PrePersist
    protected void onCreate() {
        this.fechaRegistro = LocalDateTime.now();
        if (this.correoEnviado == null) {
            this.correoEnviado = false;
        }
    }
}
