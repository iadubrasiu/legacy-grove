# HEARTBEAT.md

## Estado
Corrigiendo error de build en Vercel (Next.js 16 + next-pwa).

## Cambios realizados
- Actualizado `vercel.json` para usar `buildCommand: "next build --webpack"`.
- Esto fuerza a Next.js a usar Webpack en lugar de Turbopack, necesario para que el plugin `next-pwa` funcione.

## Resultado
- Esperando nuevo despliegue en Vercel.

## Cómo probar
- Esperar ~2 minutos.
- Visitar https://legacy-grove.vercel.app/api/health

## Próximo paso automático
- Verificar despliegue.
