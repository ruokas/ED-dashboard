import React from 'react';

export let dndOnDragEnd;

jest.mock(
  'react-beautiful-dnd',
  () => {
    const React = require('react');
    return {
      DragDropContext: ({ children, onDragEnd }) => {
        dndOnDragEnd = onDragEnd;
        return <div>{children}</div>;
      },
      Droppable: ({ children }) => (
        <div>{children({ innerRef: jest.fn(), droppableProps: {}, placeholder: null })}</div>
      ),
      Draggable: ({ children }) => (
        <div>{children({ innerRef: jest.fn(), draggableProps: {}, dragHandleProps: {} })}</div>
      )
    };
  },
  { virtual: true }
);

jest.mock(
  '@/components/ui/card',
  () => {
    const React = require('react');
    return {
      Card: React.forwardRef(({ children, ...props }, ref) => (
        <div ref={ref} {...props}>{children}</div>
      )),
      CardContent: React.forwardRef(({ children, ...props }, ref) => (
        <div ref={ref} {...props}>{children}</div>
      ))
    };
  },
  { virtual: true }
);

jest.mock(
  '@/components/ui/button',
  () => ({
    Button: ({ children, ...props }) => <button {...props}>{children}</button>
  }),
  { virtual: true }
);
