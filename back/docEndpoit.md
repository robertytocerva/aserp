# Documentacion de Endpoints - ASERP

API REST para el sistema de asesores pares del Instituto Tecnologico Superior Campus Uruapan.

Base URL: `http://localhost:8080`

---

## Autenticacion

Roles: `ALUMNO`, `ASESOR`, `ADMIN`. El registro de alumno crea la cuenta con rol `ALUMNO`. El rol `ASESOR` se asigna solo cuando el admin valida al asesor; si la validacion se revierte, el rol vuelve a `ALUMNO`.

### Login

```
POST /api/auth/login
Content-Type: application/json
```

**Body:**
```json
{
  "correo": "juan.perez@uruapan.tecnm.mx",
  "password": "secreta123"
}
```

**Response 200:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "tipo": "Bearer",
  "idUsuario": 1,
  "idAlumno": 1,
  "rol": "ALUMNO"
}
```

Los endpoints protegidos se llaman con el header `Authorization: Bearer <token>`. El token expira en 24 horas.

**Response 401 (credenciales invalidas o cuenta desactivada):**
```json
{
  "timestamp": "2026-09-30T20:00:00",
  "status": 401,
  "error": "Unauthorized",
  "message": "Correo o contrasena incorrectos"
}
```

**Response 401 (sin token en endpoint protegido):**
```json
{
  "timestamp": "2026-09-30T20:00:00",
  "status": 401,
  "error": "Unauthorized",
  "message": "Se requiere autenticacion para acceder a este recurso"
}
```

**Response 403 (rol insuficiente):**
```json
{
  "timestamp": "2026-09-30T20:00:00",
  "status": 403,
  "error": "Forbidden",
  "message": "No tienes permisos para realizar esta accion"
}
```

### Cuenta de administracion

Se crea manualmente en la BD (no hay endpoint de registro de admin). Generar un hash BCrypt de la contrasena y ejecutar:

```sql
INSERT INTO usuarios (correo, password_hash, rol)
VALUES ('admin@uruapan.tecnm.mx', '<hash-bcrypt-de-la-contrasena>', 'ADMIN');
```

---

## Carreras

### Listar todas las carreras

```
GET /api/carreras
```

**Response 200:**
```json
[
  {
    "idCarrera": 1,
    "clave": "ISC",
    "nombre": "Ingenieria en Sistemas Computacionales",
    "activo": true
  },
  {
    "idCarrera": 2,
    "clave": "IIA",
    "nombre": "Ingenieria en Inteligencia Artificial",
    "activo": true
  }
]
```

### Buscar carrera por ID

```
GET /api/carreras/1
```

**Response 200:**
```json
{
  "idCarrera": 1,
  "clave": "ISC",
  "nombre": "Ingenieria en Sistemas Computacionales",
  "activo": true
}
```

**Response 404:**
```json
{
  "timestamp": "2026-09-30T20:00:00",
  "status": 404,
  "error": "Not Found",
  "message": "Carrera no encontrada con id: 99"
}
```

### Crear carrera

```
POST /api/carreras
Content-Type: application/json
```

**Body:**
```json
{
  "clave": "ISC",
  "nombre": "Ingenieria en Sistemas Computacionales"
}
```

**Response 201:**
```json
{
  "idCarrera": 1,
  "clave": "ISC",
  "nombre": "Ingenieria en Sistemas Computacionales",
  "activo": true
}
```

**Response 400 (clave duplicada):**
```json
{
  "timestamp": "2026-09-30T20:00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Ya existe una carrera con la clave: ISC"
}
```

**Response 400 (validacion):**
```json
{
  "timestamp": "2026-09-30T20:00:00",
  "status": 400,
  "error": "Validation Error",
  "errors": {
    "clave": "La clave es obligatoria",
    "nombre": "El nombre es obligatorio"
  }
}
```

### Actualizar carrera

```
PUT /api/carreras/1
Content-Type: application/json
```

**Body:**
```json
{
  "clave": "ISC",
  "nombre": "Ing. en Sistemas Computacionales (actualizado)"
}
```

**Response 200:**
```json
{
  "idCarrera": 1,
  "clave": "ISC",
  "nombre": "Ing. en Sistemas Computacionales (actualizado)",
  "activo": true
}
```

### Eliminar carrera (soft delete)

```
DELETE /api/carreras/1
```

**Response 204:** Sin body

---

## Materias

### Listar todas las materias

```
GET /api/materias
```

**Response 200:**
```json
[
  {
    "idMateria": 1,
    "clave": "IS-101",
    "nombre": "Programacion Estructurada",
    "idCarrera": 1,
    "nombreCarrera": "Ingenieria en Sistemas Computacionales",
    "semestreRecomendado": 1,
    "creditos": 6,
    "descripcion": "Fundamentos de programacion",
    "activo": true
  }
]
```

### Buscar materia por ID

```
GET /api/materias/1
```

**Response 200:**
```json
{
  "idMateria": 1,
  "clave": "IS-101",
  "nombre": "Programacion Estructurada",
  "idCarrera": 1,
  "nombreCarrera": "Ingenieria en Sistemas Computacionales",
  "semestreRecomendado": 1,
  "creditos": 6,
  "descripcion": "Fundamentos de programacion",
  "activo": true
}
```

### Listar materias por carrera

```
GET /api/materias/carrera/1
```

**Response 200:**
```json
[
  {
    "idMateria": 1,
    "clave": "IS-101",
    "nombre": "Programacion Estructurada",
    "idCarrera": 1,
    "nombreCarrera": "Ingenieria en Sistemas Computacionales",
    "semestreRecomendado": 1,
    "creditos": 6,
    "descripcion": "Fundamentos de programacion",
    "activo": true
  },
  {
    "idMateria": 2,
    "clave": "IS-201",
    "nombre": "Estructuras de Datos",
    "idCarrera": 1,
    "nombreCarrera": "Ingenieria en Sistemas Computacionales",
    "semestreRecomendado": 3,
    "creditos": 6,
    "descripcion": null,
    "activo": true
  }
]
```

### Crear materia

```
POST /api/materias
Content-Type: application/json
```

**Body:**
```json
{
  "clave": "IS-101",
  "nombre": "Programacion Estructurada",
  "idCarrera": 1,
  "semestreRecomendado": 1,
  "creditos": 6,
  "descripcion": "Fundamentos de programacion"
}
```

**Response 201:**
```json
{
  "idMateria": 1,
  "clave": "IS-101",
  "nombre": "Programacion Estructurada",
  "idCarrera": 1,
  "nombreCarrera": "Ingenieria en Sistemas Computacionales",
  "semestreRecomendado": 1,
  "creditos": 6,
  "descripcion": "Fundamentos de programacion",
  "activo": true
}
```

**Response 400 (clave duplicada):**
```json
{
  "timestamp": "2026-09-30T20:00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Ya existe una materia con la clave: IS-101"
}
```

**Response 404 (carrera no existe):**
```json
{
  "timestamp": "2026-09-30T20:00:00",
  "status": 404,
  "error": "Not Found",
  "message": "Carrera no encontrada con id: 99"
}
```

### Actualizar materia

```
PUT /api/materias/1
Content-Type: application/json
```

**Body:**
```json
{
  "clave": "IS-101",
  "nombre": "Programacion Estructurada",
  "idCarrera": 1,
  "semestreRecomendado": 1,
  "creditos": 8,
  "descripcion": "Actualizado: Fundamentos de programacion en C"
}
```

**Response 200:**
```json
{
  "idMateria": 1,
  "clave": "IS-101",
  "nombre": "Programacion Estructurada",
  "idCarrera": 1,
  "nombreCarrera": "Ingenieria en Sistemas Computacionales",
  "semestreRecomendado": 1,
  "creditos": 8,
  "descripcion": "Actualizado: Fundamentos de programacion en C",
  "activo": true
}
```

### Eliminar materia (soft delete)

```
DELETE /api/materias/1
```

**Response 204:** Sin body

---

## Alumnos

### Listar todos los alumnos

```
GET /api/alumnos
```

**Response 200:**
```json
[
  {
    "idAlumno": 1,
    "matricula": "20240001",
    "nombre": "Juan",
    "apellidoPaterno": "Perez",
    "apellidoMaterno": "Lopez",
    "correo": "juan.perez@uruapan.tecnm.mx",
    "telefono": "4521234567",
    "idCarrera": 1,
    "nombreCarrera": "Ingenieria en Sistemas Computacionales",
    "semestre": 3,
    "activo": true
  }
]
```

### Buscar alumno por ID

```
GET /api/alumnos/1
```

**Response 200:**
```json
{
  "idAlumno": 1,
  "matricula": "20240001",
  "nombre": "Juan",
  "apellidoPaterno": "Perez",
  "apellidoMaterno": "Lopez",
  "correo": "juan.perez@uruapan.tecnm.mx",
  "telefono": "4521234567",
  "idCarrera": 1,
  "nombreCarrera": "Ingenieria en Sistemas Computacionales",
  "semestre": 3,
  "activo": true
}
```

### Registrar alumno

Crea el alumno y su cuenta de acceso (rol `ALUMNO`) en la misma operacion. El `correo` sirve como usuario de login.

```
POST /api/alumnos
Content-Type: application/json
```

**Body:**
```json
{
  "matricula": "20240001",
  "nombre": "Juan",
  "apellidoPaterno": "Perez",
  "apellidoMaterno": "Lopez",
  "correo": "juan.perez@uruapan.tecnm.mx",
  "telefono": "4521234567",
  "idCarrera": 1,
  "semestre": 3,
  "password": "secreta123"
}
```

**Response 201:**
```json
{
  "idAlumno": 1,
  "matricula": "20240001",
  "nombre": "Juan",
  "apellidoPaterno": "Perez",
  "apellidoMaterno": "Lopez",
  "correo": "juan.perez@uruapan.tecnm.mx",
  "telefono": "4521234567",
  "idCarrera": 1,
  "nombreCarrera": "Ingenieria en Sistemas Computacionales",
  "semestre": 3,
  "activo": true
}
```

**Response 400 (matricula duplicada):**
```json
{
  "timestamp": "2026-09-30T20:00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Ya existe un alumno con la matricula: 20240001"
}
```

**Response 400 (correo duplicado):**
```json
{
  "timestamp": "2026-09-30T20:00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Ya existe un alumno con el correo: juan.perez@uruapan.tecnm.mx"
}
```

**Response 400 (validacion):**
```json
{
  "timestamp": "2026-09-30T20:00:00",
  "status": 400,
  "error": "Validation Error",
  "errors": {
    "matricula": "La matricula es obligatoria",
    "nombre": "El nombre es obligatorio",
    "correo": "El correo debe ser valido",
    "idCarrera": "El idCarrera es obligatorio",
    "semestre": "El semestre debe estar entre 1 y 20"
  }
}
```

### Actualizar alumno

```
PUT /api/alumnos/1
Content-Type: application/json
```

**Body:**
```json
{
  "matricula": "20240001",
  "nombre": "Juan",
  "apellidoPaterno": "Perez",
  "apellidoMaterno": "Lopez",
  "correo": "juan.perez@uruapan.tecnm.mx",
  "telefono": "4529999999",
  "idCarrera": 1,
  "semestre": 4
}
```

**Response 200:**
```json
{
  "idAlumno": 1,
  "matricula": "20240001",
  "nombre": "Juan",
  "apellidoPaterno": "Perez",
  "apellidoMaterno": "Lopez",
  "correo": "juan.perez@uruapan.tecnm.mx",
  "telefono": "4529999999",
  "idCarrera": 1,
  "nombreCarrera": "Ingenieria en Sistemas Computacionales",
  "semestre": 4,
  "activo": true
}
```

### Eliminar alumno (soft delete)

```
DELETE /api/alumnos/1
```

**Response 204:** Sin body

---

## Asesores

### Listar todos los asesores

```
GET /api/asesores
```

**Response 200:**
```json
[
  {
    "idAsesor": 1,
    "idAlumno": 1,
    "nombreAlumno": "Juan Perez",
    "matricula": "20240001",
    "promedio": 9.50,
    "fechaInicio": "2026-09-30",
    "validado": true,
    "activo": true
  }
]
```

### Buscar asesor por ID

```
GET /api/asesores/1
```

**Response 200:**
```json
{
  "idAsesor": 1,
  "idAlumno": 1,
  "nombreAlumno": "Juan Perez",
  "matricula": "20240001",
  "promedio": 9.50,
  "fechaInicio": "2026-09-30",
  "validado": true,
  "activo": true
}
```

### Registrar asesor (postulacion)

Requiere token de una cuenta con rol `ALUMNO` o `ASESOR`. El alumno se toma del token (el body ya no lleva `idAlumno`). Un alumno solo puede tener un perfil de asesor. El asesor se crea con `validado: false` y no puede usar la plataforma hasta que el admin lo valide.

```
POST /api/asesores
Content-Type: application/json
Authorization: Bearer <token>
```

**Body:**
```json
{
  "promedio": 9.50
}
```

**Response 201:**
```json
{
  "idAsesor": 1,
  "idAlumno": 1,
  "nombreAlumno": "Juan Perez",
  "matricula": "20240001",
  "promedio": 9.50,
  "fechaInicio": "2026-09-30",
  "validado": false,
  "activo": true
}
```

**Response 401 (sin token):**
```json
{
  "timestamp": "2026-09-30T20:00:00",
  "status": 401,
  "error": "Unauthorized",
  "message": "Se requiere autenticacion para acceder a este recurso"
}
```

**Response 400 (alumno ya es asesor):**
```json
{
  "timestamp": "2026-09-30T20:00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "El alumno con id 1 ya tiene una cuenta de asesor"
}
```

**Response 400 (validacion):**
```json
{
  "timestamp": "2026-09-30T20:00:00",
  "status": 400,
  "error": "Validation Error",
  "errors": {
    "promedio": "El promedio maximo es 10"
  }
}
```

### Validar asesor (solo admin)

Requiere token de una cuenta con rol `ADMIN`. Cambia el estado `validado` del asesor y sincroniza su rol de usuario (`ASESOR` si `validado: true`, `ALUMNO` si `false`). Solo un asesor validado puede hacer uso de la plataforma.

```
PATCH /api/admin/asesores/1/validacion
Content-Type: application/json
Authorization: Bearer <token-admin>
```

**Body:**
```json
{
  "validado": true
}
```

**Response 200:**
```json
{
  "idAsesor": 1,
  "idAlumno": 1,
  "nombreAlumno": "Juan Perez",
  "matricula": "20240001",
  "promedio": 9.50,
  "fechaInicio": "2026-09-30",
  "validado": true,
  "activo": true
}
```

**Response 403 (token sin rol ADMIN):**
```json
{
  "timestamp": "2026-09-30T20:00:00",
  "status": 403,
  "error": "Forbidden",
  "message": "No tienes permisos para realizar esta accion"
}
```

**Response 404 (asesor no existe):**
```json
{
  "timestamp": "2026-09-30T20:00:00",
  "status": 404,
  "error": "Not Found",
  "message": "Asesor no encontrado con id: 99"
}
```

### Desactivar asesor (soft delete)

```
DELETE /api/asesores/1
```

**Response 204:** Sin body

---

## Horarios del asesor

El horario es un bloque **recurrente semanal** (`diaSemana` 1=lunes … 7=domingo). Un asesor validado publica sus horarios y los alumnos reservan un slot concreto (horario + fecha) mediante una solicitud.

`modalidad`: `presencial`, `virtual` o `hibrida`. `horaInicio`/`horaFin` con formato `HH:mm`, y `horaFin` debe ser posterior a `horaInicio`.

### Crear horario

Requiere token de una cuenta con rol `ASESOR` (asesor ya validado por el admin). El asesor se toma del token.

```
POST /api/horarios
Content-Type: application/json
Authorization: Bearer <token-asesor>
```

**Body:**
```json
{
  "diaSemana": 2,
  "horaInicio": "16:00",
  "horaFin": "18:00",
  "modalidad": "presencial",
  "lugar": "Aula 3"
}
```

**Response 201:**
```json
{
  "idHorario": 1,
  "idAsesor": 1,
  "nombreAsesor": "Juan Perez",
  "diaSemana": 2,
  "horaInicio": "16:00",
  "horaFin": "18:00",
  "modalidad": "presencial",
  "lugar": "Aula 3",
  "activo": true
}
```

**Response 400 (horario duplicado):**
```json
{
  "timestamp": "2026-09-30T20:00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Ya existe un horario con ese dia y rango de horas para este asesor"
}
```

**Response 400 (rango de horas invalido):**
```json
{
  "timestamp": "2026-09-30T20:00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "La hora de fin debe ser posterior a la hora de inicio"
}
```

**Response 401 (sin token):**
```json
{
  "timestamp": "2026-09-30T20:00:00",
  "status": 401,
  "error": "Unauthorized",
  "message": "Se requiere autenticacion para acceder a este recurso"
}
```

**Response 403 (rol distinto de ASESOR):**
```json
{
  "timestamp": "2026-09-30T20:00:00",
  "status": 403,
  "error": "Forbidden",
  "message": "No tienes permisos para realizar esta accion"
}
```

**Response 400 (asesor aun no validado):**
```json
{
  "timestamp": "2026-09-30T20:00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "El asesor aun no ha sido validado por el administrador"
}
```

### Listar mis horarios (solo asesor)

Devuelve los horarios propios, incluidos los inactivos.

```
GET /api/horarios
Authorization: Bearer <token-asesor>
```

**Response 200:** Array de horarios (misma forma que el response de crear).

### Listar horarios activos de un asesor

Lectura publica, solo horarios `activo: true`.

```
GET /api/asesores/1/horarios
```

**Response 200:** Array de horarios.

**Response 404 (asesor no existe):**
```json
{
  "timestamp": "2026-09-30T20:00:00",
  "status": 404,
  "error": "Not Found",
  "message": "Asesor no encontrado con id: 99"
}
```

### Listar horarios disponibles para reserva

Lectura publica. Expande los horarios activos del asesor en **slots** concretos (horario + fecha) dentro del rango pedido, excluyendo los que ya tienen una solicitud o sesion activa (`solicitada` o `programada`) que se traslape. `diaSemana` debe coincidir con el dia de la semana de `fecha`.

```
GET /api/asesores/1/horarios/disponibles?desde=2026-10-13&hasta=2026-10-27
```

Parametros opcionales `desde` y `hasta` (`yyyy-MM-dd`). Por defecto `desde` = hoy y `hasta` = `desde` + 14 dias. `desde` debe ser hoy o posterior, `hasta` >= `desde`, y el rango no puede exceder 60 dias.

**Response 200:**
```json
[
  {
    "idHorario": 1,
    "idAsesor": 1,
    "nombreAsesor": "Juan Perez",
    "fecha": "2026-10-13",
    "diaSemana": 2,
    "horaInicio": "16:00",
    "horaFin": "18:00",
    "modalidad": "presencial",
    "lugar": "Aula 3"
  }
]
```

**Response 400 (rango invalido):**
```json
{
  "timestamp": "2026-09-30T20:00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "El rango de fechas no debe exceder 60 dias"
}
```

### Actualizar horario

Requiere token del asesor **dueño** del horario.

```
PUT /api/horarios/1
Content-Type: application/json
Authorization: Bearer <token-asesor>
```

**Body:** igual que el de crear.

**Response 200:** Horario actualizado.

**Response 400 (no es el dueño):**
```json
{
  "timestamp": "2026-09-30T20:00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "El horario no pertenece al asesor autenticado"
}
```

**Response 404 (horario no existe):**
```json
{
  "timestamp": "2026-09-30T20:00:00",
  "status": 404,
  "error": "Not Found",
  "message": "Horario no encontrado con id: 99"
}
```

### Eliminar horario (soft delete)

Requiere token del asesor dueño. Marca `activo: false`: el horario deja de ofrecerse para reserva pero las sesiones ya pedidas no se afectan.

```
DELETE /api/horarios/1
Authorization: Bearer <token-asesor>
```

**Response 204:** Sin body

---

## Solicitudes de sesion de tutoria

Una **solicitud** reserva un slot concreto (horario + fecha) de un asesor. Se crea en estado `solicitada`; el asesor la `acepta` (`programada`) o la `rechaza` (`rechazada`). Al crearse se copian del horario `horaInicio`, `horaFin`, `modalidad` y `lugar`, de modo que editar el horario despues no mueve sesiones ya pedidas.

**Estados:** `solicitada`, `programada`, `completada`, `cancelada`, `no_asistio`, `rechazada`.

**Reglas:**
- Un slot (horario + fecha) solo admite una solicitud/sesion activa (`solicitada` o `programada`). Mientras este ocupado **no aparece** en `disponibles` para otros alumnos; si el asesor rechaza, el slot vuelve a estar libre.
- La `fecha` debe ser hoy o posterior y su dia de semana debe coincidir con el `diaSemana` del horario.
- El asesor no puede solicitar su propio horario.

### Enviar solicitud (reservar slot)

Requiere token de una cuenta con rol `ALUMNO` o `ASESOR`. El alumno se toma del token.

```
POST /api/solicitudes
Content-Type: application/json
Authorization: Bearer <token-alumno>
```

**Body:**
```json
{
  "idHorario": 1,
  "fecha": "2026-10-13",
  "idMateria": 1
}
```

**Response 201:**
```json
{
  "idAsesoria": 1,
  "idHorario": 1,
  "idAsesor": 1,
  "nombreAsesor": "Juan Perez",
  "idAlumno": 2,
  "nombreAlumno": "Ana Lopez",
  "matricula": "20240002",
  "idMateria": 1,
  "nombreMateria": "Calculo",
  "fecha": "2026-10-13",
  "horaInicio": "16:00",
  "horaFin": "18:00",
  "modalidad": "presencial",
  "lugar": "Aula 3",
  "estado": "solicitada"
}
```

**Response 400 (slot ya ocupado):**
```json
{
  "timestamp": "2026-09-30T20:00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "El horario ya no esta disponible para esa fecha"
}
```

**Response 400 (fecha no coincide con el dia del horario):**
```json
{
  "timestamp": "2026-09-30T20:00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "La fecha no corresponde al dia de semana del horario"
}
```

**Response 400 (horario inactivo):**
```json
{
  "timestamp": "2026-09-30T20:00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "El horario no esta disponible"
}
```

**Response 400 (el asesor solicita su propio horario):**
```json
{
  "timestamp": "2026-09-30T20:00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "El asesor no puede solicitar su propio horario"
}
```

### Ver mis solicitudes

Requiere token. Devuelve las solicitudes/sesiones donde el alumno autenticado es el solicitante, ordenadas por fecha y hora.

```
GET /api/solicitudes/mis
Authorization: Bearer <token-alumno>
```

**Response 200:** Array de solicitudes (misma forma que el response de enviar solicitud).

### Ver solicitudes recibidas (solo asesor)

Requiere token de una cuenta con rol `ASESOR`. Devuelve las solicitudes de sus propias sesiones, ordenadas por fecha y hora. Filtrado opcional por `estado`.

```
GET /api/solicitudes/recibidas?estado=solicitada
Authorization: Bearer <token-asesor>
```

`estado` opcional: `solicitada`, `programada`, `completada`, `cancelada`, `no_asistio` o `rechazada`. Sin el parametro devuelve todas.

**Response 200:** Array de solicitudes.

**Response 400 (estado invalido):**
```json
{
  "timestamp": "2026-09-30T20:00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "El estado debe ser solicitada, programada, completada, cancelada, no_asistio o rechazada"
}
```

### Aceptar solicitud (agendar sesion)

Requiere token del asesor **dueño** de la solicitud. Cambia `solicitada` → `programada`. La sesion queda agendada.

```
PATCH /api/solicitudes/1/aceptar
Authorization: Bearer <token-asesor>
```

**Response 200:** Solicitud con `estado: "programada"`.

**Response 400 (no esta en estado solicitada):**
```json
{
  "timestamp": "2026-09-30T20:00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Solo se pueden aceptar solicitudes en estado solicitada"
}
```

**Response 400 (no es el dueño):**
```json
{
  "timestamp": "2026-09-30T20:00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "La solicitud no pertenece al asesor autenticado"
}
```

### Rechazar solicitud

Requiere token del asesor dueño. Cambia `solicitada` → `rechazada`. El slot vuelve a estar disponible para reserva.

```
PATCH /api/solicitudes/1/rechazar
Authorization: Bearer <token-asesor>
```

**Response 200:** Solicitud con `estado: "rechazada"`.

**Response 400 (no esta en estado solicitada):**
```json
{
  "timestamp": "2026-09-30T20:00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Solo se pueden rechazar solicitudes en estado solicitada"
}
```

---

## Flujo completo de registro y validacion de asesor

Paso 1 - Crear carrera:
```bash
curl -X POST http://localhost:8080/api/carreras \
  -H "Content-Type: application/json" \
  -d '{"clave":"ISC","nombre":"Ingenieria en Sistemas Computacionales"}'
