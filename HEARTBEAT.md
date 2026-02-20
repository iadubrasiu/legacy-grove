# HEARTBEAT.md

## Estado
Corrigiendo configuración de despliegue en Vercel.

## Cambios realizados
- Añadido `vercel.json` explícito para forzar framework Next.js.
- Movido `requirements.txt` a `prototype/` para evitar detección errónea de Python.

## Resultado
- Esperando que el nuevo push fuerce la re-detección del framework en Vercel.

## Cómo probar
- Esperar ~2 minutos tras el push.
- Visitar https://legacy-grove.vercel.app/api/health

## Próximo paso automático
- Verificar si el despliegue funciona.
