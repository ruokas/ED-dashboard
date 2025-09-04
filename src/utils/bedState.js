export const NUMATYTA_BUSENA = {
  needsWC: false,
  needsCleaning: false,
  flaggedAt: null,
  lastBy: null,
  lastAt: null,
  lastCheckedAt: null,
  lastWCAt: null,
  lastCleanAt: null,
};

export const dabar = () => Date.now();

export const laikasFormatu = t => {
  const secs = Math.floor((dabar() - t) / 1000);
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${String(s).padStart(2,'0')}`;
};

export default { NUMATYTA_BUSENA, dabar, laikasFormatu };
