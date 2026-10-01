package cxt.robertytocerva.aserp;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class AserpApplication {

	public static void main(String[] args) {
		Dotenv dotenv = Dotenv.configure()
				.directory("./")
				.load();

		System.setProperty("NEON_DB_URL", dotenv.get("NEON_DB_URL"));

		SpringApplication.run(AserpApplication.class, args);
	}

}