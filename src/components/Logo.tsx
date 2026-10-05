import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  customLogoUrl?: string;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  customLogoUrl,
}) => {
  // If administrator uploaded a custom logo image, render it
  if (customLogoUrl) {
    const sizeClasses = {
      sm: 'h-8',
      md: 'h-11',
      lg: 'h-16',
      xl: 'h-24',
    };
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <img
          src={customLogoUrl}
          alt="Quadri Medical & General Store Logo"
          className={`${sizeClasses[size]} w-auto object-contain`}
          referrerPolicy="no-referrer"
        />
        {showText && (
          <div className="flex flex-col">
            <span className="font-bold tracking-tight text-blue-900 leading-none text-lg md:text-xl">
              Quadri
            </span>
            <span className="text-[10px] md:text-xs font-semibold tracking-wider text-emerald-800 uppercase mt-0.5">
              Medical &amp; General Store
            </span>
          </div>
        )}
      </div>
    );
  }

  // Exact vector SVG recreation of the official Quadri Medical Store brand emblem
  const iconDimensions = {
    sm: { width: 34, height: 34 },
    md: { width: 44, height: 44 },
    lg: { width: 62, height: 62 },
    xl: { width: 88, height: 88 },
  }[size];

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Emblem SVG */}
      <svg
        width={iconDimensions.width}
        height={iconDimensions.height}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-200 hover:scale-105"
        aria-label="Quadri Medical Store Logo Icon"
      >
        <defs>
          <linearGradient id="qRingGrad" x1="20" y1="20" x2="170" y2="170" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="60%" stopColor="#0d9488" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
          <linearGradient id="leafGrad" x1="70" y1="50" x2="130" y2="120" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="pillGrad" x1="130" y1="85" x2="175" y2="130" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#0369a1" />
          </linearGradient>
        </defs>

        {/* Outer Circular Ring (the "Q") */}
        <circle
          cx="92"
          cy="85"
          r="62"
          stroke="url(#qRingGrad)"
          strokeWidth="18"
          strokeLinecap="round"
        />

        {/* Central Medical Cross (+) in Royal Blue */}
        <path
          d="M80 50 H104 V73 H127 V97 H104 V120 H80 V97 H57 V73 H80 Z"
          fill="#0284c7"
        />

        {/* Natural Green Leaf emerging inside cross */}
        <path
          d="M87 90 C80 72 90 60 102 54 C104 68 96 82 87 90 Z"
          fill="url(#leafGrad)"
        />

        {/* Flowing ribbon-leaf tail of the "Q" curving out to the bottom right */}
        <path
          d="M84 96 C105 92 125 106 142 124 C148 130 156 126 150 118 C135 98 108 85 84 96 Z"
          fill="#10b981"
        />

        {/* Medical Capsule Pill tilted on bottom-right */}
        <g transform="translate(132, 78) rotate(42)">
          {/* Top Half of Capsule (Blue) */}
          <path
            d="M0 0 H24 V20 C24 26.6 18.6 32 12 32 C5.4 32 0 26.6 0 20 Z"
            fill="#0284c7"
          />
          {/* Highlight glare */}
          <path
            d="M5 8 C5 5 8 3 12 3 C16 3 19 5 19 8"
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.85"
          />
          {/* Bottom Half of Capsule (Green) */}
          <path
            d="M0 0 H24 V-16 C24 -22.6 18.6 -28 12 -28 C5.4 -28 0 -22.6 0 -16 Z"
            fill="#10b981"
          />
          <line x1="0" y1="0" x2="24" y2="0" stroke="#ffffff" strokeWidth="2.5" />
        </g>
      </svg>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col select-none">
          <div className="flex items-center">
            <span className="font-extrabold text-blue-900 tracking-tight leading-none text-xl md:text-2xl">
              Quadri
            </span>
            {/* Tiny accent leaf over the 'i' matching logo */}
            <svg
              className="w-3.5 h-3.5 text-emerald-600 -ml-0.5 -mt-2.5 animate-pulse"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12c0 2.21.72 4.25 1.94 5.92L12 22l8.06-4.08C21.28 16.25 22 14.21 22 12c0-5.52-4.48-10-10-10zm0 14c-2.21 0-4-1.79-4-4 0-2.21 3.5-6 4-6s4 3.79 4 6c0 2.21-1.79 4-4 4z" />
            </svg>
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="h-[1.5px] w-2.5 bg-emerald-600 rounded-full"></span>
            <span className="text-[10px] md:text-[11px] font-bold tracking-widest text-emerald-800 uppercase">
              Medical Store
            </span>
            <span className="h-[1.5px] w-2.5 bg-emerald-600 rounded-full"></span>
          </div>
        </div>
      )}
    </div>
  );
};
