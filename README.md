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
- **Data Persistence** - Your sessions and tasks are saved automatically
- **Dark/Light Mode** - Interface adapts to your preferred viewing mode
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- **Distraction Blocking** - Optional features to minimize interruptions
- **Session Analytics** - Track your productivity patterns over time

## 🚀 Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm or yarn
- Docker (for local development with databases)

### Installation Options

You can set up the 10p2 application in several ways depending on your needs:

#### Option 1: Simple Local Development

```bash
# Clone the repository
git clone https://github.com/yourusername/10p2.git
cd 10p2

# Install frontend dependencies
cd frontend
npm install

# Start the development server
npm run dev
```

Then open your browser to: `http://localhost:3000`

#### Option 2: Docker Compose (Frontend + DynamoDB)

The simplest way to run the full stack locally is using Docker Compose:

```bash
cd 10p2
docker-compose up -d
```

This will start:
- Frontend application on http://localhost:3000
- DynamoDB local on port 8000

#### Option 3: Local DynamoDB Setup

If you want to run the app with Node.js locally but use Docker for DynamoDB:

```bash
# Start DynamoDB local
docker run -p 8000:8000 amazon/dynamodb-local

# In a separate terminal, create the required table
cd frontend/db
node createTable.cjs

# Start the frontend
cd frontend
npm run dev
```

## 🏗️ Architecture

### Frontend Architecture

The 10p2 frontend is built with:

- **Next.js 14** - React framework with server components and app router
- **React** - UI library with hooks for state management
- **TailwindCSS** - Utility-first CSS framework
- **Shadcn UI** - Reusable component library
- **DND Kit** - Drag and drop functionality for task management
- **Framer Motion** - Animations and transitions

Key components include:

- **Timer System** - Dual timers with state synchronization
- **Task Management** - Create, update, delete, and reorder tasks
- **Settings Panel** - User preferences and timer configuration
- **Analytics Dashboard** - Visualizations of productivity data
- **User Authentication** - User profiles and data persistence

### Data Model

The application uses a single-table DynamoDB design with the following entities:

- **Users** - User profiles and preferences
- **Sessions** - Focus and break session records
- **Tasks** - User tasks with status tracking
- **Settings** - User configuration options

## 🧪 Deployment Options

### Current Working Deployments

#### 1. Docker Compose

The Docker Compose setup provides a complete local development environment:

```yaml
services:
  frontend:
    depends_on:
      - dynamodb-local
    build:
      context: ./frontend
      dockerfile: Dockerfile
    env_file:
      - ./frontend/.env.local
    ports:
      - "3000:3000"
    volumes:
      - ./frontend:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
      - DYNAMODB_ENDPOINT=http://dynamodb-local:8000

  dynamodb-local:
    image: "amazon/dynamodb-local:latest"
    container_name: dynamodb-local
    ports:
      - "8000:8000"
```

#### 2. DynamoDB Local Setup

Test your DynamoDB connection:

```bash
cd frontend/db
node testConnection.cjs
```

Create required tables:

```bash
cd frontend/db
node createTable.cjs
```

### In-Progress Deployments

#### 1. LocalStack (AWS Services Locally)

LocalStack allows us to simulate AWS services locally. The setup is in progress:

```bash
# Start LocalStack with Docker Compose
cd localstack
docker-compose up -d
```

Current status:
- ✅ Basic container setup
- ✅ DynamoDB service configuration
- ❌ Integration with frontend
- ❌ Automated table creation scripts

**TODO:**
- Complete environment variable setup for LocalStack endpoints
- Create initialization scripts for DynamoDB tables
- Add sample data seeding capabilities
- Document IAM policy simulation

#### 2. Kubernetes with Minikube

Local Kubernetes deployment with Minikube is in progress:

```bash
# Start Minikube
minikube start

# Apply Kubernetes manifests
kubectl apply -f kube/overlays/dev/
```

Current status:
- ✅ Basic deployment YAML files
- ✅ Kustomize overlays for environments
- ❌ Service meshes and networking
- ❌ Persistent volume configuration

**TODO:**
- Configure persistent volumes for DynamoDB data
- Implement Kubernetes secrets for environment variables
- Set up Ingress controllers
- Create deployment automation scripts

#### 3. Terraform Infrastructure

Terraform configuration for AWS deployment is in development:

```bash
# Initialize Terraform
cd terraform/localstack-dynamodb
terraform init

# Apply configuration
terraform apply
```

Current status:
- ✅ Basic resource definitions
- ✅ LocalStack integration for testing
- ❌ Complete AWS resource definitions
- ❌ CI/CD pipeline integration

**TODO:**
- Define complete AWS infrastructure
- Create modules for reusable components
- Implement state management
- Configure remote backend for state storage

## 🔮 Future Development Roadmap

### Near-term Goals

1. **Complete Infrastructure Setup**
   - Finish LocalStack integration for AWS service simulation
   - Complete Kubernetes deployment configuration
   - Finalize Terraform infrastructure as code

2. **Enhanced Features**
   - Multi-user support with profiles
   - Team collaboration features
   - Integration with calendar apps
   - Mobile application development

3. **Performance & Testing**
   - Implement comprehensive test suite
   - Performance optimization
   - Accessibility audits and improvements

### Long-term Vision

1. **Machine Learning Integration**
   - Personalized focus/break recommendations
   - Productivity pattern analysis
   - Predictive task scheduling

2. **Enterprise Features**
   - Team management dashboard
   - Organization-wide analytics
   - SSO integration
   - Custom branding options

3. **Ecosystem Expansion**
   - Browser extension
   - Desktop application
   - API for third-party integrations

## 📝 Testing

### Running Frontend Tests

```bash
cd frontend
npm test
```

### Testing Database Connections

```bash
cd frontend/db
node testConnection.cjs
```

### Testing LocalStack

```bash
cd localstack
./test-localstack.sh
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.