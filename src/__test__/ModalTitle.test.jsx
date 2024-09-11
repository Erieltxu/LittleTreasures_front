// src/__test__/ModalTitle.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ModalTitle from '../components/modal/ModalTitle';

describe('ModalTitle', () => {
  const mockEvent = {
    title: 'Evento de prueba',
    description: 'Descripción del evento de prueba',
    date: '2024-10-01',
    remaining_spots: 5,
  };

  test('should render event details correctly', () => {
    render(<ModalTitle event={mockEvent} onClose={() => {}} />);

    expect(screen.getByText('Evento: Evento de prueba')).toBeInTheDocument();
    expect(screen.getByText('Descripción del evento de prueba')).toBeInTheDocument();
    expect(screen.getByText('Fecha: 2024-10-01')).toBeInTheDocument();
    expect(screen.getByText('Plazas disponibles: 5')).toBeInTheDocument();
  });

  test('should render "No se ha seleccionado ningún evento" when no event is provided', () => {
    render(<ModalTitle event={null} onClose={() => {}} />);

    expect(screen.getByText('No se ha seleccionado ningún evento.')).toBeInTheDocument();
  });

  test('should call onClose when close button is clicked', () => {
    const onClose = jest.fn();
    render(<ModalTitle event={mockEvent} onClose={onClose} />);

    fireEvent.click(screen.getByText('X'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
