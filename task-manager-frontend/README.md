# Task Management System - Frontend

## 1. Overview

This is a modern, responsive web frontend for the Task Management System built with React. The application provides an intuitive interface for creating, viewing, updating, and managing tasks. Users can filter and search tasks based on various criteria, view task details, and change task statuses seamlessly.

The frontend offers the following key features:
- Task dashboard with a comprehensive list view
- Task creation and editing forms
- Task detail view
- Search and filtering capabilities
- Status management (mark as complete, reopen)
- Responsive design that works on desktop and mobile devices

## 2. Frontend Structure

### 2.1 Architectural Approach

This frontend is developed as a Single Page Application (SPA) using React. The SPA approach was chosen for the following reasons:

1. **Enhanced User Experience**: Provides a smoother, more responsive experience with minimal page reloads
2. **Reduced Server Load**: Only data is transferred, not entire pages
3. **Clean Separation of Concerns**: Frontend and backend are completely decoupled
4. **State Management**: Application state is maintained on the client side for improved performance

### 2.2 Key Components

The application follows a component-based architecture:

#### 2.2.1 Pages
- `HomePage.jsx`: Landing page showing the task list
- `TaskDetailsPage.jsx`: Detailed view of a single task

#### 2.2.2 Components
- `TaskList.jsx`: Displays a table of tasks with search and filter functionality
- `TaskItem.jsx`: Individual task row in the list with action buttons
- `TaskForm.jsx`: Form for creating and editing tasks
- `Navbar.jsx`: Navigation component

#### 2.2.3 Services and API
- `taskService.js`: Service layer that abstracts business logic
- `taskApi.js`: API client for communication with the backend

#### 2.2.4 Utilities
- `dateUtils.js`: Date formatting and manipulation utilities

### 2.3 State Management

The application uses React's built-in state management with hooks:
- `useState`: For component-level state
- `useEffect`: For side effects like data fetching
- `useNavigate` and `useParams`: For routing

### 2.4 Routing

React Router is used to handle navigation between different views without page reloads:
- `/`: Home page with task list
- `/tasks`: Task list view
- `/tasks/:id`: Task details view
- `/tasks/new`: Create new task form
- `/tasks/edit/:id`: Edit task form

## 3. Frontend Technologies

### 3.1 Core Technologies
- **React**: Primary UI library for building the component-based interface
- **React Router**: For client-side routing
- **React Bootstrap**: UI component library for responsive design
- **Axios**: HTTP client for API requests
- **React-Toastify**: For displaying notifications and alerts

### 3.2 Why These Technologies?

1. **React** was chosen for its:
    - Component-based architecture enabling reusable UI elements
    - Virtual DOM for optimal rendering performance
    - Strong community support and extensive ecosystem
    - Declarative programming model that simplifies development

2. **React Bootstrap** was selected because:
    - It provides a comprehensive set of accessible UI components
    - Ensures consistent styling across the application
    - Offers responsive design capabilities out of the box
    - Reduces development time with pre-built components

3. **Axios** was preferred for API communication due to:
    - Promise-based architecture
    - Request/response interceptors
    - Automatic JSON transformation
    - Browser and Node.js support
    - Easier error handling

## 4. Build and Install

### 4.1 Environment Details and Dependencies

- **Node.js**: v16.x or higher
- **npm**: v8.x or higher
- **Package Manager**: npm or yarn
- **Key Dependencies**:
    - React 18.x
    - React Router 6.x
    - React Bootstrap 2.x
    - Axios 1.x
    - React-Toastify 9.x

### 4.2 Build Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/Task-Management-System.git
   cd Task-Management-System/task-manager-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure API endpoint in `src/config.js`:
   ```javascript
   export default {
     api: {
       serverUrl: 'http://localhost:9090'
     }
   };
   ```

4. Build the project for production:
   ```bash
   npm run build
   ```

### 4.3 Run Instructions

1. For development mode with hot reloading:
   ```bash
   npm run dev
   ```

2. The development server will start at `http://localhost:5173` (or another port if 5173 is in use)

3. To serve the production build:
   ```bash
   npm run serve
   ```

## 5. Additional Documentation

### 5.1 User Guide

#### Creating a Task
1. Click the "+ Add New Task" button
2. Fill in the required information (Title, Status)
3. Add optional information (Description, Due Date, Remarks)
4. Enter your name in the "Created By" field
5. Click "Create Task"

#### Editing a Task
1. Find the task in the task list
2. Click the "Edit" button
3. Modify the task details
4. Enter your name in the "Updated By" field
5. Click "Update Task"

#### Completing a Task
1. Find the task in the task list
2. Click the "Complete" button to mark it as done
3. To reopen a completed task, click the "Reopen" button

#### Searching and Filtering
1. Use the search form at the top of the task list
2. Enter a search term in the "Task Title" field
3. Select a status from the dropdown (or leave as "Any Status")
4. Click "Search" to filter the list
5. Click "Clear" to reset the filters

### 5.2 Responsive Design

The application is designed to work on devices of all sizes:
- Desktop: Full table view with all columns
- Tablet: Responsive layout with adjusted column visibility
- Mobile: Optimized view with essential information

### 5.3 Accessibility Considerations

The application follows web accessibility guidelines:
- Proper HTML semantics with appropriate ARIA attributes
- Keyboard navigation support
- Sufficient color contrast
- Screen reader compatibility

### 5.4 Future Enhancements

Potential improvements for future versions:
1. Advanced filtering and sorting options
2. User authentication and personalized views
3. Task categorization and tagging
4. Task assignment to other users
5. Email notifications for approaching deadlines
6. Offline mode with local storage 