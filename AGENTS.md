# AGENTS.md

## Reglas de Workspace
- El único workspace válido para este proyecto es `/home/workspace/app-recuerdos`.
- No se debe trabajar fuera de este directorio.
- No se deben modificar archivos de configuración del sistema (OpenClaw, systemd, etc.) sin una orden explícita.

## Reglas de Git
- **Verificación obligatoria:** Antes de implementar cualquier cambio funcional, se debe ejecutar `git status` para confirmar que el repositorio está limpio. Si no lo está, el agente debe detenerse y avisar.
- **Commit Hashes:** No se deben inventar o reportar hashes de commit inexistentes.
- **Push:** No se debe afirmar que un `push` se ha completado sin verificar que el hash del commit existe realmente en `origin/main`.
- `git push --force` está prohibido.

## Reglas de Deploy
- Un cambio no se considera visible en producción hasta que el despliegue de Vercel para el commit correspondiente esté verificado como "Ready".
- Si un despliegue falla, se debe reportar el fallo y no pedir al usuario que verifique cambios que no se han aplicado.

## Reglas de Implementación
- **Verificación de diff antes de commit:** Antes de ejecutar `git commit`, el agente debe verificar que los cambios en los archivos (el `diff`) son los correctos para el objetivo de la tarea.
- **Regla de verificación de archivo:** Antes de hacer commit, el agente debe leer el contenido final del archivo modificado y confirmar que contiene exactamente el cambio esperado. Por ejemplo, si se modifica `src/app/page.tsx`, el agente debe:
  - Leer el contenido actual del archivo.
  - Confirmar que el código nuevo está presente.
  - Confirmar que el código antiguo no está presente.
  - Solo entonces hacer commit.
