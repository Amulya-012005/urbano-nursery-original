import React from 'react';

interface UrbanoLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  textSize?: 'sm' | 'md' | 'lg';
}

export const UrbanoLogo: React.FC<UrbanoLogoProps> = ({
  className = '',
  size = 40,
  showText = false,
  textSize = 'md'
}) => {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Exact Vector Representation of User Uploaded Logo (Hand cradling leaves with circle) */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 hover:scale-105"
      >
        <defs>
          {/* Golden Yellow to Vibrant Leaf Green Gradient for outer leaves */}
          <linearGradient id="goldenLeafGradLeft" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#eab308" />
            <stop offset="45%" stopColor="#84cc16" />
            <stop offset="100%" stopColor="#22c55e" />
          </linearGradient>

          <linearGradient id="goldenLeafGradRight" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#eab308" />
            <stop offset="45%" stopColor="#84cc16" />
            <stop offset="100%" stopColor="#22c55e" />
          </linearGradient>

          {/* Center Leaf Gradient */}
          <linearGradient id="centerLeafGrad" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#4ade80" />
            <stop offset="60%" stopColor="#16a34a" />
            <stop offset="100%" stopColor="#15803d" />
          </linearGradient>

          {/* Dark Forest Green Hand */}
          <linearGradient id="handGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0d3822" />
            <stop offset="100%" stopColor="#1b5e37" />
          </linearGradient>

          {/* Circle Ring Gradient */}
          <linearGradient id="circleRingGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#15803d" />
            <stop offset="60%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#84cc16" />
          </linearGradient>

          {/* Soft Glow Filter */}
          <filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#22c55e" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Outer Circular Ring (Open at top right, matching user image) */}
        <path
          d="M 148 54 A 86 86 0 1 0 120 184 C 145 178 168 152 172 126 C 176 102 168 76 148 54 Z"
          fill="none"
          stroke="url(#circleRingGrad)"
          strokeWidth="8.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Hand Silhouette Cupping Upwards */}
        <path
          d="M 44 104 C 44 104 52 126 62 136 C 74 148 94 158 116 160 C 138 162 152 148 142 138 C 132 128 108 120 96 114 C 90 110 84 94 84 94 C 84 94 76 104 70 112 C 64 120 54 116 48 108 C 44 102 44 104 44 104 Z"
          fill="url(#handGrad)"
        />

        {/* Stylized Palm & Fingers details */}
        <path
          d="M 52 92 C 54 94 62 110 68 118 C 74 126 84 136 102 144 C 122 152 140 148 146 142 C 150 138 144 134 132 128 C 118 122 98 114 88 102 C 84 96 82 86 82 86 C 82 86 74 94 68 98 C 62 102 54 98 52 92 Z"
          fill="#134e2c"
          opacity="0.95"
        />

        {/* Left Leaf with Golden Yellow / Chartreuse Tip */}
        <path
          d="M 100 110 C 82 105 60 84 62 62 C 64 52 74 46 84 54 C 98 66 102 88 100 110 Z"
          fill="url(#goldenLeafGradLeft)"
          filter="url(#logoGlow)"
        />
        <path
          d="M 62 62 C 75 74 88 88 100 110"
          stroke="#16a34a"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.5"
        />

        {/* Center Main Leaf (Tall, Vibrant Green) */}
        <path
          d="M 100 112 C 86 88 84 56 100 32 C 116 56 114 88 100 112 Z"
          fill="url(#centerLeafGrad)"
          filter="url(#logoGlow)"
        />
        <path
          d="M 100 34 L 100 110"
          stroke="#bbf7d0"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.6"
        />

        {/* Right Leaf with Golden Yellow / Chartreuse Tip */}
        <path
          d="M 100 110 C 118 105 140 84 138 62 C 136 52 126 46 116 54 C 102 66 98 88 100 110 Z"
          fill="url(#goldenLeafGradRight)"
          filter="url(#logoGlow)"
        />
        <path
          d="M 138 62 C 125 74 112 88 100 110"
          stroke="#16a34a"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.5"
        />
      </svg>

      {/* Optional Brand Text */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-bold tracking-tight text-white font-serif-botanical ${
                textSize === 'lg' ? 'text-2xl sm:text-3xl' : textSize === 'sm' ? 'text-lg' : 'text-xl sm:text-2xl'
              }`}
            >
              Urbano
            </span>
            <span className="text-[10px] uppercase tracking-widest font-bold text-amber-300 bg-amber-950/70 border border-amber-400/40 px-2 py-0.5 rounded-full shadow-xs">
              Nursery
            </span>
          </div>
          <span className="text-[10px] text-emerald-200/80 font-medium tracking-wider">
            Grow Greener · Live Better
          </span>
        </div>
      )}
    </div>
  );
};
