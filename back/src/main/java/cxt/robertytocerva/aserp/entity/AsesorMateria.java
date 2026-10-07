package cxt.robertytocerva.aserp.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "asesor_materia",
        uniqueConstraints = @UniqueConstraint(name = "uq_asesor_materia", columnNames = {"id_asesor", "id_materia"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AsesorMateria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_asesor_materia")
    private Integer idAsesorMateria;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_asesor", nullable = false)
    private Asesor asesor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_materia", nullable = false)
    private Materia materia;

    @Column(name = "nivel_dominio", nullable = false, length = 20)
    private String nivelDominio;

    @Column(name = "creado_en", nullable = false, updatable = false)
    private LocalDateTime creadoEn;

    @PrePersist
    protected void onCreate() {
        this.creadoEn = LocalDateTime.now();
        if (this.nivelDominio == null) {
            this.nivelDominio = "intermedio";
        }
    }
}
