import { filterLogEntries } from '../src/utils/logFilter.js';

describe('filterLogEntries', () => {
  test('filters entries case-insensitively', () => {
    const log = [
      { tekstas: 'Error occurred', vartotojas: 'User1', ts: 1 },
      { tekstas: 'All good', vartotojas: 'User2', ts: 2 },
      { tekstas: 'another ERROR here', vartotojas: 'User3', ts: 3 },
    ];
    const result = filterLogEntries(log, 'error');
    expect(result).toEqual([
      { tekstas: 'another ERROR here', vartotojas: 'User3', ts: 3 },
      { tekstas: 'Error occurred', vartotojas: 'User1', ts: 1 },
    ]);
  });

  test('returns entries in reverse order', () => {
    const log = [
      { tekstas: 'first match', vartotojas: 'User1', ts: 1 },
      { tekstas: 'unrelated', vartotojas: 'User2', ts: 2 },
      { tekstas: 'second match', vartotojas: 'User3', ts: 3 },
    ];
    const result = filterLogEntries(log, 'match');
    expect(result).toEqual([
      { tekstas: 'second match', vartotojas: 'User3', ts: 3 },
      { tekstas: 'first match', vartotojas: 'User1', ts: 1 },
    ]);
  });

  test('filters entries by user name', () => {
    const log = [
      { tekstas: 'one', vartotojas: 'Jonas', ts: 1 },
      { tekstas: 'two', vartotojas: 'Petras', ts: 2 },
      { tekstas: 'three', vartotojas: 'jonas', ts: 3 },
    ];
    const result = filterLogEntries(log, 'jonas');
    expect(result).toEqual([
      { tekstas: 'three', vartotojas: 'jonas', ts: 3 },
      { tekstas: 'one', vartotojas: 'Jonas', ts: 1 },
    ]);
  });

  test('filters entries by timestamp string', () => {
    const ts2022 = new Date('2022-05-01T00:00:00Z').getTime();
    const ts2023 = new Date('2023-05-01T00:00:00Z').getTime();
    const log = [
      { tekstas: 'old', vartotojas: 'User1', ts: ts2022 },
      { tekstas: 'new', vartotojas: 'User2', ts: ts2023 },
    ];
    const result = filterLogEntries(log, '2023');
    expect(result).toEqual([
      { tekstas: 'new', vartotojas: 'User2', ts: ts2023 },
    ]);
  });

  test('handles undefined search term without errors', () => {
    const log = [
      { tekstas: 'first', vartotojas: 'User1', ts: 1 },
      { tekstas: 'second', vartotojas: 'User2', ts: 2 },
    ];
    expect(() => filterLogEntries(log, undefined)).not.toThrow();
    const result = filterLogEntries(log, undefined);
    expect(result).toEqual([
      { tekstas: 'second', vartotojas: 'User2', ts: 2 },
      { tekstas: 'first', vartotojas: 'User1', ts: 1 },
    ]);
  });
});
