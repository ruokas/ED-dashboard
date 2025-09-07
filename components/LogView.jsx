import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { exportLogToCsv } from '@/src/utils/exportCsv.js';
import { filterLogEntries } from '@/src/utils/logFilter.js';

export default function LogView({ log }) {
  const [search, setSearch] = useState('');
  const filteredLog = filterLogEntries(log, search);

  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <input
          className="border p-1 rounded text-xs flex-1 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          placeholder="Ieškoti žurnale"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <Button size="sm" onClick={() => exportLogToCsv(filteredLog)}>
          Eksportuoti CSV
        </Button>
      </div>
      <ul className="text-xs space-y-1 max-h-[70vh] overflow-auto">
        {filteredLog.map(e => (
          <li key={e.ts} className="py-0.5">
            {e.vartotojas}[{new Date(e.ts).toLocaleTimeString()}]: {e.tekstas}
          </li>
        ))}
      </ul>
    </div>
  );
}

