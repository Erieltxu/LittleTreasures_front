import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from '../pages/Login'; // Ajusta la ruta según la ubicación de tu componente
import useApi from '../services/useApi';

// Mock del hook useApi
jest.mock('../services/useApi');

describe('Login Component', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    // Limpia el localStorage antes de cada prueba
    localStorage.clear();
  });

  test('renders login form and handles successful login', async () => {
    // Mock del hook useApi para que devuelva datos simulados
    useApi.mockReturnValue({
      data: { token: 'mockedToken' },
      loading: false,
      error: null,
    });

    const mockOnLoginSuccess = jest.fn();
    render(
      <MemoryRouter>
        <Login onLoginSuccess={mockOnLoginSuccess} />
      </MemoryRouter>
    );

    // Verifica que los elementos de la interfaz están presentes
    expect(screen.getByLabelText(/nombre de usuario/i)).toBeInTheDocument(); // Cambiado a "Nombre de usuario"
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument(); // Cambiado a "Contraseña"
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument(); // Cambiado a "ENTRAR"

    // Simula la entrada de usuario
    fireEvent.change(screen.getByLabelText(/nombre de usuario/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: 'password123' } });

    // Simula el envío del formulario
    fireEvent.click(screen.getByRole('button', { name: /entrar/i })); // Cambiado a "ENTRAR"

    // Espera a que se actualice el estado después del envío
    await waitFor(() => {
      expect(mockOnLoginSuccess).toHaveBeenCalledWith({ username: 'testuser' }, 'mockedToken');
      expect(localStorage.getItem('token')).toBe('mockedToken');
    });
  });

  test('shows error message on login failure', async () => {
    // Mock del hook useApi para simular un error
    useApi.mockReturnValue({
      data: null,
      loading: false,
      error: new Error('Invalid credentials'),
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Simula la entrada de usuario
    fireEvent.change(screen.getByLabelText(/nombre de usuario/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: 'password123' } });

    // Simula el envío del formulario
    fireEvent.click(screen.getByRole('button', { name: /entrar/i })); // Cambiado a "ENTRAR"

    // Espera a que se actualice el estado después del envío
    await waitFor(() => {
      expect(screen.getByText(/login failed: Invalid credentials/i)).toBeInTheDocument();
    });
  });
});
