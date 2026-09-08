# RESOLVÉ v3 — reconstrucción limpia

Objetivo: reemplazar progresivamente la versión parcheada por un núcleo estable, probado de punta a punta, sin tocar producción hasta aprobar QA.

## Circuitos obligatorios

### Cliente
1. Registro
2. Confirmación e ingreso
3. Mi cuenta
4. Buscar profesional
5. Ver perfil, fotos y valoraciones
6. Solicitar presupuesto
7. Recibir presupuesto
8. Aceptar
9. Completar trabajo
10. Valorar

### Profesional
1. Registro
2. Ingreso
3. Completar perfil, oficio, zona y fotos
4. Aparecer en búsqueda
5. Recibir solicitudes
6. Enviar presupuesto
7. Ver aceptación
8. Completar trabajo

### Navegación y administración
- Inicio
- Buscar
- Mi cuenta
- Bolsa de trabajo
- Volver / cerrar modales
- Cerrar sesión
- Persistencia de sesión móvil
- Panel administrador

## Regla de publicación
La rama `main` y la URL pública no se reemplazan hasta que todos los circuitos críticos superen pruebas funcionales.