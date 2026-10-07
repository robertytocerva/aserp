package cxt.robertytocerva.aserp.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;

import java.io.IOException;
import java.time.LocalDateTime;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationConverter jwtAuthenticationConverter;

    public SecurityConfig(JwtAuthenticationConverter jwtAuthenticationConverter) {
        this.jwtAuthenticationConverter = jwtAuthenticationConverter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/asesores").hasAnyRole("ALUMNO", "ASESOR")
                        .requestMatchers("/api/horarios", "/api/horarios/**").hasRole("ASESOR")
                        .requestMatchers(HttpMethod.GET, "/api/solicitudes/mis").hasAnyRole("ALUMNO", "ASESOR")
                        .requestMatchers(HttpMethod.POST, "/api/solicitudes").hasAnyRole("ALUMNO", "ASESOR")
                        .requestMatchers(HttpMethod.GET, "/api/solicitudes/recibidas").hasRole("ASESOR")
                        .requestMatchers(HttpMethod.PATCH, "/api/solicitudes/*/aceptar",
                                "/api/solicitudes/*/rechazar").hasRole("ASESOR")
                        .anyRequest().permitAll()
                )
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter))
                        .authenticationEntryPoint(this::handleAuthenticationError)
                )
                .exceptionHandling(handling -> handling
                        .accessDeniedHandler(accessDeniedHandler())
                );
        return http.build();
    }

    private AccessDeniedHandler accessDeniedHandler() {
        return (request, response, accessDeniedException) ->
                writeError(response, HttpStatus.FORBIDDEN, "Forbidden",
                        "No tienes permisos para realizar esta accion");
    }

    private void handleAuthenticationError(HttpServletRequest request, HttpServletResponse response,
                                           AuthenticationException exception) {
        writeError(response, HttpStatus.UNAUTHORIZED, "Unauthorized",
                "Se requiere autenticacion para acceder a este recurso");
    }

    private void writeError(HttpServletResponse response, HttpStatus status, String error, String message) {
        String body = "{\"timestamp\":\"" + LocalDateTime.now()
                + "\",\"status\":" + status.value()
                + ",\"error\":\"" + error
                + "\",\"message\":\"" + message + "\"}";
        try {
            response.setStatus(status.value());
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write(body);
        } catch (IOException e) {
            response.setStatus(status.value());
        }
    }
}
