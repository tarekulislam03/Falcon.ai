import React, { useEffect, useRef } from 'react';

export default function BackgroundCanvas({ gridVisible = true, particleCount = 35 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Floating particles
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.5 + 0.5,
      speedX: (Math.random() - 0.5) * 0.15,
      speedY: (Math.random() - 0.5) * 0.15,
      alpha: Math.random() * 0.5 + 0.2,
      pulseSpeed: Math.random() * 0.015 + 0.005,
      maxAlpha: Math.random() * 0.6 + 0.3
    }));

    const render = () => {
      // Dark navy base background (#050816)
      ctx.fillStyle = '#050816';
      ctx.fillRect(0, 0, width, height);

      if (gridVisible) {
        const gridSize = 50;

        // Draw blueprint grid lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 0.8;

        ctx.beginPath();
        for (let x = 0; x <= width; x += gridSize) {
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
        }
        for (let y = 0; y <= height; y += gridSize) {
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
        }
        ctx.stroke();

        // Top Ruler Ticks (dots along top edge grid)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        for (let x = gridSize; x < width; x += gridSize) {
          ctx.beginPath();
          ctx.arc(x, 24, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }

        // Left Ruler Ticks (dots along left edge grid)
        for (let y = gridSize; y < height; y += gridSize) {
          ctx.beginPath();
          ctx.arc(24, y, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }

        // Top Center Bezel Outline (Futuristic HUD Notch)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        const bezelWidth = 260;
        const centerX = width / 2;
        ctx.moveTo(centerX - bezelWidth / 2, 0);
        ctx.lineTo(centerX - bezelWidth / 2 + 12, 16);
        ctx.lineTo(centerX + bezelWidth / 2 - 12, 16);
        ctx.lineTo(centerX + bezelWidth / 2, 0);
        ctx.stroke();
      }

      // Draw subtle floating glowing particles
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        p.alpha += p.pulseSpeed;
        if (p.alpha > p.maxAlpha || p.alpha < 0.1) {
          p.pulseSpeed = -p.pulseSpeed;
        }

        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 240, 255, ${Math.max(0, p.alpha)})`;
        ctx.shadowBlur = 6;
        ctx.shadowColor = 'rgba(0, 240, 255, 0.8)';
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [gridVisible, particleCount]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
}
