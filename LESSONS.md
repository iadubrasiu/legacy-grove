# Lecciones Aprendidas y Prevención de Errores

Este documento registra los errores críticos encontrados durante el desarrollo y despliegue, junto con las soluciones aplicadas y las reglas para evitar su recurrencia.

## 1. Despliegue en Vercel

### Error: `Command "next build --webpack" exited with 1`
- **Causa:** El archivo `vercel.json` contenía un `buildCommand` obsoleto que forzaba el flag `--webpack`, incompatible con Next.js 14+.
- **Solución:** Eliminar `vercel.json` para permitir que Vercel detecte automáticamente la configuración óptima, o usar una configuración estándar (`"use": "@vercel/next"`).
- **Prevención:** No incluir comandos de build personalizados en `vercel.json` a menos que sea estrictamente necesario. Confiar en los defaults de Vercel.

### Error: Base de Datos SQLite (Read-Only)
- **Causa:** SQLite usa un archivo local (`dev.db`). En Vercel (entorno Serverless), el sistema de archivos es efímero y de solo lectura fuera de `/tmp`. Esto impedía el registro de usuarios y la creación de memorias (error 500 al escribir).
- **Solución:** Migrar a PostgreSQL (Vercel Postgres / Neon) para persistencia real.
- **Prevención:** Nunca usar SQLite para aplicaciones desplegadas en Vercel que requieran escritura. Configurar Postgres desde el inicio del proyecto.

### Error: Variables de Entorno en Producción
- **Causa:** La aplicación fallaba al conectar a la DB (`Failed to fetch`) porque la variable `DATABASE_URL` no estaba vinculada en el panel de Vercel, a pesar de estar en `.env` local.
- **Solución:** Configurar las variables en el panel de Vercel o (como medida de emergencia) inyectarlas mediante `.env.production`.
- **Prevención:** Verificar siempre la sección "Environment Variables" en Vercel tras crear una base de datos nueva.

## 2. Desarrollo y Código

### Error: Rutas de Importación (`Module not found`)
- **Causa:** Al mover archivos a rutas anidadas dinámicas (`src/app/api/memorias/[id]/route.ts`), las importaciones relativas (`../../../lib/prisma`) quedaron cortas por un nivel.
- **Solución:** Ajustar la profundidad de los `../` o usar alias absolutos (`@/lib/prisma`) si el `tsconfig.json` está correctamente configurado para el entorno de build.
- **Prevención:** Usar alias (`@/`) preferentemente para evitar el infierno de rutas relativas, asegurando que `tsconfig.json` y el bundler los resuelvan bien.

### Error: Sintaxis JSX Inválida (`Unexpected token`)
- **Causa:** Uso incorrecto de la herramienta de edición automatizada que pegó código (interfaces, imports) dentro del bloque `return (...)` del JSX.
- **Solución:** Revisión manual y reescritura limpia del archivo.
- **Prevención:** **Obligatorio:** Ejecutar `npm run build` localmente antes de cada `git push` para detectar estos errores de sintaxis antes de enviar a producción.

## Protocolo de Despliegue Seguro (Nuevo Estándar)

1.  **Validación Local:** Ejecutar siempre `npm run build` en el entorno local antes de hacer push.
2.  **Verificación de Entorno:** Confirmar que las variables de entorno nuevas (como claves de API o DB) están configuradas en Vercel.
3.  **Monitorización:** No asumir que el deploy funciona. Verificar el estado del build y visitar la URL tras el despliegue.
