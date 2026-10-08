#!/usr/bin/env bash
# seed-demo.sh — Siembra datos de demostracion en ASERP usando SOLO la API (curl).
#
# Requisitos:
#   - Servidor corriendo (por defecto http://localhost:8080, ajusta BASE_URL).
#   - Cuenta admin existente: admin@uruapan.tecnm.mx / tecUruapan2026
#     (si no existe, crearla con el SQL de "Cuenta de administracion" en back/docEndpoit.md).
#   - bash 4+ (arreglos asociativos), GNU date (Linux), curl.
#
# Uso:
#   chmod +x seed-demo.sh && ./seed-demo.sh
#
# Es "one shot": si detecta datos previos aborta. Para re-ejecutar, limpia antes:
#   DELETE FROM bitacoras; DELETE FROM asesorias; DELETE FROM horarios_asesores;
#   DELETE FROM asesor_materia; DELETE FROM asesores; DELETE FROM usuarios;
#   DELETE FROM alumnos; DELETE FROM materias; DELETE FROM carreras;

set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:8080}"
ADMIN_EMAIL="${ADMIN_EMAIL:-admin@uruapan.tecnm.mx}"
ADMIN_PASSWORD="${ADMIN_PASSWORD:-tecUruapan2026}"
ALUMNO_PASSWORD="${ALUMNO_PASSWORD:-tecmm2026}"

die() { echo "ERROR: $*" >&2; exit 1; }

command -v curl >/dev/null || die "curl no esta instalado"
curl -sf -o /dev/null "$BASE_URL/api/carreras" || die "el servidor no responde en $BASE_URL"

# ---------------- helpers http ----------------
RESP=""; HTTP_CODE=""

