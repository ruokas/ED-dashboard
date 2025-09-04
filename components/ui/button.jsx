import * as React from 'react';

/**
 * Minimal button component with a few opinionated styles so the UI
 * has a consistent look across the app.
 *
 * Available variants:
 * - `default`: primary action (blue)
 * - `outline`: bordered neutral action
 * - `destructive`: dangerous action (red)
 * - `success`: positive action/confirmation (green)
 * - `warning`: cautionary action (yellow)
 *
 * A couple of sizes are supported.
 */
export const Button = React.forwardRef(
  ({ className = '', variant = 'default', size = 'md', ...props }, ref) => {
    const base =
      'rounded font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:pointer-events-none';
      const variants = {
        default: 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600',
        outline:
          'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 dark:border-gray-600 dark:text-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700',
        destructive: 'bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600',
        success: 'bg-green-600 text-white hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600',
        warning: 'bg-yellow-500 text-white hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700',
      };
    const sizes = {
      sm: 'px-2 py-1 text-xs',
      md: 'px-3 py-2 text-sm',
      icon: 'w-11 h-11 flex items-center justify-center',
      touch: 'h-11 min-w-[2.75rem] px-3 text-sm flex items-center justify-center',
    };

    return (
      <button
        ref={ref}
        className={`${base} ${variants[variant] || variants.default} ${
          sizes[size] || sizes.md
        } ${className}`.trim()}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export default Button;

