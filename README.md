# Proyecto todo-list-test - Prueba Técnica

Este proyecto consiste en un catálogo de automóviles con backend en Node.js/Express y SQLite, y frontend en React + Vite. Se incluye manejo de autenticación JWT y geolocalización con Leaflet.

### Tecnologías usadas

- Backend: [Node.js], [Express], [SQLite], [JWT]
- Frontend: [React], [Vite], [React Router], [React Leaflet]
- Contenedores: [Docker], [Docker Compose]

### Requisitos previos

- Tener instalado [Docker Desktop]
- Docker Compose (viene con Docker Desktop)

### Instrucciones para ejecutar el proyecto (Docker)

Clonar este repositorio:

```sh
git clone https://github.com/marlacobar/todo-list-test.git
cd todo-list-test
```

Construir y levantar los contenedores:

```sh
docker-compose up --build
```

Esto hará lo siguiente:

1. Construirá y levantará el backend en el puerto 3001
2. Ejecutará las migraciones para crear las tablas y roles si no existen
3. Construirá y levantará el frontend servido con Vite en modo producción en el puerto 5173

Acceder desde el navegador:

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001/api

### Alternativa: Ejecutar el proyecto sin Docker (modo local)

Si prefieres probar el proyecto sin Docker (por ejemplo, durante desarrollo o para depurar), sigue estos pasos:

Clonar este repositorio:

```sh
git clone https://github.com/marlacobar/todo-list-test.git
cd todo-list-test
```

Instala todas las dependencias del proyecto:
Este repositorio contiene un package.json en la raíz que permite instalar las dependencias tanto del frontend como del backend al mismo tiempo.

```sh
npm install
```

Ejecuta migraciones manualmente:
Asegúrate de que el archivo `carcatalog.db` esté limpio si deseas partir desde cero (por ejemplo, eliminándolo manualmente), aunque el script de migración incluye `IF NOT EXISTS` para evitar errores al recrear tablas ya existentes.

Nota: Los siguientes comandos deben ejecutarse desde una terminal compatible con Bash, como Git Bash, WSL, o una terminal de Linux/macOS.

```sh
sqlite3 carcatalog.db < db/migrations/001_create_tables.sql
sqlite3 carcatalog.db < db/migrations/002_insert_roles.sql
```

Ejecuta el proyecto completo (frontend y backend) con un solo comando:

```sh
npm run dev
```

El backend estará disponible en: `http://localhost:3001`
El frontend estará disponible en: `http://localhost:5173`

### Migraciones

Se aplican automáticamente al iniciar el backend.

Archivos:

- backend/db/migrations/001_create_tables.sql
- backend/db/migrations/002_insert_roles.sql

Si necesitas reiniciar la base de datos, elimina el archivo `backend/carcatalog.db` antes de volver a ejecutar `docker-compose up`.

### Uso general

- Regístrate o inicia sesión
- Agrega, edita y elimina autos
- Actualiza su ubicación manualmente (latitud/longitud)
- Visualízalos en el mapa con Leaflet
- Cierra sesión desde el botón en la esquina superior derecha

### License

MIT

[Docker]: https://www.docker.com/
[Docker Desktop]: https://www.docker.com/products/docker-desktop
[Docker Compose]: https://docs.docker.com/compose/
[React]: https://es.react.dev/
[React Leaflet]: https://react-leaflet.js.org/
[Vite]: https://vite.dev/
[SQLite]: https://www.sqlite.org/
[JWT]: https://www.jwt.io/
[Node.js]: http://nodejs.org
[React Router]: https://reactrouter.com/home
[Express]: http://expressjs.com
