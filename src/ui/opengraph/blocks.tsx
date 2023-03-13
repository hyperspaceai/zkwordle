const BLOCK_SIZE = 48;
const GRID_GAP = 12;
const GRID_WIDTH = 300;

export const OgBlocks = ({ data }: { data: string[] }) => {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end", flexWrap: "wrap", gap: GRID_GAP, width: GRID_WIDTH }}>
      {data.map((x) => (
        <div
          key={x}
          style={{
            width: BLOCK_SIZE,
            height: BLOCK_SIZE,
            backgroundColor: getBlockColor(x),
            border: `1px solid ${Number(x) < 3 ? getBlockColor(x) : "#ffffff"}`,
            opacity: Number(x) < 3 ? 1 : 0.6,
          }}
        />
      ))}
    </div>
  );
};

const getBlockColor = (x: string) => {
  switch (x) {
    case "3":
      return "transparent";
    case "2":
      return "#EC4899";
    case "1":
      return "#B7791F";
    default:
      return "#2D3748";
  }
};
