import React, { useRef, useEffect } from "react";

export default function LetterGlitch({
  characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  glitchColors = ["#1bff9b", "#29d6ff", "#9a7bff"],
  glitchSpeed = 45,
  smooth = true,
  shareRef = null,
  waveStrength = 1,
  waveAmpX = 10,
  waveAmpY = 7,
  rippleStrength = 1,
  rippleAmp = 22,
  rippleFalloff = 320,
  fontSize = 32,      // props baru untuk ukuran font
  fontOpacity = 0.7,  // props baru untuk opacity
  className = ""
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;

    const letters = characters.split("");
    const glitchArr = Array.from({ length: letters.length }, () => ({
      char: letters[Math.floor(Math.random() * letters.length)],
      x: Math.random() * width,
      y: Math.random() * height,
      speed: Math.random() * 1.2 + 0.2
    }));

    let rafId;
    let t = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      glitchArr.forEach((g, i) => {
        g.y += g.speed * glitchSpeed * 0.03;
        if (g.y > height) g.y = 0;

        ctx.fillStyle = glitchColors[i % glitchColors.length];
        ctx.globalAlpha = fontOpacity; // opacity controllable dari props
        ctx.font = `${fontSize}px monospace`; // font size controllable
        ctx.fillText(g.char, g.x, g.y);

        // ripple/wave sync
        if (shareRef && shareRef.current) {
          const s = shareRef.current;
          g.x += Math.sin(t * s.vs + g.y * 0.02) * waveAmpX * waveStrength;
          g.y += Math.sin(t * s.vs + g.x * 0.02) * waveAmpY * waveStrength;
        }
      });

      t += 0.03;
      rafId = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(rafId);
  }, [
    characters,
    glitchColors,
    glitchSpeed,
    shareRef,
    waveAmpX,
    waveAmpY,
    waveStrength,
    fontSize,
    fontOpacity
  ]);

  const containerStyle = { position: "absolute", inset: 0 };
  const canvasStyle = { width: "100%", height: "100%", display: "block" };

  return <div style={containerStyle} className={className}>
    <canvas ref={canvasRef} style={canvasStyle} />
  </div>;
}