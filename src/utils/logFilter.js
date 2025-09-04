export function filterLogEntries(log, searchTerm) {
  const term = searchTerm.toLowerCase();
  return log.slice().reverse().filter(entry => entry.tekstas.toLowerCase().includes(term));
}

export default { filterLogEntries };
