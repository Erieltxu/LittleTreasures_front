import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import Home from "../pages/Home";
import "@testing-library/jest-dom";
import { useNavigate } from "react-router-dom";

// Mocking useNavigate from react-router-dom
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("Home Component", () => {
  let mockedNavigate;

  // Reset mocks before each test
  beforeEach(() => {
    mockedNavigate = jest.fn();
    useNavigate.mockReturnValue(mockedNavigate);
  });

  // Test if the main elements are rendered correctly
  it("should display main elements", () => {
    render(
      <Router>
        <Home />
      </Router>
    );

    // Check if the logo is displayed
    expect(screen.getByAltText("Logo")).toBeInTheDocument();

    // Check if the title is displayed
    expect(screen.getByText(/LITTLE/i)).toBeInTheDocument();
    expect(screen.getByText(/TREASURES/i)).toBeInTheDocument();

    // Check if the buttons are displayed
    expect(screen.getByText("ACCEDER")).toBeInTheDocument(); // Cambiado a "ACCEDER"
    expect(screen.getByText("REGISTRARSE")).toBeInTheDocument(); // Cambiado a "REGISTRARSE"
  });

  // Test if clicking the Login button navigates to "/login"
  it('should navigate to "/login" when "ACCEDER" button is clicked', () => {
    render(
      <Router>
        <Home />
      </Router>
    );

    fireEvent.click(screen.getByText("ACCEDER")); // Cambiado a "ACCEDER"
    expect(mockedNavigate).toHaveBeenCalledWith("/login");
  });

  // Test if clicking the Sign Up button navigates to "/signup"
  it('should navigate to "/signup" when "REGISTRARSE" button is clicked', () => {
    render(
      <Router>
        <Home />
      </Router>
    );

    fireEvent.click(screen.getByText("REGISTRARSE")); // Cambiado a "REGISTRARSE"
    expect(mockedNavigate).toHaveBeenCalledWith("/signup");
  });
});
