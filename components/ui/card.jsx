import * as React from 'react';

/**
 * Simple card component used throughout the dashboard. Provides a
 * lightweight wrapper with a subtle shadow and rounded corners so all
 * cards share the same appearance.
 */
export const Card = React.forwardRef(({ className = '', ...props }, ref) => (
  <div
    ref={ref}
    className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700 ${className}`.trim()}
    {...props}
  />
));
Card.displayName = 'Card';

export const CardHeader = React.forwardRef(
  ({ className = '', ...props }, ref) => (
    <div
      ref={ref}
      className={`p-4 border-b border-gray-200 dark:border-gray-700 ${className}`.trim()}
      {...props}
    />
  )
);
CardHeader.displayName = 'CardHeader';

export const CardContent = React.forwardRef(
  ({ className = '', ...props }, ref) => (
    <div
      ref={ref}
      className={`p-4 text-gray-800 dark:text-gray-100 ${className}`.trim()}
      {...props}
    />
  )
);
CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef(
  ({ className = '', ...props }, ref) => (
    <div
      ref={ref}
      className={`p-4 border-t border-gray-200 dark:border-gray-700 ${className}`.trim()}
      {...props}
    />
  )
);
CardFooter.displayName = 'CardFooter';

