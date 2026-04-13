"use client";

import { useRef, useState, useCallback, useEffect } from "react";

interface BeforeAfterSliderProps {
  beforeSvg: React.ReactNode;
  afterSvg: React.ReactNode;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
}

export function BeforeAfterSlider({
  beforeSvg,
  afterSvg,
  beforeLabel = "Before",
  afterLabel = "After",
  className = "",
}: BeforeAfterSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const updatePosition = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const pct = Math.max(2, Math.min(98, (x / rect.width) * 100));
      setPosition(pct);
      if (!hasInteracted) setHasInteracted(true);
    },
    [hasInteracted]
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      setIsDragging(true);
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      updatePosition(e.clientX);
    },
    [updatePosition]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      updatePosition(e.clientX);
    },
    [isDragging, updatePosition]
  );

  const onPointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Gentle idle animation before user interacts
  useEffect(() => {
    if (hasInteracted) return;
    let frame: number;
    let t = 0;
    const animate = () => {
      t += 0.01;
      setPosition(50 + Math.sin(t) * 10);
      frame = requestAnimationFrame(animate);
    };
    const timeout = setTimeout(() => {
      frame = requestAnimationFrame(animate);
    }, 2000);
    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(frame);
    };
  }, [hasInteracted]);

  return (
    <div
      ref={containerRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      className={`group relative cursor-col-resize select-none overflow-hidden rounded-2xl ${className}`}
      style={{ touchAction: "none" }}
    >
      {/* After (full background) */}
      <div className="relative aspect-[4/3] w-full">{afterSvg}</div>

      {/* Before (clipped) */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        {beforeSvg}
      </div>

      {/* Slider line */}
      <div
        className="absolute top-0 bottom-0 z-10 w-[2px] -translate-x-1/2"
        style={{ left: `${position}%` }}
      >
        <div className="h-full w-full bg-gradient-to-b from-[#d4a054]/80 via-white/90 to-[#d4a054]/80 shadow-[0_0_20px_rgba(212,160,84,0.3)]" />

        {/* Handle */}
        <div className="absolute top-1/2 left-1/2 flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-[#d4a054]/60 bg-[#0e0d0b]/80 shadow-[0_0_30px_rgba(212,160,84,0.25)] backdrop-blur-md transition-transform group-hover:scale-110">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="text-[#d4a054]"
          >
            <path
              d="M5 3L2 8L5 13M11 3L14 8L11 13"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Labels */}
      <div
        className="absolute bottom-4 left-4 z-10 rounded-full border border-white/10 bg-black/60 px-3 py-1 text-xs font-medium tracking-wider text-white/80 uppercase backdrop-blur-md transition-opacity"
        style={{ opacity: position > 15 ? 1 : 0 }}
      >
        {beforeLabel}
      </div>
      <div
        className="absolute right-4 bottom-4 z-10 rounded-full bg-gradient-to-r from-[#d4a054] to-[#a67830] px-3 py-1 text-xs font-semibold tracking-wider text-[#0e0d0b] uppercase shadow-[0_0_20px_rgba(212,160,84,0.3)] transition-opacity"
        style={{ opacity: position < 85 ? 1 : 0 }}
      >
        {afterLabel}
      </div>
    </div>
  );
}
