import { useCallback } from "react";

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
        if (typeof onMinimize === 'function') onMinimize();
        // Remove from currentApplication, add to minimizedApplication
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
    },
    [app, onMaximize, onCloseWithAnim, onMinimize]
  );

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
      {dotColors.map((dot, idx) => (
        <span
          key={idx}
          onClick={() => handleClick(dot.action)}
          style={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            background: dot.color,
            display: "inline-block",
            marginLeft: idx === 0 ? 0 : 6,
            marginRight: idx === 2 ? 0 : 6,
            cursor: "pointer",
          }}
        />
      ))}
    </div>
  );
}