api() { # api metodo ruta [token] [body]
  local metodo=$1 ruta=$2 token="${3:-}" body="${4:-}"
  local args=(-sS -X "$metodo" -H "Content-Type: application/json" -w $'\n%{http_code}')
  if [ -n "$token" ]; then args+=(-H "Authorization: Bearer $token"); fi
  if [ -n "$body" ]; then args+=(-d "$body"); fi
  RESP=$(curl "${args[@]}" "$BASE_URL$ruta")
  HTTP_CODE=${RESP##*$'\n'}
  RESP=${RESP%$'\n'*}
}

espera() { # espera codigo descripcion
  [ "$HTTP_CODE" = "$1" ] || die "$2 -> HTTP $HTTP_CODE (esperaba $1): $RESP"
  echo "  ok: $2"
}

id_de()   { echo "$RESP" | sed -n "s/.*\"$1\":\([0-9]*\).*/\1/p" | head -1; }
campo()   { echo "$RESP" | sed -n "s/.*\"$1\":\"\([^\"]*\)\".*/\1/p" | head -1; }

login() { # login correo password -> eco del token (el aviso va a stderr)
  api POST /api/auth/login "" "{\"correo\":\"$1\",\"password\":\"$2\"}"
  [ "$HTTP_CODE" = "200" ] || die "login $1 -> HTTP $HTTP_CODE: $RESP"
  echo "  ok: login $1" >&2
  campo token
}

fecha_para_dia() { # fecha_para_dia diaSemanaISO(1=lun..7=dom) [semanasAdelante] -> yyyy-mm-dd (>= hoy)
  local dia=$1 semana="${2:-0}" i f
  for i in 0 1 2 3 4 5 6 7; do
    f=$(date -d "+$((i + semana * 7)) day" +%F)
    if [ "$(date -d "$f" +%u)" = "$dia" ]; then echo "$f"; return; fi
  done
  die "no se pudo calcular fecha para dia $dia"
}

# ---------------- datos ----------------
carreras=(
  "ISC|Ingenieria en Sistemas Computacionales"
  "IIA|Ingenieria en Inteligencia Artificial"
  "IM|Ingenieria Mecatronica"
  "IGE|Ingenieria en Gestion Empresarial"
)

materias=( # clave|nombre|carrera|semestre|creditos|descripcion
  "ISC101|Programacion Orientada a Objetos|ISC|3|5|Diseno e implementacion de software con POO"
  "ISC102|Bases de Datos|ISC|4|5|Modelado, SQL y administracion de bases de datos"
  "ISC103|Estructuras de Datos|ISC|3|4|Listas, arboles, grafos y analisis de algoritmos"
  "ISC104|Redes de Computadoras|ISC|5|4|Modelo OSI, TCP/IP y configuracion de redes"
  "ISC105|Desarrollo Web|ISC|6|4|Aplicaciones web modernas front y back end"
  "IIA101|Fundamentos de Inteligencia Artificial|IIA|3|5|Busqueda, logica y agentes inteligentes"
  "IIA102|Aprendizaje Automatico|IIA|5|5|Modelos supervisados y no supervisados"
  "IIA103|Procesamiento de Lenguaje Natural|IIA|6|4|Analisis y generacion de texto"
  "IIA104|Vision por Computadora|IIA|6|4|Procesamiento digital de imagenes"
  "IIA105|Analisis de Datos|IIA|4|5|Exploracion y visualizacion de datos"
  "IM101|Circuitos Electricos|IM|3|4|Analisis de circuitos de corriente continua y alterna"
  "IM102|Sistemas Embebidos|IM|5|4|Microcontroladores y programacion de bajo nivel"
  "IM103|Control Automatico|IM|5|5|Sistemas de control en tiempo real"
  "IM104|Robotica|IM|6|4|Cinematica y programacion de robots"
  "IM105|Mecanica de Fluidos|IM|4|4|Fundamentos hidraulicos y neumaticos"
  "IGE101|Contabilidad General|IGE|1|5|Registros contables y estados financieros"
  "IGE102|Mercadotecnia|IGE|2|5|Investigacion de mercados y mezcla comercial"
  "IGE103|Administracion de Proyectos|IGE|4|5|Planeacion, ejecucion y control de proyectos"
  "IGE104|Finanzas Corporativas|IGE|5|5|Evaluacion financiera y presupuestos"
  "IGE105|Gestion de la Calidad|IGE|6|4|Normas, auditorias y mejora continua"
)

alumnos=( # matricula|nombre|apellidoPaterno|apellidoMaterno|correo|telefono|carrera|semestre
  "20240001|Juan Carlos|Hernandez|Lopez|juan.hernandez@tecmm.mx|4521010101|ISC|3"
  "20240002|Maria Guadalupe|Martinez|Sanchez|maria.martinez@tecmm.mx|4521010102|ISC|5"
  "20240003|Carlos Alberto|Garcia|Ramirez|carlos.garcia@tecmm.mx|4521010103|ISC|3"
  "20240004|Ana Sofia|Rodriguez|Flores|ana.rodriguez@tecmm.mx|4521010104|ISC|4"
  "20240005|Jose Luis|Martinez|Diaz|jose.martinez@tecmm.mx|4521010105|IIA|6"
  "20240006|Laura Elena|Gonzalez|Herrera|laura.gonzalez@tecmm.mx|4521010106|IIA|4"
  "20240007|Miguel Angel|Perez|Cruz|miguel.perez@tecmm.mx|4521010107|IIA|5"
  "20240008|Carmen|Lopez|Morales|carmen.lopez@tecmm.mx|4521010108|IIA|6"
  "20240009|Roberto|Sanchez|Vargas|roberto.sanchez@tecmm.mx|4521010109|IM|3"
  "20240010|Patricia|Ramirez|Castillo|patricia.ramirez@tecmm.mx|4521010110|IM|4"
  "20240011|Fernando|Torres|Ortiz|fernando.torres@tecmm.mx|4521010111|IM|5"
  "20240012|Alejandra|Flores|Jimenez|alejandra.flores@tecmm.mx|4521010112|IGE|2"
  "20240013|Ricardo|Mendoza|Ruiz|ricardo.mendoza@tecmm.mx|4521010113|IGE|3"
  "20240014|Sofia|Aguilar|Reyes|sofia.aguilar@tecmm.mx|4521010114|IGE|5"
  "20240015|Diego|Castillo|Gutierrez|diego.castillo@tecmm.mx|4521010115|IGE|2"
  "20240016|Valeria|Ortiz|Chavez|valeria.ortiz@tecmm.mx|4521010116|IGE|4"
  "20240017|Andres|Vargas|Rojas|andres.vargas@tecmm.mx|4521010117|ISC|6"
  "20240018|Gabriela|Cruz|Medina|gabriela.cruz@tecmm.mx|4521010118|ISC|3"
  "20240019|Alejandro|Rios|Soto|alejandro.rios@tecmm.mx|4521010119|IIA|4"
  "20240020|Mariana|Navarro|Campos|mariana.navarro@tecmm.mx|4521010120|IM|5"
  "20240021|Pablo|Guerrero|Vega|pablo.guerrero@tecmm.mx|4521010121|IIA|3"
  "20240022|Daniela|Ramos|Fuentes|daniela.ramos@tecmm.mx|4521010122|ISC|2"
  "20240023|Eduardo|Silva|Cortes|eduardo.silva@tecmm.mx|4521010123|IGE|6"
  "20240024|Paola|Moreno|Herrera|paola.moreno@tecmm.mx|4521010124|ISC|4"
  "20240025|Jorge|Delgado|Pena|jorge.delgado@tecmm.mx|4521010125|IM|3"
  "20240026|Karla|Romero|Serrano|karla.romero@tecmm.mx|4521010126|IIA|5"
  "20240027|Francisco|Gutierrez|Dominguez|francisco.gutierrez@tecmm.mx|4521010127|ISC|6"
  "20240028|Lucia|Sandoval|Ibarra|lucia.sandoval@tecmm.mx|4521010128|IGE|3"
  "20240029|Manuel|Estrada|Carrillo|manuel.estrada@tecmm.mx|4521010129|IM|4"
  "20240030|Regina|Valdez|Miranda|regina.valdez@tecmm.mx|4521010130|ISC|2"
)

asesores=( # matricula|promedio|seValida(1/0)
  "20240002|9.40|1"
  "20240005|9.10|1"
  "20240008|8.90|1"
  "20240011|9.60|1"
  "20240014|8.70|1"
  "20240017|9.20|1"
  "20240020|9.80|0"
  "20240023|8.80|0"
)

asignaciones=( # matriculaAsesor|materiaClave|nivelDominio
  "20240002|ISC101|avanzado"
  "20240002|ISC102|intermedio"
  "20240002|ISC103|basico"
  "20240005|IIA101|avanzado"
  "20240005|IIA102|intermedio"
  "20240008|IIA105|avanzado"
  "20240008|IM101|intermedio"
  "20240011|IM102|avanzado"
  "20240011|IGE101|intermedio"
  "20240014|IGE102|intermedio"
  "20240014|IGE103|basico"
  "20240017|ISC103|avanzado"
  "20240017|IIA103|intermedio"
  "20240020|IM104|basico"
  "20240023|IGE105|basico"
)

horarios=( # matriculaAsesor|diaSemana|horaInicio|horaFin|modalidad|lugar
  "20240002|1|16:00|18:00|presencial|Aula 204"
  "20240002|3|10:00|12:00|virtual|Google Meet"
  "20240002|5|14:00|16:00|presencial|Laboratorio de Redes"
  "20240005|2|08:00|10:00|presencial|Aula 105"
  "20240005|4|12:00|14:00|virtual|Google Meet"
  "20240008|1|09:00|11:00|hibrida|Aula 301"
  "20240008|3|15:00|17:00|presencial|Aula 301"
  "20240008|6|10:00|12:00|virtual|Zoom"
  "20240011|2|14:00|16:00|presencial|Biblioteca"
  "20240011|5|09:00|11:00|virtual|Google Meet"
  "20240014|4|08:00|10:00|presencial|Laboratorio de Sistemas"
  "20240014|6|12:00|14:00|presencial|Aula 202"
  "20240017|1|12:00|14:00|virtual|Zoom"
  "20240017|3|08:00|10:00|presencial|Aula 108"
  "20240017|5|16:00|18:00|hibrida|Aula 108"
)

solicitudes=( # matriculaAlumno|matriculaAsesor|dia|horaInicio|materiaClave|accion(aceptar/rechazar/pendiente)|semanas
  "20240003|20240002|1|16:00|ISC101|aceptar|0"
  "20240004|20240002|3|10:00|ISC102|aceptar|0"
  "20240006|20240005|2|08:00|IIA101|aceptar|0"
  "20240007|20240005|4|12:00|IIA102|rechazar|0"
  "20240021|20240005|4|12:00|IIA102|aceptar|0"
  "20240009|20240008|1|09:00|IIA105|aceptar|0"
  "20240010|20240008|3|15:00|IM101|rechazar|0"
  "20240012|20240011|2|14:00|IM102|aceptar|0"
  "20240013|20240011|5|09:00|IGE101|pendiente|0"
  "20240015|20240014|4|08:00|IGE102|rechazar|0"
  "20240016|20240014|6|12:00|IGE103|pendiente|0"
  "20240018|20240017|1|12:00|ISC103|pendiente|0"
  "20240019|20240017|3|08:00|IIA103|pendiente|1"
)

# ---------------- fase 0: guardas y login admin ----------------
echo "== Fase 0: comprobaciones =="
api GET /api/carreras
if echo "$RESP" | grep -q '"clave":"ISC"'; then
  die "ya existen datos de demo (carrera ISC). Limpia la BD antes de re-ejecutar (ver cabecera)."
fi

ADMIN_TOKEN=$(login "$ADMIN_EMAIL" "$ADMIN_PASSWORD") \
  || die "no se pudo entrar como admin. Crea la cuenta (SQL en back/docEndpoit.md) e intentalo de nuevo."

declare -A ID_CARRERA ID_MATERIA ID_ALUMNO ID_ASESOR ID_HORARIO CORREO TOKEN_ALUMNO TOKEN_ASESOR

# ---------------- fase 1: carreras ----------------
echo "== Fase 1: carreras =="
for c in "${carreras[@]}"; do
  IFS='|' read -r clave nombre <<<"$c"
  api POST /api/carreras "" "{\"clave\":\"$clave\",\"nombre\":\"$nombre\"}"
  espera 201 "carrera $clave"
  ID_CARRERA[$clave]=$(id_de idCarrera)
done

# ---------------- fase 2: materias ----------------
echo "== Fase 2: materias =="
for m in "${materias[@]}"; do
  IFS='|' read -r clave nombre carrera sem creditos desc <<<"$m"
  api POST /api/materias "" \
    "{\"clave\":\"$clave\",\"nombre\":\"$nombre\",\"idCarrera\":${ID_CARRERA[$carrera]},\"semestreRecomendado\":$sem,\"creditos\":$creditos,\"descripcion\":\"$desc\"}"
  espera 201 "materia $clave"
  ID_MATERIA[$clave]=$(id_de idMateria)
done

# ---------------- fase 3: alumnos (crea tambien su cuenta) ----------------
echo "== Fase 3: alumnos =="
for a in "${alumnos[@]}"; do
  IFS='|' read -r mat nombre ap_p ap_m correo tel carrera sem <<<"$a"
  api POST /api/alumnos "" \
    "{\"matricula\":\"$mat\",\"nombre\":\"$nombre\",\"apellidoPaterno\":\"$ap_p\",\"apellidoMaterno\":\"$ap_m\",\"correo\":\"$correo\",\"telefono\":\"$tel\",\"idCarrera\":${ID_CARRERA[$carrera]},\"semestre\":$sem,\"password\":\"$ALUMNO_PASSWORD\"}"
  espera 201 "alumno $mat"
  ID_ALUMNO[$mat]=$(id_de idAlumno)
  CORREO[$mat]=$correo
  TOKEN_ALUMNO[$mat]=$(login "$correo" "$ALUMNO_PASSWORD")
done

# ---------------- fase 4: postulacion de asesores ----------------
echo "== Fase 4: postulaciones de asesor =="
for s in "${asesores[@]}"; do
  IFS='|' read -r mat prom _validar <<<"$s"
  api POST /api/asesores "${TOKEN_ALUMNO[$mat]}" "{\"promedio\":$prom}"
  espera 201 "postulacion de $mat"
  ID_ASESOR[$mat]=$(id_de idAsesor)
done

# ---------------- fase 5: validacion por admin ----------------
echo "== Fase 5: validacion (solo los marcados) =="
for s in "${asesores[@]}"; do
  IFS='|' read -r mat _prom validar <<<"$s"
  if [ "$validar" = "1" ]; then
    api PATCH "/api/admin/asesores/${ID_ASESOR[$mat]}/validacion" "$ADMIN_TOKEN" '{"validado":true}'
    espera 200 "validar asesor $mat"
  else
    echo "  skip: $mat queda sin validar (validado=false)"
  fi
done

# ---------------- fase 6: materias asignadas (admin) ----------------
echo "== Fase 6: asignacion de materias =="
for s in "${asignaciones[@]}"; do
  IFS='|' read -r mat clave nivel <<<"$s"
  api POST "/api/admin/asesores/${ID_ASESOR[$mat]}/materias" "$ADMIN_TOKEN" \
    "{\"idMateria\":${ID_MATERIA[$clave]},\"nivelDominio\":\"$nivel\"}"
  espera 201 "asignar $clave a $mat ($nivel)"
done

# ---------------- fase 7: horarios (token ASESOR; re-login tras validar) ----------------
echo "== Fase 7: horarios =="
for s in "${asesores[@]}"; do
  IFS='|' read -r mat _prom validar <<<"$s"
  if [ "$validar" = "1" ]; then
    # gotcha: hay que reloguearse para que el JWT traiga rol ASESOR
    TOKEN_ASESOR[$mat]=$(login "${CORREO[$mat]}" "$ALUMNO_PASSWORD")
  fi
done
for h in "${horarios[@]}"; do
  IFS='|' read -r mat dia ini fin mod lugar <<<"$h"
  api POST /api/horarios "${TOKEN_ASESOR[$mat]}" \
    "{\"diaSemana\":$dia,\"horaInicio\":\"$ini\",\"horaFin\":\"$fin\",\"modalidad\":\"$mod\",\"lugar\":\"$lugar\"}"
  espera 201 "horario $mat d$dia $ini-$fin"
  ID_HORARIO["$mat|$dia|$ini"]=$(id_de idHorario)
done

# ---------------- fase 8: solicitudes + aceptar/rechazar ----------------
echo "== Fase 8: solicitudes =="
for sol in "${solicitudes[@]}"; do
  IFS='|' read -r mat_al mat_as dia ini clave accion semanas <<<"$sol"
  key="$mat_as|$dia|$ini"
  idh="${ID_HORARIO[$key]:?falta horario $key}"
  fecha=$(fecha_para_dia "$dia" "$semanas")
  api POST /api/solicitudes "${TOKEN_ALUMNO[$mat_al]}" \
    "{\"idHorario\":$idh,\"fecha\":\"$fecha\",\"idMateria\":${ID_MATERIA[$clave]}}"
  espera 201 "solicitud $mat_al -> $mat_as d$dia $ini ($fecha)"
  id_sol=$(id_de idAsesoria)
  case "$accion" in
    aceptar)
      api PATCH "/api/solicitudes/$id_sol/aceptar" "${TOKEN_ASESOR[$mat_as]}"
      espera 200 "aceptar solicitud $id_sol" ;;
    rechazar)
      api PATCH "/api/solicitudes/$id_sol/rechazar" "${TOKEN_ASESOR[$mat_as]}"
      espera 200 "rechazar solicitud $id_sol" ;;
    pendiente) echo "  deja solicitud $id_sol en estado solicitada" ;;
  esac
