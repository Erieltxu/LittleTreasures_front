import React from 'react';
import { render, screen } from '@testing-library/react';

test('renders a simple test', () => {
  render(<div>Hello World</div>);
  const element = screen.getByText(/hello world/i);
  expect(element).toBeInTheDocument();
});
