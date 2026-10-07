package cxt.robertytocerva.aserp.service;

import cxt.robertytocerva.aserp.entity.Usuario;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
public class JwtService {

    private final JwtEncoder jwtEncoder;

    public String generarToken(Usuario usuario) {
        Instant ahora = Instant.now();

        JwtClaimsSet.Builder claims = JwtClaimsSet.builder()
                .issuer("aserp")
                .subject(usuario.getCorreo())
                .issuedAt(ahora)
                .expiresAt(ahora.plus(24, ChronoUnit.HOURS))
                .claim("idUsuario", usuario.getIdUsuario())
                .claim("rol", usuario.getRol().name());

        if (usuario.getAlumno() != null) {
            claims.claim("idAlumno", usuario.getAlumno().getIdAlumno());
        }

        JwsHeader header = JwsHeader.with(MacAlgorithm.HS256).build();
        return jwtEncoder.encode(JwtEncoderParameters.from(header, claims.build())).getTokenValue();
    }
}
