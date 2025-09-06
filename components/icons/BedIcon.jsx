import React from 'react';

export default function BedIcon({ className = '', ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      role="img"
      aria-label="Lovos"
      className={className}
      {...props}
    >
      <rect x="3" y="7" width="18" height="10" rx="2" />
      <path d="M3 7V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2" />
    </svg>
  );
}
