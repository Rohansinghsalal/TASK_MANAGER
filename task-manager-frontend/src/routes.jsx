import { Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import TaskDetailsPage from './pages/TaskDetailsPage.jsx';
import TaskList from './components/TaskList.jsx';
import TaskForm from './components/TaskForm.jsx';

/**
 * Application routes configuration
 */
const routes = [
  {
    path: '/',
    element: <HomePage />
  },
  {
    path: '/tasks',
    element: <TaskList />
  },
  {
    path: '/tasks/:id',
    element: <TaskDetailsPage />
  },
  {
    path: '/tasks/new',
    element: <TaskForm />
  },
  {
    path: '/tasks/edit/:id',
    element: <TaskForm />
  },
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
];

export default routes; 