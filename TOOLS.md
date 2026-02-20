# TOOLS.md

## Herramientas Permitidas

### Docker (principal)
- docker
- docker compose

Uso obligatorio para:
- Ejecutar servidores
- Base de datos
- Migraciones
- Tests

### Git
- git status
- git add
- git commit
- git push
- git pull

Reglas:
- Commits solo por hitos importantes.
- Prohibido push --force.

### Node / Python
- Preferentemente ejecutados dentro de contenedores.
- No levantar servidores directamente en host.

## Reglas de Infraestructura
- No abrir puertos públicos.
- No modificar configuración del sistema.
- No instalar paquetes globales innecesarios.
