import React from 'react';
import { render, act } from '@testing-library/react';
import Pranesimas from '../Pranesimas.jsx';

jest.useFakeTimers();

describe('Pranesimas', () => {
  test('hides after 2 seconds', () => {
    const { queryByText } = render(<Pranesimas msg="hello" onUndo={() => {}} />);
    expect(queryByText('hello')).toBeInTheDocument();
    act(() => { jest.advanceTimersByTime(2000); });
    expect(queryByText('hello')).not.toBeInTheDocument();
  });

  test('timer resets on msg change', () => {
    const { queryByText, rerender } = render(<Pranesimas msg="first" onUndo={() => {}} />);
    expect(queryByText('first')).toBeInTheDocument();
    act(() => { jest.advanceTimersByTime(1000); });
    rerender(<Pranesimas msg="second" onUndo={() => {}} />);
    expect(queryByText('second')).toBeInTheDocument();
    act(() => { jest.advanceTimersByTime(1000); });
    // after total 2 seconds from the rerender, it should still be visible
    expect(queryByText('second')).toBeInTheDocument();
    act(() => { jest.advanceTimersByTime(1000); });
    expect(queryByText('second')).not.toBeInTheDocument();
  });
});
