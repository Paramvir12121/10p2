# filepath: /workspaces/10p2/terraform/localstack-dynamodb/main.tf
provider "aws" {
  region                      = var.region
  access_key                  = "test" # LocalStack default dummy credentials
  secret_key                  = "test"
  skip_credentials_validation = true
  skip_metadata_api_check     = true
  skip_requesting_account_id  = true

  # Define endpoints for all services used
  endpoints {
    dynamodb = var.localstack_endpoint_generic
    ec2      = var.localstack_endpoint_generic
    s3       = var.localstack_endpoint_generic
    # Add other services if needed
  }
}

# --- DynamoDB Table (Modified TableName to match frontend expectations) ---
resource "aws_dynamodb_table" "app_table" {
  name         = var.table_name # Use the variable consistent with frontend
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "PK" # Match frontend createTable script
  range_key    = "SK" # Match frontend createTable script

  attribute {
    name = "PK"
    type = "S"
  }
  attribute {
    name = "SK"
    type = "S"
  }
  # Add GSI attributes if needed, matching your frontend createTable script
  attribute { name = "GSI1PK", type = "S" }
  attribute { name = "GSI1SK", type = "S" }
  # ... add other GSI attributes (GSI2, GSI3) ...

  # Define Global Secondary Indexes matching your frontend createTable script
  global_secondary_index {
    name            = "GSI1"
    hash_key        = "GSI1PK"
    range_key       = "GSI1SK"
    projection_type = "ALL"
  }
  # ... add other GSIs (GSI2, GSI3) ...


  tags = {
    Environment = "localstack-dev"
    Name        = var.table_name
  }

  # Ensure table creation completes before EC2 tries to use it (implicitly handled by endpoint config)
}


# --- S3 Bucket to store frontend code ---
resource "aws_s3_bucket" "frontend_code_bucket" {
  bucket = "frontend-code-bucket-${random_id.bucket_suffix.hex}"
  # LocalStack might require force_destroy for cleanup during development
  force_destroy = true
}

resource "random_id" "bucket_suffix" {
  byte_length = 4
}

# --- Upload Frontend Code Zip to S3 ---
resource "aws_s3_object" "frontend_code_zip" {
  bucket = aws_s3_bucket.frontend_code_bucket.id
  key    = "frontend_app.zip"
  source = var.frontend_code_zip_path # Path to the zip file created by deploy.sh
  etag   = filemd5(var.frontend_code_zip_path) # Ensures re-upload if file changes
}

# --- Security Group for EC2 Instance ---
resource "aws_security_group" "frontend_sg" {
  name        = "frontend-sg"
  description = "Allow HTTP traffic to frontend app"

  ingress {
    from_port   = var.frontend_app_port
    to_port     = var.frontend_app_port
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # Allow access from anywhere (within LocalStack network)
  }

  # Allow all outbound traffic (needed for apt-get, npm install, etc.)
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "frontend-sg"
  }
}

# --- EC2 Instance to run the Frontend ---
resource "aws_instance" "frontend_server" {
  ami           = var.ec2_ami_id # Verify this AMI exists in your LocalStack
  instance_type = "t2.micro"     # LocalStack ignores instance type but it's required
  vpc_security_group_ids = [aws_security_group.frontend_sg.id]

  # User data script to setup and run the app
  user_data = <<-EOF
    #!/bin/bash
    set -e # Exit immediately if a command exits with a non-zero status.
    exec > >(tee /var/log/user-data.log|logger -t user-data -s 2>/dev/console) 2>&1

    echo "Starting user data script..."

    # Install dependencies (adjust based on the chosen AMI)
    # Example for Amazon Linux 2 / CentOS / RHEL based:
    yum update -y
    yum install -y aws-cli unzip nodejs npm git # Install necessary tools

    # Example for Debian / Ubuntu based:
    # apt-get update -y
    # apt-get install -y awscli unzip nodejs npm git curl
    # curl -sL https://deb.nodesource.com/setup_18.x | bash - # Install newer Node.js if needed
    # apt-get install -y nodejs

    echo "Dependencies installed."

    # Configure AWS CLI for LocalStack S3 (use the internal LocalStack hostname)
    # Note: 'localstack' is often the hostname within the Docker network. Adjust if needed.
    export AWS_ENDPOINT_URL=http://localstack:4566
    export AWS_ACCESS_KEY_ID=test
    export AWS_SECRET_ACCESS_KEY=test
    export AWS_DEFAULT_REGION=${var.region}

    echo "AWS CLI configured for LocalStack endpoint: $AWS_ENDPOINT_URL"

    # Create app directory
    APP_DIR="/opt/frontend_app"
    mkdir -p $APP_DIR
    cd $APP_DIR

    echo "Created app directory: $APP_DIR"

    # Download frontend code from S3
    echo "Downloading frontend code from S3 bucket ${aws_s3_bucket.frontend_code_bucket.id}..."
    aws s3 cp s3://${aws_s3_bucket.frontend_code_bucket.id}/${aws_s3_object.frontend_code_zip.key} frontend_app.zip --endpoint-url $AWS_ENDPOINT_URL
    unzip frontend_app.zip
    rm frontend_app.zip # Clean up zip file

    echo "Frontend code downloaded and unzipped."

    # Navigate into the actual frontend code directory (assuming zip contains 'frontend' folder)
    cd frontend

    echo "Installing frontend dependencies..."
    npm install

    echo "Frontend dependencies installed."

    # Set environment variables for the frontend app
    # Use the internal LocalStack hostname for DynamoDB endpoint
    export DYNAMODB_ENDPOINT=http://localstack:4566
    export DYNAMODB_REGION=${var.region}
    export DYNAMODB_TABLE_NAME=${var.table_name}
    export DYNAMODB_ACCESS_KEY_ID=test
    export DYNAMODB_SECRET_ACCESS_KEY=test
    export PORT=${var.frontend_app_port}
    # Add other necessary env vars from your .env.local if needed
    # export NEXTAUTH_URL=... (This might be tricky with dynamic EC2 IPs)
    # export NEXT_PUBLIC_BASE_URL=...

    echo "Environment variables set:"
    echo "DYNAMODB_ENDPOINT=$DYNAMODB_ENDPOINT"
    echo "PORT=$PORT"

    # Run the frontend application (using development server for simplicity)
    # Consider using pm2 or similar for production scenarios
    echo "Starting frontend application..."
    npm run dev -- -p ${var.frontend_app_port} # Run in dev mode on the specified port

    echo "User data script finished."
  EOF

  tags = {
    Name = "frontend-server"
  }

  # Ensure S3 object is uploaded before instance starts
  depends_on = [aws_s3_object.frontend_code_zip]
}