import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import Tabs from '../components/Tabs.jsx';

describe('Tabs', () => {
  test.each([
    ['Lovos', 'lovos', 'zurnalas', 'Žurnalas'],
    ['Žurnalas', 'zurnalas', 'lovos', 'Lovos']
  ])('clicking %s sets skirtukas and variant', (label, value, initial, otherLabel) => {
    const setSkirtukas = jest.fn();
    const { rerender } = render(<Tabs skirtukas={initial} setSkirtukas={setSkirtukas} />);

    fireEvent.click(screen.getByText(label));
    expect(setSkirtukas).toHaveBeenCalledWith(value);

    rerender(<Tabs skirtukas={value} setSkirtukas={setSkirtukas} />);
    expect(screen.getByText(label)).toHaveClass('bg-blue-600');
    expect(screen.getByText(otherLabel)).toHaveClass('border-gray-300');
  });
});
