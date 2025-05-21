
import { useState, useEffect } from 'react'
import { fetchTask } from '../api'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, Button } from 'react-bootstrap'

export default function TaskDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [task, setTask] = useState(null)

  useEffect(() => {
    fetchTask(id).then(res => setTask(res.data))
  }, [id])

  if (!task) return <p>Loading…</p>

  return (
    <Card className="m-4">
      <Card.Header>
        <h3>{task.title}</h3>
        <div className="float-end">
          <Button onClick={() => navigate(`/tasks/edit/${id}`)}>Edit</Button>{' '}
          <Button onClick={() => navigate('/tasks')}>Back</Button>
        </div>
      </Card.Header>
      <Card.Body>
        <p><strong>Description:</strong> {task.description}</p>
        <p><strong>Due:</strong> {new Date(task.dueDate).toLocaleString()}</p>
        <p><strong>Status:</strong> {task.status}</p>
        <p><strong>Remarks:</strong> {task.remarks}</p>
      </Card.Body>
    </Card>
  )
}
