package cxt.robertytocerva.aserp.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "asesores")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Asesor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_asesor")
    private Integer idAsesor;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_alumno", nullable = false, unique = true)
    private Alumno alumno;

    @Column(precision = 3, scale = 2)
    private BigDecimal promedio;

    @Column(name = "fecha_inicio", nullable = false)
    private LocalDate fechaInicio;

    @Column(nullable = false)
    private Boolean activo = true;

    @Column(name = "creado_en", nullable = false, updatable = false)
    private LocalDateTime creadoEn;

    @PrePersist
    protected void onCreate() {
        this.creadoEn = LocalDateTime.now();
        if (this.fechaInicio == null) {
            this.fechaInicio = LocalDate.now();
        }
        if (this.activo == null) {
            this.activo = true;
        }
    }
}
