@echo off
setlocal EnableDelayedExpansion

echo Starting WSL2 Ubuntu terminal in project directory...

:: Get project directory and convert to WSL path
set PROJECT_DIR=%CD%
set WSL_PROJECT_DIR=/home/%USERNAME%/project

:: Check if Ubuntu-20.04 is installed
wsl -l | findstr "Ubuntu-20.04" >nul
if %ERRORLEVEL% neq 0 (
    echo Error: Ubuntu-20.04 is not installed. Run install.bat first.
    pause
    exit /b 1
)

:: Check if project directory exists in WSL
wsl -d Ubuntu-20.04 -e bash -c "test -d %WSL_PROJECT_DIR%"
if %ERRORLEVEL% neq 0 (
    echo Error: Project directory %WSL_PROJECT_DIR% not found in WSL2. Run install.bat first.
    pause
    exit /b 1
)

:: Start WSL2 Ubuntu terminal in project directory
echo Opening Ubuntu terminal in %WSL_PROJECT_DIR%...
wsl -d Ubuntu-20.04 -e bash -c "cd %WSL_PROJECT_DIR% && exec bash"

echo Terminal closed.
pause