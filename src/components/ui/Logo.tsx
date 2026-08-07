import React from 'react';

export function Logo({ className = '' }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={className} 
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      <defs>
        <linearGradient id="logo-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
          <stop offset="50%" stopColor="currentColor" stopOpacity="0.7" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.3" />
        </linearGradient>
        <linearGradient id="logo-grad-2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.9" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.4" />
        </linearGradient>
        <filter id="logo-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.15" />
        </filter>
      </defs>

      {/* Background soft glow */}
      <circle cx="50" cy="50" r="30" fill="currentColor" opacity="0.1" filter="blur(12px)" />

      {/* The main folded ribbon */}
      <path 
        d="M 14 50 L 32 32 L 68 68 L 86 50 L 68 32 L 32 68 Z" 
        stroke="url(#logo-grad-1)" 
        strokeWidth="14" 
        strokeLinejoin="round"
        strokeLinecap="round"
        filter="url(#logo-shadow)"
      />
      
      {/* Inner highlight ribbon (for 3D bevel effect) */}
      <path 
        d="M 14 50 L 32 32 L 68 68 L 86 50 L 68 32 L 32 68 Z" 
        stroke="white" 
        strokeWidth="1.5" 
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity="0.2"
      />

      {/* The Core (Solid Diamond) */}
      <polygon 
        points="50,34 66,50 50,66 34,50" 
        fill="url(#logo-grad-2)" 
        filter="url(#logo-shadow)"
      />
      {/* Diamond inner highlight */}
      <polygon 
        points="50,34 66,50 50,66 34,50" 
        fill="none"
        stroke="white"
        strokeWidth="1.5"
        strokeLinejoin="round"
        opacity="0.3"
      />
      
      {/* Floating data nodes */}
      <circle cx="32" cy="32" r="3.5" fill="currentColor" />
      <circle cx="68" cy="68" r="3.5" fill="currentColor" />
      <circle cx="86" cy="50" r="3.5" fill="currentColor" />
    </svg>
  );
}
