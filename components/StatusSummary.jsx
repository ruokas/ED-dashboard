import React from 'react';
import { Card } from '@/components/ui/card';
import { Toilet, SprayCan, Clock } from 'lucide-react';
import { isOverdue } from '@/src/utils/bedState.js';

export default function StatusSummary({ statusMap }) {
  const statuses = Object.values(statusMap || {});
  const wcCount = statuses.filter(s => s?.needsWC).length;
  const cleaningCount = statuses.filter(s => s?.needsCleaning).length;
  const overdueCount = statuses.filter(s => isOverdue(s?.lastCheckedAt)).length;

  return (
    <div className="grid grid-cols-3 gap-2 my-2">
      <Card aria-label="needs-wc" className="flex items-center justify-center gap-2 p-2 text-sm">
        <Toilet className="text-blue-600" />
        <span>{wcCount}</span>
      </Card>
      <Card aria-label="needs-cleaning" className="flex items-center justify-center gap-2 p-2 text-sm">
        <SprayCan className="text-green-600" />
        <span>{cleaningCount}</span>
      </Card>
      <Card aria-label="overdue" className="flex items-center justify-center gap-2 p-2 text-sm">
        <Clock className="text-red-600" />
        <span>{overdueCount}</span>
      </Card>
    </div>
  );
}
