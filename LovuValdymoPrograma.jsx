import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { DragDropContext } from 'react-beautiful-dnd';
import Pranesimas from './Pranesimas.jsx';
import useLocalStorageState from './hooks/useLocalStorageState.js';
import useInterval from './hooks/useInterval.js';
import ZoneSection from './components/ZoneSection.jsx';
import Header from './components/Header.jsx';
import StatusSummary from './components/StatusSummary.jsx';
import Analytics from './components/Analytics.jsx';
import NavigationBar from './components/NavigationBar.jsx';
import LogView from './components/LogView.jsx';
import useBedManager from './hooks/useBedManager.js';
import { NUMATYTA_BUSENA, dabar, isOverdue } from '@/src/utils/bedState.js';

// ---------------- Konfigūracija -----------------
const ZONOS = {
  'A zona': ['1','2','3','4','5','6','7','8'],
  'B zona': ['9','10','11','12','13','14','15','16'],
  'IT zona': ['IT1','IT2','IT3','IT4']
};
const FiltravimoRezimai = { VISI: 'VISI', TUALETAS: 'TUALETAS', VALYMAS: 'VALYMAS', UZDELTAS: 'UZDELTAS' };

function LovuValdymoPrograma() {
  const [filtras, setFiltras] = useState(FiltravimoRezimai.VISI);
  const [, tick] = useState(0);
  const [skirtukas, setSkirtukas] = useState('lovos');
  const [zurnalas, setZurnalas] = useLocalStorageState('lovuZurnalas', []);
  const [dark, setDark] = useState(false);
  const [alertsMuted, setAlertsMuted] = useState(false);
  const alertedRef = useRef(new Set());
  const zoneRefs = useRef({});

  const pushZurnalas = tekst =>
    setZurnalas(l => [...l, { ts: dabar(), vartotojas: 'Anon', tekstas: tekst }].slice(-200));

  const {
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
  } = useBedManager(ZONOS, pushZurnalas);

  useEffect(() => {
    const lovos = Object.values(zonosLovos).flat();
    const legacy = lovos.some(v => /[PS]/.test(v));
    const mismatch = Object.entries(ZONOS).some(([z, b]) => {
      const cur = zonosLovos[z];
      return !cur || cur.length !== b.length;
    });
    if (legacy || mismatch) {
      setZonosLovos(ZONOS);
      localStorage.removeItem('lovuBusena');
      localStorage.removeItem('lovuZurnalas');
      localStorage.removeItem('zonuPadejejas');
    }
  }, [zonosLovos, setZonosLovos]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  useInterval(() => tick(x => x + 1), 1000);

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

  const applyFilter = lov => {
    const s = statusMap[lov] || NUMATYTA_BUSENA;
    if (filtras === FiltravimoRezimai.TUALETAS) return s.needsWC;
    if (filtras === FiltravimoRezimai.VALYMAS) return s.needsCleaning;
    if (filtras === FiltravimoRezimai.UZDELTAS) return isOverdue(s.lastCheckedAt);
    return true;
  };

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

  return (
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
        <NavigationBar
          filtras={filtras}
          setFiltras={setFiltras}
          FiltravimoRezimai={FiltravimoRezimai}
          skirtukas={skirtukas}
          setSkirtukas={setSkirtukas}
        />
        {skirtukas === 'lovos' && <StatusSummary statusMap={statusMap} />}
        {skirtukas === 'lovos' ? (
          <DragDropContext onDragEnd={onDragEnd}>
            {Object.entries(zonosLovos).map(([zona, lovos]) => (
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
                onPadejejasChange={user => handleZone(zona, user)}
                checkAll={() => checkAll(zona)}
              />
            ))}
          </DragDropContext>
        ) : skirtukas === 'zurnalas' ? (
          <LogView log={zurnalas} />
        ) : (
          <Analytics log={zurnalas} />
        )}
      </main>
      {snack && <Pranesimas msg={snack.msg} onUndo={undo} />}
    </div>
  );
}

LovuValdymoPrograma.propTypes = {};

LovuValdymoPrograma.defaultProps = {};

export default LovuValdymoPrograma;

