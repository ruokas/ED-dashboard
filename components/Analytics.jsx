import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { aggregateMetrics, exportMetricsToCsv } from '@/src/utils/analytics.js';
import { Button } from '@/components/ui/button';

export default function Analytics({ log }) {
  const metrics = useMemo(() => aggregateMetrics(log), [log]);

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <Button size="sm" onClick={() => exportMetricsToCsv(metrics)}>Eksportuoti metrikas</Button>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={metrics.daily}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="wc" stackId="a" fill="#8884d8" name="WC" />
            <Bar dataKey="cleaning" stackId="a" fill="#82ca9d" name="Valymas" />
            <Bar dataKey="checks" fill="#ffc658" name="Patikrinimai" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="h-64 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={metrics.weekly}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="wc" stackId="a" fill="#8884d8" name="WC" />
            <Bar dataKey="cleaning" stackId="a" fill="#82ca9d" name="Valymas" />
            <Bar dataKey="checks" fill="#ffc658" name="Patikrinimai" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs mt-2">Vidutinis patikrinimo laikas: {metrics.avgCheckTime.toFixed(1)} min</p>
    </div>
  );
}
