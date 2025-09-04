import * as React from 'react';

/**
 * Simple card component used throughout the dashboard. Provides a
 * lightweight wrapper with a subtle shadow and rounded corners so all
 * cards share the same appearance.
 */
export const Card = React.forwardRef(({ className = '', ...props }, ref) => (
  <div
    ref={ref}
    className={`bg-white dark:bg-gray-800 rounded shadow ${className}`.trim()}
    {...props}
  />
));
Card.displayName = 'Card';

export const CardContent = React.forwardRef(
  ({ className = '', ...props }, ref) => (
    <div
      ref={ref}
      className={`p-2 text-gray-800 dark:text-gray-100 ${className}`.trim()}
      {...props}
    />
  )
);
CardContent.displayName = 'CardContent';

