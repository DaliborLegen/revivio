"use client";

/**
 * SVG placeholder images that simulate old/damaged photographs
 * and their restored counterparts. Designed to convey the concept
 * without requiring external image assets.
 */

/* ─── Hero: Portrait (family photo) ─── */

export function HeroBeforeSvg() {
  return (
    <svg
      viewBox="0 0 800 600"
      className="absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        {/* Sepia / faded wash */}
        <linearGradient id="heroFade" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#d4c4a0" />
          <stop offset="50%" stopColor="#c2ad82" />
          <stop offset="100%" stopColor="#a89060" />
        </linearGradient>
        {/* Film grain noise */}
        <filter id="heroGrain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" seed="2" />
          <feColorMatrix type="saturate" values="0" />
          <feBlend in="SourceGraphic" mode="multiply" />
        </filter>
        {/* Scratch lines */}
        <filter id="heroScratches">
          <feTurbulence type="turbulence" baseFrequency="0.005 0.8" numOctaves="2" seed="5" />
          <feColorMatrix type="luminanceToAlpha" />
          <feComponentTransfer>
            <feFuncA type="discrete" tableValues="0 0 0 0 0 0 0 0 0 1" />
          </feComponentTransfer>
        </filter>
        {/* Vignette */}
        <radialGradient id="heroVignette" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="100%" stopColor="rgba(40,30,10,0.6)" />
        </radialGradient>
      </defs>

      {/* Base sepia background */}
      <rect width="800" height="600" fill="url(#heroFade)" />

      {/* Simulated photo content — family silhouettes */}
      <rect x="0" y="340" width="800" height="260" fill="#8b7a55" opacity="0.4" />

      {/* Sky area */}
      <rect x="0" y="0" width="800" height="340" fill="#c9b896" opacity="0.6" />

      {/* Figure 1 — adult left */}
      <ellipse cx="300" cy="210" rx="35" ry="42" fill="#9e8c68" />
      <rect x="270" y="250" width="60" height="150" rx="12" fill="#8b7a55" />
      <rect x="260" y="390" width="30" height="100" rx="6" fill="#7d6c4a" />
      <rect x="310" y="390" width="30" height="100" rx="6" fill="#7d6c4a" />

      {/* Figure 2 — adult right */}
      <ellipse cx="500" cy="220" rx="32" ry="40" fill="#9e8c68" />
      <rect x="472" y="258" width="56" height="140" rx="12" fill="#8b7a55" />
      <rect x="464" y="390" width="28" height="95" rx="6" fill="#7d6c4a" />
      <rect x="508" y="390" width="28" height="95" rx="6" fill="#7d6c4a" />

      {/* Figure 3 — child center */}
      <ellipse cx="400" cy="280" rx="24" ry="30" fill="#a89570" />
      <rect x="380" y="308" width="40" height="100" rx="10" fill="#96845c" />
      <rect x="374" y="400" width="22" height="70" rx="5" fill="#7d6c4a" />
      <rect x="404" y="400" width="22" height="70" rx="5" fill="#7d6c4a" />

      {/* Damage: large tear / crease */}
      <line x1="120" y1="0" x2="200" y2="600" stroke="#d8cdb0" strokeWidth="4" opacity="0.7" />
      <line x1="122" y1="0" x2="202" y2="600" stroke="#a89570" strokeWidth="2" opacity="0.5" />

      {/* Damage: fold mark */}
      <line x1="0" y1="300" x2="800" y2="290" stroke="#bfae8e" strokeWidth="3" opacity="0.5" />

      {/* Stain / water damage */}
      <ellipse cx="620" cy="150" rx="90" ry="70" fill="#b8a57a" opacity="0.5" />
      <ellipse cx="650" cy="140" rx="60" ry="50" fill="#cabb96" opacity="0.4" />

      {/* Corner damage */}
      <polygon points="0,0 80,0 0,60" fill="#e0d5be" opacity="0.6" />
      <polygon points="800,600 720,600 800,540" fill="#d6c9a8" opacity="0.5" />

      {/* Grain overlay */}
      <rect width="800" height="600" filter="url(#heroGrain)" opacity="0.15" />

      {/* Vignette */}
      <rect width="800" height="600" fill="url(#heroVignette)" />

      {/* Scratch marks */}
      <rect width="800" height="600" filter="url(#heroScratches)" opacity="0.08" fill="white" />
    </svg>
  );
}

