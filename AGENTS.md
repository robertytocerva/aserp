# AGENTS.md

## Layout

- `back/` — the only code: Spring Boot 4.1.1 / Java 21 REST API (Maven, wrapper `./mvnw`). All commands run from `back/`.
- `front/` — placeholder, no frontend yet.
- Endpoint docs (Spanish, with request/response examples): `back/docEndpoit.md`. Keep it updated when changing controllers.

## Commands

```bash
cd back
./mvnw spring-boot:run          # dev server on :8080
./mvnw test                     # full suite
./mvnw -Dtest=AsesorMateriaServiceTests test   # single test class
./mvnw -Dtest=AsesorMateriaServiceTests#methodName test
```

There is no lint/format/typecheck tooling and no CI — compile + tests are the whole verification story.

## Environment (easy to get wrong)

- `back/.env` must contain `NEON_DB_URL` (Neon Postgres, `sslmode=require`) and `JWT_SECRET` (≥32 chars, HS256 signing key). Copy from `.env.example`. It is gitignored.
- `.env` is loaded by `DotenvEnvironmentPostProcessor` registered in `back/src/main/resources/META-INF/spring.factories` — it runs in `main` **and** in `@SpringBootTest`. Keep new env vars in its `CLAVES` array. Run the app/tests with working directory `back/` or the `.env` won't be found.
- `spring.datasource.username/password` are hardcoded in `application.properties`; only the URL comes from `.env`.
- `./mvnw test` boots a full `@SpringBootTest` context against the **live** Neon database (Flyway runs against it). No H2/Testcontainers.
- Because of that, service tests are `@SpringBootTest` + class-level `@Transactional` (rollback per test), create their own carrera/alumno/asesor/materia with unique UUID-suffixed claves/matrículas, never `deleteAll()` or touch rows they didn't create, and never assume existing ids. See `AsesorMateriaServiceTests`.

## Database / Flyway

- Schema is owned entirely by Flyway: `spring.jpa.hibernate.ddl-auto=validate`. Never hand-edit the DB or add `ddl-auto=update`.
- Migrations are applied in order and must never be edited after applying. `V001__create_asesorias_schema.sql` (8 tables), `V002__usuarios_y_validacion_asesores.sql` (`usuarios` + `asesores.validado`) and `V003__estados_solicitud_asesoria.sql` (`asesorias.estado` CHECK ampliado a `solicitada`/`rechazada`) are already applied. Add `V00N__descripcion.sql` for any schema change, then adjust entities so `validate` passes.
- The schema is still slightly ahead of the code: table `bitacoras` exists in the DB but has no entity/service/controller yet.
- Columns are snake_case; entity fields camelCase with explicit `@Column(name = "snake_case")`.
- Entity boolean defaults are applied in `@PrePersist` (e.g. `activo = true`), **not** via field initializers — Lombok `@Builder` silently drops them.
- `asesorias.estado` and `modalidad` fields are `String` (V001/V003 CHECKs use lowercase values; a `@Enumerated(EnumType.STRING)` would persist uppercase names and violate them).

## Code conventions

- Package root `cxt.robertytocerva.aserp` with `controller / service / repository / entity / dto / config / exception` layers.
- DTOs: nested `record`s inside a per-entity holder class (`AlumnoDTO.Request`, `AlumnoDTO.Response`, e.g. `RegistroRequest`), with jakarta validation annotations and Spanish messages.
- Entities: Lombok `@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder`; `@PrePersist` sets timestamps/defaults.
- Services: `@RequiredArgsConstructor`, manual entity→DTO mapping (no MapStruct), `@Transactional` (readOnly for queries), business messages in Spanish.
- Errors: throw `ResourceNotFoundException` / `BadRequestException` / `UnauthorizedException`; `GlobalExceptionHandler` returns `{timestamp, status, error, message}` maps. Follow this shape.
- `DELETE /api/.../{id}` is a **soft delete** (sets `activo=false`, returns 204). Exception: `DELETE /api/admin/asesores/{idAsesor}/materias/{idMateria}` is a hard delete (`asesor_materia` has no `activo` column).

## Auth & roles (as of V002)

