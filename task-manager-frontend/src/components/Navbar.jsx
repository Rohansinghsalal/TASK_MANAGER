import { Navbar as BootstrapNavbar, Nav, Container } from 'react-bootstrap';
import { NavLink, Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <BootstrapNavbar bg="primary" variant="dark" expand="lg" className="mb-4 shadow-sm">
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/" className="fw-bold">
          Task Management System
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={NavLink} to="/" className="mx-1">
              Home
            </Nav.Link>
            <Nav.Link as={NavLink} to="/tasks" className="mx-1">
              Tasks
            </Nav.Link>
            <Nav.Link as={NavLink} to="/tasks/new" className="mx-1">
              New Task
            </Nav.Link>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar; 