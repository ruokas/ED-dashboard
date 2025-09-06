import React from 'react';
import { Button } from '@/components/ui/button';

export default function Tabs({ skirtukas, setSkirtukas, className = '' }) {
  return (
    <div className={`flex gap-2 ${className}`}>
      <Button
        className="flex-1 text-center"
        size="md"
        onClick={() => setSkirtukas('lovos')}
        variant={skirtukas==='lovos'?'default':'outline'}
      >
        Lovos
      </Button>
      <Button
        className="flex-1 text-center"
        size="md"
        onClick={() => setSkirtukas('zurnalas')}
        variant={skirtukas==='zurnalas'?'default':'outline'}
      >
        Žurnalas
      </Button>
      <Button
        className="flex-1 text-center"
        size="md"
        onClick={() => setSkirtukas('analytics')}
        variant={skirtukas==='analytics'?'default':'outline'}
      >
        Analytics
      </Button>
    </div>
  );
}
