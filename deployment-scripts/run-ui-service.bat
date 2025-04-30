@echo off
setlocal enabledelayedexpansion

REM Configuration
set "NETWORK_NAME=librarypal-net"

set "USERS_CONTAINER=librarypal-users-service-container"
set "BOOKS_CONTAINER=librarypal-books-service-container"
set "LENDING_CONTAINER=librarypal-lending-books-service-container"

set "UI_CONTAINER=librarypal-ui-service-container"
set "UI_IMAGE=librarypal-ui-service"
set "UI_PORT=80"

echo Checking if required services are running...

for %%C in ("%USERS_CONTAINER%" "%BOOKS_CONTAINER%" "%LENDING_CONTAINER%") do (
    docker ps -q -f name=%%~C >nul
    if errorlevel 1 (
        echo ❌ %%~C is not running.
        exit /b 1
    )
)

echo ✅ All required services are running.

echo 🧹 Stopping old UI service container (if any)...
docker rm -f %UI_CONTAINER% >nul 2>&1

echo 🔨 Building UI service image...
docker build -t %UI_IMAGE% .

echo 🚀 Starting UI service container on port %UI_PORT%...
docker run -d ^
 --name %UI_CONTAINER% ^
 --network %NETWORK_NAME% ^
 -p %UI_PORT%:%UI_PORT% ^
 %UI_IMAGE%

echo ✅ UI service is running at http://localhost:%UI_PORT%
