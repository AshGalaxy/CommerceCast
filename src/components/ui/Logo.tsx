import React from 'react';

export function Logo({ className = '' }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={className} 
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      {/* Outer Ribbon C */}
      <path 
        d="M 85 25 L 35 25 L 15 50 L 35 75 L 85 75" 
        stroke="currentColor" 
        strokeWidth="12" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      {/* Inner Data Node (Diamond) */}
      <polygon 
        points="60,35 75,50 60,65 45,50" 
        fill="currentColor" 
      />
    </svg>
  );
}
