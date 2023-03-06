import type { ReactNode } from "react";

export const OgMetrics = ({ data }: { data: Record<string, ReactNode> }) => {
  return (
    <div style={{ display: "flex", gap: 64 }}>
      {Object.entries(data).map(([k, v], i) => (
        <div key={i} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span style={{ color: "#EC4899", fontSize: 48, fontWeight: 700 }}>{v}</span>
          <div style={{ color: "#fff", fontSize: 28 }}>{k}</div>
        </div>
      ))}
    </div>
  );
};
