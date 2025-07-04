import { useCallback, useState } from "react";

const dotColors = [
  { color: "#FF5A52", action: "close" }, // Red
  { color: "#E6C029", action: "minimize" }, // Orange
  { color: "#53C22B", action: "maximize" }, // Green
];

export default function ApplicationActions({ app, onMaximize, onCloseWithAnim, onMinimize }: { app: string; onMaximize: () => void; onCloseWithAnim?: () => void; onMinimize?: () => void }) {
  const handleClick = useCallback(
    (action: string) => {
      if (action === "close") {
        if (onCloseWithAnim) {
          onCloseWithAnim();
        } else {
          // Remove app from currentApplication array
          let arr: string[] = [];
          try {
            arr = JSON.parse(localStorage.getItem("currentApplication") || "[]");
            if (!Array.isArray(arr)) arr = [];
          } catch {
            arr = [];
          }
          arr = arr.filter((a) => a !== app);
          localStorage.setItem("currentApplication", JSON.stringify(arr));
          window.dispatchEvent(new Event("applicationChange"));
        }
      } else if (action === "maximize") {
        onMaximize();
      } else if (action === "minimize") {
        if (typeof onMinimize === 'function') {
          onMinimize();
        } else {
          // Fallback: Remove from currentApplication, add to minimizedApplication
          let arr: string[] = [];
          let minArr: string[] = [];
          try {
            arr = JSON.parse(localStorage.getItem("currentApplication") || "[]");
            if (!Array.isArray(arr)) arr = [];
          } catch {
            arr = [];
          }
          try {
            minArr = JSON.parse(localStorage.getItem("minimizedApplication") || "[]");
            if (!Array.isArray(minArr)) minArr = [];
          } catch {
            minArr = [];
          }
          arr = arr.filter((a) => a !== app);
          if (!minArr.includes(app)) minArr.unshift(app);
          localStorage.setItem("currentApplication", JSON.stringify(arr));
          localStorage.setItem("minimizedApplication", JSON.stringify(minArr));
          window.dispatchEvent(new Event("applicationChange"));
        }
      }
    },
    [app, onMaximize, onCloseWithAnim, onMinimize]
  );
  // Track which dot is hovered
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Icon SVGs (all black)
  const icons = {
    close: (
      <svg width="10" height="10" viewBox="0 0 10 10" style={{ display: 'block' }}>
        <line x1="2" y1="2" x2="8" y2="8" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="8" y1="2" x2="2" y2="8" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    minimize: (
      <svg width="10" height="10" viewBox="0 0 10 10" style={{ display: 'block' }}>
        <line x1="2" y1="5" x2="8" y2="5" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    maximize: (
      <svg width="10" height="10" viewBox="0 0 10 10" style={{ display: 'block' }}>
        <polygon points="1,2 1,9 8,9" fill="black" />
        <polygon points="2,1 9,1 9,8" fill="black" />
      </svg>
    ),
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, paddingTop: 12, paddingLeft: 16 }}>
      {dotColors.map((dot, idx) => (
        <span
          key={idx}
          onClick={() => handleClick(dot.action)}
          onMouseEnter={() => setHoveredIdx(idx)}
          onMouseLeave={() => setHoveredIdx(null)}
          style={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            background: dot.color,
            display: "inline-block",
            marginLeft: idx === 0 ? 0 : 6,
            marginRight: idx === 2 ? 0 : 6,
            cursor: "pointer",
            position: 'relative',
          }}
        >
          {hoveredIdx === idx && (
            <span style={{
              position: 'absolute',
              left: '50%','top': '50%',
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 10,
              height: 10,
            }}>
              {icons[dot.action as keyof typeof icons]}
            </span>
          )}
        </span>
      ))}
    </div>
  );
}
