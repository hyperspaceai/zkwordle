import { SvgDiscord, SvgGlobe, SvgTwitter } from "@/ui/opengraph/svg";

export const OgLinkBanner = () => {
  return (
    <div
      style={{
        alignItems: "center",
        backgroundColor: "#2B2B2B",
        bottom: 0,
        display: "flex",
        fontSize: 20,
        fontWeight: 700,
        gap: 8,
        justifyContent: "space-around",
        left: 0,
        letterSpacing: "-0.5px",
        padding: 16,
        position: "absolute",
        right: 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <SvgDiscord />
        <span>hyperchat.gg</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <SvgGlobe />
        <span>hyperspace.foundation</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <SvgTwitter />
        <span>@hyperspaceorg</span>
      </div>
    </div>
  );
};
