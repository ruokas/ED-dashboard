import React, { useState, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { Button } from '@/components/ui/button';
import Pranesimas from './Pranesimas.jsx';
import useLocalStorageState from './hooks/useLocalStorageState.js';
import Filters from './components/Filters.jsx';
import Tabs from './components/Tabs.jsx';
import ZoneSection from './components/ZoneSection.jsx';

// ---------------- Konfigūracija -----------------
const ZONOS = {
  'IT Zona': ['IT1', 'IT2'],
  'Zona 1': ['1','2','3','P1','P2','P1/P2','P3','S1','S2','S3'],
  'Zona 2': ['4','5','6','P4','P5','P5/6P','P6','S4','S5','S6'],
  'Zona 3': ['7','8','9','P7','P7/P8','P8','P9','S7','S8','S9'],
  'Zona 4': ['10','11','12','P10','P11','P11/P12','P12','S10','S11','S12'],
  'Zona 5': ['13','14','15','16','17','121A','121B','IZO']
};
const VISOS_LOVOS = Object.values(ZONOS).flat();

// ------------- Tipai --------------------
const FiltravimoRezimai = { VISI: 'VISI', TUALETAS: 'TUALETAS', VALYMAS: 'VALYMAS', UZDELTAS: 'UZDELTAS' };

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
  
  useEffect(()=>{const id=setInterval(()=>tick(x=>x+1),1000);return()=>clearInterval(id)},[]);

  const pushZurnalas=tekst=>setZurnalas(l=>[...l,{ts:dabar(),vartotojas:'Anon',tekstas:tekst}].slice(-200));
  const applyFilter=lov=>{
    const s=statusMap[lov]||NUMATYTA_BUSENA;
    if(filtras===FiltravimoRezimai.TUALETAS) return s.needsWC;
    if(filtras===FiltravimoRezimai.VALYMAS) return s.needsCleaning;
    if(filtras===FiltravimoRezimai.UZDELTAS) return !s.lastCheckedAt || (dabar()-s.lastCheckedAt)>30*60*1000;
    return true;
  };
  const updateLova=(lova,fn,msg)=>{setStatusMap(prev=>{const old=prev[lova]||NUMATYTA_BUSENA;const next={...fn(old),lastBy:'Anon',lastAt:dabar()};setSnack({lava:lova,prev:old,msg});return{...prev,[lova]:next};});pushZurnalas(msg);};
  const toggleWC=b=>updateLova(b,s=>({...s,needsWC:!s.needsWC,lastWCAt:dabar(),flaggedAt:!s.needsWC?dabar():s.needsCleaning?s.flaggedAt:null}),`${b}: Tualetas`);
  const toggleCleaning=b=>updateLova(b,s=>({...s,needsCleaning:!s.needsCleaning,lastCleanAt:dabar(),flaggedAt:!s.needsCleaning?dabar():s.needsWC?s.flaggedAt:null}),`${b}: Valymas`);
  const markChecked=b=>updateLova(b,s=>({...s,lastCheckedAt:dabar()}),`${b}: Patikrinta`);
  const checkAll=z=>{const lovos=zonosLovos[z]||[];setStatusMap(prev=>{const upd={...prev};lovos.forEach(l=>{upd[l]={...upd[l],lastCheckedAt:dabar()}});return upd});pushZurnalas(`Zona ${z} patikrinta`);};
  const undo=()=>{if(!snack)return;setStatusMap(p=>({...p,[snack.lava]:snack.prev}));setSnack(null);pushZurnalas(`Anuliuota ${snack.lava}`);};
  const handleZone=(z,user)=>{setZonuPadejejas(prev=>{const next={...prev,[z]:user};pushZurnalas(`Padėjėjas ${user||'nėra'} ${z}`);return next;});const lovos=zonosLovos[z]||[];setStatusMap(prev=>{const upd={...prev};lovos.forEach(l=>{upd[l]={...upd[l],lastCheckedAt:dabar()}});return upd});};
  const onDragEnd=res=>{if(!res.destination)return;const {source,destination,draggableId}=res;setZonosLovos(prev=>{const result={...prev};const src=Array.from(result[source.droppableId]);const [moved]=src.splice(source.index,1);if(source.droppableId===destination.droppableId){src.splice(destination.index,0,moved);result[source.droppableId]=src;}else{const dest=Array.from(result[destination.droppableId]);dest.splice(destination.index,0,moved);result[source.droppableId]=src;result[destination.droppableId]=dest;}return result;});pushZurnalas(`Perkelta ${draggableId} į ${destination.droppableId}`);};
  const filteredLog=zurnalas.slice().reverse().filter(e=>e.tekstas.toLowerCase().includes(paieska.toLowerCase()));
  const exportCsv=()=>{const hd='laikas,vartotojas,tekstas';const rows=filteredLog.map(e=>[new Date(e.ts).toISOString(),e.vartotojas,`"${e.tekstas.replace(/"/g,'""')}"`].join(','));const csv=[hd,...rows].join('\n');const blob=new Blob([csv],{type:'text/csv'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`lovu_zurnalas_${new Date().toISOString()}.csv`;a.click();URL.revokeObjectURL(url);};

  return(
    <div className="p-2 bg-gray-100 min-h-screen">
      <Filters filtras={filtras} setFiltras={setFiltras} FiltravimoRezimai={FiltravimoRezimai}/>
      <Tabs skirtukas={skirtukas} setSkirtukas={setSkirtukas}/>
      {skirtukas==='lovos'?(
        <DragDropContext onDragEnd={onDragEnd}>
          {Object.entries(zonosLovos).map(([zona,lovos])=> (
            <ZoneSection
              key={zona}
              zona={zona}
              lovos={lovos}
              statusMap={statusMap}
              applyFilter={applyFilter}
              onWC={toggleWC}
              onClean={toggleCleaning}
              onCheck={markChecked}
              padejejas={zonuPadejejas[zona]}
              onPadejejasChange={user=>handleZone(zona,user)}
              checkAll={()=>checkAll(zona)}
            />
          ))}
        </DragDropContext>
      ):(
        <div>
          <div className="flex items-center gap-2 mb-1">
            <input className="border p-1 rounded text-xs flex-1" placeholder="Ieškoti žurnale" value={paieska} onChange={e=>setPaieska(e.target.value)}/>
            <Button size="sm" onClick={exportCsv}>Eksportuoti CSV</Button>
          </div>
          <ul className="text-xs space-y-1 max-h-[70vh] overflow-auto">
            {filteredLog.map((e,i)=><li key={i} className="py-0.5">{e.vartotojas}[{new Date(e.ts).toLocaleTimeString()}]: {e.tekstas}</li>)}
          </ul>
        </div>
      )}
      {snack&&<Pranesimas msg={snack.msg} onUndo={undo}/>}
    </div>
  );
}
