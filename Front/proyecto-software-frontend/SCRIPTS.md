# Guía de Scripts del Proyecto

Este documento explica la función de cada comando disponible en el archivo `package.json`. Puedes ejecutarlos usando `npm run <nombre-del-script>`.

## Desarrollo y Producción

### `npm run dev`
Inicia el servidor de desarrollo local con **Live Reload**. Es el comando principal que usarás mientras escribes código.
- **Uso**: Desarrollo diario.

### `npm run build`
Compila la aplicación para producción. Genera una versión optimizada en la carpeta `build/`, lista para ser desplegada.
- **Uso**: Antes de subir a un servidor real o para probar el rendimiento final.

### `npm run start`
Inicia el servidor de producción utilizando la compilación previa generada por `npm run build`.
- **Uso**: En entornos de servidores reales (VPS, Docker, etc.).

---

## Calidad y Estándares de Código

### `npm run lint`
Ejecuta **ESLint** para buscar errores de calidad, malas prácticas o inconsistencias en el código según las reglas del equipo.
- **Uso**: Para verificar que el código está limpio antes de hacer un commit o subir cambios.

### `npm run lint:fix`
Igual que el anterior, pero intenta **corregir automáticamente** todos los errores que sean posibles (como espacios mal puestos, comas faltantes, etc.).
- **Uso**: Cuando tienes muchos avisos del linter y quieres arreglarlos rápido.

### `npm run format`
Ejecuta **Prettier** para formatear todos los archivos del proyecto (comillas, indentación, longitud de línea).
- **Uso**: Para que todo el código se vea estéticamente igual, sin importar quién lo escribió.

---

## Tipos y Validación (TypeScript)

### `npm run typecheck`
Realiza dos acciones importantes:
1.  **`react-router typegen`**: Genera tipos automáticos para tus rutas (loaders, actions).
2.  **`tsc`**: Valida que no haya errores de tipos en todo el proyecto.
- **Uso**: Para asegurarte de que no hay errores de lógica de tipos antes de compilar.
