import * as React from 'react';

export const KenaAILogo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 130 28"
    {...props}
  >
    <rect width="28" height="28" rx="8" fill="hsl(var(--primary))" />
    <path
      d="M10 8 L10 20 L12 20 L12 15 L17 20 L19 20 L13.5 14 L19 8 L17 8 L12 13 L12 8 Z"
      fill="hsl(var(--primary-foreground))"
    />
    <text
      x="40"
      y="20"
      fontFamily="'PT Sans', sans-serif"
      fontSize="20"
      fontWeight="bold"
      fill="hsl(var(--primary))"
    >
      enaAI
    </text>
  </svg>
);
