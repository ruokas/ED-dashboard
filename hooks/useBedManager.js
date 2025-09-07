import { useState } from 'react';
import useLocalStorageState from './useLocalStorageState.js';
import { NUMATYTA_BUSENA, dabar, resetBedStatus } from '@/src/utils/bedState.js';

export default function useBedManager(initialZones, pushLog) {
  const VISOS_LOVOS = Object.values(initialZones).flat();
  const [statusMap, setStatusMap] = useLocalStorageState(
    'lovuBusena',
    Object.fromEntries(VISOS_LOVOS.map(b => [b, { ...NUMATYTA_BUSENA }]))
  );
  const [zonosLovos, setZonosLovos] = useLocalStorageState('zonosLovos', initialZones);
  const [zonuPadejejas, setZonuPadejejas] = useLocalStorageState(
    'zonuPadejejas',
    Object.fromEntries(Object.keys(initialZones).map(z => [z, '']))
  );
  const [snack, setSnack] = useState(null);

  const updateBed = (bed, fn, msg) => {
    setStatusMap(prev => {
      const old = prev[bed] || NUMATYTA_BUSENA;
      const next = { ...fn(old), lastBy: 'Anon', lastAt: dabar() };
      setSnack({ bed, prev: old, msg });
      return { ...prev, [bed]: next };
    });
    pushLog(msg);
  };

  const toggleWC = b =>
    updateBed(
      b,
      s => ({
        ...s,
        needsWC: !s.needsWC,
        lastWCAt: dabar(),
        flaggedAt: !s.needsWC ? dabar() : s.needsCleaning ? s.flaggedAt : null,
      }),
      `${b}: Tualetas`
    );

  const toggleCleaning = b =>
    updateBed(
      b,
      s => ({
        ...s,
        needsCleaning: !s.needsCleaning,
        lastCleanAt: dabar(),
        flaggedAt: !s.needsCleaning ? dabar() : s.needsWC ? s.flaggedAt : null,
      }),
      `${b}: Valymas`
    );

  const markChecked = b =>
    updateBed(b, s => ({ ...s, lastCheckedAt: dabar() }), `${b}: Patikrinta`);

  const resetLova = b => {
    setStatusMap(prev => {
      const old = prev[b] || NUMATYTA_BUSENA;
      const next = resetBedStatus();
      setSnack({ bed: b, prev: old, msg: `${b}: Atstatyta` });
      return { ...prev, [b]: next };
    });
    pushLog(`${b}: Atstatyta`);
  };

  const checkAll = zona => {
    const lovos = zonosLovos[zona] || [];
    setStatusMap(prev => {
      const upd = { ...prev };
      lovos.forEach(l => {
        upd[l] = { ...upd[l], lastCheckedAt: dabar() };
      });
      return upd;
    });
    pushLog(`Zona ${zona} patikrinta`);
  };

  const undo = () => {
    if (!snack) return;
    setStatusMap(p => ({ ...p, [snack.bed]: snack.prev }));
    setSnack(null);
    pushLog(`Anuliuota ${snack.bed}`);
  };

  const handleZone = (zona, user) => {
    setZonuPadejejas(prev => {
      const next = { ...prev, [zona]: user };
      pushLog(`Padėjėjas ${user || 'nėra'} ${zona}`);
      return next;
    });
    const lovos = zonosLovos[zona] || [];
    setStatusMap(prev => {
      const upd = { ...prev };
      lovos.forEach(l => {
        upd[l] = { ...upd[l], lastCheckedAt: dabar() };
      });
      return upd;
    });
  };

  const onDragEnd = res => {
    if (!res.destination) return;
    const { source, destination, draggableId } = res;
    setZonosLovos(prev => {
      const result = { ...prev };
      const src = Array.from(result[source.droppableId]);
      const [moved] = src.splice(source.index, 1);
      if (source.droppableId === destination.droppableId) {
        src.splice(destination.index, 0, moved);
        result[source.droppableId] = src;
      } else {
        const dest = Array.from(result[destination.droppableId]);
        dest.splice(destination.index, 0, moved);
        result[source.droppableId] = src;
        result[destination.droppableId] = dest;
      }
      return result;
    });
    pushLog(`Perkelta ${draggableId} į ${destination.droppableId}`);
  };

  return {
    statusMap,
    zonosLovos,
    zonuPadejejas,
    snack,
    toggleWC,
    toggleCleaning,
    markChecked,
    resetLova,
    checkAll,
    undo,
    handleZone,
    onDragEnd,
    setZonosLovos,
  };
}

