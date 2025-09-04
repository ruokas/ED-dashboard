import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { DragDropContext } from 'react-beautiful-dnd';
import ZoneSection from '../components/ZoneSection.jsx';

jest.mock(
  'react-swipeable',
  () => ({
    useSwipeable: () => ({})
  }),
  { virtual: true }
);

const renderZone = () =>
  render(
    <DragDropContext onDragEnd={() => {}}>
      <ZoneSection
        zona="Test"
        lovos={['1']}
        statusMap={{}}
        applyFilter={() => true}
        onWC={() => {}}
        onClean={() => {}}
        onCheck={() => {}}
        padejejas=""
        onPadejejasChange={() => {}}
        checkAll={() => {}}
      />
    </DragDropContext>
  );

describe('ZoneSection responsiveness', () => {
  afterEach(() => cleanup());

  test('uses base size classes on small screens', () => {
    window.innerWidth = 500;
    renderZone();
    const card = screen.getByText('1').closest('.bg-red-100');
    expect(card).toHaveClass('w-full', 'h-28');
  });

  test('includes larger size classes for sm breakpoint', () => {
    window.innerWidth = 700;
    renderZone();
    const card = screen.getByText('1').closest('.bg-red-100');
    expect(card).toHaveClass('w-full', 'sm:h-32');
  });
});

describe('ZoneSection collapse toggle', () => {
  afterEach(() => cleanup());

  test('toggle button hides and shows bed grid', () => {
    const { queryByText } = renderZone();
    expect(queryByText('1')).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('Collapse zone'));
    expect(queryByText('1')).not.toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('Expand zone'));
    expect(queryByText('1')).toBeInTheDocument();
  });
});

describe('ZoneSection card layout', () => {
  afterEach(() => cleanup());

  test('buttons remain within card bounds', () => {
    renderZone();
    const card = screen.getByText('1').closest('div');
    const cardRect = card.getBoundingClientRect();
    const buttons = card.querySelectorAll('button');
    buttons.forEach(btn => {
      const rect = btn.getBoundingClientRect();
      expect(rect.left).toBeGreaterThanOrEqual(cardRect.left);
      expect(rect.right).toBeLessThanOrEqual(cardRect.right);
      expect(rect.top).toBeGreaterThanOrEqual(cardRect.top);
      expect(rect.bottom).toBeLessThanOrEqual(cardRect.bottom);
    });
  });
});
