import React from 'react';
import { useSwipeable } from 'react-swipeable';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Toilet, Brush, Check } from 'lucide-react';
import { NUMATYTA_BUSENA, dabar, laikasFormatu } from '@/src/utils/bedState.js';

function LovosKortele({ lova, index, status, onWC, onClean, onCheck }) {
  const s = status || NUMATYTA_BUSENA;
  const gesture = useSwipeable({
    onSwipedLeft: () => onWC(lova),
    onSwipedRight: () => onClean(lova),
    delta: 50,
  });
  const pradelsta = s.lastCheckedAt ? (dabar() - s.lastCheckedAt) > 30*60*1000 : true;
  const rysys = lova.startsWith('IT')
    ? 'border-2 border-blue-400'
    : pradelsta
      ? 'animate-pulse border-2 border-red-500'
      : s.needsWC || s.needsCleaning
        ? 'border-2 border-blue-400 animate-pulse'
        : '';

  return (
    <Draggable draggableId={lova} index={index}>
      {provided => (
        <Card
          {...gesture}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`p-1 w-full h-24 sm:h-28 bg-gray-200 ${rysys}`}
          title={s.lastBy ? `${s.lastBy} • ${new Date(s.lastAt).toLocaleTimeString()}` : ''}
        >
          <CardContent className="p-1 flex flex-col items-center h-full space-y-0.5">
            <span className="font-bold text-xs leading-tight">{lova}</span>
            {s.lastCheckedAt && <span className="text-[7px]">Patikrinta: {laikasFormatu(s.lastCheckedAt)}</span>}
            {s.lastWCAt && <span className="text-[7px]">Tual.: {laikasFormatu(s.lastWCAt)}</span>}
            {s.lastCleanAt && <span className="text-[7px]">Val.: {laikasFormatu(s.lastCleanAt)}</span>}
            <div className="flex gap-1 mt-auto">
              <Button size="icon" className="w-5 h-5" variant={s.needsWC?'destructive':'outline'} onClick={e=>{e.stopPropagation(); onWC(lova);}}>
                <Toilet size={12}/>
              </Button>
              <Button size="icon" className="w-5 h-5" variant={s.needsCleaning?'destructive':'outline'} onClick={e=>{e.stopPropagation(); onClean(lova);}}>
                <Brush size={12}/>
              </Button>
              <Button size="icon" className="w-5 h-5" variant="outline" onClick={e=>{e.stopPropagation(); onCheck(lova);}}>
                <Check size={12}/>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </Draggable>
  );
}

export default function ZoneSection({
  zona,
  lovos,
  statusMap,
  applyFilter,
  onWC,
  onClean,
  onCheck,
  padejejas,
  onPadejejasChange,
  checkAll,
}) {
  return (
    <div className="mb-3">
      <div className="flex items-center mb-1 gap-2">
        <h2 className="font-semibold text-xs flex-1 min-w-0 text-left truncate">{zona}</h2>
        <input
          className="border p-1 text-xs rounded flex-1 min-w-0"
          placeholder="Padėjėjas"
          value={padejejas}
          onChange={e => onPadejejasChange(e.target.value)}
        />
        <Button
          size="icon"
          variant="outline"
          onClick={checkAll}
          aria-label="Patikrinti visus"
          className="flex-shrink-0"
        >
          <Check size={14}/>
        </Button>
      </div>
      <Droppable droppableId={zona}>
        {provided => (
          <div ref={provided.innerRef} {...provided.droppableProps} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {lovos.filter(applyFilter).map((l, i) => (
              <LovosKortele
                key={l}
                index={i}
                lova={l}
                status={statusMap[l]}
                onWC={onWC}
                onClean={onClean}
                onCheck={onCheck}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
