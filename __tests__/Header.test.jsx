import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from '../components/Header.jsx';

describe('Header', () => {
  test('renders without zones when none provided', () => {
    render(<Header />);
    expect(screen.queryByText('Zonos')).toBeNull();
  });

  test('warns on invalid dark prop', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    render(<Header dark="true" />);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

