import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { checkApiHealth } from '../api/taskApi';

const HomePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [apiConnected, setApiConnected] = useState(false);

  useEffect(() => {
    // Check API health first
    checkApiHealth()
      .then(() => {
        setApiConnected(true);
        setLoading(false);
      })
      .catch(err => {
        console.error('API health check failed:', err);
        setApiConnected(false);
        setError('Could not connect to the backend server. Please make sure it is running.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (!apiConnected) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>Backend Connection Error</Alert.Heading>
          <p>{error}</p>
          <hr />
          <p className="mb-0">
            To start the backend, open a terminal and run the following commands:
          </p>
          <pre className="mt-2 bg-light p-3 rounded text-dark">
            cd ../
            mvn spring-boot:run
          </pre>
          <div className="mt-3">
            <Button 
              variant="primary" 
              onClick={() => window.location.reload()}
            >
              Retry Connection
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <div className="text-center mb-5">
        <h1>Task Management System</h1>
        <p className="lead">A simple and effective way to manage your tasks</p>
      </div>
      
      {error && (
        <Alert variant="warning" className="mb-4">
          {error}
        </Alert>
      )}
      
      <Row className="mb-4 g-4">
        <Col md={6}>
          <Card className="h-100 shadow-sm border-0">
            <Card.Body>
              <h4>Manage Tasks</h4>
              <p>View and update all your tasks in one place.</p>
              <div className="d-grid">
                <Button 
                  variant="primary" 
                  onClick={() => {
                    console.log('Navigating to tasks page');
                    navigate('/tasks');
                  }}
                >
                  Go to Tasks
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="h-100 shadow-sm border-0">
            <Card.Body>
              <h4>Create New Task</h4>
              <p>Add a new task to your list.</p>
              <div className="d-grid">
                <Button 
                  variant="primary" 
                  onClick={() => navigate('/tasks/new')}
                >
                  Create Task
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <div className="text-center mt-5">
        <p className="text-muted">
          Task Management System
        </p>
      </div>
    </Container>
  );
};

export default HomePage; 