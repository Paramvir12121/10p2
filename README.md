# 10p2
The better Pomodoro.

## Focus App - Better Pomodoro
A modern Pomodoro timer application built with Next.js and PostgreSQL.

## Setup Instructions
### Prerequisites
- Node.js (v16 or later)
- npm or yarn
- Docker and Docker Compose

### Environment Setup
1. Clone the repository

2. Install dependencies:
```bash
cd frontend
npm install
# or
yarn install
```

3. Configure environment variables:
```bash
# Copy the example env file if it doesn't exist
cp .env.example .env.local
# Edit the environment variables as needed
```

## Database Setup
The application uses PostgreSQL running in Docker. The database schema is automatically applied when the container is first created.

1. Start the database:
```bash
cd frontend
docker-compose -env-file .env.local up -d
```

2. Verify the database is running:
```bash
docker ps
# You should see postgres-db container running
```

3. If you need to reset the database:
```bash
# Stop and remove the container
docker-compose down
# Remove the volume
docker volume rm 10p2_postgres_data
# Restart the container
docker-compose up -d
```

## Running the Application
1. Start the development server:
```bash
cd frontend
npm run dev
# or
yarn dev
```

2. Access the application at http://localhost:3000

## Database Management
### Connecting to PostgreSQL
```bash
# Connect to the PostgreSQL container
docker exec -it postgres-db psql -U focususer -d focusapp

# Or connect using a PostgreSQL client with these details:
# Host: localhost
# Port: 5432
# Database: focusapp
# Username: focususer
# Password: your_password (as defined in .env.local)
```

### Useful PostgreSQL Commands
```sql
\l                        -- List all databases
\d                        -- List all tables
\d+ tablename             -- Show table structure
SELECT * FROM users;      -- View all users
SELECT * FROM tasks;      -- View all tasks
SELECT * FROM sessions;   -- View all sessions
\q                        -- Quit PostgreSQL
```

## Project Structure
- `/app` - Next.js application and server actions
- `/db` - Database connection and data access layer
- `/components` - React components
- `/public` - Static assets

## Troubleshooting
### Database Connection Issues
If you encounter database connection errors:

1. Verify the PostgreSQL container is running:
```bash
docker ps | grep postgres-db
```

2. Check container logs:
```bash
docker logs postgres-db
```

3. Ensure environment variables match between the application and Docker Compose file:
```bash
# Check environment variables in Docker
docker exec postgres-db env | grep POSTGRES

# Compare with your .env.local file
cat .env.local | grep POSTGRES
```

### Schema Not Initialized
If tables don't exist:
```bash
# Verify schema initialization
docker exec -it postgres-db psql -U focususer -d focusapp -c "\d"

# Manually run schema if needed
cat db/schema.sql | docker exec -i postgres-db psql -U focususer -d focusapp
```

## Development
This project uses Next.js with Server Actions for backend functionality and PostgreSQL for data persistence.