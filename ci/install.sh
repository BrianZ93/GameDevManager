@echo off
setlocal EnableDelayedExpansion

echo Installing WSL2, Ubuntu, and development environment...

:: Check if running with admin privileges
net session >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo This script requires administrative privileges. Please run as Administrator.
    pause
    exit /b 1
)

:: Enable WSL and WSL2
echo Enabling WSL and WSL2...
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart

:: Download and install WSL2 Linux kernel update
echo Installing WSL2 Linux kernel update...
curl -L -o wsl_update_x64.msi https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi
msiexec /i wsl_update_x64.msi /quiet /norestart
del wsl_update_x64.msi

:: Set WSL2 as default
echo Setting WSL2 as default...
wsl --set-default-version 2

:: Install Ubuntu 20.04 if not already installed
echo Checking for Ubuntu 20.04 installation...
wsl -l | findstr "Ubuntu-20.04" >nul
if %ERRORLEVEL% neq 0 (
    echo Installing Ubuntu 20.04...
    wsl --install -d Ubuntu-20.04
) else (
    echo Ubuntu 20.04 is already installed.
)

:: Wait for Ubuntu to be ready
echo Waiting for Ubuntu to initialize...
:CHECK_WSL
wsl -d Ubuntu-20.04 -e bash -c "exit" >nul 2>&1
if %ERRORLEVEL% neq 0 (
    timeout /t 5 >nul
    goto CHECK_WSL
)

:: Get project directory and convert to WSL path
set PROJECT_DIR=%CD%
set WSL_PROJECT_DIR=/home/%USERNAME%/project
echo Project directory: %PROJECT_DIR%

:: Copy project to WSL2 filesystem
echo Copying project to WSL2 filesystem...
wsl -d Ubuntu-20.04 -e bash -c "mkdir -p %WSL_PROJECT_DIR% && cp -r /mnt/%PROJECT_DIR:~0,1%/!PROJECT_DIR:~3!/* %WSL_PROJECT_DIR%"

:: Run WSL2 setup commands
echo Setting up Ubuntu environment...
wsl -d Ubuntu-20.04 -e bash -c ^
"set -e; ^
echo 'Updating package lists...'; ^
sudo apt-get update; ^
echo 'Installing prerequisites...'; ^
sudo apt-get install -y apt-transport-https ca-certificates curl gnupg lsb-release; ^
if ! command -v docker; then ^
    echo 'Installing Docker...'; ^
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg; ^
    echo \"deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable\" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null; ^
    sudo apt-get update; ^
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io; ^
else ^
    echo 'Docker is already installed.'; ^
fi; ^
if ! command -v docker-compose; then ^
    echo 'Installing Docker Compose...'; ^
    sudo curl -L 'https://github.com/docker/compose/releases/download/v2.29.2/docker-compose-$(uname -s)-$(uname -m)' -o /usr/local/bin/docker-compose; ^
    sudo chmod +x /usr/local/bin/docker-compose; ^
else ^
    echo 'Docker Compose is already installed.'; ^
fi; ^
if ! command -v node; then ^
    echo 'Installing Node.js...'; ^
    curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -; ^
    sudo apt-get install -y nodejs; ^
else ^
    echo 'Node.js is already installed.'; ^
fi; ^
if ! command -v go; then ^
    echo 'Installing Go...'; ^
    wget https://golang.org/dl/go1.24.5.linux-amd64.tar.gz; ^
    sudo tar -C /usr/local -xzf go1.24.5.linux-amd64.tar.gz; ^
    echo 'export PATH=$PATH:/usr/local/go/bin' >> ~/.bashrc; ^
    export PATH=$PATH:/usr/local/go/bin; ^
    rm go1.24.5.linux-amd64.tar.gz; ^
else ^
    echo 'Go is already installed.'; ^
fi; ^
echo 'Configuring inotify limits...'; ^
sudo sh -c 'echo \"fs.inotify.max_user_watches=524288\" >> /etc/sysctl.conf'; ^
sudo sysctl -p; ^
cd %WSL_PROJECT_DIR%; ^
if [[ ! -d 'frontend' || ! -d 'backend' ]]; then ^
    echo 'Error: frontend or backend directory not found.'; ^
    exit 1; ^
fi; ^
echo 'Building Docker images...'; ^
docker-compose build; ^
echo 'Installation complete! Install Docker Desktop and enable WSL2 integration.'"

echo Please install Docker Desktop from https://www.docker.com/products/docker-desktop/
echo After installation, enable WSL2 integration in Docker Desktop:
echo Settings > Resources > WSL Integration > Enable for Ubuntu-20.04
echo Then, run start.bat to enter the Ubuntu environment.
pause