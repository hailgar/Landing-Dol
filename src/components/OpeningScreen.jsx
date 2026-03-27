import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./OpeningScreen.module.css";
import LetterGlitch from "../components/LetterGlitch";
import Waves from "../components/Waves";

export default function OpeningScreen({ onFinish }) {
  const [phase, setPhase] = useState("idle");
  const rootRef = useRef(null);

  // 🎧 AUDIO REF
  const audioRef = useRef(null);
  const [muted, setMuted] = useState(false);

  const waveShareRef = useRef({
    t: 0,
    x: -9999,
    y: -9999,
    v: 0,
    vs: 0,
    a: 0,
    width: 0,
    height: 0,
  });

  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [burst, setBurst] = useState(0);

  const characters = useMemo(
    () =>
      "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ" +
      "αβγδεζηθικλμνξοπρστυφχψω" +
      "ΔΛΩΣΠΦΨ" +
      "†‡∑√∞≈≠≤≥÷×±∂∇µπλΩ" +
      "[]{}()<>/\\|~=;:,.!?*@#$%^&-+_",
    []
  );

  // 🔥 Fade in audio biar smooth
  const fadeInAudio = () => {
    if (!audioRef.current) return;
    let vol = 0;
    const interval = setInterval(() => {
      if (!audioRef.current) return;
      vol += 0.05;
      audioRef.current.volume = Math.min(vol, 0.4);
      if (vol >= 0.4) clearInterval(interval);
    }, 100);
  };

  const enter = () => {
    if (phase !== "idle") return;

    // 🎧 PLAY AUDIO
    if (audioRef.current) {
      audioRef.current.volume = 0;
      audioRef.current.play().catch(() => {});
      fadeInAudio();
    }

    setPhase("entering");
    window.setTimeout(() => onFinish?.(), 1550);
  };

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Enter") enter();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [phase]);

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !muted;
    setMuted(!muted);
  };

  const onMouseMove = (e) => {
    const el = rootRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;

    setTilt({
      x: (py - 0.5) * -9,
      y: (px - 0.5) * 12,
    });
  };

  const onPointerDown = () => {
    setBurst((b) => b + 1);
  };

  return (
    <div
      ref={rootRef}
      className={[styles.wrap, phase === "entering" ? styles.entering : ""].join(" ")}
      onMouseMove={onMouseMove}
      onPointerDown={onPointerDown}
    >
      {/* 🎧 AUDIO ELEMENT */}
      <audio
        ref={audioRef}
        src="/soundtrack/Brave Heart - Digimon.mp3"
        loop
      />

      {/* BACKGROUND */}
      <div className={styles.bgLayer}>
        <LetterGlitch
          className={styles.letterBg}
          characters={characters}
          glitchColors={["#1bff9b", "#29d6ff", "#9a7bff"]}
          glitchSpeed={Math.max(22, 55 - (burst % 6) * 6)}
          smooth
          outerVignette
          centerVignette
          shareRef={waveShareRef}
          waveStrength={1.0}
          waveAmpX={10}
          waveAmpY={7}
          rippleStrength={1.0}
          rippleAmp={22}
          rippleFalloff={320}
        />
      </div>

      {/* WAVES */}
      <div className={styles.wavesLayer} aria-hidden="true">
        <Waves
          className={styles.wavesBlend}
          backgroundColor="transparent"
          shareRef={waveShareRef}
          lineColor="rgba(140, 255, 210, 0.28)"
          lineWidth={1.35}
          lineAlpha={0.85}
          waveAmpX={52}
          waveAmpY={22}
          waveSpeedX={0.014}
          waveSpeedY={0.006}
          xGap={14}
          yGap={40}
          tension={0.008}
          friction={0.93}
        />
      </div>

      {/* OVERLAYS */}
      <div className={styles.scanlines} />
      <div className={styles.vignette} />
      <div className={styles.filmGrain} />

      {/* CONTENT */}
      <div className={styles.center}>
        <div
          className={styles.logo3d}
          style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
        >
          <DOLLogo onPortal={enter} />
        </div>

        <div className={styles.sub}>
          FUTURISTIC WEB EXPERIENCES • DIGITAL PRODUCT • IT SOLUTIONS
        </div>

        <button className={styles.hint} onClick={enter}>
          <span className={styles.key}>Enter</span>
          <span>untuk masuk ke dunia DOL</span>
        </button>

        {/* 🔊 MUTE BUTTON */}
        <button className={styles.soundToggle} onClick={toggleMute}>
          {muted ? "🔇 Unmute" : "🔊 Mute"}
        </button>

        <div className={styles.mini}>
          Gerakkan mouse • Klik logo untuk masuk
        </div>
      </div>

      <div className={styles.flash} />
    </div>
  );
}

function DOLLogo({ onPortal }) {
  return (
    <div className={styles.logoWrap}>
      <button onClick={onPortal}>
        ENTER
      </button>
    </div>
  );
}