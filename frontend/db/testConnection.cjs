const { DynamoDBClient, ListTablesCommand } = require('@aws-sdk/client-dynamodb');

const client = new DynamoDBClient({
  region: 'us-east-1',
  endpoint: 'http://localhost:8000',
  credentials: {
    accessKeyId: 'local',
    secretAccessKey: 'local',
  },
});

const testConnection = async () => {
  try {
    const result = await client.send(new ListTablesCommand({}));
    console.log('Connection successful! Tables:', result.TableNames);
  } catch (error) {
    console.error('Connection failed:', error);
  }
};

testConnection();