```

Paso 2 - Registrar alumno (crea tambien su cuenta de acceso):
```bash
curl -X POST http://localhost:8080/api/alumnos \
  -H "Content-Type: application/json" \
  -d '{"matricula":"20240001","nombre":"Juan","apellidoPaterno":"Perez","correo":"juan@uruapan.tecnm.mx","idCarrera":1,"semestre":5,"password":"secreta123"}'
```

Paso 3 - Login del alumno:
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"correo":"juan@uruapan.tecnm.mx","password":"secreta123"}'
```

Paso 4 - Postularse como asesor (con el token del paso 3):
```bash
curl -X POST http://localhost:8080/api/asesores \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token-alumno>" \
  -d '{"promedio":9.50}'
```

El asesor queda con `validado: false` y sin uso de la plataforma.

Paso 5 - Login del admin y validacion:
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"correo":"admin@uruapan.tecnm.mx","password":"<contrasena-admin>"}'

curl -X PATCH http://localhost:8080/api/admin/asesores/1/validacion \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token-admin>" \
  -d '{"validado":true}'
```

A partir de aqui el asesor tiene rol `ASESOR` y puede usar la plataforma.

---

## Flujo completo de solicitud y agendamiento de sesion

Pre-requisito: un asesor ya validado (ver flujo anterior).

Paso 1 - El asesor publica su horario:
```bash
curl -X POST http://localhost:8080/api/horarios \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token-asesor>" \
  -d '{"diaSemana":2,"horaInicio":"16:00","horaFin":"18:00","modalidad":"presencial","lugar":"Aula 3"}'
