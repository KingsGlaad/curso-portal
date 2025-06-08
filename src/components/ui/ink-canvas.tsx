// components/ui/ink-canvas.tsx
"use client";

import React, { useRef, useEffect } from "react";
import { useTheme } from "next-themes"; // Importe o hook para ler o tema

// Paletas de cores separadas para cada tema
const darkPalettes = [
  ["#FF0055", "#00F0FF", "#A020F0"], // Neon Dark
  ["#7DF9FF", "#FF3EA5", "#00FF7F"], // Cyberpunk
];

const lightPalettes = [
  ["#FF6B6B", "#4ECDC4", "#45B7D1"], // Summer Beach
  ["#D6A4A4", "#A4B5D6", "#D6C2A4"], // Soft Earth Tones
];

// A classe Particle continua a mesma de antes...
class Particle {
  x: number;
  y: number;
  radius: number;
  color: string;
  angle: number;
  speed: number;
  life: number;
  maxLife: number;

  constructor(canvasWidth: number, canvasHeight: number, palette: string[]) {
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * canvasHeight;
    this.radius = Math.random() * 20 + 10;
    this.color = palette[Math.floor(Math.random() * palette.length)];
    this.angle = Math.random() * Math.PI * 2;
    this.speed = Math.random() * 0.5 + 0.1;
    this.life = 1;
    this.maxLife = Math.random() * 400 + 200;
  }

  update() {
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;
    this.angle += Math.random() * 0.2 - 0.1;
    this.radius *= 0.99;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

export const InkCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Usa o hook do next-themes. 'resolvedTheme' garante que teremos 'light' ou 'dark', nunca 'system'.
  const { resolvedTheme } = useTheme();

  // O useEffect agora depende do 'resolvedTheme'. Ele será re-executado se o tema mudar.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Define as cores com base no tema ativo
    const isDark = resolvedTheme === "dark";
    const fadeColor = isDark
      ? "rgba(10, 10, 10, 0.1)"
      : "rgba(255, 255, 255, 0.1)";
    const currentPalettes = isDark ? darkPalettes : lightPalettes;
    const selectedPalette =
      currentPalettes[Math.floor(Math.random() * currentPalettes.length)];

    let animationFrameId: number;
    let particles: Particle[] = [];
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const initParticles = () => {
      particles = [];
      const numParticles = Math.floor((width * height) / 40000);
      for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle(width, height, selectedPalette));
      }
    };

    const animate = () => {
      ctx.fillStyle = fadeColor;
      ctx.fillRect(0, 0, width, height);
      ctx.filter = "blur(35px)";

      particles.forEach((p, index) => {
        p.update();
        p.draw(ctx);
        if (p.radius < 0.5 || p.life > p.maxLife) {
          particles[index] = new Particle(width, height, selectedPalette);
        }
      });

      ctx.filter = "none";
      animationFrameId = window.requestAnimationFrame(animate);
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };

    initParticles();
    animate();

    window.addEventListener("resize", handleResize);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [resolvedTheme]); // <-- A mágica acontece aqui!

  return (
    <canvas ref={canvasRef} className="absolute inset-0 z-0 bg-background" />
  );
};
