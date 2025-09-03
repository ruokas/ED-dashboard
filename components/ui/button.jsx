import * as React from 'react';

/**
 * Minimal button component with a few opinionated styles so the UI
 * has a consistent look across the app. Variants roughly follow the
 * names used throughout the project (`default`, `outline`,
 * `destructive`) and a couple of sizes are supported.
 */
export const Button = React.forwardRef(
  ({ className = '', variant = 'default', size = 'md', ...props }, ref) => {
    const base =
      'rounded font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
    const variants = {
      default: 'bg-blue-600 text-white hover:bg-blue-700',
      outline:
        'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50',
      destructive: 'bg-red-600 text-white hover:bg-red-700',
    };
    const sizes = {
      sm: 'px-2 py-1 text-xs',
      md: 'px-3 py-2 text-sm',
      icon: 'p-1 w-6 h-6 flex items-center justify-center',
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

