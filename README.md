# Gestión de Solicitudes de Crédito

Prueba técnica — Desarrollador Full Stack (BlueCore). Aplicación para crear solicitudes de crédito, aprobarlas/rechazarlas y visualizar su estado, con autenticación de usuarios.

## Stack

- **Backend:** Java 21, Spring Boot 4.1, Spring Data JPA, Bean Validation, Spring Security + JWT (jjwt), PostgreSQL, springdoc-openapi (Swagger).
- **Frontend:** Angular 19 (componentes standalone, signals, Reactive Forms), Tailwind CSS v4, Font Awesome.
- **Base de datos:** PostgreSQL.

## Cómo correr el proyecto

### Opción A — Todo con Docker (recomendado)

El `docker-compose.yml` es distinto según la rama:

- **`development`**: self-contained — levanta su propio Postgres en un contenedor, no necesita nada externo.
- **`main`**: pensado para producción — el backend se conecta a una base PostgreSQL externa (no levanta Postgres propio), usando las variables de entorno `DB_URL`, `DB_USER`, `DB_PASSWORD` y `JWT_SECRET`. Hace falta un archivo `.env` en la raíz del repo (no versionado) con esos 4 valores — Docker Compose lo lee solo, sin flags adicionales.

Desde la raíz del repositorio, parado en la rama que corresponda:

```bash
docker compose up --build
```

Cuando termine de levantar:

- **Frontend:** http://localhost
- **Backend / API:** http://localhost:8090/gestion-credito/api
- **Swagger UI:** http://localhost:8090/gestion-credito/api/swagger-ui.html

El frontend le pega a la API a través de un reverse proxy de nginx (`frontend/gestionCredito/nginx.conf`), así que no hace falta configurar ninguna URL ni IP a mano.

Para apagar todo: `docker compose down` (o `docker compose down -v` si además querés borrar los datos de Postgres, solo aplica en `development`).

### Opción B — Backend y frontend por separado (desarrollo)

**Backend** (requiere Java 21 y Docker instalado y corriendo — Spring Boot usa Docker Compose automáticamente para levantar Postgres):

```bash
cd backend/gestion.credito
./gradlew bootRun
```

Al arrancar, levanta un contenedor de Postgres automáticamente (definido en `backend/gestion.credito/compose.yaml`) y queda disponible en:

- API: http://localhost:8090/gestion-credito/api
- Swagger UI: http://localhost:8090/gestion-credito/api/swagger-ui.html

**Frontend** (requiere Node.js, en otra terminal, con el backend ya corriendo):

```bash
cd frontend/gestionCredito
npm install
npm start
```

Disponible en http://localhost:4200.

### Tests

```bash
cd backend/gestion.credito
./gradlew test
```

## Autenticación

La API usa JWT. Hay que registrarse e iniciar sesión antes de poder usar los endpoints de solicitudes:

1. `POST /auth/register` — crea el usuario (cédula, nombre, apellido, correo, contraseña).
2. `POST /auth/login` — devuelve un token: `{ "token": "..." }`.
3. Mandar ese token en cada request siguiente: header `Authorization: Bearer <token>`.

En Swagger UI hay un botón **"Authorize"** arriba a la derecha — pegás el token ahí (sin escribir `Bearer`) y las pruebas desde la UI ya lo mandan solas.

El frontend maneja esto automáticamente: guarda el token al loguearse, lo adjunta a cada request, y redirige a `/login` si no hay sesión activa.

## Casos de uso implementados

| Método | Endpoint | Descripción | Requiere token |
| --- | --- | --- | --- |
| `POST` | `/auth/register` | Crea un usuario nuevo | No |
| `POST` | `/auth/login` | Devuelve un JWT | No |
| `POST` | `/solicitudes` | Crea una solicitud de crédito (nace en estado `PENDIENTE`) | Sí |
| `GET` | `/solicitudes?estado=` | Lista las solicitudes; el filtro por estado es opcional | Sí |
| `PATCH` | `/solicitudes/{id}/estado` | Aprueba o rechaza una solicitud, con comentario obligatorio | Sí |

