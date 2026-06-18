# Flujo de planificación

Este documento define el flujo esperado para planificar y medir el avance en la aplicación: **objetivo → meta → actividad → subactividad**.

## Jerarquía esperada

1. **Objetivo**
   - Representa el resultado estratégico de mayor nivel.
   - Agrupa una o más metas.
   - Sus estados válidos son `ACTIVE`, `COMPLETED` y `ARCHIVED`.

2. **Meta**
   - Pertenece siempre a un objetivo.
   - Traduce el objetivo en un resultado medible o verificable.
   - Puede ser de tipo `BOOLEAN`, `MONETARY`, `HOURS`, `QUALITATIVE` o `ACTIVITIES`.
   - Sus estados válidos son `ACTIVE`, `COMPLETED` y `ARCHIVED`.

3. **Actividad**
   - Pertenece siempre a una meta.
   - Describe el trabajo operativo necesario para avanzar la meta.
   - Puede usar distintos flujos de trabajo (`STANDARD`, `SCRUM`, `KANBAN`, `MARKETING` o `CRM`), cada uno con sus propios estados.
   - Puede tener subactividades, dependencias, actividades vinculadas, horas registradas, comentarios, prioridad y fechas.

4. **Subactividad**
   - Pertenece siempre a una actividad.
   - Funciona como checklist de trabajo específico.
   - Se considera completada cuando su campo `completed` es `true`.

## Mensajes de ayuda por nivel WBS

Estos mensajes deben acompañar la grilla de planificación para que cada usuario entienda qué representa cada código WBS:

| Nivel WBS | Ejemplo | Mensaje de ayuda |
| --- | --- | --- |
| Objetivo | `1` | WBS 1 identifica el objetivo estratégico que agrupa metas, actividades y subactividades relacionadas. |
| Meta | `1.1` | WBS 1.1 identifica una meta vinculada al objetivo; úsala para medir un resultado específico. |
| Actividad | `1.1.1` | WBS 1.1.1 identifica una actividad operativa que contribuye al avance de la meta. |
| Subactividad | `1.1.1.1` | WBS 1.1.1.1 identifica una subactividad o checklist puntual dentro de la actividad. |

## Reglas de avance

### Subactividad

- Cada subactividad aporta avance únicamente dentro de su actividad.
- Una subactividad completada es aquella marcada con `completed: true`.
- Una subactividad pendiente es aquella marcada con `completed: false` o sin marca explícita.

### Actividad

- Si una actividad tiene subactividades, su porcentaje de avance se calcula como:

  ```text
  subactividades completadas / total de subactividades * 100
  ```

- Si una actividad no tiene subactividades, su avance visual es:
  - `100%` cuando su estado está dentro de los estados considerados completados.
  - `0%` cuando su estado no está dentro de los estados considerados completados.
- Para métricas agregadas de metas, objetivos y dashboard, una actividad cuenta como completada por su estado de flujo, no por el porcentaje de subactividades.

### Meta

- La meta se evalúa a partir de las actividades asociadas.
- En el detalle de una meta, el avance agregado se calcula como:

  ```text
  actividades completadas / total de actividades * 100
  ```

- Si la meta no tiene actividades, el avance agregado es `0%`.
- La meta solo cuenta como completada en métricas globales cuando su propio estado es `COMPLETED`.

### Objetivo

- El objetivo agrupa metas y actividades relacionadas mediante esas metas.
- En el detalle de un objetivo se muestran sus metas, actividades y la cantidad de actividades completadas.
- El objetivo solo cuenta como completado en métricas globales cuando su propio estado es `COMPLETED`.

## Estados considerados completados

### Objetivos y metas

Para objetivos y metas, el estado completado es:

- `COMPLETED`

Los estados `ACTIVE` y `ARCHIVED` no cuentan como completados en las métricas globales.

### Actividades

Para actividades, los estados que cuentan como completados son:

- `COMPLETED`
- `ACCEPTED`
- `CLOSED`
- `WON`

Estos estados permiten cubrir los distintos flujos de trabajo disponibles:

| Flujo | Estados del flujo | Estados completados dentro del flujo |
| --- | --- | --- |
| `STANDARD` | `PENDING`, `IN_PROGRESS`, `COMPLETED` | `COMPLETED` |
| `SCRUM` | `OPEN`, `PENDING`, `IN_PROGRESS`, `REVIEW`, `ACCEPTED`, `REJECTED`, `BLOCKED`, `CLOSED` | `ACCEPTED`, `CLOSED` |
| `KANBAN` | `OPEN`, `REVIEW`, `IN_PROGRESS`, `CLOSED` | `CLOSED` |
| `MARKETING` | `OPEN`, `CONCEPT`, `REVIEW`, `IN_PROGRESS`, `RUNNING`, `CLOSED` | `CLOSED` |
| `CRM` | `ANALYSIS`, `PROPOSAL`, `QUOTED`, `NEGOTIATION`, `WON`, `LOST`, `CANCELLED` | `WON` |

## Criterio operativo recomendado

- Crear primero el **objetivo**.
- Crear una o más **metas** vinculadas al objetivo.
- Crear **actividades** vinculadas a cada meta.
- Dividir cada actividad en **subactividades** cuando sea necesario detallar el checklist de ejecución.
- Usar los estados completados de actividad para cerrar trabajo operativo y alimentar métricas agregadas.
- Actualizar explícitamente el estado de metas y objetivos a `COMPLETED` cuando el usuario confirme que el resultado de negocio quedó cumplido.
