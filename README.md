# Task Management System

A comprehensive task management application with a Spring Boot backend and React frontend.

## Project Structure

This project is divided into two main parts:

1. [Backend (Spring Boot)](backend-README.md) - RESTful API for task management
2. [Frontend (React)](task-manager-frontend/frontend-README.md) - Single Page Application for user interface

## Overview

The Task Management System is a web application that allows users to create, view, update, and manage tasks. It provides a clean and intuitive interface for task tracking with features like searching, filtering, and status management.

### Key Features

- Create and manage tasks with detailed information
- Search and filter tasks by title and status
- View task details including creation and update history
- Mark tasks as complete or reopen them as needed
- Responsive design for desktop and mobile use

## Quick Start

### Prerequisites

- Java 17 or higher
- Node.js 16 or higher
- MySQL 8.0 or higher
- Maven 3.8 or higher

### Starting the Backend

1. Navigate to the root directory
2. Configure database connection in `src/main/resources/application.properties`
3. Run the Spring Boot application:
   ```bash
   ./mvnw spring-boot:run
   ```
4. Backend will be available at `http://localhost:9090`

### Starting the Frontend

1. Navigate to the frontend directory:
   ```bash
   cd task-manager-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Frontend will be available at `http://localhost:5173`

## Documentation

For detailed documentation, please refer to:
- [Backend Documentation](backend-README.md)
- [Frontend Documentation](task-manager-frontend/frontend-README.md)

## Technologies Used

### Backend
- Spring Boot
- Spring Data JPA
- MySQL
- Hibernate
- Maven

### Frontend
- React
- React Router
- React Bootstrap
- Axios
- Vite

## Screenshots

(Placeholder for screenshots of the application)

## License

This project is available under the MIT License.
