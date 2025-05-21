import { Button, Badge } from 'react-bootstrap';
import { formatDate } from '../utils/dateUtils';
import PropTypes from 'prop-types';

const TaskItem = ({ task, onEdit, onDelete, onComplete, onPending, onView }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'TODO':
        return <Badge bg="secondary">To Do</Badge>;
      case 'IN_PROGRESS':
        return <Badge bg="primary">In Progress</Badge>;
      case 'DONE':
        return <Badge bg="success">Done</Badge>;
      default:
        return <Badge bg="secondary">{status || 'Unknown'}</Badge>;
    }
  };

  return (
    <tr>
      <td>{task.id}</td>
      <td>{task.title}</td>
      <td>{getStatusBadge(task.status)}</td>
      <td>{formatDate(task.dueDate) || 'Not set'}</td>
      <td>
        <span className="fw-bold text-primary">
          {task.createdBy || 'System'}
        </span>
      </td>
      <td>{formatDate(task.createdOn, true) || 'Unknown'}</td>
      <td>
        <span className="fw-bold text-info">
          {task.lastUpdatedBy || 'System'}
        </span>
      </td>
      <td>
        <div className="d-flex gap-1">
          <Button size="sm" variant="outline-info" onClick={() => onView(task.id)}>
            View
          </Button>
          
          <Button size="sm" variant="outline-primary" onClick={() => onEdit(task.id)}>
            Edit
          </Button>
          
          {task.status !== 'DONE' && (
            <Button size="sm" variant="outline-success" onClick={() => onComplete(task.id)}>
              Complete
            </Button>
          )}
          
          {task.status === 'DONE' && (
            <Button size="sm" variant="outline-warning" onClick={() => onPending(task.id)}>
              Reopen
            </Button>
          )}
          
          <Button size="sm" variant="outline-danger" onClick={() => onDelete(task.id)}>
            Delete
          </Button>
        </div>
      </td>
    </tr>
  );
};

TaskItem.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    dueDate: PropTypes.string,
    createdBy: PropTypes.string,
    createdOn: PropTypes.string,
    lastUpdatedBy: PropTypes.string
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onComplete: PropTypes.func.isRequired,
  onPending: PropTypes.func.isRequired,
  onView: PropTypes.func.isRequired
};

export default TaskItem; 