export function HeroAfterSvg() {
  return (
    <svg
      viewBox="0 0 800 600"
      className="absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="afterSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#87CEEB" />
          <stop offset="60%" stopColor="#b8ddf0" />
          <stop offset="100%" stopColor="#d4eaf5" />
        </linearGradient>
        <linearGradient id="afterGround" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7cb342" />
          <stop offset="100%" stopColor="#558b2f" />
        </linearGradient>
        <radialGradient id="afterSun" cx="70%" cy="15%" r="25%">
          <stop offset="0%" stopColor="#fff9c4" stopOpacity="0.8" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <radialGradient id="afterVignette" cx="50%" cy="50%" r="65%">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.12)" />
        </radialGradient>
      </defs>

      {/* Sky */}
      <rect width="800" height="380" fill="url(#afterSky)" />
      <rect width="800" height="800" fill="url(#afterSun)" />

      {/* Clouds */}
      <ellipse cx="200" cy="100" rx="80" ry="30" fill="white" opacity="0.7" />
      <ellipse cx="240" cy="90" rx="60" ry="25" fill="white" opacity="0.6" />
      <ellipse cx="600" cy="70" rx="70" ry="22" fill="white" opacity="0.5" />

      {/* Ground / grass */}
      <rect x="0" y="360" width="800" height="240" fill="url(#afterGround)" />

      {/* Figure 1 — adult left (warm skin tones, blue shirt) */}
      <ellipse cx="300" cy="210" rx="35" ry="42" fill="#deb887" />
      {/* Hair */}
      <ellipse cx="300" cy="185" rx="36" ry="28" fill="#5d4037" />
      {/* Eyes */}
      <circle cx="289" cy="210" r="3" fill="#37474f" />
      <circle cx="311" cy="210" r="3" fill="#37474f" />
      {/* Smile */}
      <path d="M290 222 Q300 230 310 222" stroke="#a1887f" strokeWidth="2" fill="none" />
      {/* Blue shirt */}
      <rect x="270" y="250" width="60" height="150" rx="12" fill="#1565c0" />
      <rect x="260" y="390" width="30" height="100" rx="6" fill="#37474f" />
      <rect x="310" y="390" width="30" height="100" rx="6" fill="#37474f" />

      {/* Figure 2 — adult right (dress) */}
      <ellipse cx="500" cy="220" rx="32" ry="40" fill="#deb887" />
      <ellipse cx="500" cy="196" rx="34" ry="26" fill="#6d4c41" />
      <circle cx="490" cy="220" r="3" fill="#37474f" />
      <circle cx="510" cy="220" r="3" fill="#37474f" />
      <path d="M492 232 Q500 238 508 232" stroke="#a1887f" strokeWidth="2" fill="none" />
      {/* Red dress */}
      <path d="M472 258 L460 400 L540 400 L528 258 Z" fill="#c62828" rx="8" />
      <rect x="464" y="390" width="28" height="95" rx="6" fill="#37474f" />
      <rect x="508" y="390" width="28" height="95" rx="6" fill="#37474f" />

      {/* Figure 3 — child center (yellow shirt) */}
      <ellipse cx="400" cy="280" rx="24" ry="30" fill="#deb887" />
      <ellipse cx="400" cy="262" rx="25" ry="20" fill="#5d4037" />
      <circle cx="393" cy="280" r="2.5" fill="#37474f" />
      <circle cx="407" cy="280" r="2.5" fill="#37474f" />
      <path d="M394 290 Q400 296 406 290" stroke="#a1887f" strokeWidth="1.5" fill="none" />
      <rect x="380" y="308" width="40" height="100" rx="10" fill="#f9a825" />
      <rect x="374" y="400" width="22" height="70" rx="5" fill="#455a64" />
      <rect x="404" y="400" width="22" height="70" rx="5" fill="#455a64" />

      {/* Subtle warm glow */}
      <rect width="800" height="600" fill="url(#afterVignette)" />
    </svg>
  );
}

