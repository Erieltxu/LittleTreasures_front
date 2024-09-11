import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CreateEvent from '../pages/CreateEvent';
import UseApi from '../services/useApi';
import { MemoryRouter } from 'react-router-dom';

// Mock UseApi hook
jest.mock('../services/useApi');

// Mock global fetch
global.fetch = jest.fn();

// Mock global alert
const mockAlert = jest.spyOn(global, 'alert').mockImplementation(() => {});

describe('CreateEvent', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    UseApi.mockReturnValue({ data: { is_admin: true }, loading: false, error: null });
    global.fetch.mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      })
    );
  });

  test('should clear form fields and show success alert on successful creation', async () => {
    render(
      <MemoryRouter>
        <CreateEvent />
      </MemoryRouter>
    );

    // Fill the form fields
    fireEvent.change(screen.getByLabelText(/Título:/i), { target: { value: 'Evento de Prueba' } });
    fireEvent.change(screen.getByLabelText(/Descripción:/i), { target: { value: 'Descripción del evento' } });
    fireEvent.change(screen.getByLabelText(/Fecha:/i), { target: { value: '2024-10-01' } });
    fireEvent.change(screen.getByLabelText(/Plazas:/i), { target: { value: '2' } });

    // Submit the form
    fireEvent.click(screen.getByText(/Crear Evento/i));

    // Wait for the alert to be called
    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith('Evento creado con éxito');
    });

    // Check if form fields are cleared
    expect(screen.getByLabelText(/Título:/i).value).toBe('');
    expect(screen.getByLabelText(/Descripción:/i).value).toBe('');
    expect(screen.getByLabelText(/Fecha:/i).value).toBe('');
    expect(screen.getByLabelText(/Plazas:/i).value).toBe('');
  });

  afterEach(() => {
    mockAlert.mockRestore();
  });
});
