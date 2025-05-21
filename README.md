# Task Management System - Backend

## 1. Overview

This is a RESTful API backend for a Task Management System built with Spring Boot. The system allows users to create, read, update, and delete tasks. Each task has properties such as title, description, due date, status, and remarks. The system tracks who created and last updated each task.

The backend provides endpoints for:
- Creating new tasks
- Getting a list of all tasks
- Searching tasks by title and/or status
- Getting details of a specific task
- Updating task information
- Deleting tasks
- Marking tasks as completed or pending

## 2. Database Design

### 2.1 ER Diagram

```
+-----------------+
|      Task       |
+-----------------+
| id              | PK
| title           |
| description     |
| due_date        |
| status          |
| remarks         |
| created_on      |
| created_by      |
| last_updated_on |
| last_updated_by |
+-----------------+
```

### 2.2 Data Dictionary

#### Task Table

| Column         | Type           | Constraints     | Description                                    |
|----------------|----------------|-----------------|------------------------------------------------|
| id             | BIGINT         | PK, AUTO_INC    | Unique identifier for the task                 |
| title          | VARCHAR(255)   | NOT NULL        | Title of the task                              |
| description    | VARCHAR(1000)  |                 | Detailed description of the task               |
| due_date       | DATETIME       |                 | Due date for the task                          |
| status         | VARCHAR(255)   | NOT NULL        | Current status of the task (TODO, IN_PROGRESS, DONE) |
| remarks        | VARCHAR(500)   |                 | Additional remarks about the task              |
| created_on     | DATETIME       | NOT NULL        | Timestamp when the task was created            |
| created_by     | VARCHAR(255)   | NOT NULL        | Name of person who created the task            |
| last_updated_on| DATETIME       | NOT NULL        | Timestamp when the task was last updated       |
| last_updated_by| VARCHAR(255)   | NOT NULL        | Name of person who last updated the task       |

### 2.3 Indexes

| Index Name           | Table | Columns                    | Type    | Purpose                                   |
|----------------------|-------|----------------------------|---------|-------------------------------------------|
| PRIMARY              | Task  | id                         | PRIMARY | Unique identifier for quick lookup        |
| title_index          | Task  | title                      | INDEX   | For faster searching by title             |
| status_index         | Task  | status                     | INDEX   | For faster filtering by status            |
| created_on_index     | Task  | created_on                 | INDEX   | For sorting by creation date              |
| last_updated_on_index| Task  | last_updated_on            | INDEX   | For sorting by last update date           |

### 2.4 Code-first vs DB-first Approach

This project uses a code-first approach with Hibernate's automatic schema generation. This approach was chosen because:

1. **Development Speed**: It allows for faster development as the database schema is automatically generated from the entity classes.
2. **Version Control**: Changes to data models are tracked in version control alongside code changes.
3. **Consistency**: Ensures that the database schema always matches the current entity model.
4. **Migration Support**: Spring Boot and Hibernate provide tools for database migrations when entity models change.

## 3. Structure of the Application

This is a RESTful API backend that serves as a data source for frontend applications. It follows a standard layered architecture:

### 3.1 Architectural Approach

The application follows a standard MVC architecture:

1. **Controller Layer**: Handles HTTP requests and responses
2. **Service Layer**: Contains business logic
3. **Repository Layer**: Interfaces with the database
4. **Model Layer**: Represents data entities
5. **DTO Layer**: Data Transfer Objects for API communication
6. **Mapper Layer**: Converts between entity and DTO objects
7. **Exception Layer**: Custom exception handling

### 3.2 Key Components

#### 3.2.1 Controllers
- `TaskController`: Handles all task-related endpoints

#### 3.2.2 Services
- `TaskService`: Interface defining task operations
- `TaskServiceImpl`: Implementation of task business logic

#### 3.2.3 Repositories
- `TaskRepository`: JPA repository for database operations

#### 3.2.4 Models
- `Task`: JPA entity representing a task

#### 3.2.5 DTOs
- `TaskDTO`: Data Transfer Object for task information

#### 3.2.6 Mappers
- `TaskMapper`: Converts between Task entity and TaskDTO

#### 3.2.7 Exception Handling
- `GlobalExceptionHandler`: Central exception handler
- `ResourceNotFoundException`: Custom exception for missing resources
- `ValidationException`: Custom exception for validation errors

## 4. Build and Install

### 4.1 Environment Details and Dependencies

- **Java**: JDK 17 or higher
- **Build Tool**: Maven 3.8.x or higher
- **Database**: MySQL 8.0 or higher
- **Spring Boot**: 3.2.x
- **Dependencies**:
  - Spring Web
  - Spring Data JPA
  - Spring Validation
  - MySQL Connector
  - Lombok (optional)

### 4.2 Build Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/Task-Management-System.git
   cd Task-Management-System
   ```

2. Configure database connection in `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/task_management?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

3. Build the project using Maven:
   ```bash
   ./mvnw clean package
   ```

### 4.3 Run Instructions

1. Start the application:
   ```bash
   ./mvnw spring-boot:run
   ```

2. The API will be available at `http://localhost:9090`

3. API Endpoints:
   - `GET /api/tasks`: Get all tasks
   - `GET /api/tasks/{id}`: Get task by ID
   - `POST /api/tasks`: Create a new task
   - `PUT /api/tasks/{id}`: Update a task
   - `DELETE /api/tasks/{id}`: Delete a task
   - `PUT /api/tasks/{id}/complete`: Mark a task as completed
   - `PUT /api/tasks/{id}/pending`: Mark a task as pending
   - `GET /api/tasks/search?title=...&status=...`: Search tasks by title and/or status

## 5. Additional Documentation

### 5.1 API Request/Response Examples

#### Creating a Task

Request:
```http
POST /api/tasks
Content-Type: application/json

{
  "title": "Complete project documentation",
  "description": "Create comprehensive documentation for the Task Management System",
  "status": "TODO",
  "dueDate": "2023-12-31T18:00:00",
  "remarks": "Include API documentation and examples",
  "createdBy": "John Doe"
}
```

Response:
```json
{
  "id": 1,
  "title": "Complete project documentation",
  "description": "Create comprehensive documentation for the Task Management System",
  "status": "TODO",
  "dueDate": "2023-12-31T18:00:00",
  "remarks": "Include API documentation and examples",
  "createdBy": "John Doe",
  "lastUpdatedBy": "John Doe",
  "createdOn": "2023-05-21T10:15:30",
  "lastUpdatedOn": "2023-05-21T10:15:30"
}
```

### 5.2 Error Handling

The API returns appropriate HTTP status codes and error messages:

- `400 Bad Request`: Invalid input data
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server-side errors

Error responses include a message explaining the error. 
