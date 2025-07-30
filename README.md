# GameDevManager

A comprehensive project and task management system designed specifically for game development workflows. This project is optimized for Windows development with Docker.

## 🎮 Features

- **Game Project Management** - Create and manage multiple game projects
- **Phase-Based Development** - Organize development into phases (Pre-production, Production, etc.)
- **Feature Tracking** - Break down features into manageable tasks and steps
- **Progress Monitoring** - Track progress across all levels of development
- **Real-time Updates** - Live file watching and hot reloading for development

## 🚀 Quick Start

### Prerequisites

- **Docker Desktop** with WSL2 backend (recommended) or Hyper-V
- **Windows 10/11** with Docker Desktop installed

### Development Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd GameDevManager
   ```

2. **Start the development environment**:
   ```bash
   make run_local
   ```

3. **Access the application**:
   - Frontend: http://localhost:9000
   - Backend API: http://localhost:8000
   - Database: PostgreSQL on localhost:5432

## 🛠️ Development Commands

```bash
# Start development environment
make run_local

# Stop development environment
make stop_local

# Clean up (removes database volume)
make clean_local

# View logs
docker compose logs -f

# Rebuild containers
docker compose build --no-cache
```

## 🏗️ Architecture

- **Frontend**: Quasar Framework (Vue.js) with TypeScript
- **Backend**: Go with Gin framework and GORM
- **Database**: PostgreSQL with persistent storage
- **Development**: Docker containers with optimized file watching for Windows

## 📁 Project Structure

```
GameDevManager/
├── frontend/          # Quasar Vue.js application
├── backend/           # Go API server
├── docker-compose.yml # Windows-optimized Docker configuration
├── Makefile          # Development commands
└── DATABASE.md       # Database setup documentation
```

## 🔧 Windows Optimizations

This project includes several Windows-specific optimizations:

- **Bind mounts** with `consistency: cached` for better performance
- **Chokidar polling** for reliable file change detection
- **Enhanced Air configuration** for Go file watching
- **WSL2 integration** support for optimal performance

## 📚 Documentation

- [Windows Development Setup](WINDOWS_DEV_SETUP.md) - Detailed Windows development guide
- [Database Setup](DATABASE.md) - Database configuration and management
- [Frontend Documentation](frontend/README.md) - Frontend-specific documentation

## 🐛 Troubleshooting

### File Changes Not Detected
1. Ensure Docker Desktop is using WSL2 backend
2. Add project directory to Docker Desktop's "File sharing" settings
3. Restart Docker Desktop if issues persist

### Database Connection Issues
1. Check container health: `docker compose ps`
2. View logs: `docker compose logs postgres`

### Performance Issues
1. Use WSL2 backend in Docker Desktop settings
2. Ensure project is in a WSL2-accessible directory

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with `make run_local`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License. 