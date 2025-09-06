import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import Filters from '../components/Filters.jsx';

const FiltravimoRezimai = {
  VISI: 'VISI',
  TUALETAS: 'TUALETAS',
  VALYMAS: 'VALYMAS',
  UZDELTAS: 'UZDELTAS'
};

const options = [
  { label: 'VISI', value: 'VISI', activeClass: 'bg-blue-600' },
  { label: 'TUALETAS', value: 'TUALETAS', activeClass: 'bg-blue-600' },
  { label: 'VALYMAS', value: 'VALYMAS', activeClass: 'bg-blue-600' },
  { label: 'UZDELTAS', value: 'UZDELTAS', activeClass: 'bg-yellow-500' }
];

describe('Filters', () => {
  test.each(options)('$label item sets filter and variant', ({ label, value, activeClass }) => {
    const setFiltras = jest.fn();
    const { rerender } = render(
      <Filters filtras={FiltravimoRezimai.VISI} setFiltras={setFiltras} FiltravimoRezimai={FiltravimoRezimai} />
    );

    fireEvent.click(screen.getByText('Filtrai'));
    fireEvent.click(screen.getByText(label));
    expect(setFiltras).toHaveBeenCalledWith(FiltravimoRezimai[value]);

    rerender(
      <Filters filtras={FiltravimoRezimai[value]} setFiltras={setFiltras} FiltravimoRezimai={FiltravimoRezimai} />
    );
    fireEvent.click(screen.getByText('Filtrai'));
    expect(screen.getByText(label)).toHaveClass(activeClass);
    const other = options.find(o => o.label !== label);
    expect(screen.getByText(other.label)).toHaveClass('border-gray-300');
  });
});
