import React from 'react';
import { Button } from '@/components/ui/button';

export default function Filters({ filtras, setFiltras, FiltravimoRezimai, className = '' }) {
  return (
    <div className={`flex gap-2 ${className}`}>
      <Button
        className="flex-1 text-center"
        size="md"
        onClick={() => setFiltras(FiltravimoRezimai.VISI)}
        variant={filtras===FiltravimoRezimai.VISI?'default':'outline'}
      >
        Visi
      </Button>
      <Button
        className="flex-1 text-center"
        size="md"
        onClick={() => setFiltras(FiltravimoRezimai.TUALETAS)}
        variant={filtras===FiltravimoRezimai.TUALETAS?'default':'outline'}
      >
        Tualetas
      </Button>
      <Button
        className="flex-1 text-center"
        size="md"
        onClick={() => setFiltras(FiltravimoRezimai.VALYMAS)}
        variant={filtras===FiltravimoRezimai.VALYMAS?'default':'outline'}
      >
        Valymas
      </Button>
      <Button
        className="flex-1 text-center"
        size="md"
        onClick={() => setFiltras(FiltravimoRezimai.UZDELTAS)}
        variant={filtras===FiltravimoRezimai.UZDELTAS?'warning':'outline'}
      >
        Pradelstos
      </Button>
    </div>
  );
}
