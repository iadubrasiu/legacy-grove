# PROJECT_STATE.md

## Sistema
- **Repo activo:** /home/workspace/app-recuerdos
- **Repo remoto:** https://github.com/iadubrasiu/legacy-grove
- **Runtime:** OpenClaw ejecutándose en el VPS

## Estado del Sistema
- OpenClaw: instalado y funcionando
- Bot de Telegram: responde
- Modelo por defecto: google/gemini-2.5-pro
- Contexto del proyecto: `docs/context`
- Git: configurado para commit y push

## Reglas Operativas Clave
- Antes de declarar una tarea como terminada, el estado relevante debe quedar reflejado en archivos.
- Un cambio no se considera visible en producción hasta que el deploy de Vercel esté completado y verificado.
- SSR dinámico (`export const dynamic = 'force-dynamic';`) debe mantenerse en la Home.

## Hitos Técnicos Verificados
- `[2026-03-25]` `[Commit: 58b7728]` El texto "Árbol de Memorias" en la Home se confirmó como no clicable. Deploy verificado.
- `[2026-03-25]` `[Commit: 230f74d]` Eliminada la ruta placeholder `/protected`. Deploy verificado.
