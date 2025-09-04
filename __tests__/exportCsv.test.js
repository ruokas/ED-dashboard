import { exportLogToCsv } from '../src/utils/exportCsv.js';

describe('exportLogToCsv', () => {
  const originalCreate = global.URL.createObjectURL;
  const originalRevoke = global.URL.revokeObjectURL;

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2024-01-02T03:04:05.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
    global.URL.createObjectURL = originalCreate;
    global.URL.revokeObjectURL = originalRevoke;
  });

  test('generates CSV content and filename', async () => {
    const createObjectURL = jest.fn(() => 'blob:url');
    const revokeObjectURL = jest.fn();
    global.URL.createObjectURL = createObjectURL;
    global.URL.revokeObjectURL = revokeObjectURL;
    const anchor = { click: jest.fn(), set href(v){this._href=v;}, get href(){return this._href;}, set download(v){this._download=v;}, get download(){return this._download;} };
    jest.spyOn(document, 'createElement').mockReturnValue(anchor);

    class BlobMock {
      constructor(parts, opts){ this.parts = parts; this.options = opts; }
    }
    const OriginalBlob = global.Blob;
    global.Blob = BlobMock;

    const log = [{ ts: Date.parse('2024-01-01T00:00:00.000Z'), vartotojas: 'User', tekstas: 'Hello "world"' }];
    exportLogToCsv(log);

    const blob = createObjectURL.mock.calls[0][0];
    const text = blob.parts[0];
    expect(text).toBe('laikas,vartotojas,tekstas\n2024-01-01T00:00:00.000Z,User,"Hello ""world"""');
    expect(anchor.download).toBe('lovu_zurnalas_2024-01-02T03:04:05.000Z.csv');
    expect(anchor.click).toHaveBeenCalled();
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:url');

    global.Blob = OriginalBlob;
  });
});
