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

  test('applies responsive sizing utilities', () => {
    renderZone();
    const card = screen.getByText('1').closest('.bg-gray-200');
    expect(card).toHaveClass('w-full', 'max-w-[6rem]', 'aspect-[3/4]');
    expect(card).not.toHaveClass('h-24', 'sm:h-28');
  });
});
