import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HomeLogin from '../pages/HomeLogin'; // Ajusta la ruta si es necesario
import { useNavigate } from 'react-router-dom';

// Mock de useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('HomeLogin Component', () => {
  let mockedNavigate;

  beforeEach(() => {
    mockedNavigate = jest.fn();
    useNavigate.mockReturnValue(mockedNavigate);
  });

  it('should render the logo, title, and "Eventos" button', () => {
    render(
      <MemoryRouter>
        <HomeLogin />
      </MemoryRouter>
    );

    // Verificar que el logo se renderiza
    expect(screen.getByAltText('Logo')).toBeInTheDocument();

    // Verificar que el título se renderiza
    expect(screen.getByText(/LITTLE/i)).toBeInTheDocument();
    expect(screen.getByText(/TREASURES/i)).toBeInTheDocument();

    // Verificar que el botón de "Eventos" se renderiza
    const eventosButton = screen.getByRole('button', { name: /Eventos/i });
    expect(eventosButton).toBeInTheDocument();
  });

  it('should navigate to "/events" when "Eventos" button is clicked', () => {
    render(
      <MemoryRouter>
        <HomeLogin />
      </MemoryRouter>
    );

    // Simular el clic en el botón de "Eventos"
    const eventosButton = screen.getByRole('button', { name: /Eventos/i });
    fireEvent.click(eventosButton);

    // Verificar que la navegación ocurre correctamente
    expect(mockedNavigate).toHaveBeenCalledWith('/events');
  });
});
