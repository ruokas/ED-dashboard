import React from 'react';
import { Button } from '@/components/ui/button';

export default function Filters({ filtras, setFiltras, FiltravimoRezimai }) {
  return (
    <div className="flex gap-2 mb-1">
      <Button className="flex-1 text-center" size="sm" onClick={() => setFiltras(FiltravimoRezimai.VISI)} variant={filtras===FiltravimoRezimai.VISI?'default':'outline'}>Visi</Button>
      <Button className="flex-1 text-center" size="sm" onClick={() => setFiltras(FiltravimoRezimai.TUALETAS)} variant={filtras===FiltravimoRezimai.TUALETAS?'default':'outline'}>Tualetas</Button>
      <Button className="flex-1 text-center" size="sm" onClick={() => setFiltras(FiltravimoRezimai.VALYMAS)} variant={filtras===FiltravimoRezimai.VALYMAS?'default':'outline'}>Valymas</Button>
      <Button className="flex-1 text-center" size="sm" onClick={() => setFiltras(FiltravimoRezimai.UZDELTAS)} variant={filtras===FiltravimoRezimai.UZDELTAS?'default':'outline'}>Pradelstos</Button>
    </div>
  );
}
