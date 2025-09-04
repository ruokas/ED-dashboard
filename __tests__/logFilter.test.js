import { filterLogEntries } from '../src/utils/logFilter.js';

describe('filterLogEntries', () => {
  test('filters entries case-insensitively', () => {
    const log = [
      { tekstas: 'Error occurred' },
      { tekstas: 'All good' },
      { tekstas: 'another ERROR here' },
    ];
    const result = filterLogEntries(log, 'error');
    expect(result).toEqual([
      { tekstas: 'another ERROR here' },
      { tekstas: 'Error occurred' },
    ]);
  });

  test('returns entries in reverse order', () => {
    const log = [
      { tekstas: 'first match' },
      { tekstas: 'unrelated' },
      { tekstas: 'second match' },
    ];
    const result = filterLogEntries(log, 'match');
    expect(result).toEqual([
      { tekstas: 'second match' },
      { tekstas: 'first match' },
    ]);
  });
});
