import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ModalRegister from '../components/modal/ModalRegister';

describe('ModalRegister', () => {
    const mockEvent = { title: 'Evento de Prueba' };
    const mockChildren = [
      { id: 1, first_name: 'Juan', date_of_birth: '2010-01-01' },
      { id: 2, first_name: 'Ana', date_of_birth: '2011-02-02' },
    ];
    const mockOnClose = jest.fn();
    const mockOnRegister = jest.fn();
    const mockOnChildSelect = jest.fn();
    const mockOnCancelRegistration = jest.fn();
  
    test('should render event title and list of children', () => {
      render(
        <ModalRegister
          event={mockEvent}
          onClose={mockOnClose}
          children={mockChildren}
          onRegister={mockOnRegister}
          onChildSelect={mockOnChildSelect}
          onCancelRegistration={mockOnCancelRegistration}
          selectedChildren={[]}
        />
      );
  
      expect(screen.getByText(/Registrar niños en el evento Evento de Prueba/i)).toBeInTheDocument();
      expect(screen.getByText(/Juan/i)).toBeInTheDocument();
      expect(screen.getByText(/Ana/i)).toBeInTheDocument();
    });
  
    test('should call onChildSelect when a checkbox is clicked', () => {
      render(
        <ModalRegister
          event={mockEvent}
          onClose={mockOnClose}
          children={mockChildren}
          onRegister={mockOnRegister}
          onChildSelect={mockOnChildSelect}
          onCancelRegistration={mockOnCancelRegistration}
          selectedChildren={[]}
        />
      );
  
      // Find the text of the child and then find the corresponding checkbox
      const juanText = screen.getByText(/Juan/i);
      const checkbox = juanText.closest('.children-row').querySelector('input[type="checkbox"]');
      fireEvent.click(checkbox);
  
      expect(mockOnChildSelect).toHaveBeenCalledWith(1);
    });
  
    test('should call onCancelRegistration when cancel icon is clicked', () => {
      render(
        <ModalRegister
          event={mockEvent}
          onClose={mockOnClose}
          children={mockChildren}
          onRegister={mockOnRegister}
          onChildSelect={mockOnChildSelect}
          onCancelRegistration={mockOnCancelRegistration}
          selectedChildren={[1]}
        />
      );
  
      const cancelIcon = screen.getAllByAltText(/Cancelar Registro/i)[0];
      fireEvent.click(cancelIcon);
  
      expect(mockOnCancelRegistration).toHaveBeenCalledWith(1);
    });
  
    test('should call onRegister when Confirmar Registro button is clicked', () => {
      render(
        <ModalRegister
          event={mockEvent}
          onClose={mockOnClose}
          children={mockChildren}
          onRegister={mockOnRegister}
          onChildSelect={mockOnChildSelect}
          onCancelRegistration={mockOnCancelRegistration}
          selectedChildren={[1]}
        />
      );
  
      const registerButton = screen.getByText(/Confirmar Registro/i);
      fireEvent.click(registerButton);
  
      expect(mockOnRegister).toHaveBeenCalled();
    });
  
    test('should disable Confirmar Registro button when no children are selected', () => {
      render(
        <ModalRegister
          event={mockEvent}
          onClose={mockOnClose}
          children={mockChildren}
          onRegister={mockOnRegister}
          onChildSelect={mockOnChildSelect}
          onCancelRegistration={mockOnCancelRegistration}
          selectedChildren={[]}
        />
      );
  
      const registerButton = screen.getByText(/Confirmar Registro/i);
      expect(registerButton).toBeDisabled();
    });
  
    test('should render loading message if children prop is missing', () => {
      render(
        <ModalRegister
          event={mockEvent}
          onClose={mockOnClose}
          onRegister={mockOnRegister}
          onChildSelect={mockOnChildSelect}
          onCancelRegistration={mockOnCancelRegistration}
          selectedChildren={[]}
        />
      );
  
      expect(screen.getByText(/Cargando niños.../i)).toBeInTheDocument();
    });
  });