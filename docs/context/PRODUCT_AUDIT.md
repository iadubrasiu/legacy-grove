# PRODUCT_AUDIT.md

## FASE ACTUAL: Limpieza y Auditoría del MVP

### Auditoría Global de la Aplicación (vs. Diseño) - [2026-03-24]

#### Hallazgos de UX/CTAs/Placeholders:
- **`[Corregido]`** Iconos placeholder de "Search" y "Bell" en la cabecera de la Home.
- **`[Corregido]`** Enlace clicable en "Árbol de Memorias" de la Home llevaba a una página incompleta.
- **`[Identificado]`** La página `/preguntas` es un placeholder no enlazado. Se mantiene para futuro desarrollo.

#### Gaps contra Diseño (Funcionalidades Incompletas):
- **Home (`/`):** La sección "Pregunta del Día" tiene contenido estático. El `user` se obtiene con un email hardcodeado.
- **Muro de Preguntas (`/preguntas`):** La página necesita ser rediseñada para coincidir con la vista de "muro" del diseño.
- **Perfil de Familiar (`/personas/[id]`):** Faltan métricas visuales (capítulos de vida, memorias, etc.) y la lista de "Memorias Recientes" del familiar.
- **Editor de Memorias (`/memorias/new`, `/memorias/[id]/edit`):** La grabación de audio, gestión de fotos y videos, y la integración con el "Árbol de Memorias" están incompletas.
- **Árbol Genealógico (`/arbol`):** La UI interactiva con conexiones, búsqueda y filtros no está implementada.
- **Detalle de Memoria (`/memorias/[id]`):** Falta la integración de multimedia incrustada y la sección de comentarios/reacciones.

### Auditoría Específica: "Pregunta del Día" - [2026-03-24]

**1. Lo que falta:**
*   **Dinamicidad de la pregunta:** La pregunta y su descripción son actualmente estáticas.
*   **Mecanismo de selección/rotación:** No hay lógica para variar la pregunta diariamente.

**2. Lo que está incompleto:**
*   **Contenido:** Pregunta y descripción cableadas, deberían ser dinámicas.
*   **Enlace de acción:** `href` del botón "Responder yo" usa la pregunta estática.
*   **Fuente de datos:** No hay una fuente definida para las preguntas.
