import React, { useState, useEffect } from 'react';
import Filters from './Filters.jsx';
import Tabs from './Tabs.jsx';
import { Button } from '@/components/ui/button';

export default function NavigationBar({ filtras, setFiltras, FiltravimoRezimai, skirtukas, setSkirtukas }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMd, setIsMd] = useState(() => window.innerWidth >= 768);

  useEffect(() => {
    const onResize = () => setIsMd(window.innerWidth >= 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <nav className="mb-1 flex flex-col">
      {!isMd && (
        <Button
          size="sm"
          variant="outline"
          className="mb-1 self-start md:hidden"
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Meniu"
        >
          ☰
        </Button>
      )}
      {(menuOpen || isMd) && (
        <div className="flex flex-col md:flex-row gap-1">
          <Filters
            filtras={filtras}
            setFiltras={setFiltras}
            FiltravimoRezimai={FiltravimoRezimai}
            className="w-full md:w-auto flex-none"
          />
          <Tabs
            skirtukas={skirtukas}
            setSkirtukas={setSkirtukas}
            className="flex-1"
          />
        </div>
      )}
    </nav>
  );
}