- JWT Bearer (HS256, `JwtConfig`/`JwtService`), stateless, CSRF off. Roles in `usuarios.rol`: `ALUMNO` / `ASESOR` / `ADMIN` (enum `RolUsuario`, claim `rol` → `ROLE_*` via `jwtAuthenticationConverter`).
- `SecurityConfig` rules: `/api/admin/**` → `ADMIN`; `POST /api/asesores` → `ALUMNO` or `ASESOR`; everything else `permitAll` (reads stay public). Keep new endpoints under `/api/` and add a matcher when they need a role.
- `POST /api/alumnos` creates `Alumno` + `Usuario` (rol `ALUMNO`, BCrypt hash) in one transaction; the alumno's `correo` is the login username.
- `POST /api/asesores` derives `idAlumno` from the JWT claim (`jwt.getClaim("idAlumno")` is a `Number`, not `Integer`) and creates the asesor with `validado=false`.
- `PATCH /api/admin/asesores/{id}/validacion` is the **only** place that changes `validado`; it also syncs `usuarios.rol` (`ASESOR` when validated, back to `ALUMNO` when reverted).
- An unvalidated asesor must not use platform features: gate asesor-owned endpoints (horarios, solicitudes/sesiones) on `AsesorService.obtenerAsesorValidadoDeAlumno(idAlumno)` (JWT claim → asesor → `validado`).
- The `ADMIN` account is created manually (SQL with a BCrypt hash — see `docEndpoit.md`); there is no admin registration endpoint.

## Horarios y solicitudes (V003)

- `HorarioAsesor` = bloque semanal recurrente (`dia_semana` 1=lunes…7=domingo, matches ISO `DayOfWeek`); a reservable slot is `(horario, fecha)`.
- A `Solicitud` is an `Asesoria` row in estado `solicitada`; `aceptar` → `programada`, `rechazar` → `rechazada` (`SolicitudService` is the only writer of those transitions).
- Creating a solicitud copies `hora_inicio/hora_fin/modalidad/lugar` from the horario — editing the horario later must not move existing sessions.
- One active (`solicitada`/`programada`) asesoría per asesor+fecha+time-overlap: enforced on insert via `AsesoriaRepository.existeTraslape` and it filters slots out of `GET /api/asesores/{id}/horarios/disponibles`. Test both sides (slot hidden from other alumnos, reappears after `rechazar`).
- The asesor cannot request their own horario; `fecha` must match the horario's `dia_semana` and be today or later.

## Materias por asesor (`asesor_materia`)

- Only the admin assigns materias: writes live in `AdminController` under `/api/admin/asesores/{idAsesor}/materias` (POST / PUT `/{idMateria}` / DELETE `/{idMateria}`); `AsesorMateriaService` is the only writer of `asesor_materia`. Rows are addressed by `(idAsesor, idMateria)` (UNIQUE), not by `id_asesor_materia`.
- `nivel_dominio` is a `String` (`basico`/`intermedio`/`avanzado`, CHECK in lowercase); default `intermedio` set in `@PrePersist`.
- Assigning requires the asesor `activo` and the materia `activo`, but **not** `validado` (the admin may configure an asesor before validating it).
- Public reads in `AsesorMateriaController`: `GET /api/asesores/{id}/materias` (all assignments, validated or not) and `GET /api/materias/{id}/asesores` (only `activo && validado` asesores, each with its active horarios via `HorarioAsesorService.listarActivosDeAsesor`).
- `SolicitudService` does **not** check that the asesor imparts the requested materia (intentionally out of scope for now).

## Toolchain quirks

- Spring Boot 4 starter names differ from Boot 3: `spring-boot-starter-webmvc` (not `starter-web`) and `spring-boot-starter-*-test` variants in `pom.xml`.
- Lombok is wired as an explicit `annotationProcessorPaths` in `maven-compiler-plugin` for both compile and test-compile — don't remove those executions.

## Deploy (Docker / Render)

- `Dockerfile` + `.dockerignore` + `render.yaml` live in `back/` (build context = `back/`; Docker paths are relative to it). Render deploys as a Docker web service with root directory `back/`.
- The entrypoint runs `java -jar app.jar --server.port=${PORT:-8080}` — Render injects `PORT` and Spring Boot does not map it on its own. Don't hardcode the port.
- Build runs `mvn -DskipTests` (tests boot `@SpringBootTest` against the live DB). Required env vars in Render: `NEON_DB_URL`, `JWT_SECRET` (`render.yaml` marks them `sync: false`).
- `back/.env` is `.dockerignore`d (excluded as `.env`, context-relative) — secrets must come from the environment, never baked into the image. `DotenvEnvironmentPostProcessor` ignores the missing file, so the same code runs local and in Render.
