package cxt.robertytocerva.aserp.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "asesorias")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Asesoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_asesoria")
    private Integer idAsesoria;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_asesor", nullable = false)
    private Asesor asesor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_alumno", nullable = false)
    private Alumno alumno;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_materia", nullable = false)
    private Materia materia;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_horario")
    private HorarioAsesor horario;

    @Column(nullable = false)
    private LocalDate fecha;

    @Column(name = "hora_inicio", nullable = false)
    private LocalTime horaInicio;

    @Column(name = "hora_fin", nullable = false)
    private LocalTime horaFin;

    @Column(nullable = false, length = 20)
    private String modalidad;

    @Column(length = 100)
    private String lugar;

    @Column(nullable = false, length = 20)
    private String estado;

    @Column(name = "creado_en", nullable = false, updatable = false)
    private LocalDateTime creadoEn;

    @PrePersist
    protected void onCreate() {
        this.creadoEn = LocalDateTime.now();
    }
}
