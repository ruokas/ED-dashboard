import React from 'react';
import { render, fireEvent, screen, within, act } from '@testing-library/react';
import { dndOnDragEnd } from './testUtils/mocks';

jest.mock(
  'react-swipeable',
  () => ({
    useSwipeable: () => ({})
  }),
  { virtual: true }
);

import LovuValdymoPrograma from '../LovuValdymoPrograma.jsx';

jest.useFakeTimers();

describe('LovuValdymoPrograma', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('filters beds by toilet status', () => {
    render(<LovuValdymoPrograma />);

    const bed1Label = screen.getByText(/^1$/);
    const card = bed1Label.parentElement.parentElement;
    const wcButton = within(card).getAllByRole('button')[0];
    fireEvent.click(wcButton);

    fireEvent.click(screen.getByText('Tualetas'));

    expect(screen.getByText(/^1$/)).toBeInTheDocument();
    expect(screen.queryByText(/^2$/)).not.toBeInTheDocument();
  });

  test('undo reverses status change', () => {
    render(<LovuValdymoPrograma />);

    const bed1Label = screen.getByText(/^1$/);
    const card = bed1Label.parentElement.parentElement;
    const wcButton = within(card).getAllByRole('button')[0];
    fireEvent.click(wcButton);

    fireEvent.click(screen.getByText('Tualetas'));
    expect(screen.getByText(/^1$/)).toBeInTheDocument();

    const msg = screen.getByText('1: Tualetas');
    const undoBtn = within(msg).getByRole('button');
    fireEvent.click(undoBtn);

    expect(screen.queryByText(/^1$/)).not.toBeInTheDocument();
  });

  test('zone helper update marks beds checked', () => {
    render(<LovuValdymoPrograma />);

    const row = screen.getByText('Zona 1').parentElement;
    const input = within(row).getByPlaceholderText('Padėjėjas');
    fireEvent.change(input, { target: { value: 'Jonas' } });

    expect(input.value).toBe('Jonas');

    const bed1Label = screen.getByText(/^1$/);
    const card = bed1Label.parentElement.parentElement;
    expect(within(card).getByText(/Patikrinta/)).toBeInTheDocument();
  });

  test('dragging moves bed between zones', () => {
    render(<LovuValdymoPrograma />);

    expect(within(screen.getByText('Zona 1').parentElement.parentElement).getByText(/^1$/)).toBeInTheDocument();
    expect(within(screen.getByText('Zona 2').parentElement.parentElement).queryByText(/^1$/)).toBeNull();

    act(() => {
      dndOnDragEnd({
        draggableId: '1',
        source: { droppableId: 'Zona 1', index: 0 },
        destination: { droppableId: 'Zona 2', index: 0 }
      });
    });

    const zone1 = screen.getByText('Zona 1').parentElement.parentElement;
    const zone2 = screen.getByText('Zona 2').parentElement.parentElement;
    expect(within(zone2).getByText(/^1$/)).toBeInTheDocument();
    expect(within(zone1).queryByText(/^1$/)).toBeNull();
  });

  test('reset button clears bed status', () => {
    render(<LovuValdymoPrograma />);

    const bed1Label = screen.getByText(/^1$/);
    const card = bed1Label.parentElement.parentElement;
    const buttons = within(card).getAllByRole('button');
    const wcButton = buttons[0];
    const resetButton = buttons[3];

    fireEvent.click(wcButton);
    fireEvent.click(resetButton);
    fireEvent.click(screen.getByText('Tualetas'));

    expect(screen.queryByText(/^1$/)).not.toBeInTheDocument();
  });
});
