#!/bin/bash

# === Configurable Variables ===
SERVICE_NAME="ui-service"
IMAGE_NAME="librarypal-ui-service"
IMAGE_TAG="latest"
HELM_CHART_DIR="./helm"
LOCAL_PORT=80
SERVICE_PORT=80

# Exit on error
set -e

echo "[INFO] Using Minikube's Docker environment..."
eval $(minikube docker-env)

echo "[INFO] Building Docker image: ${IMAGE_NAME}:${IMAGE_TAG} ..."
docker build -t ${IMAGE_NAME}:${IMAGE_TAG} .

echo "[INFO] Deploying Helm release: ${SERVICE_NAME} ..."
helm upgrade --install ${SERVICE_NAME} ${HELM_CHART_DIR}

# Wait for the pod to be in 'Running' state
echo "[INFO] Waiting for pod to be running..."
kubectl wait --for=condition=available --timeout=600s deployment/${IMAGE_NAME}

echo "[INFO] Starting port-forward: localhost:${LOCAL_PORT} -> service/${IMAGE_NAME}:${SERVICE_PORT} ..."
nohup kubectl port-forward service/${IMAGE_NAME} ${LOCAL_PORT}:${SERVICE_PORT} > port-forward.log 2>&1 &

echo "[DONE] Service '${SERVICE_NAME}' is accessible at http://localhost:${LOCAL_PORT}"
