# PROJECT_STATE.md

## Repo activo
/home/workspace/app-recuerdos

## Repo remoto
https://github.com/iadubrasiu/legacy-grove

## Runtime
OpenClaw ejecutándose en el VPS

## Estado actual
- OpenClaw está instalado y funcionando
- El bot de Telegram responde
- El modelo por defecto ya fue corregido a Google Gemini
- El contexto del proyecto fue movido a `docs/context`
- Git ya está configurado para hacer commit y push desde este VPS

## Regla operativa
Antes de declarar una tarea como terminada, el estado relevante debe quedar reflejado en archivos y no solo en la conversación.

## Regla de persistencia

Antes de decir que algo está terminado:

1. El cambio debe estar en archivos
2. El cambio debe estar en git
3. El cambio debe estar en PROJECT_STATE.md si afecta al sistema
4. No se permite marcar tareas como done sin persistencia

## Regla de despliegue

Un cambio no se considera visible en producción hasta que:
1. el push esté hecho
2. el deploy de Vercel esté completado correctamente
3. o exista validación local real que lo demuestre

Push exitoso no equivale a deploy exitoso.
Deploy exitoso no equivale automáticamente a validación visual.

## Estado de despliegue

El estado del sistema debe diferenciar:

- local
- repo
- deploy
- producción

Push != Deploy
Deploy != Visible
Visible != Validado
