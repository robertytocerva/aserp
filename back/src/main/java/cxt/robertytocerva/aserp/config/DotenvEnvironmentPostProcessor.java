package cxt.robertytocerva.aserp.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.EnvironmentPostProcessor;
import org.springframework.boot.SpringApplication;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

import java.util.LinkedHashMap;
import java.util.Map;

public class DotenvEnvironmentPostProcessor implements EnvironmentPostProcessor {

    private static final String[] CLAVES = {"NEON_DB_URL", "JWT_SECRET"};

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        Dotenv dotenv = Dotenv.configure()
                .directory("./")
                .ignoreIfMissing()
                .load();

        Map<String, Object> valores = new LinkedHashMap<>();
        for (String clave : CLAVES) {
            String valor = dotenv.get(clave);
            if (valor != null && !valor.isBlank()) {
                valores.put(clave, valor);
            }
        }

        if (!valores.isEmpty()) {
            environment.getPropertySources().addFirst(new MapPropertySource("dotenv", valores));
        }
    }
}
