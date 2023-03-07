import { metadata } from "config/metadata";

export const OgContainer = ({ children }) => {
  return (
    <div
      style={{
        backgroundColor: "#141414",
        backgroundImage: `url(${metadata.url}/og-bg.png)`,
        backgroundSize: "cover",
        color: "white",
        display: "flex",
        fontFamily: '"Be Vietnam Pro", sans-serif',
        fontWeight: 400,
        height: "100%",
        position: "relative",
        width: "100%",
      }}
    >
      {children}
    </div>
  );
};
