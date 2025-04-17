# filepath: /workspaces/10p2/terraform/localstack-dynamodb/output.tf
output "dynamodb_table_name" {
  description = "Name of the created DynamoDB table"
  value       = aws_dynamodb_table.app_table.name
}

output "dynamodb_table_arn" {
  description = "ARN of the created DynamoDB table"
  value       = aws_dynamodb_table.app_table.arn
}

output "frontend_code_bucket_name" {
  description = "Name of the S3 bucket holding frontend code"
  value       = aws_s3_bucket.frontend_code_bucket.bucket
}

# Note: LocalStack EC2 IPs are internal to the Docker network unless mapped.
output "frontend_server_private_ip" {
  description = "Private IP address of the EC2 instance (within LocalStack network)"
  value       = aws_instance.frontend_server.private_ip
}

output "frontend_server_id" {
  description = "ID of the EC2 instance"
  value       = aws_instance.frontend_server.id
}

output "access_frontend_app_command" {
  description = "Example command to potentially access the app (adjust port mapping if needed)"
  # This is just an example; actual access depends on port mapping and LocalStack networking.
  value       = "Try accessing http://localhost:${var.frontend_app_port} in your browser (if port ${var.frontend_app_port} is mapped in docker-compose.yml)"
}

output "view_ec2_logs_command" {
   description = "Command to view the user-data logs inside the EC2 instance"
   value = "docker exec localstack_main aws --endpoint-url=${var.localstack_endpoint_generic} ec2 get-console-output --instance-id ${aws_instance.frontend_server.id} --output text"
}