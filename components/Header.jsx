import React from 'react';
import { Button } from '@/components/ui/button';

export default function Header({ dark, toggleDark }) {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md mb-4">
      <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-semibold">ED Dashboard</h1>
        <Button
          size="sm"
          variant="outline"
          className="border-white text-white hover:bg-white/20"
          onClick={toggleDark}
        >
          {dark ? 'Light' : 'Dark'}
        </Button>
      </div>
    </header>
  );
}
