import React from 'react';
import { useSwipeable } from 'react-swipeable';
import { Draggable } from 'react-beautiful-dnd';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Toilet, SprayCan, Check, RotateCcw } from 'lucide-react';
import { NUMATYTA_BUSENA, laikasFormatu, isOverdue } from '@/src/utils/bedState.js';

const LovosKortele = React.memo(function LovosKortele({ lova, index, status, onWC, onClean, onCheck, onReset, isTouch }) {
  const s = status || NUMATYTA_BUSENA;
  const gesture = useSwipeable({
    onSwipedLeft: () => onWC(lova),
    onSwipedRight: () => onClean(lova),
    delta: 50,
  });
  // Beds are overdue only when lastCheckedAt exists and exceeds the limit
  const pradelsta = isOverdue(s.lastCheckedAt);
  // Color legend:
  // - Blue: IT beds
  // - Red: overdue check
  // - Green: needs WC or cleaning
  // - Gray: normal status
  const rysys = lova.startsWith('IT')
    ? 'border-2 border-blue-400 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
    : pradelsta
      ? 'border-2 border-red-500 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100 dark:border-red-400'
      : s.needsWC || s.needsCleaning
        ? 'border-2 border-green-400 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 dark:border-green-400'
        : 'bg-gray-200 dark:bg-gray-700 dark:text-gray-100';

  const card = (
    <Card
      {...gesture}
      className={`flex flex-col p-1 w-full min-h-20 sm:min-h-24 h-auto motion-safe:hover:scale-105 motion-safe:transition-transform ${rysys}`}
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
      <CardFooter className="p-1 flex gap-1 justify-center">
        <Button
          size="icon-sm"
          variant={s.needsWC ? 'warning' : 'outline'}
          aria-label="Mark toilet needed"
          onClick={e => {
            e.stopPropagation();
            onWC(lova);
          }}
        >
          <Toilet size={20}/>
        </Button>
        <Button
          size="icon-sm"
          variant={s.needsCleaning ? 'warning' : 'outline'}
          aria-label="Mark cleaned"
          onClick={e => {
            e.stopPropagation();
            onClean(lova);
          }}
        >
          <SprayCan size={20}/>
        </Button>
        <Button
          size="icon-sm"
          variant={pradelsta ? 'warning' : 'success'}
          aria-label="Mark checked"
          onClick={e => {
            e.stopPropagation();
            onCheck(lova);
          }}
        >
          <Check size={20}/>
        </Button>
        <Button
          size="icon-sm"
          variant="outline"
          aria-label="Reset status"
          onClick={e => {
            e.stopPropagation();
            onReset(lova);
          }}
        >
          <RotateCcw size={20}/>
        </Button>
      </CardFooter>
    </Card>
  );

  return isTouch ? (
    card
  ) : (
    <Draggable draggableId={lova} index={index}>
      {provided => (
        React.cloneElement(card, {
          ref: provided.innerRef,
          ...provided.draggableProps,
          ...provided.dragHandleProps,
        })
      )}
    </Draggable>
  );
});

export default LovosKortele;

