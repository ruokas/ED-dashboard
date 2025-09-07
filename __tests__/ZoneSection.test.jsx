import React from 'react';
import { render, screen, cleanup, fireEvent, within } from '@testing-library/react';
import { DragDropContext } from 'react-beautiful-dnd';
import ZoneSection from '@/components/ZoneSection.jsx';

jest.mock(
  'react-swipeable',
  () => ({
    useSwipeable: () => ({})
  }),
  { virtual: true }
);

const renderZone = (props = {}) =>
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
        onReset={() => {}}
        padejejas=""
        onPadejejasChange={() => {}}
        checkAll={() => {}}
        {...props}
      />
    </DragDropContext>
  );

describe('ZoneSection responsiveness', () => {
  afterEach(() => cleanup());

  test('uses base size classes on small screens', () => {
    window.innerWidth = 500;
    renderZone();
    const card = screen.getByText('1').closest('.bg-gray-200');
    expect(card).toHaveClass('w-full', 'min-h-20', 'h-auto');
  });

  test('includes larger size classes for sm breakpoint', () => {
    window.innerWidth = 700;
    renderZone();
    const card = screen.getByText('1').closest('.bg-gray-200');
    expect(card).toHaveClass('w-full', 'min-h-20', 'sm:min-h-24', 'h-auto');
  });
});

describe('ZoneSection reset button', () => {
  afterEach(() => cleanup());

  test('invokes onReset when clicked', () => {
    const onReset = jest.fn();
    renderZone({ onReset });
    const card = screen.getByText('1').parentElement.parentElement;
    const resetBtn = within(card).getAllByRole('button')[3];
    fireEvent.click(resetBtn);
    expect(onReset).toHaveBeenCalledWith('1');
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

describe('ZoneSection overdue animation', () => {
  afterEach(() => cleanup());

  test('beds without last check do not animate', () => {
    renderZone();
    const card = screen.getByText('1').closest('.bg-gray-200');
    expect(card).not.toHaveClass('animate-pulse');
  });

  test('beds pulse after exceeding limit', () => {
    renderZone({ statusMap: { '1': { lastCheckedAt: Date.now() - 31 * 60 * 1000 } } });
    const card = screen.getByText('1').closest('.bg-red-100');
    expect(card).toHaveClass('animate-pulse');
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

describe('ZoneSection props validation', () => {
  afterEach(() => cleanup());

  test('defaults padejejas to empty string', () => {
    renderZone({ padejejas: undefined });
    const input = screen.getByPlaceholderText('Padėjėjas');
    expect(input.value).toBe('');
  });

  test('warns when zona is not a string', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    renderZone({ zona: 123 });
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
