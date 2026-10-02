# Gestión de Solicitudes de Crédito

Prueba técnica — Desarrollador Full Stack (BlueCore). Aplicación para crear solicitudes de crédito, aprobarlas/rechazarlas y visualizar su estado.

## Stack

- **Backend:** Java 21, Spring Boot 4.1, Spring Data JPA, Bean Validation, PostgreSQL, springdoc-openapi (Swagger).
- **Frontend:** Angular 19 (componentes standalone, signals, Reactive Forms), Tailwind CSS v4, Font Awesome.
- **Base de datos:** PostgreSQL.

## Cómo correr el proyecto

### Opción A — Todo con Docker (recomendado)

Requiere Docker y Docker Compose. Desde la raíz del repositorio:

```bash
docker compose up --build
```

Esto levanta 3 contenedores (Postgres, backend, frontend) conectados entre sí. Cuando termine de levantar:

- **Frontend:** http://localhost:8081
- **Backend / API:** http://localhost:8090/gestion-credito/api
- **Swagger UI:** http://localhost:8090/gestion-credito/api/swagger-ui.html

El frontend le pega a la API a través de un reverse proxy de nginx (`frontend/gestionCredito/nginx.conf`), así que no hace falta configurar ninguna URL ni IP a mano.

Para apagar todo: `docker compose down` (o `docker compose down -v` si además querés borrar los datos de Postgres).

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

## Casos de uso implementados

| Método | Endpoint | Descripción |
| --- | --- | --- |
| `POST` | `/solicitudes` | Crea una solicitud de crédito (nace en estado `PENDIENTE`) |
| `GET` | `/solicitudes?estado=` | Lista las solicitudes; el filtro por estado es opcional |
| `PATCH` | `/solicitudes/{id}/estado` | Aprueba o rechaza una solicitud, con comentario obligatorio |

## Validaciones de negocio

- Monto entre **$500** y **$50,000**.
- Plazo entre **6** y **60** meses.
- Cédula obligatoria.
- Solo se puede aprobar/rechazar una solicitud que esté en estado `PENDIENTE` (no se puede resolver dos veces).
- El comentario es obligatorio al cambiar el estado.

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
| `400` | Datos inválidos (monto/plazo fuera de rango, cédula vacía, comentario vacío) |
| `404` | No existe una solicitud con el id indicado |
| `409` | Se intenta aprobar/rechazar una solicitud que ya fue resuelta |

## Estructura del proyecto

```text
/backend/gestion.credito   API en Spring Boot (controller -> service -> repository, DTOs separados de las entidades)
/frontend/gestionCredito   Angular (componentes standalone + signals)
docker-compose.yml         Levanta todo el stack (Postgres + backend + frontend) para la entrega
```

## Decisiones de diseño (resumen)

- **Arquitectura en 3 capas** (controller / service / repository), sin sobre-ingeniería dado el alcance acotado de la prueba.
- DTOs de request/response separados de las entidades JPA, para no exponer el modelo de persistencia en la API.
- `PATCH` (no `PUT`) para cambiar el estado, porque es una actualización parcial de un recurso existente.
- El estado de la solicitud se persiste como `STRING` (no `ORDINAL`) para no depender del orden del enum.
- Tests unitarios de servicio con Mockito (no de integración), porque ahí vive la lógica de negocio que la prueba evalúa.

## Bonus implementados

- ✅ Angular en el frontend.
- ✅ Dockerización completa (`docker compose up` funcional).
- ⬜ Autenticación JWT — no implementada por tiempo.
