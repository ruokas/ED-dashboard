import React from 'react';
import { useSwipeable } from 'react-swipeable';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Toilet, Brush, Check } from 'lucide-react';

const NUMATYTA_BUSENA = {
  needsWC: false,
  needsCleaning: false,
  flaggedAt: null,
  lastBy: null,
  lastAt: null,
  lastCheckedAt: null,
  lastWCAt: null,
  lastCleanAt: null,
};
const dabar = () => Date.now();
const laikasFormatu = t => {
  const secs = Math.floor((dabar() - t) / 1000);
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${String(s).padStart(2,'0')}`;
};

function LovosKortele({ lova, index, status, onWC, onClean, onCheck }) {
  const s = status || NUMATYTA_BUSENA;
  const gesture = useSwipeable({
    onSwipedLeft: () => onWC(lova),
    onSwipedRight: () => onClean(lova),
    delta: 50,
  });
  const pradelsta = s.lastCheckedAt ? (dabar() - s.lastCheckedAt) > 30*60*1000 : true;
  const fonas = '#E2E8F0';
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
          className={`m-1 p-1 w-[80px] h-[105px] ${rysys}`}
          style={{ backgroundColor: fonas }}
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
        <h2 className="font-semibold text-xs w-20 text-left">{zona}</h2>
        <input
          className="border p-1 text-xs rounded w-20"
          placeholder="Padėjėjas"
          value={padejejas}
          onChange={e => onPadejejasChange(e.target.value)}
        />
        <Button size="icon" variant="outline" onClick={checkAll} aria-label="Patikrinti visus">
          <Check size={14}/>
        </Button>
      </div>
      <Droppable droppableId={zona}>
        {provided => (
          <div ref={provided.innerRef} {...provided.droppableProps} className="flex flex-wrap">
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
