import React from 'react';
import { Button } from '@/components/ui/button';

export default function Header({
  dark,
  toggleDark,
  alertsMuted,
  toggleMute,
  zones = [],
  onSelectZone,
}) {
  const [selected, setSelected] = React.useState('');

  const handleChange = e => {
    const value = e.target.value;
    if (value) {
      onSelectZone && onSelectZone(value);
      setSelected('');
    }
  };

  return (
    <header className="glass text-gray-900 dark:text-gray-100 mb-2">
      <div className="max-w-screen-2xl mx-auto px-4 py-2 flex items-center justify-between">
        <h1 className="text-lg font-semibold">ED Dashboard</h1>
        <div className="flex gap-2 items-center">
          {zones.length > 0 && (
            <select
              value={selected}
              onChange={handleChange}
              className="glass border rounded px-2 py-1 text-sm bg-white/60 dark:bg-gray-900/60 text-gray-900 dark:text-gray-100"
            >
              <option value="" disabled>
                Zonos
              </option>
              {zones.map(z => (
                <option key={z} value={z}>
                  {z}
                </option>
              ))}
            </select>
          )}
          <Button
            size="sm"
            variant="outline"
            className="glass text-gray-900 dark:text-gray-100 hover:bg-white/40 dark:hover:bg-gray-900/40"
            onClick={toggleMute}
          >
            {alertsMuted ? 'Unmute' : 'Mute'}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="glass text-gray-900 dark:text-gray-100 hover:bg-white/40 dark:hover:bg-gray-900/40"
            onClick={toggleDark}
          >
            {dark ? 'Light' : 'Dark'}
          </Button>
        </div>
      </div>
    </header>
  );
}
