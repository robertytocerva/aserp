-- datos de la sesion copiados al crear la bitacora (inmutables aunque cambien horarios o nombres)
ALTER TABLE bitacoras ADD COLUMN fecha_sesion DATE;
ALTER TABLE bitacoras ADD COLUMN hora_inicio TIME;
ALTER TABLE bitacoras ADD COLUMN hora_fin TIME;
ALTER TABLE bitacoras ADD COLUMN matricula_alumno VARCHAR(20);
ALTER TABLE bitacoras ADD COLUMN nombre_alumno VARCHAR(250);
ALTER TABLE bitacoras ADD COLUMN nombre_asesor VARCHAR(250);
ALTER TABLE bitacoras ADD COLUMN nombre_materia VARCHAR(150);
ALTER TABLE bitacoras ADD COLUMN nombre_carrera VARCHAR(150);

-- evidencia opcional (max 2 MB, JPG/PNG validado en la aplicacion)
ALTER TABLE bitacoras ADD COLUMN imagen_evidencia BYTEA;
ALTER TABLE bitacoras ADD COLUMN imagen_tipo VARCHAR(20);

-- resultado del envio de correo (el envio ocurre despues del commit)
ALTER TABLE bitacoras ADD COLUMN correo_enviado BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE bitacoras ADD COLUMN correo_error TEXT;
