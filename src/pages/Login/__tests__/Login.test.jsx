import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { InteractionStatus } from '@azure/msal-browser';
import Login from '../Login';

vi.mock('@azure/msal-react', () => ({
  useMsal: vi.fn(),
}));

vi.mock('../../../services/authService', () => ({
  authService: {
    login: vi.fn(),
  },
}));

import { useMsal } from '@azure/msal-react';

const renderLogin = () =>
  render(
    <MemoryRouter initialEntries={['/login']}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<div>Dashboard</div>} />
      </Routes>
    </MemoryRouter>
  );

describe('Login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('permanece en /login cuando no hay cuenta autenticada', () => {
    useMsal.mockReturnValue({
      accounts: [],
      inProgress: InteractionStatus.None,
    });

    renderLogin();

    expect(screen.getByRole('button', { name: /iniciar sesión con microsoft/i })).toBeInTheDocument();
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
  });

  it('no redirige a /dashboard mientras el login está en progreso', () => {
    useMsal.mockReturnValue({
      accounts: [],
      inProgress: InteractionStatus.HandleRedirect,
    });

    renderLogin();

    expect(screen.getByRole('button', { name: /cargando/i })).toBeDisabled();
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
  });

  it('redirige a /dashboard cuando hay cuenta y MSAL terminó', () => {
    useMsal.mockReturnValue({
      accounts: [{ name: 'Admin PrintWorks', username: 'admin@example.com' }],
      inProgress: InteractionStatus.None,
    });

    renderLogin();

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });
});
