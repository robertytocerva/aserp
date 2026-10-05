-- 001_create_carreras.up.sql
CREATE TABLE carreras (
    id_carrera      SERIAL PRIMARY KEY,
    clave           VARCHAR(20)  NOT NULL UNIQUE,
    nombre          VARCHAR(150) NOT NULL,
    activo          BOOLEAN      NOT NULL DEFAULT TRUE,
    creado_en       TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- 002_create_alumnos.up.sql
CREATE TABLE alumnos (
    id_alumno           SERIAL PRIMARY KEY,
    matricula           VARCHAR(20)  NOT NULL UNIQUE,
    nombre              VARCHAR(100) NOT NULL,
    apellido_paterno    VARCHAR(100) NOT NULL,
    apellido_materno    VARCHAR(100),
    correo              VARCHAR(150) NOT NULL UNIQUE,
    telefono            VARCHAR(20),
    id_carrera          INTEGER NOT NULL,
    semestre            SMALLINT NOT NULL CHECK (semestre BETWEEN 1 AND 20),
    activo              BOOLEAN NOT NULL DEFAULT TRUE,
    creado_en           TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_alumnos_carrera
        FOREIGN KEY (id_carrera) REFERENCES carreras (id_carrera)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE INDEX idx_alumnos_carrera ON alumnos (id_carrera);

-- 003_create_asesores.up.sql
CREATE TABLE asesores (
    id_asesor       SERIAL PRIMARY KEY,
    id_alumno       INTEGER NOT NULL UNIQUE,
    promedio        NUMERIC(3,2) CHECK (promedio BETWEEN 0 AND 10),
    fecha_inicio    DATE NOT NULL DEFAULT CURRENT_DATE,
    activo          BOOLEAN NOT NULL DEFAULT TRUE,
    creado_en       TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_asesores_alumno
        FOREIGN KEY (id_alumno) REFERENCES alumnos (id_alumno)
        ON UPDATE CASCADE ON DELETE CASCADE
);

-- 004_create_materias.up.sql
CREATE TABLE materias (
    id_materia              SERIAL PRIMARY KEY,
    clave                   VARCHAR(20)  NOT NULL UNIQUE,
    nombre                  VARCHAR(150) NOT NULL,
    id_carrera               INTEGER NOT NULL,
    semestre_recomendado    SMALLINT CHECK (semestre_recomendado BETWEEN 1 AND 20),
    creditos                 SMALLINT CHECK (creditos >= 0),
    descripcion              TEXT,
    activo                   BOOLEAN NOT NULL DEFAULT TRUE,
    creado_en                TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_materias_carrera
        FOREIGN KEY (id_carrera) REFERENCES carreras (id_carrera)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE INDEX idx_materias_carrera ON materias (id_carrera);

-- 005_create_asesor_materia.up.sql
CREATE TABLE asesor_materia (
    id_asesor_materia   SERIAL PRIMARY KEY,
    id_asesor           INTEGER NOT NULL,
    id_materia          INTEGER NOT NULL,
    nivel_dominio       VARCHAR(20) NOT NULL DEFAULT 'intermedio'
                            CHECK (nivel_dominio IN ('basico','intermedio','avanzado')),
    creado_en           TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_asesor_materia_asesor
        FOREIGN KEY (id_asesor) REFERENCES asesores (id_asesor)
        ON UPDATE CASCADE ON DELETE CASCADE,

    CONSTRAINT fk_asesor_materia_materia
        FOREIGN KEY (id_materia) REFERENCES materias (id_materia)
        ON UPDATE CASCADE ON DELETE CASCADE,

    CONSTRAINT uq_asesor_materia UNIQUE (id_asesor, id_materia)
);

CREATE INDEX idx_asesor_materia_asesor ON asesor_materia (id_asesor);
CREATE INDEX idx_asesor_materia_materia ON asesor_materia (id_materia);

-- 006_create_horarios_asesores.up.sql
CREATE TABLE horarios_asesores (
    id_horario      SERIAL PRIMARY KEY,
    id_asesor       INTEGER NOT NULL,
    dia_semana      SMALLINT NOT NULL CHECK (dia_semana BETWEEN 1 AND 7),
    hora_inicio     TIME NOT NULL,
    hora_fin        TIME NOT NULL,
    modalidad       VARCHAR(20) NOT NULL DEFAULT 'presencial'
                        CHECK (modalidad IN ('presencial','virtual','hibrida')),
    lugar           VARCHAR(100),
    activo          BOOLEAN NOT NULL DEFAULT TRUE,
    creado_en       TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_horarios_asesor
        FOREIGN KEY (id_asesor) REFERENCES asesores (id_asesor)
        ON UPDATE CASCADE ON DELETE CASCADE,

    CONSTRAINT chk_horario_valido CHECK (hora_fin > hora_inicio),

    CONSTRAINT uq_horario_asesor UNIQUE (id_asesor, dia_semana, hora_inicio, hora_fin)
);

CREATE INDEX idx_horarios_asesor ON horarios_asesores (id_asesor);
CREATE INDEX idx_horarios_dia ON horarios_asesores (dia_semana);

-- 007_create_asesorias.up.sql
CREATE TABLE asesorias (
    id_asesoria     SERIAL PRIMARY KEY,
    id_asesor       INTEGER NOT NULL,
    id_alumno       INTEGER NOT NULL,
    id_materia      INTEGER NOT NULL,
    id_horario      INTEGER,
    fecha           DATE NOT NULL,
    hora_inicio     TIME NOT NULL,
    hora_fin        TIME NOT NULL,
    modalidad       VARCHAR(20) NOT NULL DEFAULT 'presencial'
                        CHECK (modalidad IN ('presencial','virtual','hibrida')),
    lugar           VARCHAR(100),
    estado          VARCHAR(20) NOT NULL DEFAULT 'programada'
                        CHECK (estado IN ('programada','completada','cancelada','no_asistio')),
    creado_en       TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_asesorias_asesor
        FOREIGN KEY (id_asesor) REFERENCES asesores (id_asesor)
        ON UPDATE CASCADE ON DELETE RESTRICT,

    CONSTRAINT fk_asesorias_alumno
        FOREIGN KEY (id_alumno) REFERENCES alumnos (id_alumno)
        ON UPDATE CASCADE ON DELETE RESTRICT,

    CONSTRAINT fk_asesorias_materia
        FOREIGN KEY (id_materia) REFERENCES materias (id_materia)
        ON UPDATE CASCADE ON DELETE RESTRICT,

    CONSTRAINT fk_asesorias_horario
        FOREIGN KEY (id_horario) REFERENCES horarios_asesores (id_horario)
        ON UPDATE CASCADE ON DELETE SET NULL,

    CONSTRAINT chk_asesoria_horas CHECK (hora_fin > hora_inicio)
);

CREATE INDEX idx_asesorias_asesor ON asesorias (id_asesor);
CREATE INDEX idx_asesorias_alumno ON asesorias (id_alumno);
CREATE INDEX idx_asesorias_materia ON asesorias (id_materia);
CREATE INDEX idx_asesorias_fecha ON asesorias (fecha);

-- 008_create_bitacoras.up.sql
CREATE TABLE bitacoras (
    id_bitacora         SERIAL PRIMARY KEY,
    id_asesoria         INTEGER NOT NULL UNIQUE,
    temas_tratados      TEXT NOT NULL,
    tareas_asignadas    TEXT,
    observaciones       TEXT,
    calificacion_alumno SMALLINT CHECK (calificacion_alumno BETWEEN 1 AND 5),
    comentario_alumno   TEXT,
    registrado_por      INTEGER NOT NULL,
    fecha_registro      TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_bitacoras_asesoria
        FOREIGN KEY (id_asesoria) REFERENCES asesorias (id_asesoria)
        ON UPDATE CASCADE ON DELETE CASCADE,

    CONSTRAINT fk_bitacoras_registrado_por
        FOREIGN KEY (registrado_por) REFERENCES asesores (id_asesor)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE INDEX idx_bitacoras_asesoria ON bitacoras (id_asesoria);