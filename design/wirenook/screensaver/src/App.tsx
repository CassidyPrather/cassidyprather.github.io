import { useEffect, useRef, useState } from "react";
import { wavePath } from "./waves";

function Topography({ paused }: { paused: boolean }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const elapsed = useRef(0);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const paths = svgRef.current?.querySelectorAll("path");
    let frame = 0;
    let previous: number | null = null;

    const draw = (timestamp: number) => {
      if (previous !== null) elapsed.current += (timestamp - previous) / 1000;
      previous = timestamp;
      paths?.forEach((path, index) => {
        path.setAttribute("d", wavePath(index, elapsed.current));
      });
      frame = window.requestAnimationFrame(draw);
    };
    const syncMotion = () => {
      window.cancelAnimationFrame(frame);
      previous = null;
      if (!paused && !motion.matches) frame = window.requestAnimationFrame(draw);
    };
    syncMotion();
    motion.addEventListener("change", syncMotion);
    return () => {
      window.cancelAnimationFrame(frame);
      motion.removeEventListener("change", syncMotion);
    };
  }, [paused]);

  return (
    <svg
      ref={svgRef}
      className="topography"
      viewBox="0 0 1440 900"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {Array.from({ length: 15 }, (_, index) => (
        <path key={index} d={wavePath(index, 0)} />
      ))}
    </svg>
  );
}

const tickerText = ["WIRENOOK.NET", "HOP, BUT NEVER STOP", "CASSIDY CO.", "KEEP MOVING"];

function TickerGroup() {
  return (
    <div className="ticker-group">
      {tickerText.map((item) => (
        <span key={item}>
          {item}
          <i />
        </span>
      ))}
    </div>
  );
}

export default function App() {
  const [paused, setPaused] = useState(false);
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    const clock = window.setInterval(() => setTime(new Date()), 1000);
    const handleKey = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault();
        setPaused((current) => !current);
      }
      if (event.key.toLowerCase() === "f") {
        void document.documentElement.requestFullscreen?.();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      window.clearInterval(clock);
      window.removeEventListener("keydown", handleKey);
    };
  }, []);

  const toggleFullscreen = async () => {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await document.documentElement.requestFullscreen?.();
  };

  return (
    <main
      className={`screensaver ${paused ? "is-paused" : ""}`}
      aria-label="Wirenook animated screensaver"
    >
      <div className="aurora" />
      <Topography paused={paused} />
      <div className="scanlines" />
      <div className="perspective-grid" />

      <header className="brand">
        <span className="brand-mark">W</span>
        <div>
          <p className="brand-name">WIRENOOK.NET</p>
          <p className="brand-sub">Cassidy Co. / Signal 12</p>
        </div>
      </header>

      <div className="status">
        <span className="status-dot" />
        DREAM MODE
      </div>

      <div className="blobs" aria-hidden="true">
        <span className="blob blob-a" />
        <span className="blob blob-b" />
        <span className="blob blob-c" />
      </div>

      <div className="glyphs" aria-hidden="true">
        <span className="glyph glyph-square" />
        <span className="glyph glyph-circle" />
        <span className="glyph glyph-triangle" />
      </div>

      <div className="ticker" aria-hidden="true">
        <div className="ticker-track">
          <TickerGroup />
          <TickerGroup />
        </div>
      </div>

      <footer className="controls">
        <div className="time" aria-label="Current time">
          {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </div>
        <div className="control-actions">
          <button type="button" onClick={() => setPaused((current) => !current)}>
            {paused ? "PLAY" : "PAUSE"} <span>SPACE</span>
          </button>
          <button type="button" onClick={toggleFullscreen}>
            FULLSCREEN <span>F</span>
          </button>
        </div>
      </footer>
    </main>
  );
}
