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

export const resetBedStatus = () => ({ ...NUMATYTA_BUSENA });

export const dabar = () => Date.now();

export const laikasFormatu = t => {
  const secs = Math.floor((dabar() - t) / 1000);
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${String(s).padStart(2,'0')}`;
};

export const isOverdue = (lastCheckedAt, limitMs = 30 * 60 * 1000) => {
  return !lastCheckedAt || (dabar() - lastCheckedAt) > limitMs;
};
export default { NUMATYTA_BUSENA, dabar, laikasFormatu, isOverdue, resetBedStatus };
