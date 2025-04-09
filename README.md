# 10p2: The Better Pomodoro Timer

<div align="center">
  <img src="https://via.placeholder.com/200x200?text=10p2" alt="10p2 Logo" width="200" height="200">
  <br>
  <strong>Focus better. Work smarter. Take breaks consistently.</strong>
  <br><br>
</div>

## 📋 Overview

10p2 is an advanced Pomodoro timer application designed to enhance productivity through structured work sessions and breaks. Unlike traditional Pomodoro apps, 10p2 offers a more flexible and modern approach with real-time task tracking, dynamic break earning, and a beautiful user interface that adapts to your workflow.

### Why "10p2"?

The name "10p2" derives from a productivity methodology where you work intensely for blocks of time and earn proportional breaks - specifically, for every 10 parts of focused work, you earn 2 parts of break time. This balanced approach helps maintain high productivity without burnout.

## ✨ Features

- **Dual Timers System** - Separate focus and break timers that work in tandem
- **Dynamic Break Earning** - Earn break time proportionally to your focused work
- **Drag & Drop Tasks** - Intuitive task management with drag & drop functionality
- **Focus Task Selection** - Easily select your current focus task for better concentration
- **Dark & Light Modes** - Beautiful themes that change based on your system preferences
- **Persistent Storage** - Your tasks, focus sessions and preferences remain between sessions
- **Responsive Design** - Works beautifully on desktop and mobile devices
- **Dynamic Backgrounds** - Changeable background themes to suit your mood
- **Session Statistics** - Track your productivity over time
- **Sound Notifications** - Get alerted when timers finish
- **PostgreSQL Integration** - Robust data storage with PostgreSQL
- **Offline Support** - Core functionality works even without internet connection

## 🛠️ Technology Stack

- **Frontend:**
  - Next.js 14 (React framework with server components)
  - TailwindCSS (utility-first CSS framework)
  - Shadcn UI (component library)
  - DND Kit (drag and drop functionality)
  - Framer Motion (animations)
  - Sonner (toast notifications)
  - Next Themes (theming support)

- **Backend:**
  - Next.js Server Actions (API endpoints)
  - PostgreSQL (database)
  - Node-Postgres (database client)

- **Development:**
  - ESLint (code linting)
  - Docker (containerization)
  - GitHub Codespaces (development environment)

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Docker and Docker Compose (for database)

### Environment Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/10p2.git
cd 10p2
```

2. Install dependencies:
```bash
cd frontend
npm install
# or
yarn install
```

3. Configure environment variables:
```bash
# Copy the example env file
cp .env.example .env.local

# Edit the .env.local file with your settings
# Example:
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=focusapp
# DB_USER=focususer
# DB_PASSWORD=yourpassword
```

## 🗄️ Database Setup

The application uses PostgreSQL running in Docker for data persistence. The database schema is automatically applied when the container is first created.

1. Start the database:
```bash
cd frontend
docker-compose up -d
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

## 🏃‍♂️ Running the Application

1. Start the development server:
```bash
cd frontend
npm run dev
# or
yarn dev
```

2. Access the application at http://localhost:3000

## 📱 Using the Application

### Timer Controls

The app features a dual timer system:

- **Focus Timer**: Tracks your work sessions
  - Start/Pause: Control your focus session
  - Reset: Clear the current focus timer
  
- **Break Timer**: Manages your break time
  - Start Break: Use earned break time
  - End Break: End your break early
  - Reset: Clear available break time

### Task Management

- **Adding Tasks**: Enter task details in the input field and press Enter or click Add
- **Completing Tasks**: Click the checkbox or the Complete button
- **Setting Focus**: Drag a task to the Focus area or click the Focus button
- **Reordering**: Drag tasks to reorder them in the list
- **Filtering**: Use the tabs to filter by All, Active, or Completed tasks
- **Searching**: Use Ctrl+K to search for tasks

### Keyboard Shortcuts

- `Ctrl+K`: Open search
- `Ctrl+N`: Focus on new task input
- `Ctrl+Z`: Undo last action
- `Space`: Toggle task selection
- `Escape`: Close dialogs/search

## 🗃️ Database Management

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

### Database Schema

The application uses the following schema:

#### Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### Tasks Table
```sql
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    priority VARCHAR(20),
    due_date TIMESTAMP WITH TIME ZONE,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE
);
```

#### Sessions Table
```sql
CREATE TABLE sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    work_duration INTEGER NOT NULL, -- in seconds
    break_duration INTEGER NOT NULL, -- in seconds
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## 📂 Project Structure

```
10p2/
├── frontend/               # Next.js application
│   ├── app/                # Next.js app directory
│   │   ├── actions.js      # Server actions
│   │   ├── api/            # API routes
│   │   ├── globals.css     # Global CSS
│   │   ├── layout.js       # Root layout
│   │   └── page.js         # Home page
│   ├── components/         # React components
│   │   ├── layout/         # Layout components
│   │   ├── main/           # Main application components
│   │   │   ├── background/ # Background components
│   │   │   ├── tasks/      # Task components
│   │   │   └── timer/      # Timer components
│   │   └── ui/             # UI components (buttons, cards, etc.)
│   ├── db/                 # Database connection and data access
│   │   ├── db.js           # Database connection setup
│   │   ├── schema.sql      # SQL schema definition
│   │   ├── sessionDb.js    # Session data access
│   │   └── taskDb.js       # Task data access
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   ├── provider/           # Context providers
│   ├── public/             # Static assets
│   ├── .env.local          # Environment variables
│   ├── docker-compose.yml  # Docker configuration
│   ├── next.config.mjs     # Next.js configuration
│   └── package.json        # Dependencies and scripts
└── README.md               # Project documentation
```

## 🔧 Development Guidelines

### Code Style

- Follow the ESLint configuration
- Use server actions for data mutations
- Keep components small and focused
- Use hooks for shared logic
- Document complex functions with JSDoc comments

### Adding New Features

1. Create components in the appropriate directory
2. Update hooks if needed
3. Add server actions for data persistence
4. Update tests
5. Document in this README

## ❓ Troubleshooting

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

4. Try connecting directly to the database:
```bash
docker exec -it postgres-db psql -U focususer -d focusapp
```

### Schema Not Initialized

If tables don't exist:

```bash
# Verify schema initialization
docker exec -it postgres-db psql -U focususer -d focusapp -c "\d"

# Manually run schema if needed
cat db/schema.sql | docker exec -i postgres-db psql -U focususer -d focusapp
```

### Common Issues and Solutions

| Issue | Solution |
|-------|----------|
| Tasks not saving | Check database connection and localStorage |
| Timer not working | Clear browser cache and reload |
| Components not draggable | Ensure the drag handle is being used |
| Background not changing | Check if theme is properly set |
| User preferences lost | Check localStorage permissions |

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Open a Pull Request

### Contribution Guidelines

- Write clear, commented code
- Add tests for new features
- Update documentation
- Follow the existing code style

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📬 Contact

For questions or support, please open an issue on this repository.

---

<div align="center">
  Made with ❤️ by the 10p2 Team
</div>