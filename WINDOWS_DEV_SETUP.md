# Windows Development Setup

This project is optimized for Windows development with Docker.

## Prerequisites

1. **Docker Desktop with WSL2 Backend** (Recommended)
   - Install Docker Desktop
   - Enable WSL2 backend in Docker Desktop settings
   - Install WSL2 if not already installed

2. **Alternative: Docker Desktop with Hyper-V**
   - Use if WSL2 is not available

## Quick Start

```bash
# Start the development environment (with Docker Compose watch)
make run_local

# Start with reduced logging (recommended for less spam)
make run_local_quiet
```

## Performance Optimizations

### 1. File Watching Improvements

This project includes Windows-optimized configurations:

- **Bind mounts** instead of named volumes for source code
- **Chokidar polling** for better file change detection
- **Consistency: cached** for better performance
- **Enhanced Air configuration** for Go file watching

### 2. Environment Variables

The frontend container includes these Windows-specific optimizations:

```yaml
environment:
  - CHOKIDAR_USEPOLLING=true    # Use polling instead of native file watching
  - CHOKIDAR_INTERVAL=1000      # Poll every 1000ms
```

### 3. Volume Configuration

```yaml
volumes:
  - type: bind
    source: ./frontend
    target: /app
    consistency: delegated  # Better performance and caching on Windows
```

### 4. Targeted File Watching

The configuration now uses targeted file watching instead of watching entire directories:

- **Frontend**: Only watches `src/` and `public/` directories
- **Backend**: Only watches specific directories (`controllers/`, `models/`, `routes/`, `database/`)
- **Excludes**: All temporary files, logs, and build artifacts

## Troubleshooting

### File Changes Not Detected

1. **Check Docker Desktop Settings**:
   - Ensure "Use the WSL 2 based engine" is enabled
   - Add your project directory to "File sharing" in Docker Desktop settings

2. **Restart Docker Desktop**:
   ```bash
   # Stop containers
   make stop_local
   
   # Restart Docker Desktop, then
   make run_local
   ```

3. **Check WSL2 Integration**:
   ```bash
   # Verify WSL2 is being used
   docker version
   ```

### Slow Performance

1. **Use WSL2 Backend**:
   - Docker Desktop → Settings → General → "Use the WSL 2 based engine"

2. **Exclude Directories**:
   - The configuration excludes `node_modules/`, `dist/`, and `.git/` from watching

3. **Increase Polling Interval** (if needed):
   - Modify `CHOKIDAR_INTERVAL` in `docker-compose.dev.yml`

### Excessive Logging

If you see frequent "syncing service" messages, try the quiet mode:

```bash
# Stop current environment
make stop_local

# Start with reduced logging
make run_local_quiet
```

The quiet mode disables Docker Compose watch for the frontend and relies on Quasar's built-in file watching instead.

### Database Connection Issues

1. **Check Container Health**:
   ```bash
   docker compose ps
   ```

2. **View Logs**:
   ```bash
   docker compose logs postgres
   docker compose logs backend
   ```

## Commands Reference

```bash
# Start development environment (with Docker Compose watch)
make run_local

# Start with reduced logging (recommended)
make run_local_quiet

# Stop development environment
make stop_local

# Stop quiet environment
make stop_local_quiet

# Clean up (removes database volume)
make clean_local

# Clean up quiet environment
make clean_local_quiet

# View logs
docker compose logs -f

# Rebuild containers
docker compose build --no-cache
```

## Alternative: Native Development

If Docker file watching continues to be problematic, consider:

1. **Run PostgreSQL in Docker, everything else locally**:
   ```bash
   # Start only PostgreSQL
   docker compose up postgres -d
   
   # Run backend locally
   cd backend && go run main.go
   
   # Run frontend locally
   cd frontend && npm run dev
   ```

2. **Use WSL2 directly**:
   - Install Ubuntu in WSL2
   - Clone your project in WSL2
   - Use the standard Docker setup there

## Performance Comparison

| Method | File Watching | Performance | Setup Complexity |
|--------|---------------|-------------|------------------|
| Docker Desktop (WSL2) | ✅ Good | ✅ Fast | ✅ Easy |
| Docker Desktop (Hyper-V) | ⚠️ Fair | ⚠️ Medium | ✅ Easy |
| Native Windows | ❌ Poor | ❌ Slow | ❌ Complex |
| WSL2 Native | ✅ Excellent | ✅ Very Fast | ⚠️ Medium | 