import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';

export default function Filters({ filtras, setFiltras, FiltravimoRezimai, className = '' }) {
  const [open, setOpen] = useState(false);

  const handleSelect = mode => {
    setFiltras(mode);
    setOpen(false);
  };

  const items = [
    { label: 'VISI', value: FiltravimoRezimai.VISI, activeVariant: 'default' },
    { label: 'TUALETAS', value: FiltravimoRezimai.TUALETAS, activeVariant: 'default' },
    { label: 'VALYMAS', value: FiltravimoRezimai.VALYMAS, activeVariant: 'default' },
    { label: 'UZDELTAS', value: FiltravimoRezimai.UZDELTAS, activeVariant: 'warning' },
  ];

  return (
    <div className={`relative ${className}`}>
      <Button
        size="touch"
        onClick={() => setOpen(o => !o)}
        className="w-full md:w-auto"
        aria-label="Filtrai"
      >
        <Filter className="w-4 h-4 mr-1" aria-hidden="true" />
        Filtrai
      </Button>
      {open && (
        <div className="absolute mt-1 flex flex-col bg-white border border-gray-300 rounded shadow-md z-10">
          {items.map(item => (
            <Button
              key={item.value}
              size="md"
              variant={filtras === item.value ? item.activeVariant : 'outline'}
              className="text-left"
              onClick={() => handleSelect(item.value)}
            >
              {item.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
