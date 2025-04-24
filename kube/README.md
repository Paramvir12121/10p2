# Kubernetes Deployment

This directory contains the Kubernetes configuration for deploying the application.

## Structure

- `base/`: Base configurations for all environments
  - `dynamodb/`: DynamoDB local configurations
  - `frontend/`: Frontend application configurations
- `overlays/`: Environment-specific configurations
  - `dev/`: Development environment
  - `prod/`: Production environment (when needed)

## Deployment Methods

### Using kubectl with kustomize

For development environment:

```bash
# Create namespace
kubectl create namespace focus-app-dev

# Apply using kustomize
kubectl apply -k ./overlays/dev
```

### Using a CI/CD Pipeline

For automated deployments:

1. Set up a CI/CD pipeline using GitHub Actions, GitLab CI, or similar
2. Add steps to build container images and push to a registry
3. Deploy using kustomize to the appropriate environment

## Best Practices

1. Always use version control for Kubernetes manifests
2. Use namespaces to isolate environments
3. Specify resource requests and limits for all containers
4. Include health checks (readiness and liveness probes)
5. Use ConfigMaps and Secrets for configuration
6. Apply proper labels to all resources
7. Use Kustomize for environment-specific configurations
