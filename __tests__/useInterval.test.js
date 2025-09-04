import React from 'react';
import { render, act } from '@testing-library/react';
import useInterval from '../hooks/useInterval.js';

function TestComponent({ callback, delay }) {
  useInterval(callback, delay);
  return null;
}

jest.useFakeTimers();

test('sets interval and clears on unmount', () => {
  const callback = jest.fn();
  const { unmount } = render(<TestComponent callback={callback} delay={1000} />);

  act(() => {
    jest.advanceTimersByTime(3000);
  });
  expect(callback).toHaveBeenCalledTimes(3);

  unmount();
  act(() => {
    jest.advanceTimersByTime(3000);
  });
  expect(callback).toHaveBeenCalledTimes(3);
});

test('updates interval when delay changes', () => {
  const callback = jest.fn();
  const { rerender } = render(<TestComponent callback={callback} delay={1000} />);

  act(() => {
    jest.advanceTimersByTime(1000);
  });
  expect(callback).toHaveBeenCalledTimes(1);

  rerender(<TestComponent callback={callback} delay={500} />);
  act(() => {
    jest.advanceTimersByTime(500);
  });
  expect(callback).toHaveBeenCalledTimes(2);

  act(() => {
    jest.advanceTimersByTime(500);
  });
  expect(callback).toHaveBeenCalledTimes(3);
});
