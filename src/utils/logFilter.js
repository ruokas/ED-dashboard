export function filterLogEntries(log, searchTerm) {
  const term = searchTerm.toLowerCase();
  return log
    .slice()
    .reverse()
    .filter(entry => {
      const tekstas = entry.tekstas ? entry.tekstas.toLowerCase() : '';
      const vartotojas = entry.vartotojas ? entry.vartotojas.toLowerCase() : '';
      const timestamp = entry.ts ? new Date(entry.ts).toLocaleString().toLowerCase() : '';
      return (
        tekstas.includes(term) ||
        vartotojas.includes(term) ||
        timestamp.includes(term)
      );
    });
}

export default { filterLogEntries };
