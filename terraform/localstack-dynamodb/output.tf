output "table_name" {
  description = "Name of the created DynamoDB table"
  value       = aws_dynamodb_table.test_table.name
}

output "table_arn" {
  description = "ARN of the created DynamoDB table"
  value       = aws_dynamodb_table.test_table.arn
}