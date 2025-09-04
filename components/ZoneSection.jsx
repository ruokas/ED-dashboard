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
  // Color legend:
  // - Blue: IT beds
  // - Red: overdue check
  // - Green: needs WC or cleaning
  // - Gray: normal status
    const rysys = lova.startsWith('IT')
      ? 'border-2 border-blue-400 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
      : pradelsta
        ? 'animate-pulse border-2 border-red-500 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100 dark:border-red-400'
        : s.needsWC || s.needsCleaning
          ? 'border-2 border-green-400 bg-green-100 text-green-800 animate-pulse dark:bg-green-900 dark:text-green-100 dark:border-green-400'
          : 'bg-gray-200 dark:bg-gray-700 dark:text-gray-100';

  return (
    <Draggable draggableId={lova} index={index}>
      {provided => (
        <Card
          {...gesture}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`p-1 w-full h-24 sm:h-28 ${rysys}`}
          title={s.lastBy ? `${s.lastBy} • ${new Date(s.lastAt).toLocaleTimeString()}` : ''}
        >
          <CardContent className="p-1 flex flex-col items-center h-full space-y-0.5">
            <span className="font-bold text-xs leading-tight">{lova}</span>
            {s.lastCheckedAt && <span className="text-[7px]">Patikrinta: {laikasFormatu(s.lastCheckedAt)}</span>}
            {s.lastWCAt && <span className="text-[7px]">Tual.: {laikasFormatu(s.lastWCAt)}</span>}
            {s.lastCleanAt && <span className="text-[7px]">Val.: {laikasFormatu(s.lastCleanAt)}</span>}
            <div className="flex gap-1 mt-auto">
              <Button
                size="icon"
                className="w-5 h-5"
                variant={s.needsWC ? 'warning' : 'outline'}
                onClick={e => {
                  e.stopPropagation();
                  onWC(lova);
                }}
              >
                <Toilet size={12}/>
              </Button>
              <Button
                size="icon"
                className="w-5 h-5"
                variant={s.needsCleaning ? 'warning' : 'outline'}
                onClick={e => {
                  e.stopPropagation();
                  onClean(lova);
                }}
              >
                <Brush size={12}/>
              </Button>
              <Button
                size="icon"
                className="w-5 h-5"
                variant={pradelsta ? 'warning' : 'success'}
                onClick={e => {
                  e.stopPropagation();
                  onCheck(lova);
                }}
              >
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
          className="border p-1 text-xs rounded flex-1 min-w-0 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          placeholder="Padėjėjas"
          value={padejejas}
          onChange={e => onPadejejasChange(e.target.value)}
        />
        <Button
          size="icon"
          variant="success"
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
