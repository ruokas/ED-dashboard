import React from 'react';
import { render, screen } from '@testing-library/react';
import StatusSummary from '../components/StatusSummary.jsx';

describe('StatusSummary', () => {
  test('updates counts when bed statuses change', () => {
    const { rerender } = render(<StatusSummary statusMap={{}} />);
    expect(screen.getByLabelText('needs-wc')).toHaveTextContent('0');
    expect(screen.getByLabelText('needs-cleaning')).toHaveTextContent('0');
    expect(screen.getByLabelText('overdue')).toHaveTextContent('0');

    rerender(
      <StatusSummary
        statusMap={{
          A: { needsWC: false, needsCleaning: false, lastCheckedAt: null },
        }}
      />
    );
    expect(screen.getByLabelText('overdue')).toHaveTextContent('0');

    rerender(
      <StatusSummary
        statusMap={{
          A: { needsWC: true, needsCleaning: true, lastCheckedAt: 0 },
        }}
      />
    );
    expect(screen.getByLabelText('needs-wc')).toHaveTextContent('1');
    expect(screen.getByLabelText('needs-cleaning')).toHaveTextContent('1');
    expect(screen.getByLabelText('overdue')).toHaveTextContent('1');

    rerender(
      <StatusSummary
        statusMap={{
          A: { needsWC: false, needsCleaning: false, lastCheckedAt: Date.now() },
        }}
      />
    );
    expect(screen.getByLabelText('needs-wc')).toHaveTextContent('0');
    expect(screen.getByLabelText('needs-cleaning')).toHaveTextContent('0');
    expect(screen.getByLabelText('overdue')).toHaveTextContent('0');
  });
});
