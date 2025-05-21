import { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Table, 
  Form, 
  Button, 
  InputGroup,
  Card,
  Alert,
  Spinner
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import TaskItem from './TaskItem';
import taskService from '../services/taskService';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Search filters
  const [searchTitle, setSearchTitle] = useState('');
  const [searchStatus, setSearchStatus] = useState('');
  
  const navigate = useNavigate();
  
  // Initial data loading
  useEffect(() => {
    loadTasks();
  }, []);
  
  // Load tasks from API
  const loadTasks = async () => {
    setLoading(true);
    setError('');
    
    try {
      console.log('Loading all tasks');
      const tasks = await taskService.getAllTasks();
      console.log('Tasks loaded:', tasks);
      setTasks(tasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
      setError('Failed to load tasks. Please make sure the backend server is running.');
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle task deletion
  const handleDelete = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }
    
    try {
      await taskService.deleteTask(taskId);
      toast.success('Task deleted successfully');
      loadTasks(); // Reload tasks after deletion
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    }
  };
  
  // Handle task completion
  const handleComplete = async (taskId) => {
    try {
      await taskService.markTaskCompleted(taskId);
      toast.success('Task marked as completed');
      loadTasks(); // Reload tasks after status change
    } catch (error) {
      console.error('Error completing task:', error);
      toast.error('Failed to complete task');
    }
  };
  
  // Handle task reopening
  const handlePending = async (taskId) => {
    try {
      await taskService.markTaskPending(taskId);
      toast.success('Task reopened');
      loadTasks(); // Reload tasks after status change
    } catch (error) {
      console.error('Error marking task as pending:', error);
      toast.error('Failed to reopen task');
    }
  };
  
  // Handle viewing task details
  const handleView = (taskId) => {
    navigate(`/tasks/${taskId}`);
  };
  
  // Handle search form submission
  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Create search filters object
      const filters = {};
      
      // Only add title if it's not empty
      if (searchTitle && searchTitle.trim() !== '') {
        filters.title = searchTitle.trim();
        console.log('Searching for title containing:', filters.title);
      } else {
        console.log('No title filter applied');
      }
      
      // Only add status if it's not empty (when Any Status is selected, status is empty)
      if (searchStatus && searchStatus.trim() !== '') {
        filters.status = searchStatus.trim();
        console.log('Filtering by status:', filters.status);
      } else {
        console.log('No status filter applied (showing all statuses)');
      }
      
      console.log('Searching with filters:', filters);
      const filteredTasks = await taskService.searchTasks(filters);
      console.log('Search results:', filteredTasks);
      
      if (filteredTasks.length === 0) {
        console.log('No tasks found matching the search criteria');
        toast.info('No tasks found matching your search criteria');
      } else {
        console.log(`Found ${filteredTasks.length} task(s) matching search criteria`);
        toast.success(`Found ${filteredTasks.length} task(s)`);
      }
      
      setTasks(filteredTasks);
    } catch (error) {
      console.error('Search failed:', error);
      setError(`Failed to search tasks: ${error.message}`);
      toast.error('Failed to search tasks');
    } finally {
      setLoading(false);
    }
  };
  
  // Search diagnostic tool - this makes a direct server call bypassing the service layer
  const runSearchDiagnostic = async () => {
    try {
      console.log('Running search diagnostic with title:', searchTitle);
      setLoading(true);
      
      // Construct the direct API URL
      const baseUrl = 'http://localhost:9090/api/tasks/search-debug';
      const url = searchTitle 
        ? `${baseUrl}?title=${encodeURIComponent(searchTitle.trim())}` 
        : baseUrl;
      
      console.log('Diagnostic URL:', url);
      
      // Make a direct fetch call
      const response = await fetch(url);
      const data = await response.json();
      
      // Display results in a clear way
      console.log('Search diagnostic results:', data);
      
      // Show a summary of results as a toast
      if (data.raw_count > 0) {
        toast.success(`Diagnostic found ${data.raw_count} raw results and ${data.service_count} service results`);
        setTasks(data.service_results);
      } else {
        toast.info('Diagnostic found no results. Check console for details.');
      }
    } catch (error) {
      console.error('Diagnostic failed:', error);
      toast.error(`Diagnostic error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Clear search filters
  const handleClearSearch = () => {
    setSearchTitle('');
    setSearchStatus('');
    console.log('Clearing search filters and loading all tasks');
    loadTasks();
    toast.info('Search filters cleared');
  };

  return (
    <Container className="py-4">
      <Card className="shadow-sm">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="mb-0">Task Management</h3>
            <Button 
              variant="primary" 
              onClick={() => navigate('/tasks/new')}
            >
              + Add New Task
            </Button>
          </div>
          
          {/* Search Form */}
          <Card className="mb-4 bg-light">
            <Card.Body>
              <Form onSubmit={handleSearch}>
                <Row className="g-2">
                  <Col md={5}>
                    <Form.Group>
                      <Form.Label>Task Title</Form.Label>
                      <InputGroup>
                        <Form.Control 
                          placeholder="Search by title"
                          value={searchTitle}
                          onChange={(e) => setSearchTitle(e.target.value)}
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Status</Form.Label>
                      <Form.Select 
                        value={searchStatus}
                        onChange={(e) => setSearchStatus(e.target.value)}
                      >
                        <option value="">Any Status</option>
                        <option value="TODO">To Do</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="DONE">Done</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={4} className="d-flex align-items-end">
                    <Button type="submit" variant="primary" className="me-2">
                      Search
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline-secondary" 
                      onClick={handleClearSearch}
                      className="me-2"
                    >
                      Clear
                    </Button>
                    <Button 
                      type="button"
                      variant="outline-info"
                      onClick={runSearchDiagnostic}
                      title="Run a diagnostic search directly against the server"
                    >
                      Diagnose
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
          
          {/* Error Alert */}
          {error && (
            <Alert variant="danger" className="mb-4">
              {error}
            </Alert>
          )}
          
          {/* Loading Indicator */}
          {loading && (
            <div className="text-center my-4">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          )}
          
          {/* Tasks Table */}
          {!loading && tasks.length > 0 && (
            <Table striped bordered hover responsive>
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Due Date</th>
                  <th>Created By</th>
                  <th>Created On</th>
                  <th>Last Updated By</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map(task => (
                  <TaskItem 
                    key={task.id}
                    task={task}
                    onEdit={(id) => navigate(`/tasks/edit/${id}`)}
                    onDelete={handleDelete}
                    onComplete={handleComplete}
                    onPending={handlePending}
                    onView={handleView}
                  />
                ))}
              </tbody>
            </Table>
          )}
          
          {/* Empty State */}
          {!loading && tasks.length === 0 && (
            <div className="text-center my-5 py-5">
              <p className="text-muted mb-3">No tasks found</p>
              <Button 
                variant="primary" 
                onClick={() => navigate('/tasks/new')}
              >
                Create your first task
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default TaskList; 