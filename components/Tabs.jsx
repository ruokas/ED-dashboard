import React from 'react';
import { Button } from '@/components/ui/button';

export default function Tabs({ skirtukas, setSkirtukas }) {
  return (
    <div className="flex gap-2 mb-1">
      <Button
        className="flex-1 text-center"
        size="sm"
        onClick={() => setSkirtukas('lovos')}
        variant={skirtukas==='lovos'?'default':'outline'}
      >
        Lovos
      </Button>
      <Button
        className="flex-1 text-center"
        size="sm"
        onClick={() => setSkirtukas('zurnalas')}
        variant={skirtukas==='zurnalas'?'default':'outline'}
      >
        Žurnalas
      </Button>
    </div>
  );
}
