-- amplia el ciclo de vida de la asesoria: la solicitud de reserva y su rechazo
ALTER TABLE asesorias DROP CONSTRAINT asesorias_estado_check;
ALTER TABLE asesorias ADD CONSTRAINT asesorias_estado_check
    CHECK (estado IN ('solicitada','programada','completada','cancelada','no_asistio','rechazada'));
