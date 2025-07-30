# Database Setup

This project now uses PostgreSQL as the database, which provides better performance and reliability compared to SQLite, especially in a Docker environment.

## Architecture

- **PostgreSQL Service**: Dedicated database container with persistent storage
- **Backend Service**: Go application that connects to PostgreSQL
- **Frontend Service**: Quasar application that communicates with the backend

## Development Setup

### Starting the Application

```bash
make run_local
```

This will start:
1. PostgreSQL database (port 5432)
2. Backend API (port 8000)
3. Frontend application (port 9000)

### Stopping the Application

```bash
make stop_local
```

This stops all services but preserves the database data.

### Complete Cleanup

```bash
make clean_local
```

This stops all services and removes the database volume, effectively resetting all data.

## Database Configuration

The database is configured with the following default settings:

- **Host**: postgres (container name)
- **Port**: 5432
- **Database**: gamedev
- **Username**: gamedev
- **Password**: gamedev123
- **SSL Mode**: disable

These settings can be overridden using environment variables in the `docker-compose.yml` file.

## Data Persistence

- Database data is stored in a Docker volume named `postgres_data`
- Data persists between container restarts
- Data is lost only when using `make clean_local` or manually removing the volume

## Connecting to the Database

You can connect to the database directly using:

```bash
docker exec -it game-dev-postgres psql -U gamedev -d gamedev
```

## Migration

The application automatically runs database migrations on startup using GORM's AutoMigrate feature. This ensures the database schema is always up to date.

## Troubleshooting

### Database Connection Issues

1. Ensure the PostgreSQL service is healthy:
   ```bash
   docker compose ps
   ```

2. Check PostgreSQL logs:
   ```bash
   docker compose logs postgres
   ```

3. Verify the backend can connect:
   ```bash
   docker compose logs backend
   ```

### Data Loss

If you need to reset the database completely:
```bash
make clean_local
make run_local
```

This will remove all data and start fresh. 