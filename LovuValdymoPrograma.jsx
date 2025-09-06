import React, { useState, useEffect, useRef } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { Button } from '@/components/ui/button';
import Pranesimas from './Pranesimas.jsx';
import useLocalStorageState from './hooks/useLocalStorageState.js';
import useInterval from './hooks/useInterval.js';
import Filters from './components/Filters.jsx';
import Tabs from './components/Tabs.jsx';
import ZoneSection from './components/ZoneSection.jsx';
import Header from './components/Header.jsx';
import StatusSummary from './components/StatusSummary.jsx';
import { NUMATYTA_BUSENA, dabar, isOverdue, resetBedStatus } from '@/src/utils/bedState.js';
import { exportLogToCsv } from '@/src/utils/exportCsv.js';
import { filterLogEntries } from '@/src/utils/logFilter.js';

// ---------------- Konfigūracija -----------------
const ZONOS = {
  'A zona': ['1','2','3','4','5','6','7','8'],
  'B zona': ['9','10','11','12','13','14','15','16'],
  'IT zona': ['IT1','IT2','IT3','IT4']
};
const VISOS_LOVOS = Object.values(ZONOS).flat();

// ------------- Tipai --------------------
const FiltravimoRezimai = { VISI: 'VISI', TUALETAS: 'TUALETAS', VALYMAS: 'VALYMAS', UZDELTAS: 'UZDELTAS' };


