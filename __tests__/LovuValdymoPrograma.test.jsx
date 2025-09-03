import React from 'react';
import { render, fireEvent, screen, within, act } from '@testing-library/react';

jest.mock(
  'react-swipeable',
  () => ({
    useSwipeable: () => ({})
  }),
  { virtual: true }
);

let dndOnDragEnd;
jest.mock(
  'react-beautiful-dnd',
  () => {
    const React = require('react');
    return {
      DragDropContext: ({ children, onDragEnd }) => {
        dndOnDragEnd = onDragEnd;
        return <div>{children}</div>;
      },
      Droppable: ({ children }) => (
        <div>{children({ innerRef: jest.fn(), droppableProps: {}, placeholder: null })}</div>
      ),
      Draggable: ({ children }) => (
        <div>{children({ innerRef: jest.fn(), draggableProps: {}, dragHandleProps: {} })}</div>
      )
    };
  },
  { virtual: true }
);

jest.mock(
  '@/components/ui/card',
  () => {
    const React = require('react');
    return {
      Card: React.forwardRef(({ children, ...props }, ref) => (
        <div ref={ref} {...props}>{children}</div>
      )),
      CardContent: React.forwardRef(({ children, ...props }, ref) => (
        <div ref={ref} {...props}>{children}</div>
      ))
    };
  },
  { virtual: true }
);

jest.mock(
  '@/components/ui/button',
  () => ({
    Button: ({ children, ...props }) => <button {...props}>{children}</button>
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
    const wcButton = within(bed1Label.parentElement).getAllByRole('button')[0];
    fireEvent.click(wcButton);

    fireEvent.click(screen.getByText('Tualetas'));

    expect(screen.getByText(/^1$/)).toBeInTheDocument();
    expect(screen.queryByText(/^2$/)).not.toBeInTheDocument();
  });

  test('undo reverses status change', () => {
    render(<LovuValdymoPrograma />);

    const bed1Label = screen.getByText(/^1$/);
    const wcButton = within(bed1Label.parentElement).getAllByRole('button')[0];
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
    expect(within(bed1Label.parentElement).getByText(/Patikrinta/)).toBeInTheDocument();
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
});
