# Terraform Configuration for 10p2

This directory contains Terraform configurations for provisioning infrastructure for the 10p2 application.

## Overview

The Terraform configuration defines the infrastructure required to run the 10p2 application in AWS, including:

- DynamoDB tables
- S3 buckets (for assets)
- Lambda functions (for backend processing)
- API Gateway (for RESTful APIs)
- CloudFront (for CDN)
- ECR repositories (for Docker images)

## Current Status

- ✅ Basic configuration for LocalStack testing
- ✅ DynamoDB table definitions
- ❌ Complete AWS infrastructure
- ❌ CI/CD pipeline integration

## Getting Started

### Prerequisites

- Terraform 1.0 or newer
- AWS CLI configured (for production deployment)
- LocalStack (for local testing)

### Using with LocalStack

```bash
cd terraform/localstack-dynamodb

# Initialize Terraform
terraform init

# Plan the deployment
terraform plan

# Apply the configuration
terraform apply
```

### Using with AWS (Future)

```bash
cd terraform/aws

# Initialize Terraform
terraform init

# Plan the deployment
terraform plan

# Apply the configuration
terraform apply
```

## Directory Structure

