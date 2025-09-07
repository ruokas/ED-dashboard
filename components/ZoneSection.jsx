import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { Button } from '@/components/ui/button';
import { Check, ChevronDown, ChevronRight } from 'lucide-react';
import LovosKortele from './LovosKortele.jsx';

const ZoneSection = React.forwardRef(function ZoneSection({
  zona,
  lovos,
  statusMap,
  applyFilter,
  onWC,
  onClean,
  onCheck,
  onReset,
  padejejas,
  onPadejejasChange,
  checkAll,
}, ref) {
  const [expanded, setExpanded] = React.useState(true);

  return (
    <div ref={ref} className="mb-2">
      <div className="flex items-center mb-1 gap-2">
        <Button
          size="icon"
          variant="outline"
          onClick={() => setExpanded(e => !e)}
          aria-label={expanded ? 'Collapse zone' : 'Expand zone'}
          className="flex-shrink-0"
        >
          {expanded ? <ChevronDown size={24}/> : <ChevronRight size={24}/>}
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
          <Check size={24}/>
        </Button>
      </div>
      {expanded && (
        <Droppable droppableId={zona}>
          {provided => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="grid grid-cols-[repeat(auto-fit,minmax(7rem,1fr))] sm:grid-cols-[repeat(auto-fit,minmax(8rem,1fr))] md:grid-cols-[repeat(auto-fit,minmax(9rem,1fr))] lg:grid-cols-[repeat(auto-fit,minmax(10rem,1fr))] gap-1"
            >
              {lovos.filter(applyFilter).map((l, i) => (
                <LovosKortele
                  key={l}
                  index={i}
                  lova={l}
                  status={statusMap[l]}
                  onWC={onWC}
                  onClean={onClean}
                  onCheck={onCheck}
                  onReset={onReset}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      )}
    </div>
  );
});

export default ZoneSection;