```

Paso 2 - Un alumno consulta los slots libres:
```bash
curl "http://localhost:8080/api/asesores/1/horarios/disponibles?desde=2026-10-13&hasta=2026-10-27"
```

Paso 3 - El alumno solicita un slot (queda en `solicitada`):
```bash
curl -X POST http://localhost:8080/api/solicitudes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token-alumno>" \
  -d '{"idHorario":1,"fecha":"2026-10-13","idMateria":1}'
```

El slot deja de aparecer en `disponibles` para otros alumnos.

Paso 4 - El asesor revisa sus solicitudes:
```bash
curl "http://localhost:8080/api/solicitudes/recibidas?estado=solicitada" \
  -H "Authorization: Bearer <token-asesor>"
```

Paso 5 - El asesor acepta (la sesion queda `programada`) o rechaza (el slot vuelve a estar libre):
```bash
curl -X PATCH http://localhost:8080/api/solicitudes/1/aceptar \
  -H "Authorization: Bearer <token-asesor>"

curl -X PATCH http://localhost:8080/api/solicitudes/1/rechazar \
  -H "Authorization: Bearer <token-asesor>"
```

Paso 6 - El alumno consulta el estado de sus solicitudes:
```bash
curl http://localhost:8080/api/solicitudes/mis \
  -H "Authorization: Bearer <token-alumno>"
```
