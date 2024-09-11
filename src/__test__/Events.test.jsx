import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Events from '../pages/Events'; // Ajusta la ruta si es necesario
import UseApi from '../services/useApi'; // Simular el hook

// Mock del hook `UseApi`
jest.mock('../services/useApi', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('Events Component', () => {
  beforeEach(() => {
    UseApi.mockReturnValue({
      data: [],
      loading: false,
      error: null,
    });
  });

  test('should render events list', async () => {
    UseApi.mockReturnValue({
      data: [
        { id: 1, title: 'Event 1', date: '2024-01-01', spots: 3 },
        { id: 2, title: 'Event 2', date: '2024-01-02', spots: 0 },
      ],
      loading: false,
      error: null,
    });
  
    render(
      <MemoryRouter>
        <Events />
      </MemoryRouter>
    );
  
    expect(screen.getByText('Event 1')).toBeInTheDocument();
    expect(screen.getByText('2024-01-01')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument(); // Cambiado para buscar solo el número de plazas
  
    expect(screen.getByText('Event 2')).toBeInTheDocument();
    expect(screen.getByText('2024-01-02')).toBeInTheDocument();
    expect(screen.getByText('No hay plazas')).toBeInTheDocument();
  });
  
  test('should show loading message when fetching data', () => {
    UseApi.mockReturnValue({
      data: [],
      loading: true,
      error: null,
    });

    render(
      <MemoryRouter>
        <Events />
      </MemoryRouter>
    );

    expect(screen.getByText(/Cargando eventos.../i)).toBeInTheDocument();
  });

  test('should display error message when there is an error', () => {
    UseApi.mockReturnValue({
      data: [],
      loading: false,
      error: 'Error al cargar eventos',
    });

    render(
      <MemoryRouter>
        <Events />
      </MemoryRouter>
    );

    expect(screen.getByText(/Error al cargar eventos/i)).toBeInTheDocument();
  });
});
