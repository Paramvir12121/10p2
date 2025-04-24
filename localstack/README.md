# LocalStack Setup for 10p2

This directory contains the configuration for running AWS services locally using LocalStack.

## Overview

LocalStack provides a local AWS cloud stack for testing and development. In this project, we use it to simulate:

- DynamoDB
- S3 (for future asset storage)
- Lambda (for future serverless functions)
- API Gateway (for future API endpoints)

## Current Status

- ✅ Basic container configuration
- ✅ Environment variable setup
- ❌ Automated initialization scripts
- ❌ Complete integration with frontend

## Getting Started

### Prerequisites

- Docker and Docker Compose

### Running LocalStack

From the project root:

```bash
cd localstack
docker-compose up -d
```

This will start LocalStack with the services defined in the `docker-compose.yml` file.

### Testing DynamoDB Connection

After LocalStack is running:

```bash
# Create table
aws dynamodb create-table \
  --endpoint-url http://localhost:4566 \
  --table-name FocusAppData \
  --attribute-definitions \
    AttributeName=PK,AttributeType=S \
    AttributeName=SK,AttributeType=S \
  --key-schema \
    AttributeName=PK,KeyType=HASH \
    AttributeName=SK,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST

# List tables
aws dynamodb list-tables --endpoint-url http://localhost:4566
```

### Accessing LocalStack Services

LocalStack runs on http://localhost:4566 by default. You can use AWS CLI with the `--endpoint-url` parameter to interact with it:

```bash
aws --endpoint-url=http://localhost:4566 dynamodb list-tables
```

## Future Improvements

- Create automated initialization scripts
- Add sample data generation
- Implement integration tests using LocalStack
- Create a unified CLI tool for LocalStack management
