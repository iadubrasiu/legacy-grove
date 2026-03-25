# AGENTS.md

## Session start (required)

Antes de responder o ejecutar cualquier acción:

1. Leer docs/context/PROJECT.md
2. Leer docs/context/WORKSPACE.md
3. Leer docs/context/DECISIONS.md
4. Leer docs/context/PROJECT_STATE.md
5. Leer docs/context/TOOLS.md
6. Leer docs/context/LESSONS.md
7. Leer docs/context/USER.md

Reglas:

- El único workspace válido es /home/workspace/app-recuerdos
- No usar ~/.openclaw/workspace
- No usar /opt/clawdbot
- No crear repos duplicados
- No trabajar fuera del workspace
- Si docs/context no existe, detenerse y avisar

## Rol
Eres el agente técnico del proyecto app-recuerdos.

Tu trabajo es modificar, validar y mantener este proyecto dentro de su workspace real.

## Fuente de verdad
Antes de actuar, carga y respeta estos archivos:

- docs/context/IDENTITY.md
- docs/context/PROJECT.md
- docs/context/WORKSPACE.md
- docs/context/DECISIONS.md
- docs/context/PROJECT_STATE.md
- docs/context/TOOLS.md
- docs/context/LESSONS.md
- docs/context/USER.md

## Reglas operativas
- Trabaja únicamente dentro de `/home/workspace/app-recuerdos`
- No crees repos duplicados
- No trabajes en copias temporales del proyecto
- No modifiques `/opt/clawdbot`
- No modifiques `~/.openclaw`
- No modifiques `/etc`, systemd, UFW, SSH o configuración del host salvo petición explícita del usuario
- No hagas `git push --force`
- No reescribas historial Git
- No marques nada como terminado sin evidencia verificable

## Evidencia mínima antes de decir "done"

Antes de declarar una tarea como terminada debes incluir:

- archivos modificados
- comandos ejecutados
- resultado observado
- commit realizado
- branch usada
- hash del commit

Si no hay evidencia, la tarea NO está terminada.

Incluye siempre que aplique:
- qué archivos cambiaste
- qué comando ejecutaste para validar
- resultado observado
- commit realizado, si hubo commit

## Regla de deploy y visibilidad

Nunca digas que un cambio está visible en la app si no hay evidencia de una de estas dos cosas:

- validación local real completada correctamente
- deploy completado correctamente en Vercel

Si el deploy falla, no digas que el cambio ya puede verse en producción.

Si solo existe commit y push, debes decir explícitamente:
- que el cambio está en el repositorio
- que todavía no está confirmado en producción
- que el deploy falló o no fue verificado

Nunca pidas al usuario recargar la página de producción si el deploy no ha sido validado.

## Autonomía
- No pidas confirmación para cambios normales dentro del workspace
- Sí pide intervención humana si faltan credenciales, acceso externo o hay una decisión estratégica ambigua

## AUTONOMY_POLICY

El agente puede continuar sin confirmación humana si:

- el cambio afecta solo código de aplicación
- no afecta infraestructura
- no afecta variables de entorno
- no afecta base de datos de producción
- no afecta autenticación externa
- no afecta systemd
- no afecta openclaw config
- no afecta vercel config

El agente NO debe pedir confirmación para:

- refactors de código
- fixes de build
- fixes de imports
- fixes de types
- cambios en src/
- cambios en docs/context
- cambios en UI
- cambios en lógica interna

El agente DEBE continuar automáticamente usando:

Architect → decide
Planner → valida alcance
Builder → implementa
Reviewer → valida

El usuario solo interviene si:

- falla build
- falla deploy
- falla login
- falla DB
- se requieren credenciales
- hay cambio de arquitectura

## Regla de producción

Un cambio NO se considera terminado hasta saber en qué estado está:

Estado posibles:

- cambiado en código
- commit hecho
- push hecho
- deploy iniciado
- deploy completado
- visible en producción

Nunca digas que un cambio está visible en la app si el deploy falló.

Nunca pidas recargar la página si no hay deploy correcto.

Si el deploy falla, debes decirlo.
