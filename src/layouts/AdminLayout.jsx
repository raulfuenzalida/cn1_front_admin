import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Offcanvas, Navbar, Nav, Button, Dropdown } from 'react-bootstrap';
import { authService } from '../services/authService';
import ThemeSwitch from '../components/common/ThemeSwitch';

/**
 * Layout administrativo principal
 * 
 * Incluye:
 * - Sidebar con navegación
 * - Topbar con usuario
 * - Responsive con Offcanvas
 */
const AdminLayout = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate('/login');
    } catch (error) {
      console.error('Error durante logout:', error);
    }
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/products', label: 'Productos', icon: '📦' },
    { path: '/orders', label: 'Pedidos', icon: '📋' },
    { path: '/configuration', label: 'Configuración', icon: '⚙️' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="admin-layout">
      {/* Topbar */}
      <Navbar className="border-bottom px-3 py-2">
        <div className="d-flex align-items-center w-100">
          {/* Botón toggle sidebar móvil */}
          <Button
            variant="outline-secondary"
            className="d-md-none me-2"
            onClick={() => setShowSidebar(true)}
          >
            ☰
          </Button>

          {/* Marca */}
          <Navbar.Brand className="brand-logo">
            PrintWorks Admin
          </Navbar.Brand>

          <div className="ms-auto d-flex align-items-center gap-3">
            {/* Theme Switch */}
            <ThemeSwitch />
            {/* Menú usuario */}
            <Dropdown>
              <Dropdown.Toggle variant="light" id="user-dropdown" className="user-menu">
                <span className="user-avatar">👤</span>
                <span className="user-name d-none d-sm-inline">{authService.getDisplayName()}</span>
              </Dropdown.Toggle>

              <Dropdown.Menu align="end">
                <Dropdown.Header className="d-sm-none">
                  {authService.getDisplayName()}
                </Dropdown.Header>
                <Dropdown.Item onClick={handleLogout}>Cerrar sesión</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </Navbar>

      <div className="d-flex">
        {/* Sidebar desktop */}
        <div className="sidebar d-none d-md-flex flex-column" style={{ width: '250px', minHeight: '100vh' }}>
          <Nav className="flex-column py-3">
            {navItems.map((item) => (
              <Nav.Link
                key={item.path}
                as={Link}
                to={item.path}
                className={isActive(item.path) ? 'active' : ''}
              >
                <span className="me-2">{item.icon}</span>
                {item.label}
              </Nav.Link>
            ))}
          </Nav>
        </div>

        {/* Sidebar móvil - Offcanvas */}
        <Offcanvas show={showSidebar} onHide={() => setShowSidebar(false)} placement="start">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Navegación</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="flex-column">
              {navItems.map((item) => (
                <Nav.Link
                  key={item.path}
                  as={Link}
                  to={item.path}
                  onClick={() => setShowSidebar(false)}
                  className={isActive(item.path) ? 'active' : ''}
                >
                  <span className="me-2">{item.icon}</span>
                  {item.label}
                </Nav.Link>
              ))}
            </Nav>
          </Offcanvas.Body>
        </Offcanvas>

        {/* Contenido principal */}
        <div className="flex-grow-1 p-4 main-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