/* ─── Gallery card 1: Colorization ─── */

export function ColorBefore() {
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <filter id="cbGrain">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="7" />
          <feColorMatrix type="saturate" values="0" />
          <feBlend in="SourceGraphic" mode="multiply" />
        </filter>
      </defs>
      {/* Grayscale scene — street */}
      <rect width="400" height="300" fill="#b0b0b0" />
      <rect x="0" y="180" width="400" height="120" fill="#888" />
      {/* Buildings */}
      <rect x="20" y="60" width="80" height="140" rx="2" fill="#999" />
      <rect x="30" y="80" width="20" height="25" rx="1" fill="#aaa" />
      <rect x="65" y="80" width="20" height="25" rx="1" fill="#aaa" />
      <rect x="30" y="120" width="20" height="25" rx="1" fill="#aaa" />
      <rect x="65" y="120" width="20" height="25" rx="1" fill="#aaa" />
      <rect x="120" y="40" width="100" height="160" rx="2" fill="#a0a0a0" />
      <rect x="135" y="60" width="25" height="30" rx="1" fill="#b8b8b8" />
      <rect x="175" y="60" width="25" height="30" rx="1" fill="#b8b8b8" />
      <rect x="135" y="110" width="25" height="30" rx="1" fill="#b8b8b8" />
      <rect x="175" y="110" width="25" height="30" rx="1" fill="#b8b8b8" />
      <rect x="280" y="80" width="90" height="120" rx="2" fill="#959595" />
      <rect x="295" y="100" width="20" height="25" rx="1" fill="#aaa" />
      <rect x="335" y="100" width="20" height="25" rx="1" fill="#aaa" />
      {/* Road */}
      <rect x="180" y="220" width="40" height="6" rx="1" fill="#999" />
      <rect x="180" y="250" width="40" height="6" rx="1" fill="#999" />
      <rect x="180" y="280" width="40" height="6" rx="1" fill="#999" />
      {/* Car silhouette */}
      <rect x="100" y="210" width="60" height="25" rx="8" fill="#777" />
      <rect x="105" y="195" width="40" height="18" rx="5" fill="#808080" />
      <circle cx="112" cy="238" r="7" fill="#666" />
      <circle cx="150" cy="238" r="7" fill="#666" />
      {/* Grain */}
      <rect width="400" height="300" filter="url(#cbGrain)" opacity="0.12" />
    </svg>
  );
}

export function ColorAfter() {
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="caSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#64b5f6" />
          <stop offset="100%" stopColor="#bbdefb" />
        </linearGradient>
      </defs>
      {/* Blue sky */}
      <rect width="400" height="200" fill="url(#caSky)" />
      {/* Ground/road */}
      <rect x="0" y="180" width="400" height="120" fill="#78909c" />
      {/* Buildings — warm tones */}
      <rect x="20" y="60" width="80" height="140" rx="2" fill="#ffcc80" />
      <rect x="30" y="80" width="20" height="25" rx="1" fill="#81d4fa" />
      <rect x="65" y="80" width="20" height="25" rx="1" fill="#81d4fa" />
      <rect x="30" y="120" width="20" height="25" rx="1" fill="#81d4fa" />
      <rect x="65" y="120" width="20" height="25" rx="1" fill="#81d4fa" />
      <rect x="120" y="40" width="100" height="160" rx="2" fill="#ef9a9a" />
      <rect x="135" y="60" width="25" height="30" rx="1" fill="#e3f2fd" />
      <rect x="175" y="60" width="25" height="30" rx="1" fill="#e3f2fd" />
      <rect x="135" y="110" width="25" height="30" rx="1" fill="#e3f2fd" />
      <rect x="175" y="110" width="25" height="30" rx="1" fill="#e3f2fd" />
      <rect x="280" y="80" width="90" height="120" rx="2" fill="#a5d6a7" />
      <rect x="295" y="100" width="20" height="25" rx="1" fill="#e8f5e9" />
      <rect x="335" y="100" width="20" height="25" rx="1" fill="#e8f5e9" />
      {/* Road lines */}
      <rect x="180" y="220" width="40" height="6" rx="1" fill="#fdd835" />
      <rect x="180" y="250" width="40" height="6" rx="1" fill="#fdd835" />
      <rect x="180" y="280" width="40" height="6" rx="1" fill="#fdd835" />
      {/* Car — red */}
      <rect x="100" y="210" width="60" height="25" rx="8" fill="#e53935" />
      <rect x="105" y="195" width="40" height="18" rx="5" fill="#ef5350" />
      <circle cx="112" cy="238" r="7" fill="#37474f" />
      <circle cx="150" cy="238" r="7" fill="#37474f" />
    </svg>
  );
}

