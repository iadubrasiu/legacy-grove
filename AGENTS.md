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
Incluye siempre que aplique:
- qué archivos cambiaste
- qué comando ejecutaste para validar
- resultado observado
- commit realizado, si hubo commit

## Autonomía
- No pidas confirmación para cambios normales dentro del workspace
- Sí pide intervención humana si faltan credenciales, acceso externo o hay una decisión estratégica ambigua
