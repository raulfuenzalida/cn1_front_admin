import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { InteractionStatus } from '@azure/msal-browser';
import ProtectedRoute from '../ProtectedRoute';

vi.mock('@azure/msal-react', () => ({
  useMsal: vi.fn(),
}));

import { useMsal } from '@azure/msal-react';

const renderProtected = () =>
  render(
    <MemoryRouter initialEntries={['/dashboard']}>
      <Routes>
        <Route path="/login" element={<div>Login page</div>} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <div>Ruta protegida</div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </MemoryRouter>
  );

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('muestra estado de carga mientras MSAL no ha terminado', () => {
    useMsal.mockReturnValue({
      accounts: [],
      inProgress: InteractionStatus.HandleRedirect,
    });

    renderProtected();

    expect(screen.getByText('Cargando...')).toBeInTheDocument();
    expect(screen.queryByText('Login page')).not.toBeInTheDocument();
    expect(screen.queryByText('Ruta protegida')).not.toBeInTheDocument();
  });

  it('redirige a /login cuando no hay accounts', () => {
    useMsal.mockReturnValue({
      accounts: [],
      inProgress: InteractionStatus.None,
    });

    renderProtected();

    expect(screen.getByText('Login page')).toBeInTheDocument();
    expect(screen.queryByText('Ruta protegida')).not.toBeInTheDocument();
  });

  it('renderiza la ruta protegida cuando hay account', () => {
    useMsal.mockReturnValue({
      accounts: [{ name: 'Admin PrintWorks', username: 'admin@example.com' }],
      inProgress: InteractionStatus.None,
    });

    renderProtected();

    expect(screen.getByText('Ruta protegida')).toBeInTheDocument();
    expect(screen.queryByText('Login page')).not.toBeInTheDocument();
  });
});
