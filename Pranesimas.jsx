import React, { useState, useEffect } from 'react';
import { Undo2 } from 'lucide-react';

export default function Pranesimas({ msg, onUndo }) {
  const [rodoma, setRodoma] = useState(true);
  useEffect(() => {
    setRodoma(true);
    const id = setTimeout(() => setRodoma(false), 2000);
    return () => clearTimeout(id);
  }, [msg]);
  if (!rodoma) return null;
  return (
    <div className="fixed bottom-1 left-1/2 -translate-x-1/2 bg-gray-800 text-white dark:bg-gray-100 dark:text-gray-800 px-2 py-0.5 rounded flex items-center gap-1 text-[10px] z-50">
      {msg}
      <button onClick={onUndo} className="underline"><Undo2 size={24}/></button>
    </div>
  );
}