## Validaciones de negocio

**Solicitudes:**
- Monto entre **$500** y **$50,000**.
- Plazo entre **6** y **60** meses.
- Cédula obligatoria.
- Solo se puede aprobar/rechazar una solicitud que esté en estado `PENDIENTE` (no se puede resolver dos veces).
- El comentario es obligatorio al cambiar el estado.

**Usuarios:**
- Cédula y correo son únicos — no se puede registrar dos veces con el mismo dato.
- Contraseña de al menos 6 caracteres, guardada con hash (`BCrypt`), nunca en texto plano.

## Manejo de errores

Todas las respuestas de error comparten el mismo contrato JSON:

```json
{
  "timestamp": "2026-10-02T10:00:00",
  "status": 400,
  "mensaje": "Hay datos inválidos en la solicitud.",
  "errores": ["monto: debe ser menor o igual que 50000"]
}
```

| Código | Cuándo ocurre |
| --- | --- |
| `400` | Datos inválidos (monto/plazo fuera de rango, cédula vacía, comentario vacío, contraseña corta) |
| `401` | Correo/contraseña incorrectos, o token faltante/inválido/expirado en un endpoint protegido |
| `404` | No existe una solicitud con el id indicado |
| `409` | Se intenta aprobar/rechazar una solicitud ya resuelta, o registrar una cédula/correo ya existente |

## Estructura del proyecto

```text
/backend/gestion.credito   API en Spring Boot (controller -> service -> repository, DTOs separados de las entidades)
                           com.gestion.credito.auth.*  -> registro, login, JWT, seguridad
/frontend/gestionCredito   Angular (componentes standalone + signals)
                           src/app/auth    -> login, registro, sesión, guard, interceptor
                           src/app/credit  -> solicitudes de crédito
                           src/app/shared  -> utilidades comunes a ambos
docker-compose.yml         Levanta todo el stack (Postgres + backend + frontend) para la entrega
```

## Decisiones de diseño (resumen)

- **Arquitectura en 3 capas** (controller / service / repository), sin sobre-ingeniería dado el alcance acotado de la prueba.
- DTOs de request/response separados de las entidades JPA, para no exponer el modelo de persistencia en la API.
- `PATCH` (no `PUT`) para cambiar el estado, porque es una actualización parcial de un recurso existente.
- El estado de la solicitud se persiste como `STRING` (no `ORDINAL`) para no depender del orden del enum.
- Tests unitarios de servicio con Mockito (no de integración), porque ahí vive la lógica de negocio que la prueba evalúa.
- **JWT stateless**: sin sesiones ni refresh token — se consideró innecesario para el alcance pedido ("JWT básica: login + token"); si el token expira, el usuario vuelve a loguearse.
- El id de `Usuario` es autogenerado; la **cédula** es el campo de negocio único (no se usa como clave primaria para no acoplar el esquema a un dato que en teoría podría cambiar de formato).
- En el frontend, el estado de las solicitudes vive en un **store** (`SolicitudesStore`, signals) en vez de en cada página — sobrevive la navegación entre rutas y evita refetchear innecesariamente.

## Bonus implementados

- ✅ Angular en el frontend.
- ✅ Dockerización completa (`docker compose up` funcional).
- ✅ Autenticación JWT (registro, login, endpoints de solicitudes protegidos).

## Pendiente / conocido

- **Vista mobile**: el sidebar (`credit-side-menu`) es de ancho fijo sin breakpoints — en pantallas chicas ocupa la mayoría del ancho y no hay un menú alternativo (tipo tabs inferiores). Es lo próximo a resolver.
- El nombre mostrado en el sidebar está hardcodeado — el login solo devuelve el token, no los datos del usuario (haría falta un endpoint `/auth/me` o decodificar el JWT en el cliente).
- Sin tests automatizados en el frontend (el backend sí cumple el mínimo pedido por el enunciado).
