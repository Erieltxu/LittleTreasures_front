// src/__test__/Navbar.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from '../components/navbar/Navbar';
import useApi from '../services/useApi';

// Mock de useApi
jest.mock('../services/useApi');

const renderWithRouter = (ui, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);
  return render(ui, { wrapper: Router });
};

describe('Navbar', () => {
  const mockOnLogout = jest.fn();

  test('should render welcome message and profile link when authenticated', async () => {
    useApi.mockReturnValue({
      data: { username: 'JohnDoe' },
      loading: false,
      error: null,
    });

    renderWithRouter(<Navbar isAuthenticated={true} userName="" onLogout={mockOnLogout} />);

    // Cambiado "Hi," por "Hola,"
    expect(await screen.findByText('Hola, JohnDoe')).toBeInTheDocument();
    expect(screen.getByText('Area Cliente')).toBeInTheDocument();
    expect(screen.getByText('Cerrar Sesión')).toBeInTheDocument();
  });

  test('should render login and signup links when not authenticated', () => {
    useApi.mockReturnValue({
      data: null,
      loading: false,
      error: null,
    });

    renderWithRouter(<Navbar isAuthenticated={false} userName="" onLogout={mockOnLogout} />);

    expect(screen.getByText('Acceso')).toBeInTheDocument();
    expect(screen.getByText('Registro')).toBeInTheDocument();
    expect(screen.queryByText('Cerrar Sesión')).not.toBeInTheDocument();
    expect(screen.queryByText('Area Cliente')).not.toBeInTheDocument();
  });

  test('should call onLogout when logout button is clicked', () => {
    useApi.mockReturnValue({
      data: { username: 'JohnDoe' },
      loading: false,
      error: null,
    });

    renderWithRouter(<Navbar isAuthenticated={true} userName="" onLogout={mockOnLogout} />);

    fireEvent.click(screen.getByText('Cerrar Sesión'));

    expect(mockOnLogout).toHaveBeenCalledTimes(1);
  });

  test('should handle loading and error states', () => {
    // Estado de carga
    useApi.mockReturnValue({
      data: null,
      loading: true,
      error: null,
    });

    renderWithRouter(<Navbar isAuthenticated={true} userName="" onLogout={mockOnLogout} />);

    expect(screen.queryByText('Hola,')).not.toBeInTheDocument();
    expect(screen.queryByText('Area Cliente')).not.toBeInTheDocument();
    expect(screen.queryByText('Cerrar Sesión')).not.toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument(); // Verifica el mensaje de carga

    // Estado de error
    useApi.mockReturnValue({
      data: null,
      loading: false,
      error: 'Error al cargar usuario',
    });

    renderWithRouter(<Navbar isAuthenticated={true} userName="" onLogout={mockOnLogout} />);

    expect(screen.queryByText('Hola,')).not.toBeInTheDocument();
    expect(screen.queryByText('Area Cliente')).not.toBeInTheDocument();
    expect(screen.queryByText('Cerrar Sesión')).not.toBeInTheDocument();
    expect(screen.getByText('Error al cargar usuario: Error al cargar usuario')).toBeInTheDocument(); // Verifica el mensaje de error
  });
});