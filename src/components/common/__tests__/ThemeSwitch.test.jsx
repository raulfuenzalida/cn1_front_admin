import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ThemeSwitch from '../ThemeSwitch';
import { ThemeProvider } from '../../../context/ThemeContext';

describe('ThemeSwitch', () => {
  beforeEach(() => {
    // Limpiar localStorage antes de cada test
    localStorage.clear();
    // Limpiar atributo data-theme del documento
    document.documentElement.removeAttribute('data-theme');
    // Mock window.matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  const renderWithProvider = () => {
    return render(
      <ThemeProvider>
        <ThemeSwitch />
      </ThemeProvider>
    );
  };

  it('debería renderizar el componente', () => {
    renderWithProvider();
    const button = screen.getByRole('switch');
    expect(button).toBeInTheDocument();
  });

  it('debería tener role="switch"', () => {
    renderWithProvider();
    const button = screen.getByRole('switch');
    expect(button).toHaveAttribute('role', 'switch');
  });

  it('debería tener aria-checked inicial en false (light mode)', () => {
    renderWithProvider();
    const button = screen.getByRole('switch');
    expect(button).toHaveAttribute('aria-checked', 'false');
  });

  it('debería cambiar aria-checked al hacer click', () => {
    renderWithProvider();
    const button = screen.getByRole('switch');
    
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-checked', 'true');
  });

  it('debería tener aria-label descriptivo', () => {
    renderWithProvider();
    const button = screen.getByRole('switch');
    expect(button).toHaveAttribute('aria-label', 'Cambiar a modo oscuro');
  });

  it('debería actualizar aria-label al cambiar tema', () => {
    renderWithProvider();
    const button = screen.getByRole('switch');
    
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-label', 'Cambiar a modo claro');
  });

  it('debería ser accesible por teclado con Enter', () => {
    renderWithProvider();
    const button = screen.getByRole('switch');
    
    fireEvent.keyDown(button, { key: 'Enter' });
    expect(button).toHaveAttribute('aria-checked', 'true');
  });

  it('debería ser accesible por teclado con Space', () => {
    renderWithProvider();
    const button = screen.getByRole('switch');
    
    fireEvent.keyDown(button, { key: ' ' });
    expect(button).toHaveAttribute('aria-checked', 'true');
  });

  it('debería tener tabIndex={0} para navegación por teclado', () => {
    renderWithProvider();
    const button = screen.getByRole('switch');
    expect(button).toHaveAttribute('tabIndex', '0');
  });

  it('debería mostrar el icono de sol en light mode', () => {
    renderWithProvider();
    expect(screen.getByText('☀️')).toBeInTheDocument();
  });

  it('debería mostrar el icono de luna en dark mode', () => {
    renderWithProvider();
    const button = screen.getByRole('switch');
    
    fireEvent.click(button);
    expect(screen.getByText('🌙')).toBeInTheDocument();
  });

  it('debería mostrar la etiqueta "Claro" en light mode', () => {
    renderWithProvider();
    expect(screen.getByText('Claro')).toBeInTheDocument();
  });

  it('debería mostrar la etiqueta "Oscuro" en dark mode', () => {
    renderWithProvider();
    const button = screen.getByRole('switch');
    
    fireEvent.click(button);
    expect(screen.getByText('Oscuro')).toBeInTheDocument();
  });
});
