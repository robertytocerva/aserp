package cxt.robertytocerva.aserp.repository;

import cxt.robertytocerva.aserp.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {

    Optional<Usuario> findByCorreo(String correo);

    boolean existsByCorreo(String correo);

    Optional<Usuario> findByAlumnoIdAlumno(Integer idAlumno);
}
