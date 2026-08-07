import React from 'react';

export function Logo({ className = '' }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={className} 
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      {/* 
        Abstract Isometric Ribbon (The "Infinity Fold")
        A perfectly symmetrical structural mark made of 45-degree angles.
      */}
      <path 
        d="
          M 10 50 
          L 30 30 
          L 70 70 
          L 90 50 
          L 70 30 
          L 30 70 
          Z
        " 
        stroke="currentColor" 
        strokeWidth="12" 
        strokeLinejoin="miter"
        strokeMiterlimit="4"
      />
      
      {/* 
        The Core (Solid Diamond)
        Sits exactly at the 50,50 intersection, creating an illusion of depth 
        where the ribbons cross. 
      */}
      <polygon 
        points="50,38 62,50 50,62 38,50" 
        fill="currentColor" 
      />
    </svg>
  );
}
