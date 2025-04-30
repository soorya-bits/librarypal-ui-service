#!/bin/bash

set -e

# Configuration
NETWORK_NAME=librarypal-net

USERS_CONTAINER=librarypal-users-service-container
BOOKS_CONTAINER=librarypal-books-service-container
LENDING_CONTAINER=librarypal-lending-books-service-container

UI_CONTAINER=librarypal-ui-service-container
UI_IMAGE=librarypal-ui-service
UI_PORT=80

# Check if the dependent services are running
echo "Checking if required services are running..."

if [ -z "$(docker ps -q -f name=$USERS_CONTAINER)" ]; then
  echo "❌ Users service container '$USERS_CONTAINER' is not running."
  exit 1
fi

if [ -z "$(docker ps -q -f name=$BOOKS_CONTAINER)" ]; then
  echo "❌ Books service container '$BOOKS_CONTAINER' is not running."
  exit 1
fi

if [ -z "$(docker ps -q -f name=$LENDING_CONTAINER)" ]; then
  echo "❌ Lending service container '$LENDING_CONTAINER' is not running."
  exit 1
fi

echo "✅ All required services are running."

# Stop old UI service container if any
echo "🧹 Stopping old UI service container (if any)..."
docker rm -f $UI_CONTAINER 2>/dev/null || true

# Build the UI service image
echo "🔨 Building UI service image..."
docker build -t $UI_IMAGE .

# Run the UI service container
echo "🚀 Starting UI service container on port $UI_PORT..."
docker run -d \
  --name $UI_CONTAINER \
  --network $NETWORK_NAME \
  -p $UI_PORT:$UI_PORT \
  $UI_IMAGE

echo "✅ UI service is running at http://localhost:$UI_PORT"
