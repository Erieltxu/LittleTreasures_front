import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import EventChanges from '../pages/EventChanges'; // Ajusta la ruta si es necesario
import UseApi from '../services/useApi';
import { EVENTS_API } from '../config/urls';

beforeEach(() => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});
  });
  
  afterEach(() => {
    jest.restoreAllMocks();
  });

jest.mock('../services/useApi', () => ({
    __esModule: true,
    default: jest.fn(() => ({
      data: [
        { id: 1, title: 'Evento 1', date: '2024-01-01', spots: 3, description: 'Descripción evento 1' },
      ],
      loading: false,
      error: null,
    })),
  }));

// Mock de useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('EventChanges Component', () => {
   

  test('should display loading message while fetching events', () => {
    UseApi.mockReturnValue({
      data: [],
      loading: true,
      error: null,
    });

    render(
      <MemoryRouter>
        <EventChanges />
      </MemoryRouter>
    );

    expect(screen.getByText('Cargando eventos...')).toBeInTheDocument();
  });

  test('should display error message when failed to fetch events', () => {
    UseApi.mockReturnValue({
      data: [],
      loading: false,
      error: 'Error al cargar eventos',
    });

    render(
      <MemoryRouter>
        <EventChanges />
      </MemoryRouter>
    );

    expect(screen.getByText('Error al cargar eventos: Error al cargar eventos')).toBeInTheDocument();
  });

  test('should render the list of events', () => {
    UseApi.mockReturnValue({
      data: [
        { id: 1, title: 'Evento 1', date: '2024-01-01', spots: 3 },
        { id: 2, title: 'Evento 2', date: '2024-01-02', spots: 0 },
      ],
      loading: false,
      error: null,
    });

    render(
      <MemoryRouter>
        <EventChanges />
      </MemoryRouter>
    );

    expect(screen.getByText('Evento 1')).toBeInTheDocument();
    expect(screen.getByText('2024-01-01')).toBeInTheDocument();
    expect(screen.getByText('Plazas: 3')).toBeInTheDocument();

    expect(screen.getByText('Evento 2')).toBeInTheDocument();
    expect(screen.getByText('2024-01-02')).toBeInTheDocument();
    expect(screen.getByText('Plazas: 0')).toBeInTheDocument();
  });

  test('should open modal when an event is clicked', () => {
    UseApi.mockReturnValue({
      data: [
        { id: 1, title: 'Evento 1', date: '2024-01-01', spots: 3, description: 'Descripción evento 1' },
      ],
      loading: false,
      error: null,
    });

    render(
      <MemoryRouter>
        <EventChanges />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Evento 1'));

    expect(screen.getByText('Editar Evento: Evento 1')).toBeInTheDocument();
    expect(screen.getByText('Actualizar Evento')).toBeInTheDocument();
  });

  test('should update event when the form is submitted', async () => {
    const mockFetch = jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ message: 'Evento actualizado con éxito' }),
    });

    UseApi.mockReturnValue({
      data: [
        { id: 1, title: 'Evento 1', date: '2024-01-01', spots: 3, description: 'Descripción evento 1' },
      ],
      loading: false,
      error: null,
    });

    render(
      <MemoryRouter>
        <EventChanges />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Evento 1'));
    fireEvent.change(screen.getByLabelText('Título:'), { target: { value: 'Evento Actualizado' } });
    fireEvent.click(screen.getByText('Actualizar Evento'));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify({
          title: 'Evento Actualizado',
          description: 'Descripción evento 1',
          date: '2024-01-01',
          spots: 3,
        }),
      }));
      expect(screen.queryByText('Editar Evento: Evento 1')).not.toBeInTheDocument(); // Modal should close
    });

    mockFetch.mockRestore();
  });

  test('should delete event when delete button is clicked', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ message: 'Evento eliminado con éxito' }));

    render(
      <MemoryRouter>
        <EventChanges />
      </MemoryRouter>
    );

    // Simular clic en el evento y luego en "Eliminar Evento"
    fireEvent.click(screen.getByText('Evento 1'));
    fireEvent.click(screen.getByText('Eliminar Evento'));

    // Esperar a que se haga la petición de eliminación
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(`${EVENTS_API}1/`, expect.objectContaining({
        method: 'DELETE',
      }));
      expect(screen.queryByText('Evento 1')).not.toBeInTheDocument();  // Verificar que el evento fue eliminado
    });
  });
});