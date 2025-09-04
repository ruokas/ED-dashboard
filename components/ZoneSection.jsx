import React from 'react';
import { useSwipeable } from 'react-swipeable';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Toilet, Brush, Check, ChevronDown, ChevronRight } from 'lucide-react';
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
          className={`flex flex-col p-2 w-full h-28 sm:h-32 hover:scale-105 transition-transform ${rysys}`}
          title={s.lastBy ? `${s.lastBy} • ${new Date(s.lastAt).toLocaleTimeString()}` : ''}
        >
          <CardHeader className="p-1 flex justify-center">
            <span className="text-sm leading-tight">{lova}</span>
          </CardHeader>
          <CardContent className="p-1 flex flex-col items-center flex-1 space-y-0.5">
            {s.lastCheckedAt && (
              <span className="text-xs">Patikrinta: {laikasFormatu(s.lastCheckedAt)}</span>
            )}
            {s.lastWCAt && (
              <span className="text-xs">Tual.: {laikasFormatu(s.lastWCAt)}</span>
            )}
            {s.lastCleanAt && (
              <span className="text-xs">Val.: {laikasFormatu(s.lastCleanAt)}</span>
            )}
          </CardContent>
          <CardFooter className="p-1 flex gap-2 justify-center">
            <Button
              size="icon"
              className="w-8 h-8"
              variant={s.needsWC ? 'warning' : 'outline'}
              aria-label="Mark toilet needed"
              onClick={e => {
                e.stopPropagation();
                onWC(lova);
              }}
            >
              <Toilet size={16}/>
            </Button>
            <Button
              size="icon"
              className="w-8 h-8"
              variant={s.needsCleaning ? 'warning' : 'outline'}
              aria-label="Mark cleaned"
              onClick={e => {
                e.stopPropagation();
                onClean(lova);
              }}
            >
              <Brush size={16}/>
            </Button>
            <Button
              size="icon"
              className="w-8 h-8"
              variant={pradelsta ? 'warning' : 'success'}
              aria-label="Mark checked"
              onClick={e => {
                e.stopPropagation();
                onCheck(lova);
              }}
            >
              <Check size={16}/>
            </Button>
          </CardFooter>
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
  const [expanded, setExpanded] = React.useState(true);

  return (
    <div className="mb-3">
      <div className="flex items-center mb-1 gap-2">
        <Button
          size="icon"
          variant="outline"
          onClick={() => setExpanded(e => !e)}
          aria-label={expanded ? 'Collapse zone' : 'Expand zone'}
          className="flex-shrink-0"
        >
          {expanded ? <ChevronDown size={14}/> : <ChevronRight size={14}/>}
        </Button>
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
      {expanded && (
        <Droppable droppableId={zona}>
          {provided => (
            <div ref={provided.innerRef} {...provided.droppableProps} className="grid grid-cols-[repeat(auto-fit,minmax(8rem,1fr))] gap-2">
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
      )}
    </div>
  );
}
