import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
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
    const card = screen.getByText('1').closest('.bg-gray-200');
    expect(card).toHaveClass('w-full', 'h-24');
  });

  test('includes larger size classes for sm breakpoint', () => {
    window.innerWidth = 700;
    renderZone();
    const card = screen.getByText('1').closest('.bg-gray-200');
    expect(card).toHaveClass('w-full', 'sm:h-28');
  });
});
