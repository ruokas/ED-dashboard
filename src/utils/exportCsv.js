export function exportLogToCsv(logEntries) {
  const header = 'laikas,vartotojas,tekstas';
  const rows = logEntries.map(entry => {
    const escapedText = `"${entry.tekstas.replace(/"/g, '""')}"`;
    return [new Date(entry.ts).toISOString(), entry.vartotojas, escapedText].join(',');
  });
  const csv = [header, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `lovu_zurnalas_${new Date().toISOString()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
export default { exportLogToCsv };
