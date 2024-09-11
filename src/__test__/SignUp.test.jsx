import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import Signup from "../pages/Signup"; // Ajusta la ruta si es necesario
import "@testing-library/jest-dom";
import { useNavigate } from "react-router-dom";
import useApi from "../services/useApi";

// Mock del hook `useNavigate` y `useApi`
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

jest.mock("../services/useApi", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe("Signup Component", () => {
  let mockedNavigate;
  let mockUseApi;

  beforeEach(() => {
    mockedNavigate = jest.fn();
    useNavigate.mockReturnValue(mockedNavigate);

    mockUseApi = {
      data: null,
      loading: false,
      error: null,
    };

    useApi.mockReturnValue(mockUseApi);
  });

  it("should render the form inputs and submit button", () => {
    render(
      <Router>
        <Signup />
      </Router>
    );

    // Verificar que los campos de entrada están en el documento
    expect(screen.getByLabelText('Nombre', { selector: 'input#first_name' })).toBeInTheDocument();
    expect(screen.getByLabelText('Apellido')).toBeInTheDocument();
    expect(screen.getByLabelText('Nombre de usuario', { selector: 'input#username' })).toBeInTheDocument();
    expect(screen.getByLabelText('Correo electrónico')).toBeInTheDocument();
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument();

    // Verificar que el botón de registro está en el documento
    const signUpButton = screen.getByRole('button', { name: /Registrar/i });
    expect(signUpButton).toBeInTheDocument();
  });

  it('should navigate to "/login" after successful signup', async () => {
    // Simular una respuesta exitosa de la API
    mockUseApi.data = { message: "Signup successful" };

    const mockOnSignUpSuccess = jest.fn();
    render(
      <Router>
        <Signup onSignUpSuccess={mockOnSignUpSuccess} />
      </Router>
    );

    // Simular el llenado del formulario
    fireEvent.change(screen.getByLabelText('Nombre', { selector: 'input#first_name' }), { target: { value: "John" } });
    fireEvent.change(screen.getByLabelText('Apellido'), { target: { value: "Doe" } });
    fireEvent.change(screen.getByLabelText('Nombre de usuario', { selector: 'input#username' }), { target: { value: "johndoe" } });
    fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: "password123" } });

    // Simular el clic en el botón de enviar
    const signUpButton = screen.getByRole('button', { name: /Registrar/i });
    fireEvent.click(signUpButton);

    // Esperar que navegue a la página de login y que onSignUpSuccess sea llamado
    await waitFor(() => {
      expect(mockOnSignUpSuccess).toHaveBeenCalledWith({ message: 'Signup successful' });
      expect(mockedNavigate).toHaveBeenCalledWith('/login');
    });
  });

  it("should display error message on API error", async () => {
    // Simular un error de la API
    mockUseApi.error = 'Signup failed';
    
    render(
      <Router>
        <Signup />
      </Router>
    );

    // Simular el llenado del formulario
    fireEvent.change(screen.getByLabelText('Nombre', { selector: 'input#first_name' }), { target: { value: "John" } });
    fireEvent.change(screen.getByLabelText('Apellido'), { target: { value: "Doe" } });
    fireEvent.change(screen.getByLabelText('Nombre de usuario', { selector: 'input#username' }), { target: { value: "johndoe" } });
    fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: "password123" } });

    // Simular el clic en el botón de enviar
    const signUpButton = screen.getByRole('button', { name: /Registrar/i });
    fireEvent.click(signUpButton);

    // Esperar que el mensaje de error aparezca en la pantalla
    await waitFor(() => {
      expect(screen.getByText('Signup failed')).toBeInTheDocument();
    });
  });

  it('should navigate to "/" when the back arrow is clicked', () => {
    render(
      <Router>
        <Signup />
      </Router>
    );

    // Simula clic en el icono de la flecha para regresar
    fireEvent.click(screen.getByAltText('Back to Home'));
    expect(mockedNavigate).toHaveBeenCalledWith('/');
  });

  it("should display 'loading' during API call", () => {
    // Simular la carga durante la llamada a la API
    mockUseApi.loading = true;

    render(
      <Router>
        <Signup />
      </Router>
    );

    // Verificar que el formulario muestra un indicador de carga
    expect(screen.getByText(/Cargando.../i)).toBeInTheDocument();
  });
});
