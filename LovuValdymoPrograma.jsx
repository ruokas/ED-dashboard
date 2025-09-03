import React, { useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Toilet, Brush, Check } from 'lucide-react';
import Pranesimas from './Pranesimas.jsx';

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
const laikasFormatu = t => {
  const secs = Math.floor((dabar() - t) / 1000);
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${String(s).padStart(2,'0')}`;
};

// ------------- LovosKortele Komponentas ------------
function LovosKortele({ lova, status, onWC, onClean, onCheck }) {
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
    <Droppable droppableId={lova} key={lova}>
      {provided => (
        <Card
          {...gesture}
          ref={provided.innerRef}
          {...provided.droppableProps}
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
              <Button size="icon" className="w-5 h-5" variant={s.needsWC?'destructive':'outline'} onClick={e=>{e.stopPropagation(); onWC(lova)}}>
                <Toilet size={12}/>
              </Button>
              <Button size="icon" className="w-5 h-5" variant={s.needsCleaning?'destructive':'outline'} onClick={e=>{e.stopPropagation(); onClean(lova)}}>
                <Brush size={12}/>
              </Button>
              <Button size="icon" className="w-5 h-5" variant="outline" onClick={e=>{e.stopPropagation(); onCheck(lova)}}>
                <Check size={12}/>
              </Button>
            </div>
            {provided.placeholder}
          </CardContent>
        </Card>
      )}
    </Droppable>
  );
}

// ------------- Pagrindinis Komponentas ------------
export default function LovuValdymoPrograma() {
  const [statusMap,setStatusMap]=useState(()=>{
    const saugota=localStorage.getItem('lovuBusena');
    return saugota
      ? JSON.parse(saugota)
      : Object.fromEntries(VISOS_LOVOS.map(b=>[b,{...NUMATYTA_BUSENA}]));
  });
  const [zonuPadejejas,setZonuPadejejas]=useState(()=>{
    const saugota=localStorage.getItem('zonuPadejejas');
    return saugota
      ? JSON.parse(saugota)
      : Object.fromEntries(Object.keys(ZONOS).map(z=>[z,'']));
  });
  const [filtras,setFiltras]=useState(FiltravimoRezimai.VISI);
  const [,tick]=useState(0);
  const [snack,setSnack]=useState(null);
  const [skirtukas,setSkirtukas]=useState('lovos');
  const [zurnalas,setZurnalas]=useState(()=>JSON.parse(localStorage.getItem('lovuZurnalas')||'[]'));
  const [paieska,setPaieska]=useState('');

  useEffect(()=>void localStorage.setItem('lovuBusena',JSON.stringify(statusMap)),[statusMap]);
  useEffect(()=>void localStorage.setItem('zonuPadejejas',JSON.stringify(zonuPadejejas)),[zonuPadejejas]);
  useEffect(()=>void localStorage.setItem('lovuZurnalas',JSON.stringify(zurnalas.slice(-200))),[zurnalas]);
  useEffect(()=>{const id=setInterval(()=>tick(x=>x+1),1000);return()=>clearInterval(id)},[]);

  const pushZurnalas=tekst=>setZurnalas(l=>[...l,{ts:dabar(),vartotojas:'Anon',tekstas:tekst}]);
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
  const checkAll=z=>{const lovos=ZONOS[z]||[];setStatusMap(prev=>{const upd={...prev};lovos.forEach(l=>{upd[l]={...upd[l],lastCheckedAt:dabar()}});return upd});pushZurnalas(`Zona ${z} patikrinta`);};
  const undo=()=>{if(!snack)return;setStatusMap(p=>({...p,[snack.lava]:snack.prev}));setSnack(null);pushZurnalas(`Anuliuota ${snack.lava}`);};
  const handleZone=(z,user)=>{setZonuPadejejas(prev=>{const next={...prev,[z]:user};pushZurnalas(`Padėjėjas ${user||'nėra'} ${z}`);return next;});const lovos=ZONOS[z]||[];setStatusMap(prev=>{const upd={...prev};lovos.forEach(l=>{upd[l]={...upd[l],lastCheckedAt:dabar()}});return upd});};
  const onDragEnd=res=>{if(!res.destination)return;pushZurnalas(`Perkelta ${res.draggableId} į ${res.destination.droppableId}`);};
  const filteredLog=zurnalas.slice().reverse().filter(e=>e.tekstas.toLowerCase().includes(paieska.toLowerCase()));
  const exportCsv=()=>{const hd='laikas,vartotojas,tekstas';const rows=filteredLog.map(e=>[new Date(e.ts).toISOString(),e.vartotojas,`"${e.tekstas.replace(/"/g,'""')}"`].join(','));const csv=[hd,...rows].join('\n');const blob=new Blob([csv],{type:'text/csv'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`lovu_zurnalas_${new Date().toISOString()}.csv`;a.click();URL.revokeObjectURL(url);};

  return(
    <div className="p-2 bg-gray-100 min-h-screen">
      {/* Filtrai */}
      <div className="flex gap-2 mb-1">
        <Button className="flex-1 text-center" size="sm" onClick={()=>setFiltras(FiltravimoRezimai.VISI)} variant={filtras===FiltravimoRezimai.VISI?'default':'outline'}>Visi</Button>
        <Button className="flex-1 text-center" size="sm" onClick={()=>setFiltras(FiltravimoRezimai.TUALETAS)} variant={filtras===FiltravimoRezimai.TUALETAS?'default':'outline'}>Tualetas</Button>
        <Button className="flex-1 text-center" size="sm" onClick={()=>setFiltras(FiltravimoRezimai.VALYMAS)} variant={filtras===FiltravimoRezimai.VALYMAS?'default':'outline'}>Valymas</Button>
        <Button className="flex-1 text-center" size="sm" onClick={()=>setFiltras(FiltravimoRezimai.UZDELTAS)} variant={filtras===FiltravimoRezimai.UZDELTAS?'default':'outline'}>Pradelstos</Button>
      </div>
      {/* Skirtukai */}
      <div className="flex gap-2 mb-1">
        <Button className="flex-1 text-center" size="sm" onClick={()=>setSkirtukas('lovos')} variant={skirtukas==='lovos'?'default':'outline'}>Lovos</Button>
        <Button className="flex-1 text-center" size="sm" onClick={()=>setSkirtukas('zurnalas')} variant={skirtukas==='zurnalas'?'default':'outline'}>Žurnalas</Button>
      </div>
      {skirtukas==='lovos'?(
        <DragDropContext onDragEnd={onDragEnd}>
          {Object.entries(ZONOS).map(([zona,lovos])=>(
            <div key={zona} className="mb-3">
              <div className="flex items-center mb-1 gap-2">
                <h2 className="font-semibold text-xs w-20 text-left">{zona}</h2>
                <input className="border p-1 text-xs rounded w-20" placeholder="Padėjėjas" value={zonuPadejejas[zona]} onChange={e=>handleZone(zona,e.target.value)}/>
                <Button size="icon" variant="outline" onClick={()=>checkAll(zona)} aria-label="Patikrinti visus"><Check size={14}/></Button>
              </div>
              <div className="flex flex-wrap">
                {lovos.filter(applyFilter).map(l=><LovosKortele key={l} lova={l} status={statusMap[l]} onWC={toggleWC} onClean={toggleCleaning} onCheck={markChecked}/>)}
              </div>
            </div>
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
