# Proyecto de Integración Continua - Semana 3

Aplicación full-stack con 3 contenedores Docker: Frontend (React + Vite), Backend (Node.js + Express) y Base de datos (MySQL).

## 📋 Requisitos Previos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

- **Docker** (versión 20.10 o superior)
- **Docker Compose** (versión 2.0 o superior)
- **Git** (para clonar el repositorio)

### Verificar instalación

```bash
docker --version
docker compose version
```

> **Nota**: Asegúrate de que Docker Desktop esté ejecutándose antes de continuar.

## 🚀 Inicio Rápido

### 1. Clonar el repositorio (si aplica)

```bash
git clone <url-del-repositorio>
cd integracion-continua-semana-3
```

### 2. Construir y ejecutar los contenedores

```bash
docker compose up -d --build
```

Este comando:
- Construye las imágenes de Docker para frontend y backend
- Descarga la imagen de MySQL
- Crea y ejecuta los 3 contenedores en segundo plano

### 3. Verificar que los contenedores estén corriendo

```bash
docker compose ps
```

Deberías ver 3 contenedores en estado "Up":
- `db_mysql` (MySQL)
- `api_backend` (Backend Node.js)
- `web_frontend` (Frontend React)

## 🌐 Acceso a la Aplicación

Una vez que los contenedores estén corriendo:

- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:3000
- **MySQL**: localhost:3306

### Endpoints del Backend

- `GET /api/health` - Verifica el estado del servidor
- `POST /api/register` - Registra un nuevo usuario
  ```json
  {
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "password": "contraseña123"
  }
  ```
- `GET /api/users` - Lista todos los usuarios registrados

## 📁 Estructura del Proyecto

```
integracion-continua-semana-3/
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   └── server.js          # Servidor Express con API REST
├── frontend/
│   ├── Dockerfile
│   ├── nginx.conf          # Configuración de Nginx
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── main.jsx
│       └── App.jsx         # Componente principal con formulario
├── docker-compose.yml      # Configuración de los 3 contenedores
└── README.md
```

## 🛠️ Comandos Útiles

### Ver logs de los contenedores

```bash
# Ver todos los logs
docker compose logs

# Ver logs de un contenedor específico
docker compose logs backend
docker compose logs frontend
docker compose logs mysql

# Seguir logs en tiempo real
docker compose logs -f
```

### Detener los contenedores

```bash
docker compose down
```

### Detener y eliminar volúmenes (incluye base de datos)

```bash
docker compose down -v
```

### Reconstruir los contenedores

```bash
docker compose up -d --build
```

### Reiniciar un contenedor específico

```bash
docker compose restart backend
docker compose restart frontend
docker compose restart mysql
```

## 🔧 Configuración

### Variables de Entorno

Las variables de entorno están configuradas en `docker-compose.yml`:

**Backend:**
- `DB_HOST`: mysql (nombre del servicio)
- `DB_USER`: root
- `DB_PASSWORD`: root
- `DB_NAME`: proyecto_ic
- `DB_PORT`: 3306
- `PORT`: 3000
- `CORS_ORIGIN`: http://localhost:8080

**MySQL:**
- `MYSQL_ROOT_PASSWORD`: root
- `MYSQL_DATABASE`: proyecto_ic

### Base de Datos

La base de datos MySQL se crea automáticamente al iniciar el contenedor. La tabla `users` se crea automáticamente la primera vez que el backend se conecta.

**Estructura de la tabla `users`:**
- `id` (INT, PRIMARY KEY, AUTO_INCREMENT)
- `name` (VARCHAR(100))
- `email` (VARCHAR(150), UNIQUE)
- `password_hash` (VARCHAR(255))
- `created_at` (TIMESTAMP)

## 🐛 Solución de Problemas

### Error: "Cannot connect to the Docker daemon"

**Solución**: Asegúrate de que Docker Desktop esté ejecutándose.

```bash
# En macOS/Windows, inicia Docker Desktop desde la aplicación
# En Linux:
sudo systemctl start docker
```

### Error: "npm ci command can only install with an existing package-lock.json"

**Solución**: Ya está resuelto en el proyecto. Los Dockerfiles usan `npm install` en lugar de `npm ci`.

### Error: "Port already in use"

**Solución**: Verifica si algún proceso está usando los puertos 3000, 3306 o 8080:

```bash
# En macOS/Linux:
lsof -i :3000
lsof -i :3306
lsof -i :8080

# Detén el proceso o cambia los puertos en docker-compose.yml
```

### El frontend no se conecta al backend

**Verificación**:
1. Verifica que el backend esté corriendo: `docker compose logs backend`

## ✅ Pruebas y Codecov

Puedes ejecutar las pruebas y generar reportes de cobertura localmente:

Backend:
```powershell
cd backend
npm install
npm test # ejecuta pruebas con vitest y genera cobertura en backend/coverage/lcov.info
```

Frontend:
```powershell
cd frontend
npm install
npm test # ejecuta pruebas con vitest y genera cobertura en frontend/coverage/lcov.info
```

Para que el flujo de CI suba los reportes a Codecov en repositorios privados, establece un secreto de repositorio llamado `CODECOV_TOKEN` con tu token de Codecov.

2. Verifica que el puerto 3000 esté expuesto: `curl http://localhost:3000/api/health`
3. Verifica la consola del navegador (F12) para errores de CORS

### La base de datos no se conecta

**Verificación**:
1. Verifica que MySQL esté saludable: `docker compose ps mysql`
2. Verifica los logs: `docker compose logs mysql`
3. Espera a que el healthcheck complete (puede tardar unos segundos)

### Limpiar todo y empezar de nuevo

```bash
# Detener y eliminar contenedores, redes y volúmenes
docker compose down -v

# Eliminar imágenes (opcional)
docker rmi integracion-continua-semana-3-backend integracion-continua-semana-3-frontend

# Reconstruir desde cero
docker compose up -d --build
```

## 📝 Desarrollo

### Modificar el código

1. Edita los archivos en tu editor
2. Reconstruye el contenedor afectado:
   ```bash
   docker compose up -d --build backend    # Para backend
   docker compose up -d --build frontend   # Para frontend
   ```

### Acceder a la base de datos directamente

```bash
# Conectar a MySQL desde el contenedor
docker compose exec mysql mysql -uroot -proot proyecto_ic

# O desde tu máquina local (si tienes cliente MySQL)
mysql -h 127.0.0.1 -P 3306 -uroot -proot proyecto_ic
```

### Ejecutar comandos dentro de los contenedores

```bash
# Backend
docker compose exec backend sh

# Frontend (solo nginx, no hay Node.js en producción)
docker compose exec frontend sh

# MySQL
docker compose exec mysql bash
```

## 🔐 Seguridad

⚠️ **Nota importante**: Esta configuración es para desarrollo. Para producción:

- Cambia las contraseñas por defecto
- Usa variables de entorno seguras
- Configura HTTPS
- Implementa autenticación adecuada
- No expongas puertos innecesarios

## 📚 Tecnologías Utilizadas

- **Frontend**: React 18, Vite, Nginx
- **Backend**: Node.js 20, Express, MySQL2, bcryptjs, CORS
- **Base de Datos**: MySQL 8.0
- **Contenedores**: Docker, Docker Compose

## 📄 Licencia

Este proyecto es parte de un curso de Integración Continua.

---

¿Problemas? Revisa la sección de [Solución de Problemas](#-solución-de-problemas) o los logs de los contenedores.

