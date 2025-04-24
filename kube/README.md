# Kubernetes Deployment for 10p2

This directory contains Kubernetes manifests for deploying the 10p2 application.

## Overview

The Kubernetes configuration includes:

- Deployment configuration for the frontend
- DynamoDB deployment (for development/testing)
- Service definitions
- Environment configuration via ConfigMaps and Secrets
- Kustomize overlays for different environments

## Current Status

- ✅ Basic deployment manifests
- ✅ Environment configuration with Kustomize
- ❌ Ingress setup
- ❌ Persistent volume configuration

## Getting Started with Minikube

### Prerequisites

- Minikube
- kubectl

### Starting Minikube

```bash
minikube start
```

### Applying Kubernetes Configuration

For development:

```bash
kubectl apply -k kube/overlays/dev
```

### Accessing the Application

```bash
# Start a tunnel to access the service
minikube service frontend-service --url
```

## Directory Structure
