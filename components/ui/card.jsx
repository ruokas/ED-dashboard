import * as React from 'react';

/**
 * Simple card component used throughout the dashboard. Provides a
 * lightweight wrapper with a subtle shadow and rounded corners so all
 * cards share the same appearance.
 */
export const Card = React.forwardRef(({ className = '', ...props }, ref) => (
  <div
    ref={ref}
    className={`glass rounded-lg hover:shadow-xl transition-shadow ${className}`.trim()}
    {...props}
  />
));
Card.displayName = 'Card';

export const CardHeader = React.forwardRef(
  ({ className = '', ...props }, ref) => (
    <div
      ref={ref}
      className={`p-4 border-b border-white/20 dark:border-gray-700/40 ${className}`.trim()}
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
      className={`p-4 border-t border-white/20 dark:border-gray-700/40 ${className}`.trim()}
      {...props}
    />
  )
);
CardFooter.displayName = 'CardFooter';