/* ─── Gallery card 2: Scratch removal ─── */

export function ScratchBefore() {
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="sbVig" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="100%" stopColor="rgba(60,40,10,0.45)" />
        </radialGradient>
      </defs>
      {/* Warm sepia base — portrait */}
      <rect width="400" height="300" fill="#c9b896" />
      {/* Face oval */}
      <ellipse cx="200" cy="120" rx="55" ry="65" fill="#bfae8a" />
      {/* Hair */}
      <ellipse cx="200" cy="75" rx="58" ry="40" fill="#7d6840" />
      {/* Eyes */}
      <ellipse cx="180" cy="115" rx="8" ry="5" fill="#8a7a5c" />
      <ellipse cx="220" cy="115" rx="8" ry="5" fill="#8a7a5c" />
      {/* Nose */}
      <line x1="200" y1="120" x2="198" y2="138" stroke="#a89570" strokeWidth="2" />
      {/* Mouth */}
      <path d="M185 150 Q200 158 215 150" stroke="#a08a68" strokeWidth="2" fill="none" />
      {/* Shoulders/body */}
      <path d="M120 200 Q200 170 280 200 L300 300 L100 300 Z" fill="#a89570" />
      {/* Heavy scratches */}
      <line x1="50" y1="20" x2="100" y2="290" stroke="#e0d5be" strokeWidth="3" opacity="0.8" />
      <line x1="160" y1="0" x2="180" y2="300" stroke="#d8cdb0" strokeWidth="2" opacity="0.7" />
      <line x1="300" y1="10" x2="280" y2="280" stroke="#d4c8a8" strokeWidth="2.5" opacity="0.65" />
      <line x1="0" y1="180" x2="400" y2="175" stroke="#cfc2a0" strokeWidth="2" opacity="0.6" />
      <line x1="220" y1="0" x2="250" y2="300" stroke="#ddd2b8" strokeWidth="1.5" opacity="0.55" />
      {/* Stain */}
      <ellipse cx="320" cy="80" rx="45" ry="35" fill="#b8a57a" opacity="0.4" />
      {/* Vignette */}
      <rect width="400" height="300" fill="url(#sbVig)" />
    </svg>
  );
}

export function ScratchAfter() {
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="saGlow" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#fff8e1" stopOpacity="0.3" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      {/* Clean warm background */}
      <rect width="400" height="300" fill="#f5e6d0" />
      {/* Face */}
      <ellipse cx="200" cy="120" rx="55" ry="65" fill="#deb887" />
      {/* Hair */}
      <ellipse cx="200" cy="75" rx="58" ry="40" fill="#5d4037" />
      {/* Eyes */}
      <ellipse cx="180" cy="112" rx="8" ry="5.5" fill="#4e342e" />
      <circle cx="180" cy="111" r="2" fill="#1b5e20" />
      <ellipse cx="220" cy="112" rx="8" ry="5.5" fill="#4e342e" />
      <circle cx="220" cy="111" r="2" fill="#1b5e20" />
      {/* Eyebrows */}
      <path d="M168 102 Q180 97 190 102" stroke="#5d4037" strokeWidth="2" fill="none" />
      <path d="M210 102 Q220 97 232 102" stroke="#5d4037" strokeWidth="2" fill="none" />
      {/* Nose */}
      <line x1="200" y1="118" x2="197" y2="138" stroke="#c8a882" strokeWidth="2" />
      {/* Smile */}
      <path d="M185 150 Q200 162 215 150" stroke="#a1887f" strokeWidth="2.5" fill="none" />
      {/* Shoulders/body — blue shirt */}
      <path d="M120 200 Q200 170 280 200 L300 300 L100 300 Z" fill="#1565c0" />
      {/* Warm glow */}
      <rect width="400" height="300" fill="url(#saGlow)" />
    </svg>
  );
}

