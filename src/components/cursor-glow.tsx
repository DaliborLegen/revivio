"use client";

import { useEffect, useRef } from "react";

export function CursorGlow() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      size: number;
    }[] = [];

    let mouseX = -100;
    let mouseY = -100;
    let animationId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const addParticles = (x: number, y: number) => {
      for (let i = 0; i < 2; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 1.5 + 0.5;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.5,
          life: 0,
          maxLife: 40 + Math.random() * 30,
          size: Math.random() * 3 + 1,
        });
      }
    };

    const onMove = (x: number, y: number) => {
      const dx = x - mouseX;
      const dy = y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 3) {
        addParticles(x, y);
      }
      mouseX = x;
      mouseY = y;
    };

    const onMouseMove = (e: MouseEvent) => onMove(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) onMove(t.clientX, t.clientY);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Glow around cursor
      const gradient = ctx.createRadialGradient(
        mouseX, mouseY, 0,
        mouseX, mouseY, 120
      );
      gradient.addColorStop(0, "rgba(212, 160, 84, 0.06)");
      gradient.addColorStop(0.5, "rgba(212, 160, 84, 0.02)");
      gradient.addColorStop(1, "rgba(212, 160, 84, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(mouseX - 120, mouseY - 120, 240, 240);

      // Particles
      particles = particles.filter((p) => {
        p.life++;
        if (p.life > p.maxLife) return false;

        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.02; // slight gravity
        p.vx *= 0.99;

        const progress = p.life / p.maxLife;
        const alpha = progress < 0.2
          ? progress / 0.2
          : 1 - (progress - 0.2) / 0.8;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (1 - progress * 0.5), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 160, 84, ${alpha * 0.5})`;
        ctx.fill();

        return true;
      });

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[9998]"
      aria-hidden="true"
    />
  );
}
