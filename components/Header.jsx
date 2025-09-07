import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@/components/ui/button';

function Header({
  dark,
  toggleDark,
  alertsMuted,
  toggleMute,
  zones,
  onSelectZone,
}) {
  const [selected, setSelected] = React.useState('');
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [isSmall, setIsSmall] = React.useState(() => window.innerWidth < 640);
  React.useEffect(() => {
    const onResize = () => setIsSmall(window.innerWidth < 640);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleChange = e => {
    const value = e.target.value;
    if (value) {
      onSelectZone && onSelectZone(value);
      setSelected('');
    }
  };

  const controls = (
    <>
      {zones.length > 0 && (
        <select
          value={selected}
          onChange={handleChange}
          className="glass border rounded px-2 py-1 text-sm bg-white/60 dark:bg-gray-900/60 text-gray-900 dark:text-gray-100"
        >
          <option value="" disabled>
            Zonos
          </option>
          {zones.map(z => (
            <option key={z} value={z}>
              {z}
            </option>
          ))}
        </select>
      )}
      <Button
        size="sm"
        variant="outline"
        className="glass text-gray-900 dark:text-gray-100 hover:bg-white/40 dark:hover:bg-gray-900/40"
        onClick={toggleMute}
      >
        {alertsMuted ? 'Įjungti garsą' : 'Nutildyti'}
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="glass text-gray-900 dark:text-gray-100 hover:bg-white/40 dark:hover:bg-gray-900/40"
        onClick={toggleDark}
      >
        {dark ? 'Šviesus' : 'Tamsus'}
      </Button>
    </>
  );

  return (
    <header className="glass text-gray-900 dark:text-gray-100 mb-2">
      <div className="max-w-screen-2xl mx-auto px-4 py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">SPS lovų priežiūros programa</h1>
          {isSmall && (
            <Button
              size="sm"
              variant="outline"
              className="sm:hidden"
              onClick={() => setMenuOpen(o => !o)}
              aria-label="Meniu"
            >
              ☰
            </Button>
          )}
        </div>
        <div className="hidden sm:flex gap-2 items-center">{controls}</div>
        {isSmall && menuOpen && <div className="sm:hidden flex flex-col gap-1 mt-2">{controls}</div>}
      </div>
    </header>
  );
}

Header.propTypes = {
  dark: PropTypes.bool,
  toggleDark: PropTypes.func,
  alertsMuted: PropTypes.bool,
  toggleMute: PropTypes.func,
  zones: PropTypes.arrayOf(PropTypes.string),
  onSelectZone: PropTypes.func,
};

Header.defaultProps = {
  dark: false,
  toggleDark: () => {},
  alertsMuted: false,
  toggleMute: () => {},
  zones: [],
  onSelectZone: null,
};

export default Header;