// ------------- Pagrindinis Komponentas ------------
export default function LovuValdymoPrograma() {
  const [statusMap,setStatusMap]=useLocalStorageState(
    'lovuBusena',
    Object.fromEntries(VISOS_LOVOS.map(b=>[b,{...NUMATYTA_BUSENA}]))
  );
  const [zonosLovos,setZonosLovos]=useLocalStorageState('zonosLovos',ZONOS);
  const [zonuPadejejas,setZonuPadejejas]=useLocalStorageState(
    'zonuPadejejas',
    Object.fromEntries(Object.keys(ZONOS).map(z=>[z,'']))
  );
  const [filtras,setFiltras]=useState(FiltravimoRezimai.VISI);
  const [,tick]=useState(0);
  const [snack,setSnack]=useState(null);
  const [skirtukas,setSkirtukas]=useState('lovos');
  const [zurnalas,setZurnalas]=useLocalStorageState('lovuZurnalas',[]);
  const [paieska,setPaieska]=useState('');
  const [dark,setDark]=useState(false);
  const [alertsMuted,setAlertsMuted]=useState(false);
  const alertedRef = useRef(new Set());
  const zoneRefs = useRef({});

  useEffect(()=>{
    const lovos = Object.values(zonosLovos).flat();
    const legacy = lovos.some(v=>/[PS]/.test(v));
    const mismatch = Object.entries(ZONOS).some(([z,b])=>{
      const cur = zonosLovos[z];
      return !cur || cur.length!==b.length;
    });
    if(legacy||mismatch){
      setZonosLovos(ZONOS);
      localStorage.removeItem('lovuBusena');
      localStorage.removeItem('lovuZurnalas');
      localStorage.removeItem('zonuPadejejas');
    }
  },[zonosLovos,ZONOS]);

  useEffect(()=>{document.documentElement.classList.toggle('dark',dark);},[dark]);

  useInterval(() => tick(x => x + 1), 1000);

  const pushZurnalas=tekst=>setZurnalas(l=>[...l,{ts:dabar(),vartotojas:'Anon',tekstas:tekst}].slice(-200));

  useEffect(() => {
    Object.entries(statusMap).forEach(([lova, s]) => {
      const overdue = isOverdue(s.lastCheckedAt);
      const alerted = alertedRef.current;
      if (overdue && !alerted.has(lova)) {
        alerted.add(lova);
        pushZurnalas(`${lova}: Pradelsta`);
        if (!alertsMuted) {
          try {
            if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
              new Notification(`Lova ${lova} pradelsta`);
            } else {
              // Fallback garso signalas
              const a = new Audio('/beep.mp3');
              a.play().catch(() => {});
            }
          } catch (e) {
            // Ignoruojame klaidas pranešimuose
          }
        }
      } else if (!overdue && alerted.has(lova)) {
        alerted.delete(lova);
      }
    });
  }, [tick, statusMap, alertsMuted]);
  const applyFilter=lov=>{
    const s=statusMap[lov]||NUMATYTA_BUSENA;
    if(filtras===FiltravimoRezimai.TUALETAS) return s.needsWC;
    if(filtras===FiltravimoRezimai.VALYMAS) return s.needsCleaning;
    if(filtras===FiltravimoRezimai.UZDELTAS) return isOverdue(s.lastCheckedAt);
    return true;
  };
  const updateLova=(lova,fn,msg)=>{setStatusMap(prev=>{const old=prev[lova]||NUMATYTA_BUSENA;const next={...fn(old),lastBy:'Anon',lastAt:dabar()};setSnack({bed:lova,prev:old,msg});return{...prev,[lova]:next};});pushZurnalas(msg);};
  const toggleWC=b=>updateLova(b,s=>({...s,needsWC:!s.needsWC,lastWCAt:dabar(),flaggedAt:!s.needsWC?dabar():s.needsCleaning?s.flaggedAt:null}),`${b}: Tualetas`);
  const toggleCleaning=b=>updateLova(b,s=>({...s,needsCleaning:!s.needsCleaning,lastCleanAt:dabar(),flaggedAt:!s.needsCleaning?dabar():s.needsWC?s.flaggedAt:null}),`${b}: Valymas`);
  const markChecked=b=>updateLova(b,s=>({...s,lastCheckedAt:dabar()}),`${b}: Patikrinta`);
  const resetLova=b=>{setStatusMap(prev=>{const old=prev[b]||NUMATYTA_BUSENA;const next=resetBedStatus();setSnack({bed:b,prev:old,msg:`${b}: Atstatyta`});return{...prev,[b]:next};});pushZurnalas(`${b}: Atstatyta`);};
  const checkAll=z=>{const lovos=zonosLovos[z]||[];setStatusMap(prev=>{const upd={...prev};lovos.forEach(l=>{upd[l]={...upd[l],lastCheckedAt:dabar()}});return upd});pushZurnalas(`Zona ${z} patikrinta`);};
  const undo=()=>{if(!snack)return;setStatusMap(p=>({...p,[snack.bed]:snack.prev}));setSnack(null);pushZurnalas(`Anuliuota ${snack.bed}`);};
  const handleZone=(z,user)=>{setZonuPadejejas(prev=>{const next={...prev,[z]:user};pushZurnalas(`Padėjėjas ${user||'nėra'} ${z}`);return next;});const lovos=zonosLovos[z]||[];setStatusMap(prev=>{const upd={...prev};lovos.forEach(l=>{upd[l]={...upd[l],lastCheckedAt:dabar()}});return upd});};
  const onDragEnd=res=>{if(!res.destination)return;const {source,destination,draggableId}=res;setZonosLovos(prev=>{const result={...prev};const src=Array.from(result[source.droppableId]);const [moved]=src.splice(source.index,1);if(source.droppableId===destination.droppableId){src.splice(destination.index,0,moved);result[source.droppableId]=src;}else{const dest=Array.from(result[destination.droppableId]);dest.splice(destination.index,0,moved);result[source.droppableId]=src;result[destination.droppableId]=dest;}return result;});pushZurnalas(`Perkelta ${draggableId} į ${destination.droppableId}`);};
  const scrollToZone = zona => {
    const el = zoneRefs.current[zona];
    if (el && el.scrollIntoView) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      el.classList.add('ring-2', 'ring-yellow-300');
      setTimeout(() => {
        el.classList.remove('ring-2', 'ring-yellow-300');
      }, 1500);
    }
  };
  const filteredLog = filterLogEntries(zurnalas, paieska);

  return(
    <div className="min-h-screen bg-gradient-to-br from-slate-200 via-white to-slate-200 dark:from-gray-900 dark:via-gray-950 dark:to-gray-800">
      <Header
        dark={dark}
        toggleDark={() => setDark(d => !d)}
        alertsMuted={alertsMuted}
        toggleMute={() => setAlertsMuted(m => !m)}
        zones={Object.keys(zonosLovos)}
        onSelectZone={scrollToZone}
      />
      <main className="max-w-screen-2xl mx-auto p-2">
        <Filters filtras={filtras} setFiltras={setFiltras} FiltravimoRezimai={FiltravimoRezimai}/>
        <Tabs skirtukas={skirtukas} setSkirtukas={setSkirtukas}/>
        {skirtukas==='lovos' && <StatusSummary statusMap={statusMap}/>} 
        {skirtukas==='lovos'?( 
          <DragDropContext onDragEnd={onDragEnd}>
            {Object.entries(zonosLovos).map(([zona,lovos])=> (
              <ZoneSection
                ref={el => (zoneRefs.current[zona] = el)}
                key={zona}
                zona={zona}
                lovos={lovos}
                statusMap={statusMap}
                applyFilter={applyFilter}
                onWC={toggleWC}
                onClean={toggleCleaning}
                onCheck={markChecked}
                onReset={resetLova}
                padejejas={zonuPadejejas[zona]}
                onPadejejasChange={user=>handleZone(zona,user)}
                checkAll={()=>checkAll(zona)}
              />
            ))}
          </DragDropContext>
        ):(
          <div>
            <div className="flex items-center gap-2 mb-1">
              <input className="border p-1 rounded text-xs flex-1 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100" placeholder="Ieškoti žurnale" value={paieska} onChange={e=>setPaieska(e.target.value)}/>
              <Button size="sm" onClick={() => exportLogToCsv(filteredLog)}>Eksportuoti CSV</Button>
            </div>
              <ul className="text-xs space-y-1 max-h-[70vh] overflow-auto">
                {filteredLog.map(e => (
                  <li key={e.ts} className="py-0.5">
                    {e.vartotojas}[{new Date(e.ts).toLocaleTimeString()}]: {e.tekstas}
                  </li>
                ))}
              </ul>
          </div>
        )}
      </main>
      {snack&&<Pranesimas msg={snack.msg} onUndo={undo}/>}
    </div>
  );
}
