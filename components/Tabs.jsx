import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@/components/ui/button';
import BedIcon from '@/components/icons/BedIcon.jsx';
import LogIcon from '@/components/icons/LogIcon.jsx';
import ChartIcon from '@/components/icons/ChartIcon.jsx';

function Tabs({ skirtukas, setSkirtukas, className }) {
  return (
    <div className={`flex gap-2 ${className}`}>
      <Button
        className="flex-1 flex items-center justify-center px-4"
        size="touch"
        onClick={() => setSkirtukas('lovos')}
        variant={skirtukas==='lovos'?'default':'outline'}
      >
        <BedIcon className="w-4 h-4 mr-1" />
        Lovos
      </Button>
      <Button
        className="flex-1 flex items-center justify-center px-4"
        size="touch"
        onClick={() => setSkirtukas('zurnalas')}
        variant={skirtukas==='zurnalas'?'default':'outline'}
      >
        <LogIcon className="w-4 h-4 mr-1" />
        Žurnalas
      </Button>
      <Button
        className="flex-1 flex items-center justify-center px-4"
        size="touch"
        onClick={() => setSkirtukas('analytics')}
        variant={skirtukas==='analytics'?'default':'outline'}
      >
        <ChartIcon className="w-4 h-4 mr-1" />
        Analizė
      </Button>
    </div>
  );
}

Tabs.propTypes = {
  skirtukas: PropTypes.string.isRequired,
  setSkirtukas: PropTypes.func.isRequired,
  className: PropTypes.string,
};

Tabs.defaultProps = {
  className: '',
};

export default Tabs;
