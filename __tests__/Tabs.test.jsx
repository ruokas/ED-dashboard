import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import Tabs from '../components/Tabs.jsx';

describe('Tabs', () => {
  test.each([
    ['Lovos', 'lovos'],
    ['Žurnalas', 'zurnalas'],
    ['Analizė', 'analytics']
  ])('clicking %s sets skirtukas', (label, value) => {
    const setSkirtukas = jest.fn();
    render(<Tabs skirtukas="lovos" setSkirtukas={setSkirtukas} />);
    fireEvent.click(screen.getByText(label));
    expect(setSkirtukas).toHaveBeenCalledWith(value);
  });

  test('renders icons for all tabs', () => {
    const setSkirtukas = jest.fn();
    render(<Tabs skirtukas="lovos" setSkirtukas={setSkirtukas} />);
    expect(screen.getByRole('img', { name: /lovos/i })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /žurnalas/i })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /analizė/i })).toBeInTheDocument();
  });

  test('active tab has default variant', () => {
    const setSkirtukas = jest.fn();
    render(<Tabs skirtukas="analytics" setSkirtukas={setSkirtukas} />);
    expect(screen.getByText('Analizė')).toHaveClass('bg-blue-600');
    expect(screen.getByText('Lovos')).toHaveClass('border-gray-300');
    expect(screen.getByText('Žurnalas')).toHaveClass('border-gray-300');
  });

  test('default className and invalid handler warning', () => {
    const { container } = render(<Tabs skirtukas="lovos" setSkirtukas={() => {}} />);
    const root = container.firstChild;
    expect(root).toHaveClass('flex', 'gap-2');
    expect(root.classList.length).toBe(2);

    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    render(<Tabs skirtukas="lovos" setSkirtukas={42} />);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
