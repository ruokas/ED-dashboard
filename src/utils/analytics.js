export function aggregateMetrics(logEntries) {
  const daily = {};
  const weekly = {};
  const checkIntervals = [];
  const lastCheckByBed = {};

  const getWeekKey = date => {
    const d = new Date(date);
    const dayNum = d.getUTCDay() || 7; // Monday=1 ... Sunday=7
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNum = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
    return `${d.getUTCFullYear()}-W${String(weekNum).padStart(2, '0')}`;
  };

  const ensure = (map, key) => {
    if (!map[key]) map[key] = { date: key, wc: 0, cleaning: 0, checks: 0 };
    return map[key];
  };

  logEntries.forEach(entry => {
    const d = new Date(entry.ts);
    const dayKey = d.toISOString().slice(0, 10);
    const weekKey = getWeekKey(d);
    const text = entry.tekstas;
    const bedMatch = text.match(/^([A-Za-z0-9]+)/);
    const bed = bedMatch ? bedMatch[1] : null;
    const isWC = text.includes('Tualetas');
    const isCleaning = text.includes('Valymas');
    const isCheck = text.includes('Patikrinta');

    const dayObj = ensure(daily, dayKey);
    const weekObj = ensure(weekly, weekKey);

    if (isWC) { dayObj.wc++; weekObj.wc++; }
    if (isCleaning) { dayObj.cleaning++; weekObj.cleaning++; }
    if (isCheck) { dayObj.checks++; weekObj.checks++; }

    if (isCheck && bed) {
      const last = lastCheckByBed[bed];
      if (last) checkIntervals.push(entry.ts - last);
      lastCheckByBed[bed] = entry.ts;
    }
  });

  const avgCheckTime = checkIntervals.length
    ? checkIntervals.reduce((a, b) => a + b, 0) / checkIntervals.length / 60000
    : 0;

  return {
    avgCheckTime,
    daily: Object.values(daily).sort((a, b) => a.date.localeCompare(b.date)),
    weekly: Object.values(weekly).sort((a, b) => a.date.localeCompare(b.date))
  };
}

export function exportMetricsToCsv(metrics) {
  const header = 'period,wc,cleaning,checks';
  const rows = metrics.daily.map(r => [r.date, r.wc, r.cleaning, r.checks].join(','));
  const csv = [`Average Check Time (minutes),${metrics.avgCheckTime.toFixed(2)}`, header, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `lovu_analytics_${new Date().toISOString()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default { aggregateMetrics, exportMetricsToCsv };