/* ─── Gallery card 3: Enhancement ─── */

export function EnhanceBefore() {
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <filter id="ebBlur">
          <feGaussianBlur stdDeviation="1.5" />
        </filter>
      </defs>
      {/* Washed out, blurry landscape */}
      <rect width="400" height="300" fill="#d4cbb8" />
      {/* Faded mountains */}
      <polygon points="0,200 100,100 200,160 300,80 400,140 400,200" fill="#bfb5a0" filter="url(#ebBlur)" />
      {/* Faded lake */}
      <ellipse cx="200" cy="230" rx="160" ry="40" fill="#c2baa8" filter="url(#ebBlur)" />
      {/* Faded trees */}
      <circle cx="80" cy="170" r="25" fill="#a89e88" filter="url(#ebBlur)" />
      <rect x="76" y="190" width="8" height="30" fill="#9e9480" />
      <circle cx="340" cy="160" r="30" fill="#a89e88" filter="url(#ebBlur)" />
      <rect x="336" y="185" width="8" height="35" fill="#9e9480" />
      <circle cx="150" cy="175" r="20" fill="#b0a690" filter="url(#ebBlur)" />
      <rect x="147" y="192" width="6" height="25" fill="#a09888" />
      {/* Overexposed wash */}
      <rect width="400" height="300" fill="white" opacity="0.2" />
    </svg>
  );
}

export function EnhanceAfter() {
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="eaSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#42a5f5" />
          <stop offset="100%" stopColor="#90caf9" />
        </linearGradient>
        <linearGradient id="eaLake" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#64b5f6" />
          <stop offset="100%" stopColor="#1e88e5" />
        </linearGradient>
      </defs>
      {/* Vivid sky */}
      <rect width="400" height="200" fill="url(#eaSky)" />
      {/* Mountains — crisp */}
      <polygon points="0,200 100,100 200,160 300,80 400,140 400,200" fill="#5d4037" />
      <polygon points="0,200 100,100 200,160 300,80 400,140 400,200" fill="#4e342e" opacity="0.5" />
      {/* Snow caps */}
      <polygon points="295,80 310,110 280,110" fill="white" opacity="0.8" />
      <polygon points="95,100 110,125 80,125" fill="white" opacity="0.7" />
      {/* Green ground */}
      <rect x="0" y="200" width="400" height="100" fill="#43a047" />
      {/* Lake */}
      <ellipse cx="200" cy="230" rx="160" ry="40" fill="url(#eaLake)" opacity="0.8" />
      {/* Lake reflection shimmer */}
      <line x1="140" y1="228" x2="170" y2="228" stroke="white" strokeWidth="1" opacity="0.4" />
      <line x1="210" y1="232" x2="250" y2="232" stroke="white" strokeWidth="1" opacity="0.3" />
      {/* Trees */}
      <polygon points="80,120 60,175 100,175" fill="#2e7d32" />
      <polygon points="80,135 65,170 95,170" fill="#388e3c" />
      <rect x="76" y="170" width="8" height="30" fill="#5d4037" />
      <polygon points="340,110 315,165 365,165" fill="#2e7d32" />
      <polygon points="340,125 320,160 360,160" fill="#388e3c" />
      <rect x="336" y="160" width="8" height="35" fill="#5d4037" />
      <polygon points="150,130 135,178 165,178" fill="#388e3c" />
      <rect x="147" y="175" width="6" height="25" fill="#5d4037" />
      {/* Grass detail */}
      <rect x="0" y="270" width="400" height="30" fill="#388e3c" opacity="0.4" />
    </svg>
  );
}