done

# ---------------- resumen ----------------
echo
echo "== Resumen =="
api GET /api/carreras;  echo "carreras:  $(grep -o '"idCarrera"' <<<"$RESP" | wc -l)"
api GET /api/materias;  echo "materias:  $(grep -o '"idMateria"' <<<"$RESP" | wc -l)"
api GET /api/alumnos;   echo "alumnos:   $(grep -o '"idAlumno"' <<<"$RESP" | wc -l)"
api GET /api/asesores;  echo "asesores:  $(grep -o '"idAsesor"' <<<"$RESP" | wc -l)  (validados: $(grep -o '"validado":true' <<<"$RESP" | wc -l), pendientes: $(grep -o '"validado":false' <<<"$RESP" | wc -l))"
api GET "/api/asesores/${ID_ASESOR[20240002]}/horarios"
echo "horarios del asesor 20240002: $(grep -o '"idHorario"' <<<"$RESP" | wc -l)"
tok=$(login "carlos.garcia@tecmm.mx" "$ALUMNO_PASSWORD")
api GET /api/solicitudes/mis "$tok"
echo "solicitudes de carlos.garcia: $(grep -o '"idAsesoria"' <<<"$RESP" | wc -l)"
api GET "/api/solicitudes/recibidas?estado=solicitada" "${TOKEN_ASESOR[20240011]}"
echo "pendientes del asesor 20240011: $(grep -o '"idAsesoria"' <<<"$RESP" | wc -l)"
echo
echo "Listo. Password de alumnos: $ALUMNO_PASSWORD | admin: $ADMIN_EMAIL"
