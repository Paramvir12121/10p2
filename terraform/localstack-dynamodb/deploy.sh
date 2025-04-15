#/bin/bash
# This script deploys a localstack dynamodb instance using terraform

# Start localstack container
docker-compose -f ../../localstack/docker-compose.yml up -d
# Wait for localstack to be ready
MAX_RETRIES=12  # 1 minute timeout (12 x 5 seconds)
RETRIES=0

echo "Waiting for localstack to be ready..."
if docker ps | grep -q "localstack"; then
    echo "LocalStack is running"
else
    echo "LocalStack is not running"
    exit 1
fi
echo "Localstack is ready"
# Deploy dynamodb table using terraform
cd ../../terraform/localstack-dynamodb
terraform init
terraform apply -auto-approve
# Check if the table is created
echo "Checking if the table is created..."
aws --endpoint-url=http://localhost:4566 dynamodb list-tables | grep -q "test-table"
if [ $? -eq 0 ]; then
    echo "Table created successfully"
else
    echo "Table creation failed"
    exit 1
fi


# Show the output of the terraform apply command
terraform output

