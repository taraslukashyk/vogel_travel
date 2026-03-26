import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
}

// Detect if device is touch-only (mobile/tablet) — no need for cursor effects
const isTouchDevice = () =>
  typeof window !== 'undefined' &&
  (window.matchMedia('(hover: none)').matches || 'ontouchstart' in window);

const BirdCursorEffect: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>(0);

  useEffect(() => {
    // Skip entirely on touch/mobile devices — no cursor to track
    if (isTouchDevice()) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    const createParticle = (x: number, y: number) => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 2;
      particles.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1,
        life: 1.0,
        size: 8 + Math.random() * 8,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.1,
      });
    };

    const birdPath = new Path2D("M 0,0 -0.012,0.01 -0.07,0.072 C -35.202,35.284 -35.182,92.306 0,127.488 c -35.182,35.181 -35.202,92.203 -0.07,127.413 l 0.058,0.061 0.012,0.014 c 11.305,-27.88 28.261,-54.002 50.874,-76.615 22.609,-22.61 48.734,-39.568 76.611,-50.873 C 99.608,116.183 73.483,99.225 50.874,76.612 28.261,54.002 11.305,27.879 0,0");

    const drawBird = (ctx: CanvasRenderingContext2D, p: Particle) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = p.life;
      const scale = p.size / 250;
      ctx.scale(scale, scale);
      ctx.translate(0, -125);
      ctx.fillStyle = '#5cc8bd';
      ctx.fill(birdPath);
      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = particles.current.length - 1; i >= 0; i--) {
        const p = particles.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.015;
        p.rotation += p.rotationSpeed;
        if (p.life <= 0) {
          particles.current.splice(i, 1);
        } else {
          drawBird(ctx, p);
        }
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const dist = Math.hypot(e.clientX - lastMousePos.current.x, e.clientY - lastMousePos.current.y);
      if (dist > 15) {
        createParticle(e.clientX, e.clientY);
        lastMousePos.current = { x: e.clientX, y: e.clientY };
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  // Don't even render canvas on touch devices
  if (typeof window !== 'undefined' && isTouchDevice()) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};

export default BirdCursorEffect;
