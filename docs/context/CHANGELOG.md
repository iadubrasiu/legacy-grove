# HEARTBEAT.md

## Estado
Login y Base de Datos segura (Prisma + NextAuth). Funcionalidad CRUD completa (Crear, Leer, Actualizar, Eliminar) para 'Personas' y 'Memorias'.

## Cambios realizados
- **API**: Actualizados endpoints `/api/personas/[id]` y `/api/memorias/[id]` para soportar métodos `DELETE` y `PUT`.
- **UI Personas**: Añadido botón de eliminación en la vista de detalles de persona.
- **UI Memorias**: Añadidos botones de edición y eliminación en la vista de detalles de memoria.
- **UI Memorias**: Implementada página de edición `/memorias/[id]/edit` con formulario pre-llenado.
- (Previos): Instalación de dependencias, configuración de Auth, Prisma, y rutas protegidas.

## Resultado
Sistema completo de gestión de recuerdos. El usuario puede ahora reestructurar miembros activos (eliminar personas) y corregir errores en memorias (editar/eliminar).

## Cómo probar
1. Levanta el proyecto con Docker Compose.
2. Navega a `/personas`, entra en una persona y prueba el botón **Eliminar**.
3. Navega a `/memorias`, entra en una memoria.
4. Prueba el botón **Editar**: cambia el texto o la fecha y guarda. Verifica que los cambios se reflejan.
5. Prueba el botón **Eliminar** en una memoria.

## Próximas Mejoras Solicitadas (Backlog)
1.  **UX Registro**: Mejorar diseño y etiquetas de campos (Nombre, Email, Password) para que sean claras y coherentes con el tema oscuro. (Parcialmente abordado en último commit, revisar).
2.  **Recuerdos por Voz**: Implementar grabación de audio directa para guardar recuerdos hablados.
3.  **Voz a Texto (Speech-to-Text)**: Transcribir automáticamente el audio grabado para rellenar el contenido del recuerdo.

## Próximo paso automático
Esperar validación del usuario sobre el diseño de registro actual antes de iniciar las mejoras de voz.
