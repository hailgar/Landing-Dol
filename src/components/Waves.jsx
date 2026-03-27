import React, { useRef, useEffect } from "react";

export default function Waves({
  shareRef = null,
  className = "",
  lineColor = "#8cffd2",
  lineWidth = 1.35,
  lineAlpha = 0.85,
  waveAmpX = 52,
  waveAmpY = 22,
  waveSpeedX = 0.014,
  waveSpeedY = 0.006,
  xGap = 14,
  yGap = 40,
  tension = 0.008,
  friction = 0.93,
  backgroundColor = "transparent"
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;

    const cols = Math.floor(width / xGap) + 1;
    const rows = Math.floor(height / yGap) + 1;
    const points = Array.from({ length: cols * rows }, (_, i) => ({
      x: (i % cols) * xGap,
      y: Math.floor(i / cols) * yGap,
      vx: 0,
      vy: 0
    }));

    let rafId;
    let t = 0;

    const draw = () => {
      ctx.clearRect(0,0,width,height);
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0,0,width,height);

      points.forEach(p => {
        p.vx *= friction;
        p.vy *= friction;
        p.x += p.vx + Math.sin(t * waveSpeedX) * waveAmpX;
        p.y += p.vy + Math.sin(t * waveSpeedY) * waveAmpY;
      });

      for(let y=0;y<rows;y++){
        for(let x=0;x<cols-1;x++){
          const idx = y*cols + x;
          const p1 = points[idx];
          const p2 = points[idx+1];
          ctx.strokeStyle = lineColor;
          ctx.globalAlpha = lineAlpha;
          ctx.lineWidth = lineWidth;
          ctx.beginPath();
          ctx.moveTo(p1.x,p1.y);
          ctx.lineTo(p2.x,p2.y);
          ctx.stroke();
        }
      }

      t += 0.03;
      if(shareRef && shareRef.current){
        shareRef.current.vs = t;
      }
      rafId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(rafId);
  }, [shareRef, lineColor, lineWidth, lineAlpha, waveAmpX, waveAmpY, waveSpeedX, waveSpeedY, xGap, yGap, tension, friction, backgroundColor]);

  return <canvas ref={canvasRef} className={className} style={{width:"100%",height:"100%"}} />;
}