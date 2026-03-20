# PROJECT.md

## Proyecto
app-recuerdos

Aplicación web para guardar y gestionar recuerdos familiares.

## Stack actual
- Next.js
- Prisma
- Base de datos relacional
- Vercel para despliegue
- GitHub como fuente remota del repositorio
- OpenClaw como agente operativo sobre el repo

## Estado actual conocido
- El proyecto existe y compila como app real, no como simple mock
- Hay contexto persistente en `docs/context`
- El bot de Telegram ya está operativo
- El workspace válido es `/home/workspace/app-recuerdos`

## Reglas estructurales
- Hay un solo repo válido para este proyecto
- Hay un solo workspace válido para este proyecto
- El contexto persistente vive en `docs/context`
- El runtime de OpenClaw no forma parte del proyecto
- No se deben crear copias paralelas del repo

## Objetivo operativo
Permitir que el agente pueda modificar la app, validar cambios, hacer commit y empujar cambios al repositorio correcto sin perder contexto ni trabajar sobre rutas equivocadas.
