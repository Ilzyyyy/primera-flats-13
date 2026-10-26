"use client";
import { useEffect, useRef } from "react";

// Custom cursor: a dot, a trailing ring that grows over links/buttons,
// and a short spray-paint trail drawn on a canvas.
export default function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);
  const canvas = useRef(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    document.documentElement.classList.add("has-cursor");
    const cv = canvas.current;
    const ctx = cv.getContext("2d");
    let w = (cv.width = window.innerWidth);
    let h = (cv.height = window.innerHeight);
    const onResize = () => {
      w = cv.width = window.innerWidth;
      h = cv.height = window.innerHeight;
    };

    const mouse = { x: w / 2, y: h / 2 };
    const pos = { x: mouse.x, y: mouse.y };
    let particles = [];
    let hot = false;
    let raf;

    const color = () =>
      getComputedStyle(document.documentElement).getPropertyValue("--blue").trim() || "#5d86ff";

    const onMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      for (let i = 0; i < 2; i++) {
        particles.push({
          x: e.clientX + (Math.random() - 0.5) * 8,
          y: e.clientY + (Math.random() - 0.5) * 8,
          r: Math.random() * 2.2 + 0.6,
          life: 1,
        });
      }
      if (particles.length > 160) particles = particles.slice(-160);
    };
    const onOver = (e) => {
      hot = !!e.target.closest("a, button, summary, input, [data-hot]");
    };

    const tick = () => {
      pos.x += (mouse.x - pos.x) * 0.18;
      pos.y += (mouse.y - pos.y) * 0.18;
      dot.current.style.transform = `translate(${mouse.x}px, ${mouse.y}px)`;
      ring.current.style.transform = `translate(${pos.x}px, ${pos.y}px) scale(${hot ? 1.9 : 1})`;
      ring.current.classList.toggle("hot", hot);

      ctx.clearRect(0, 0, w, h);
      const c = color();
      ctx.fillStyle = c;
      particles = particles.filter((p) => p.life > 0.02);
      for (const p of particles) {
        ctx.globalAlpha = p.life * 0.55;
        ctx.beginPath();
        ctx.arc(p.x, p.y + (1 - p.life) * 6, p.r, 0, Math.PI * 2);
        ctx.fill();
        p.life *= 0.93;
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    window.addEventListener("resize", onResize);
    raf = requestAnimationFrame(tick);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <>
      <canvas ref={canvas} className="trail" aria-hidden="true" />
      <div ref={ring} className="cring" aria-hidden="true" />
      <div ref={dot} className="cdot" aria-hidden="true" />
    </>
  );
}
