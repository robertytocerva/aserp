-- usuarios: cuentas de acceso con rol (alumno, asesor, admin)
CREATE TABLE usuarios (
    id_usuario      SERIAL PRIMARY KEY,
    correo          VARCHAR(150) NOT NULL UNIQUE,
    password_hash   VARCHAR(100) NOT NULL,
    rol             VARCHAR(20)  NOT NULL CHECK (rol IN ('ALUMNO','ASESOR','ADMIN')),
    id_alumno       INTEGER UNIQUE,
    activo          BOOLEAN NOT NULL DEFAULT TRUE,
    creado_en       TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_usuarios_alumno
        FOREIGN KEY (id_alumno) REFERENCES alumnos (id_alumno)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

-- validacion del asesor por parte de la cuenta de administracion
ALTER TABLE asesores ADD COLUMN validado BOOLEAN NOT NULL DEFAULT FALSE;
