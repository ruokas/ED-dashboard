import React from 'react';
import { render, fireEvent, screen, within } from '@testing-library/react';

jest.mock(
  'react-swipeable',
  () => ({
    useSwipeable: () => ({})
  }),
  { virtual: true }
);

jest.mock(
  'react-beautiful-dnd',
  () => ({
    DragDropContext: ({ children }: any) => <div>{children}</div>,
    Droppable: ({ children }: any) => (
      <div>{children({ innerRef: jest.fn(), droppableProps: {}, placeholder: null })}</div>
    )
  }),
  { virtual: true }
);

jest.mock(
  '@/components/ui/card',
  () => {
    const React = require('react');
    return {
      Card: React.forwardRef<HTMLDivElement, any>(({ children, ...props }, ref) => (
        <div ref={ref} {...props}>
          {children}
        </div>
      )),
      CardContent: React.forwardRef<HTMLDivElement, any>(({ children, ...props }, ref) => (
        <div ref={ref} {...props}>
          {children}
        </div>
      ))
    };
  },
  { virtual: true }
);

jest.mock(
  '@/components/ui/button',
  () => ({
    Button: ({ children, ...props }: any) => <button {...props}>{children}</button>
  }),
  { virtual: true }
);

const LovuValdymoPrograma = require('../LovųValdymoPrograma').default;

jest.useFakeTimers();

describe('LovuValdymoPrograma', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('filters beds by toilet status', () => {
    render(<LovuValdymoPrograma />);

    const bed1Label = screen.getByText(/^1$/);
    const wcButton = within(bed1Label.parentElement!).getAllByRole('button')[0];
    fireEvent.click(wcButton);

    fireEvent.click(screen.getByText('Tualetas'));

    expect(screen.getByText(/^1$/)).toBeInTheDocument();
    expect(screen.queryByText(/^2$/)).not.toBeInTheDocument();
  });

  test('undo reverses status change', () => {
    render(<LovuValdymoPrograma />);

    const bed1Label = screen.getByText(/^1$/);
    const wcButton = within(bed1Label.parentElement!).getAllByRole('button')[0];
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

    const row = screen.getByText('Zona 1').parentElement!;
    const input = within(row).getByPlaceholderText('Padėjėjas');
    fireEvent.change(input, { target: { value: 'Jonas' } });

    expect((input as HTMLInputElement).value).toBe('Jonas');

    const bed1Label = screen.getByText(/^1$/);
    expect(within(bed1Label.parentElement!).getByText(/Patikrinta/)).toBeInTheDocument();
  });
});
