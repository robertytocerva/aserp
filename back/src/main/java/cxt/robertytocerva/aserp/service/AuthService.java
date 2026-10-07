package cxt.robertytocerva.aserp.service;

import cxt.robertytocerva.aserp.dto.AuthDTO;
import cxt.robertytocerva.aserp.entity.Usuario;
import cxt.robertytocerva.aserp.exception.UnauthorizedException;
import cxt.robertytocerva.aserp.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Transactional(readOnly = true)
    public AuthDTO.LoginResponse login(AuthDTO.LoginRequest request) {
        Usuario usuario = usuarioRepository.findByCorreo(request.correo())
                .orElseThrow(() -> new UnauthorizedException("Correo o contrasena incorrectos"));

        if (!Boolean.TRUE.equals(usuario.getActivo())) {
            throw new UnauthorizedException("La cuenta de usuario esta desactivada");
        }

        if (!passwordEncoder.matches(request.password(), usuario.getPasswordHash())) {
            throw new UnauthorizedException("Correo o contrasena incorrectos");
        }

        String token = jwtService.generarToken(usuario);
        Integer idAlumno = usuario.getAlumno() != null ? usuario.getAlumno().getIdAlumno() : null;
        return new AuthDTO.LoginResponse(
                token,
                "Bearer",
                usuario.getIdUsuario(),
                idAlumno,
                usuario.getRol().name()
        );
    }
}
