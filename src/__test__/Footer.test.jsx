// src/__test__/Footer.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../components/Footer/Footer';
import '@testing-library/jest-dom'; // Para usar las aserciones de jest-dom

describe('Footer', () => {
  test('should render social media icons', () => {
    render(<Footer />);

    // Verifica que las imágenes de los iconos sociales se rendericen
    expect(screen.getByAltText('Facebook logo')).toBeInTheDocument();
    expect(screen.getByAltText('TwitterX logo')).toBeInTheDocument();
    expect(screen.getByAltText('Instagram logo')).toBeInTheDocument();
    expect(screen.getByAltText('Youtube logo')).toBeInTheDocument();
  });

  test('should render copyright text', () => {
    render(<Footer />);

    // Verifica que el texto de copyright se renderice
    expect(screen.getByText('© Copyright 2024')).toBeInTheDocument();
  });
});
