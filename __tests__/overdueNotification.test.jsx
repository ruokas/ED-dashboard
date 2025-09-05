import React from 'react';
import { render, act } from '@testing-library/react';
import LovuValdymoPrograma from '../LovuValdymoPrograma.jsx';
import { NUMATYTA_BUSENA } from '@/src/utils/bedState.js';

jest.useFakeTimers();

beforeEach(() => {
  localStorage.clear();
});

test('fires notification when bed overdue', () => {
  const now = Date.now();
  localStorage.setItem(
    'lovuBusena',
    JSON.stringify({ '1': { ...NUMATYTA_BUSENA, lastCheckedAt: now - 31 * 60 * 1000 } })
  );
  const mockNotification = jest.fn();
  mockNotification.permission = 'granted';
  global.Notification = mockNotification;
  render(<LovuValdymoPrograma />);
  act(() => {
    jest.advanceTimersByTime(1000);
  });
  expect(mockNotification).toHaveBeenCalled();
  const log = JSON.parse(localStorage.getItem('lovuZurnalas'));
  expect(log.some((e) => e.tekstas.includes('1'))).toBe(true);
});
