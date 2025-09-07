import { aggregateMetrics, exportMetricsToCsv } from '../src/utils/analytics.js';

describe('analytics utilities', () => {
  describe('aggregateMetrics', () => {
    test('aggregates counts and averages check intervals', () => {
      const log = [
        { ts: Date.parse('2024-01-01T00:00:00Z'), tekstas: 'A1 Tualetas' },
        { ts: Date.parse('2024-01-01T00:30:00Z'), tekstas: 'A1 Patikrinta' },
        { ts: Date.parse('2024-01-01T01:00:00Z'), tekstas: 'A1 Patikrinta' },
        { ts: Date.parse('2024-01-02T00:00:00Z'), tekstas: 'A2 Valymas' },
        { ts: Date.parse('2024-01-08T00:00:00Z'), tekstas: 'A1 Tualetas' },
      ];
      const metrics = aggregateMetrics(log);

      expect(metrics.avgCheckTime).toBeCloseTo(30);
      expect(metrics.daily).toEqual([
        { date: '2024-01-01', wc: 1, cleaning: 0, checks: 2 },
        { date: '2024-01-02', wc: 0, cleaning: 1, checks: 0 },
        { date: '2024-01-08', wc: 1, cleaning: 0, checks: 0 },
      ]);
      expect(metrics.weekly).toEqual([
        { date: '2024-W01', wc: 1, cleaning: 1, checks: 2 },
        { date: '2024-W02', wc: 1, cleaning: 0, checks: 0 },
      ]);
    });
  });

  describe('exportMetricsToCsv', () => {
    const originalCreate = global.URL.createObjectURL;
    const originalRevoke = global.URL.revokeObjectURL;
    const OriginalBlob = global.Blob;

    beforeEach(() => {
      jest.useFakeTimers().setSystemTime(new Date('2024-01-02T03:04:05.000Z'));
    });

    afterEach(() => {
      jest.useRealTimers();
      jest.restoreAllMocks();
      global.URL.createObjectURL = originalCreate;
      global.URL.revokeObjectURL = originalRevoke;
      global.Blob = OriginalBlob;
    });

    test('creates CSV and triggers download', () => {
      const createObjectURL = jest.fn(() => 'blob:url');
      const revokeObjectURL = jest.fn();
      global.URL.createObjectURL = createObjectURL;
      global.URL.revokeObjectURL = revokeObjectURL;
      const anchor = { click: jest.fn(), set href(v){this._href=v;}, get href(){return this._href;}, set download(v){this._download=v;}, get download(){return this._download;} };
      jest.spyOn(document, 'createElement').mockReturnValue(anchor);

      class BlobMock { constructor(parts, opts){ this.parts = parts; this.options = opts; } }
      global.Blob = BlobMock;

      const metrics = {
        avgCheckTime: 30,
        daily: [
          { date: '2024-01-01', wc: 1, cleaning: 0, checks: 2 },
          { date: '2024-01-02', wc: 0, cleaning: 1, checks: 0 },
          { date: '2024-01-08', wc: 1, cleaning: 0, checks: 0 },
        ],
      };

      exportMetricsToCsv(metrics);

      const blob = createObjectURL.mock.calls[0][0];
      const text = blob.parts[0];
      expect(text).toBe(
        'Average Check Time (minutes),30.00\nperiod,wc,cleaning,checks\n2024-01-01,1,0,2\n2024-01-02,0,1,0\n2024-01-08,1,0,0'
      );
      expect(anchor.download).toBe('lovu_analytics_2024-01-02T03:04:05.000Z.csv');
      expect(anchor.click).toHaveBeenCalled();
      expect(revokeObjectURL).toHaveBeenCalledWith('blob:url');
    });
  });
});
