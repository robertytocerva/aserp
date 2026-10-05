# Documentacion de Endpoints - ASERP

API REST para el sistema de asesores pares del Instituto Tecnologico Superior Campus Uruapan.

Base URL: `http://localhost:8080`

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
  "semestre": 3
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
  "activo": true
}
```

### Registrar asesor

Requiere que el alumno ya exista en la base de datos. Un alumno solo puede tener un perfil de asesor.

```
POST /api/asesores
Content-Type: application/json
```

**Body:**
```json
{
  "idAlumno": 1,
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
  "activo": true
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

**Response 404 (alumno no existe):**
```json
{
  "timestamp": "2026-09-30T20:00:00",
  "status": 404,
  "error": "Not Found",
  "message": "Alumno no encontrado con id: 99"
}
```

**Response 400 (validacion):**
```json
{
  "timestamp": "2026-09-30T20:00:00",
  "status": 400,
  "error": "Validation Error",
  "errors": {
    "idAlumno": "El idAlumno es obligatorio",
    "promedio": "El promedio maximo es 10"
  }
}
```

### Desactivar asesor (soft delete)

```
DELETE /api/asesores/1
```

**Response 204:** Sin body

---

## Flujo completo de registro de asesor

Paso 1 - Crear carrera:
```bash
curl -X POST http://localhost:8080/api/carreras \
  -H "Content-Type: application/json" \
  -d '{"clave":"ISC","nombre":"Ingenieria en Sistemas Computacionales"}'
```

Paso 2 - Registrar alumno:
```bash
curl -X POST http://localhost:8080/api/alumnos \
  -H "Content-Type: application/json" \
  -d '{"matricula":"20240001","nombre":"Juan","apellidoPaterno":"Perez","correo":"juan@uruapan.tecnm.mx","idCarrera":1,"semestre":5}'
```

Paso 3 - Crear perfil de asesor:
```bash
curl -X POST http://localhost:8080/api/asesores \
  -H "Content-Type: application/json" \
  -d '{"idAlumno":1,"promedio":9.50}'
```
