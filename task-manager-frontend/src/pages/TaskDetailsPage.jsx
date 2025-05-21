import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {   Container,   Card,   Row,  Col,   Button,   Badge,   Spinner,   Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { fetchTaskById, completeTask, pendingTask } from '../api/taskApi';
import { formatDate } from '../utils/dateUtils';

const TaskDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  
  // Load task data on component mount
  useEffect(() => {
    loadTaskDetails();
  }, [id]);
  
  // Fetch task details from API
  const loadTaskDetails = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetchTaskById(id);
      setTask(response.data);
    } catch (err) {
      console.error('Error loading task details:', err);
      setError('Failed to load task details. Please try again.');
      toast.error('Could not load task details');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle task completion
  const handleCompleteTask = async () => {
    setActionLoading(true);
    
    try {
      const response = await completeTask(id);
      setTask(response.data);
      toast.success('Task marked as completed');
    } catch (err) {
      console.error('Error completing task:', err);
      toast.error('Failed to complete task');
    } finally {
      setActionLoading(false);
    }
  };
  
  // Handle reopening task
  const handleReopenTask = async () => {
    setActionLoading(true);
    
    try {
      const response = await pendingTask(id);
      setTask(response.data);
      toast.success('Task reopened');
    } catch (err) {
      console.error('Error reopening task:', err);
      toast.error('Failed to reopen task');
    } finally {
      setActionLoading(false);
    }
  };
  
  // Navigate to edit page
  const handleEdit = () => {
    navigate(`/tasks/edit/${id}`);
  };
  
  // Go back to task list
  const handleBackToList = () => {
    navigate('/tasks');
  };
  
  // Get status badge based on status value
  const getStatusBadge = (status) => {
    switch (status) {
      case 'TODO':
        return <Badge bg="secondary">To Do</Badge>;
      case 'IN_PROGRESS':
        return <Badge bg="primary">In Progress</Badge>;
      case 'DONE':
        return <Badge bg="success">Done</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };
  
  // Loading state
  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }
  
  // Error state
  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          {error}
          <div className="mt-3">
            <Button variant="primary" onClick={loadTaskDetails}>Try Again</Button>{' '}
            <Button variant="outline-secondary" onClick={handleBackToList}>Back to Tasks</Button>
          </div>
        </Alert>
      </Container>
    );
  }
  
  // No task found state
  if (!task) {
    return (
      <Container className="py-5">
        <Alert variant="warning">
          Task not found.
          <div className="mt-3">
            <Button variant="outline-secondary" onClick={handleBackToList}>Back to Tasks</Button>
          </div>
        </Alert>
      </Container>
    );
  }
  
  return (
    <Container className="py-4">
      <div className="mb-4">
        <Button variant="outline-secondary" onClick={handleBackToList}>
          &larr; Back to Tasks
        </Button>
      </div>
      
      <Card className="shadow-sm">
        <Card.Header className="bg-white py-3">
          <div className="d-flex justify-content-between align-items-center">
            <h3 className="mb-0">{task.title}</h3>
            <div>
              {getStatusBadge(task.status)}
            </div>
          </div>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={8}>
              {/* Description section */}
              <h5>Description</h5>
              <p className="mb-4">{task.description || 'No description provided'}</p>
              
              {/* Remarks section */}
              {task.remarks && (
                <>
                  <h5>Remarks</h5>
                  <p className="mb-4">{task.remarks}</p>
                </>
              )}
            </Col>
            <Col md={4}>
              {/* Task details */}
              <Card className="bg-light">
                <Card.Body>
                  <h5>Details</h5>
                  <dl className="row mb-0">
                    
                    <dt className="col-sm-5">Due Date</dt>
                    <dd className="col-sm-7">{formatDate(task.dueDate, true) || 'N/A'}</dd>
                    
                    <dt className="col-sm-5">Created By</dt>
                    <dd className="col-sm-7">{task.createdBy || 'N/A'}</dd>
                    
                    <dt className="col-sm-5">Created On</dt>
                    <dd className="col-sm-7">{formatDate(task.createdOn, true) || 'N/A'}</dd>
                    
                    <dt className="col-sm-5">Last Updated</dt>
                    <dd className="col-sm-7">{formatDate(task.lastUpdatedOn, true) || 'N/A'}</dd>
                    
                    <dt className="col-sm-5">Updated By</dt>
                    <dd className="col-sm-7">{task.lastUpdatedBy || 'N/A'}</dd>
                  </dl>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Card.Body>
        <Card.Footer className="bg-white">
          <div className="d-flex justify-content-end gap-2">
            <Button 
              variant="outline-primary" 
              onClick={handleEdit}
              disabled={actionLoading}
            >
              Edit Task
            </Button>
            
            {task.status !== 'DONE' ? (
              <Button 
                variant="outline-success" 
                onClick={handleCompleteTask}
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Completing...
                  </>
                ) : 'Mark as Complete'}
              </Button>
            ) : (
              <Button 
                variant="outline-warning" 
                onClick={handleReopenTask}
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Reopening...
                  </>
                ) : 'Reopen Task'}
              </Button>
            )}
          </div>
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default TaskDetailsPage; 