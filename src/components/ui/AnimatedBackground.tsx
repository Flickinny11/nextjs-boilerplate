"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    // Circle properties
    const circle = {
      x: canvas.width / 2,
      y: canvas.height / 2,
      radius: Math.min(canvas.width, canvas.height) * 0.2,
      phase: 0,
    };

    // Animation properties
    let animationFrameId: number;
    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update circle phase
      circle.phase += 0.02;

      // Create gradient for the circle
      const gradient = ctx.createRadialGradient(
        circle.x,
        circle.y,
        0,
        circle.x,
        circle.y,
        circle.radius * 2
      );
      gradient.addColorStop(0, "rgba(59, 130, 246, 0.2)"); // Blue
      gradient.addColorStop(0.5, "rgba(147, 51, 234, 0.1)"); // Purple
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

      // Draw main circle
      ctx.beginPath();
      ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Draw orbital rings
      for (let i = 0; i < 3; i++) {
        const ringRadius = circle.radius * (1.2 + i * 0.3);
        const particles = 12;
        
        for (let j = 0; j < particles; j++) {
          const angle = (j / particles) * Math.PI * 2 + circle.phase + i;
          const x = circle.x + Math.cos(angle) * ringRadius;
          const y = circle.y + Math.sin(angle) * ringRadius;
          const size = 2 + Math.sin(circle.phase * 2 + j) * 2;

          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(147, 51, 234, ${0.2 + Math.sin(circle.phase + j) * 0.1})`; // Purple with varying opacity
          ctx.fill();
        }
      }

      // Draw eclipse effect
      const eclipseGradient = ctx.createRadialGradient(
        circle.x + circle.radius * 0.3,
        circle.y - circle.radius * 0.3,
        0,
        circle.x,
        circle.y,
        circle.radius
      );
      eclipseGradient.addColorStop(0, "rgba(0, 0, 0, 0.8)");
      eclipseGradient.addColorStop(1, "rgba(0, 0, 0, 0.2)");

      ctx.beginPath();
      ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
      ctx.fillStyle = eclipseGradient;
      ctx.fill();

      // Request next frame
      animationFrameId = requestAnimationFrame(animate);
    };

    // Start animation
    animate();

    // Cleanup
    return () => {
      window.removeEventListener("resize", setCanvasSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="fixed inset-0 z-0 pointer-events-none"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
      />
    </motion.div>
  );
}
