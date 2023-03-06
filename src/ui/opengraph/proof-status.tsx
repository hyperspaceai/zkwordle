export const OgProofStatus = ({ children }) => {
  return (
    <div style={{ display: "flex", alignItems: "baseline", fontWeight: 700, gap: 8, letterSpacing: "-2px" }}>
      <span style={{ color: "#EC4899", fontSize: 96 }}>{children}</span>
      <span style={{ fontSize: 96 / 2, lineHeight: 1.75 }}>proof</span>
    </div>
  );
};
