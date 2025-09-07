import { renderHook, act } from '@testing-library/react';
import useBedManager from '../hooks/useBedManager.js';

const ZONOS = { A: ['1'] };

describe('useBedManager', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('toggleWC updates needsWC', () => {
    const pushLog = jest.fn();
    const { result } = renderHook(() => useBedManager(ZONOS, pushLog));
    act(() => result.current.toggleWC('1'));
    expect(result.current.statusMap['1'].needsWC).toBe(true);
    expect(pushLog).toHaveBeenCalledWith('1: Tualetas');
  });

  test('undo restores previous state', () => {
    const pushLog = jest.fn();
    const { result } = renderHook(() => useBedManager(ZONOS, pushLog));
    act(() => result.current.toggleWC('1'));
    act(() => result.current.undo());
    expect(result.current.statusMap['1'].needsWC).toBe(false);
  });
});

