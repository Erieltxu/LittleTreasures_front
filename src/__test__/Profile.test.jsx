import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Profile from '../pages/profile'; // Ajusta la ruta según sea necesario
import UseApi from '../services/useApi';
import { DELETE_USER } from '../config/urls';

// Mock de UseApi
jest.mock('../services/useApi');

// Mock de fetch
global.fetch = jest.fn();

describe('Profile Component', () => {
  const mockUserData = {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    first_name: 'Test',
    last_name: 'User',
    children: [{ id: 1, first_name: 'Child1', date_of_birth: '2020-01-01' }],
  };

  beforeEach(() => {
    UseApi.mockReturnValue({
      data: mockUserData,
      loading: false,
      error: null,
    });

    fetch.mockClear();
  });

  test('should delete profile when confirmed', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Profile deleted successfully' }),
    });

    render(
      <Router>
        <Profile onLogout={jest.fn()} />
      </Router>
    );

    // Confirmar borrado de perfil
    fireEvent.click(screen.getByLabelText(/Confirmar borrar perfil/i));

    // Encontrar el botón correcto usando `getByRole` en lugar de `getByText`
    const deleteButton = screen.getByRole('button', { name: /Borrar perfil/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(DELETE_USER, {
        method: 'DELETE',
        headers: { Authorization: `Token ${localStorage.getItem('token')}` },
      });
      expect(localStorage.getItem('token')).toBeNull();
    });
  });
});
