import { useState, useEffect } from 'react';
import {
  Form,
  Button,
  Container,
  Card,
  Row,
  Col,
  Alert,
  Spinner
} from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import taskService from '../services/taskService';
import { fetchTaskById } from '../api/taskApi';
import { formatForDateTimeInput } from '../utils/dateUtils';

const TaskForm = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  // Form state
  const [task, setTask] = useState({
    title: '',
    description: '',
    status: 'TODO',
    dueDate: '',
    remarks: ''
  });
  
  // UI state
  const [createdBy, setCreatedBy] = useState('Company Admin'); // Creator name
  const [lastUpdatedBy, setLastUpdatedBy] = useState(''); // Updater name
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Load task data if in edit mode
  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      fetchTaskById(id)
        .then(response => {
          const taskData = response.data;
          
          // Format date for datetime-local input
          if (taskData.dueDate) {
            taskData.dueDate = formatForDateTimeInput(taskData.dueDate);
          }
          
          setTask(taskData);
          
          // Set updater name for editing 
          setLastUpdatedBy(taskData.lastUpdatedBy || 'System Update');
          
          // For display purposes only
          if (taskData.createdBy) {
            setCreatedBy(taskData.createdBy);
          }
        })
        .catch(() => {
          setError('Failed to load task data. Please try again.');
          toast.error('Could not load task data');
        })
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask(prev => ({ ...prev, [name]: value }));
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setError('');
    
    try {
      // Validate title
      if (!task.title || !task.title.trim()) {
        setError('Task title is required');
        return;
      }
      
      setSubmitting(true);
      
      if (isEdit) {
        // Update existing task
        const taskData = {
          id: task.id,
          title: task.title.trim(),
          description: task.description || '',
          status: task.status || 'TODO',
          dueDate: task.dueDate || null,
          remarks: task.remarks || '',
          lastUpdatedBy: lastUpdatedBy || 'System Update'
        };
        
        try {
          await taskService.updateTask(id, taskData);
          toast.success('Task updated successfully');
          navigate('/tasks');
        } catch (updateError) {
          let errorMessage = 'Failed to update task: ';
          if (updateError.response && updateError.response.data) {
            errorMessage += typeof updateError.response.data === 'string' 
              ? updateError.response.data 
              : JSON.stringify(updateError.response.data);
          } else {
            errorMessage += updateError.message || 'Unknown error';
          }
          
          setError(errorMessage);
          toast.error('Failed to update task');
        }
        
        return;
      }
      
      // For new task creation
      const taskData = {
        ...task,
        title: task.title.trim(),
        createdBy,
        lastUpdatedBy: createdBy // initially same as creator
      };
      
      if (taskData.dueDate) {
        if (!taskData.dueDate.trim()) {
          taskData.dueDate = null;
        }
      }
      
      await taskService.createTask(taskData);
      toast.success('Task created successfully');
      navigate('/tasks');
      
    } catch (err) {
      setError(`Failed to save task: ${err.message || 'Unknown error. Please try again.'}`);
      toast.error('Failed to save task');
    } finally {
      setSubmitting(false);
    }
  };

  // Cancel handling
  const handleCancel = () => {
    navigate('/tasks');
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-sm">
            <Card.Body className="p-4">
              <h3 className="text-center mb-4">
                {isEdit ? 'Edit Task' : 'Create New Task'}
              </h3>
              
              {error && (
                <Alert variant="danger" className="mb-4">
                  {error}
                </Alert>
              )}
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Task Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={task.title}
                    onChange={handleChange}
                    required
                    placeholder="Enter task title"
                    disabled={submitting}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select 
                    name="status" 
                    value={task.status} 
                    onChange={handleChange}
                    disabled={submitting}
                  >
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="DONE">Done</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="description"
                    rows={3}
                    value={task.description || ''}
                    onChange={handleChange}
                    placeholder="Describe the task"
                    disabled={submitting}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Due Date</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="dueDate"
                    value={task.dueDate || ''}
                    onChange={handleChange}
                    disabled={submitting}
                  />
                </Form.Group>

                <hr className="my-4" />
                <h5 className="mb-3">Task Responsibility</h5>
                
                {!isEdit && (
                  <Form.Group className="mb-3">
                    <Form.Label><strong>Created By (Company/Manager)</strong></Form.Label>
                    <Form.Control
                      type="text"
                      value={createdBy}
                      onChange={(e) => setCreatedBy(e.target.value)}
                      placeholder="Enter creator name (e.g., Company, Admin, Manager)"
                      disabled={submitting}
                    />
                    <Form.Text className="text-muted">
                      The person or organization that created this task
                    </Form.Text>
                  </Form.Group>
                )}
                
                {isEdit && (
                  <Form.Group className="mb-3">
                    <Form.Label><strong>Updated By</strong></Form.Label>
                    <Form.Control
                      type="text"
                      value={lastUpdatedBy}
                      onChange={(e) => setLastUpdatedBy(e.target.value)}
                      placeholder="Enter your name to track who updated this task"
                      disabled={submitting}
                    />
                    <Form.Text className="text-muted">
                      The person who is making this update
                    </Form.Text>
                  </Form.Group>
                )}

                <Form.Group className="mb-3">
                  <Form.Label>Remarks</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="remarks"
                    rows={2}
                    value={task.remarks || ''}
                    onChange={handleChange}
                    placeholder="Any additional comments"
                    disabled={submitting}
                  />
                </Form.Group>
                
                <div className="d-flex justify-content-between mt-4">
                  <Button 
                    variant="outline-secondary" 
                    onClick={handleCancel}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="primary" 
                    type="submit"
                    disabled={submitting}
                  >
                    {submitting ? 'Saving...' : (isEdit ? 'Update Task' : 'Create Task')}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default TaskForm; 